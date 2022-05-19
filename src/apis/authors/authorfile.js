import express from "express";
import {
  readAuthors,
  writeAuthors,
  saveAuthorsAvatars,
} from "../../lib/fs-tools.js";
import { getPDFReadableStream, generatePDFAsync } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";
import { createGzip } from "zlib";
import { getAuthorsReadableStream } from "../../lib/fs-tools.js";
import json2csv from "json2csv";

const authorFileRouter = express.Router();

authorFileRouter.get("/:authorId/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachments; filename=authors.pdf");
    const authors = await readAuthors();
    const foundauthor = authors.findIndex(
      (author) => author.id === req.params.authorId
    );
    if (foundauthor === -1) {
      throw new Error("Author not found");
    }
    const author = authors[foundauthor];
    const source = await getPDFReadableStream(author);

    const destination = res;

    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

authorFileRouter.get("/authorsCSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=authors.csv");

    const source = getAuthorsReadableStream();
    const destination = res;
    const transform = new json2csv.Transform({
      fields: ["id", "title", "email"],
    });

    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

authorFileRouter.get("/asyncPDF", async (req, res, next) => {
  try {
    const authors = await readAuthors();
    // generate the pdf and save it on disk
    const path = await generatePDFAsync(authors[0]);

    // attach it to email
    // await attachToEmail()
    // send the email
    // await sendEmail()
    // optionally delete the file
    // await deleteFile()
    res.send(path);
  } catch (error) {
    next(error);
  }
});

export default authorFileRouter;
