import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/authenticate";
import { IBook, UploadedFiles } from "./bookTypes";
import createHttpError from "http-errors";
import { Book } from "./bookModel";
import { deleteCloudinaryAssets, uploadFileToCloudinary } from "./bookHelper";

const createBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { title, genre } = req.body;
  const files = req.files as UploadedFiles;
  const userId = req.userId;

  const coverimgFile = files.coverimg?.[0];
  const bookFile = files.file?.[0];

  if (!coverimgFile || !bookFile) {
    return next(createHttpError(400, "Cover image and book file are required"));
  }

  try {
    const [coverimgUrl, bookFileUrl] = await Promise.all([
      uploadFileToCloudinary(coverimgFile, "book_covers", "image"),
      uploadFileToCloudinary(bookFile, "book_files", "raw"),
    ]);

    const newBook: IBook = await Book.create({
      title,
      genre,
      author: userId,
      coverimg: coverimgUrl,
      file: bookFileUrl,
    });

    res.status(201).json({
      message: "Book created successfully",
      newBook,
    });
  } catch (error) {
    if (createHttpError.isHttpError(error)) {
      return next(error);
    }
    return next(
      createHttpError(500, `Book creation failed: ${(error as Error).message}`)
    );
  }
};

const updateBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { title, genre } = req.body;
  const files = req.files as UploadedFiles;
  const bookId = req.params.bookId;
  const userId = req.userId;

  try {
    const bookToUpdate = await Book.findById(bookId);
    if (!bookToUpdate) {
      return next(createHttpError(404, "Book not found"));
    }

    if (bookToUpdate.author.toString() !== userId) {
      return next(
        createHttpError(403, "You are not authorized to update this book")
      );
    }

    const coverimgFile = files.coverimg?.[0];
    const bookFile = files.file?.[0];

    const updateData: Partial<IBook> = {};

    if (title) updateData.title = title;
    if (genre) updateData.genre = genre;

    const oldCoverUrl = bookToUpdate.coverimg;
    const oldFileUrl = bookToUpdate.file;
    let shouldDeleteOldAssets = false;

    const uploadPromises: Promise<any>[] = [];

    if (coverimgFile) {
      shouldDeleteOldAssets = true;
      const coverUploadPromise = uploadFileToCloudinary(
        coverimgFile,
        "book_covers",
        "image"
      ).then((url) => {
        updateData.coverimg = url;
      });
      uploadPromises.push(coverUploadPromise);
    }

    if (bookFile) {
      shouldDeleteOldAssets = true;
      const bookUploadPromise = uploadFileToCloudinary(
        bookFile,
        "book_files",
        "raw"
      ).then((url) => {
        updateData.file = url;
      });
      uploadPromises.push(bookUploadPromise);
    }

    await Promise.all(uploadPromises);

    if (Object.keys(updateData).length === 0) {
      return next(
        createHttpError(400, "No fields or files provided for update.")
      );
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
      new: true,
      runValidators: true,
    });

    if (shouldDeleteOldAssets) {
      console.log("Cleaning up old Cloudinary assets...");
      try {
        await deleteCloudinaryAssets(
          coverimgFile ? oldCoverUrl : bookToUpdate.coverimg,
          bookFile ? oldFileUrl : bookToUpdate.file,
          false 
        );
        console.log("Old assets cleanup completed.");
      } catch (error) {
        console.error("Old assets cleanup failed (non-critical):", error);
      }
    }

    res.status(200).json({
      message: "Book updated successfully",
      updatedBook,
    });
  } catch (error) {
    return next(
      createHttpError(500, `Update failed: ${(error as Error).message}`)
    );
  }
};

const deleteBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;
  const userId = req.userId;

  try {
    const bookToDelete = await Book.findById(bookId);
    if (!bookToDelete) {
      return next(createHttpError(404, "Book not found"));
    }

    if (bookToDelete.author.toString() !== userId) {
      return next(
        createHttpError(403, "You are not authorized to delete this book")
      );
    } 

    await deleteCloudinaryAssets(
      bookToDelete.coverimg,
      bookToDelete.file,
      true
    );
    console.log("All Cloudinary assets deleted successfully.");

    await Book.findByIdAndDelete(bookId);
    console.log("Book deleted from database.");

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Book Deletion Error:", error);
    return next(
      createHttpError(
        500,
        `Delete failed: ${
          (error as Error).message
        }. Book record preserved in database.`
      )
    );
  }
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3; 
    const skip = (page - 1) * limit;

    const booksQuery = Book.find().skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();
    const books = await booksQuery.exec();

    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      message: "Books retrieved successfully",
      currentPage: page,
      limit: limit,
      totalPages: totalPages,
      totalBooks: totalBooks,
      books, 
    });
  } catch (error) {
    return next(
      createHttpError(500, `List failed: ${(error as Error).message}`)
    );
  }
};

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    res.status(200).json({
      message: "Book retrieved successfully",
      book,
    });
  } catch (error) {
    return next(
      createHttpError(500, `Get book failed: ${(error as Error).message}`)
    );
  }
}

export { createBook, updateBook, deleteBook, getAllBooks, getBook };
