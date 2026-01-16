import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/authenticate";
import { IBook, UploadedFiles } from "./bookTypes";
import createHttpError from "http-errors";
import { Book } from "./bookModel";
import { deleteCloudinaryAssets, uploadFileToCloudinary } from "./bookHelper";

export const createBook = async (
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

    res.status(201).json({ message: "Book created successfully", newBook });

  } catch (error) {
    next(
      createHttpError(500, `Book creation failed: ${(error as Error).message}`)
    );
  }
};

export const updateBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;
  const files = req.files as UploadedFiles;

  try {
    const book = await Book.findById(bookId);
    if (!book) return next(createHttpError(404, "Book not found"));
    if (book.author.toString() !== req.userId)
      return next(createHttpError(403, "Forbidden"));

    // Dynamically build update object
    const updateData: Partial<IBook> = { ...req.body };

    if (files?.coverimg?.[0]) {
      updateData.coverimg = await uploadFileToCloudinary(
        files.coverimg[0],
        "book_covers",
        "image"
      );
    }
    if (files?.file?.[0]) {
      updateData.file = await uploadFileToCloudinary(
        files.file[0],
        "book_files",
        "raw"
      );
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
      new: true,
    });

    // Cleanup logic remains same
    if (files?.coverimg?.[0] || files?.file?.[0]) {
      await deleteCloudinaryAssets(
        files.coverimg?.[0] ? book.coverimg : "",
        files.file?.[0] ? book.file : "",
        false
      );
    }

    res.status(200).json({ message: "Updated", updatedBook });
  } catch (error) {
    next(createHttpError(500, "Update failed"));
  }
};

export const deleteBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;
  const userId = req.userId;

  try {
    const book = await Book.findById(bookId);
    if (!book) return next(createHttpError(404, "Book not found"));

    if (book.author.toString() !== userId) return next(createHttpError(403, "Forbidden: User does not own this book"));

    await deleteCloudinaryAssets(book.coverimg, book.file, true);
    await Book.findByIdAndDelete(bookId);

    res.status(204).json({ message: "Book deleted successfully" });
    
  } catch (error) {
    next(createHttpError(500, "Deletion failed"));
  }
};

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const booksQuery = Book.find().skip(skip).limit(limit).populate('author', 'name email');
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
      createHttpError(
        500,
        `Failed to get books: ${(error as Error).message}`
      )
    );
  }
};

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  try {
    const book = await Book.findById(bookId).populate('author', 'name email');
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    res.status(200).json({
      message: "Book retrieved successfully",
      book,
    });
  } catch (error) {
    return next(
      createHttpError(
        500,
        `Failed to get book: ${(error as Error).message}`
      )
    );
  }
};

export const getMyBooks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId;

  try {
    const book = await Book.find({ author: userId });
    if (book.length === 0) {
      return next(createHttpError(404, "No books found for this user"));
    }
    res.status(200).json({
      message: "User's books retrieved successfully",
      book,
    });
  } catch (error) {
    return next(
      createHttpError(500, `Failed to get user's books: ${(error as Error).message}`)
    );
  }
};

