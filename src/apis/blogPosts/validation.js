import createError from "http-errors";
import { checkSchema, validationResult } from "express-validator";

const blogPostsSchema = {
  "readTime.value": {
    in: ["body"],
    isInt: true,
    errorMessage: "value must be between 1 and 10",
  },
  "readTime.unit": {
    in: ["body"],
    isString: true,
    errorMessage: "unit unit must be a string",
  },

  title: {
    in: ["body"],
    isString: true,
    errorMessage: "title must be a string",
  },
  category: {
    in: ["body"],
    isString: true,
    errorMessage: "category must be a string",
  },
  content: {
    in: ["body"],
    isString: true,
    errorMessage: "content must be a string",
  },
  "author.name": {
    in: ["body"],
    isString: true,
    errorMessage: "author name must be a string",
  },
};

export const checkBlogPostSchema = checkSchema(blogPostsSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(
      createError(400, "Validation errors!", { errorsList: errors.array() })
    );
  } else {
    next();
  }
};
