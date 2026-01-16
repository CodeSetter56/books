export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface IBook {
  _id: string;
  title: string;
  genre: string;
  author: IUser;
  coverimg: string;
  file: string;
}

export interface IBookParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ILinkButton {
  destination: string;
  text: string;
}
export interface IButton {
  text: string;
}
