import express from "express";
import {
  readAuthors,
  writeAuthors,
  saveAuthorsAvatars,
} from "../../lib/fs-tools.js";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";
import { createGzip } from "zlib";

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

export default authorFileRouter;
