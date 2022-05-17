import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";
import { checkBlogPostSchema, checkValidationResult } from "./validation.js";
import { readBlogs, writeBlogs } from "../../lib/fs-tools.js";

const blogPostsRouter = express.Router();

// I concatenate the file path with the file name
// const blogPostsFilePath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "blog.json"
// );
//I created a reusable function to read and write the blogs
// const readBlogs = () => JSON.parse(fs.readFileSync(blogPostsFilePath));
// const writeBlogs = (blogsArray) =>
//   fs.writeFileSync(blogPostsFilePath, JSON.stringify(blogsArray));

// GET all blogs
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await readBlogs();
    if (req.query && req.query.category) {
      const filteredBlogs = blogs.filter(
        (blog) => blog.category === req.query.category
      );
      res.send(filteredBlogs);
    } else {
      res.send(blogs);
    }
  } catch (error) {
    next(error); // this will jump to the first error handler
  }
});

// POST a new blog
blogPostsRouter.post(
  "/",
  checkBlogPostSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const blogs = await readBlogs();
      const newBlog = { ...req.body, createdAt: new Date(), _id: uniqid() };
      blogs.push(newBlog);
      writeBlogs(blogs);
      res.send(newBlog);
    } catch (error) {
      next(error);
    }
  }
);

// GET a blog by id
blogPostsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogs = await readBlogs();
    const foundBlog = blogs.find((blog) => blog._id === req.params.blogId);
    if (foundBlog) {
      res.send(foundBlog);
    } else {
      //   res.status(404).send("Blog not found");
      next(createError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// PUT a blog by id
blogPostsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogs = await readBlogs();
    const index = blogs.findIndex((blog) => blog._id === req.params.blogId);
    if (index !== -1) {
      const oldBlog = blogs[index];
      const newBlog = { ...oldBlog, ...req.body };
      blogs[index] = newBlog;
      writeBlogs(blogs);
      res.send(newBlog);
    } else {
      //   res.status(404).send("Blog not found");
      next(createError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// DELETE a blog by id

blogPostsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogs = await readBlogs();
    const index = blogs.findIndex((blog) => blog._id === req.params.blogId);
    if (index !== -1) {
      const deletedBlog = blogs.splice(index, 1);
      writeBlogs(blogs);
      res.send(deletedBlog);
    } else {
      //   res.status(404).send("Blog not found");
      next(createError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// blogPostsRouter.delete("/:blogId", async (req, res, next) => {
//   try {
//     const blogs = await readBlogs();
//     const remBlogs = blogs.filter((blog) => blog._id !== req.params.blogId);
//     await writeBlogs(remBlogs);
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

blogPostsRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blogs = await readBlogs();
    const foundBlog = blogs.find((blog) => blog._id === req.params.blogId);
    if (foundBlog) {
      res.send(foundBlog.comments);
    } else {
      next(createError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post("/:blogId/comments", async (req, res, next) => {
  const blogs = await readBlogs();
  const newComment = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
  };
  console.log(newComment);
  const foundBlog = blogs.find((blog) => blog._id === req.params.blogId);
  if (foundBlog) {
    foundBlog.comments.push(newComment);
    writeBlogs(blogs);
    res.send(newComment);
  } else {
    next(createError(404, `Blog with id ${req.params.blogId} not found`));
  }
});

export default blogPostsRouter;
