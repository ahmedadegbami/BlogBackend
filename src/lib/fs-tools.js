import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const authorsFilePath = join(dataFolderPath, "authors.json");
const blogsFilePath = join(dataFolderPath, "blogs.json");
const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors");

export const pdfFilePath = join(dataFolderPath, "pdf/test.pdf");
console.log("pdfFilePath:", pdfFilePath);

export const readBlogs = () => readJSON(blogsFilePath);
export const writeBlogs = (blogs) => writeJSON(blogsFilePath, blogs);
export const readAuthors = () => readJSON(authorsFilePath);
export const writeAuthors = (authors) => writeJSON(authorsFilePath, authors);

export const getAuthorsReadableStream = () => createReadStream(authorsFilePath);

export const saveAuthorsAvatars = (fileName, contentAsBuffer) => {
  const filePath = join(authorsPublicFolderPath, fileName);
  const savedPath = `/img/authors/${fileName}`;
  console.log(savedPath);
  writeFile(filePath, contentAsBuffer);
  const url = `http://localhost:3000${savedPath}`;
  return url;
};

export const getPDFsPath = (filename) =>
  join(dataFolderPath, "./pdf", filename);
