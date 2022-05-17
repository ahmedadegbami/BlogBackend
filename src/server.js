import express from "express";
import authorsRouter from "./apis/authors/index.js";
import blogPostsRouter from "./apis/blogPosts/index.js";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  genericErrorHandler,
  notFoundErrorHandler,
  badRequestErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js";
import { join } from "path";

const server = express();

const publicFolderPath = join(process.cwd(), "./public");

//This is for request body
server.use(express.json());
server.use(express.static(publicFolderPath));

// ***** This is a middleware for interaction with front end *****

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions = {
  origin: (origin, next) => {
    // cors is a global middleware --> for each and every request we are going to be able to read the current origin value
    console.log("CURRENT ORIGIN: ", origin);

    if (!origin || whitelist.indexOf(origin) !== -1) {
      // origin is in the whitelist --> move next with no errors
      next(null, true);
    } else {
      // origin is NOT in the whitelist --> trigger an error
      next(
        createError(
          400,
          `Cors Error! your origin ${origin} is not in the list!`
        )
      );
    }
  },
};

server.use(cors(corsOptions));

// *********************** this are my ENDPOINTS ****************************

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

// *************** This error handler must always be places after endpoints ********************
server.use(badRequestErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

// ********** This an entension for instant console log of the server *************
console.table(listEndpoints(server));

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
