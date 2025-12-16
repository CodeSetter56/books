import path from "node:path";
import express, { RequestHandler } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBook,
  updateBook,
} from "./bookController";
import multer from "multer";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public"),
  limits: { fileSize: 1e7 }, 
});

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverimg", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook as RequestHandler
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverimg", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook as RequestHandler
);

bookRouter.delete(
  "/:bookId",
  authenticate,
  deleteBook as RequestHandler
);

bookRouter.get("/", getAllBooks)
bookRouter.get("/:bookId", getBook)

export default bookRouter;
