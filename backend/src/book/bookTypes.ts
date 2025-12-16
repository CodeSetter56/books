import { Types } from "mongoose";
import { IUser } from "../user/userTypes";

export interface IBook {
  _id: string;
  title: string;
  genre: string;
  author: Types.ObjectId | IUser;
  coverimg: string;
  file: string;
}

export interface UploadedFiles {
  coverimg?: Express.Multer.File[];
  file?: Express.Multer.File[];
}