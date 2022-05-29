import PdfPrinter from "pdfmake";
import fs from "fs";
import axios from "axios";
import imageToBase64 from "image-to-base64";
import { getPDFsPath } from "./fs-tools.js";
import { promisify } from "util";
import { pipeline } from "stream";
import striptags from "striptags";

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold"
  }
};

const printer = new PdfPrinter(fonts);

export const getPDFReadableStream = async (author) => {
  //   imageToBase64(author.avatar) // Path to the image
  //     .then((response) => {
  //       console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
  //     })
  //     .catch((error) => {
  //       console.log(error); // Logs an error if there was one
  //     });

  let imagePath = {};
  if (author.avatar) {
    const response = await axios.get(author.avatar, {
      responseType: "arraybuffer"
    });
    const authorAvatarURLPaths = author.avatar.split("/");
    const fileName = authorAvatarURLPaths[authorAvatarURLPaths.length - 1];
    const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePath = {
      image: base64Image,
      width: 500,
      height: 300,
      margin: [0, 0, 0, 40]
    };
  }

  const docDefinition = {
    content: [
      {
        text: author.title,
        style: "header"
      },
      imagePath,

      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n",
      {
        text: author.category,
        style: "subheader",
        fontSize: 15,
        color: "blue"
      },
      { text: striptags(author.description), style: "text" }
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 15,
        bold: true
      },
      small: {
        fontSize: 8
      },
      defaultStyle: {
        font: "Helvetica"
      }
    }
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  // OLD SYNTAX FOR PIPING pdfReadableStream.pipe(fs.createWriteStream("document.pdf"))
  pdfReadableStream.end();
  return pdfReadableStream;
};

export const generatePDFAsync = async (author) => {
  const asyncPipeline = promisify(pipeline); // Promisify is a veeeeery cool function from 'util' core module, which transforms a function that uses callbacks (error-first callbacks) into a function that uses Promises instead (and so Async/Await). Pipeline is a function which works with error-first callbac --> I can promisify a pipeline, obtaining a "Promises-based pipeline"

  const pdfReadableStream = await getPDFReadableStream(author);

  const path = getPDFsPath("test.pdf");

  await asyncPipeline(pdfReadableStream, fs.createWriteStream(path));
  return path;
};
