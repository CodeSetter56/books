import cloudinary from "../config/cloudinary";
import fs from "node:fs/promises";
import createHttpError from "http-errors";

export const uploadFileToCloudinary = async (
  file: Express.Multer.File,
  folder: string,
  resourceType: "image" | "raw" = "image"
): Promise<string> => {
  const mimeType = file.mimetype.split("/")[1] as string;

  const uploadOptions: any = {
    filename_override: file.filename,
    folder: folder,
    format: mimeType,
  };

  if (resourceType === "raw") {
    uploadOptions.resource_type = "raw";
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(
      file.path,
      uploadOptions
    );
    return uploadResult.secure_url;
  } catch (error) {
    throw error;
  } finally {
    await fs.unlink(file.path).catch((err) => {
      console.error(`Failed to unlink local file ${file.path}:`, err);
    });
  }
};

export const extractPublicId = (
  secureUrl: string,
  folder: string,
  resourceType: "image" | "raw" = "image"
): string | null => {
  try {
    const parts = secureUrl.split("/");
    const folderIndex = parts.indexOf(folder);
    if (folderIndex === -1) return null;

    const publicIdPart = parts.slice(folderIndex).join("/");

    const publicId =
      resourceType === "image"
        ? publicIdPart.replace(/\.[^/.]+$/, "")
        : publicIdPart;

    return publicId;
  } catch (e) {
    console.error("Failed to extract public ID:", e);
    return null;
  }
};

export const deleteCloudinaryAssets = async (
  coverUrl: string,
  fileUrl: string,
  throwOnError: boolean = true
): Promise<{ coverResult: any; fileResult: any }> => {
  const coverimgPublicId = extractPublicId(coverUrl, "book_covers", "image");
  const bookFilePublicId = extractPublicId(fileUrl, "book_files", "raw");

  const deletionPromises: Promise<any>[] = [];

  if (coverimgPublicId) {
    const coverDeletion = cloudinary.uploader
      .destroy(coverimgPublicId, {
        resource_type: "image",
      })
      .then((result) => {
        console.log("Cover image deleted successfully:", result);
        if (
          throwOnError &&
          result.result !== "ok" &&
          result.result !== "not found"
        ) {
          throw createHttpError(
            500,
            `Cover image deletion failed in Cloudinary: ${result.result}`
          );
        }
        return result;
      })
      .catch((error) => {
        console.error("Failed to delete cover image:", error);
        if (throwOnError) {
          throw createHttpError(
            500,
            `Failed to communicate with Cloudinary for cover image deletion: ${
              (error as Error).message
            }`
          );
        }
        return { result: "error", error };
      });
    deletionPromises.push(coverDeletion);
  }

  if (bookFilePublicId) {
    const fileDeletion = cloudinary.uploader
      .destroy(bookFilePublicId, {
        resource_type: "raw",
      })
      .then((result) => {
        console.log("Book file deleted successfully:", result);
        if (
          throwOnError &&
          result.result !== "ok" &&
          result.result !== "not found"
        ) {
          throw createHttpError(
            500,
            `Book file deletion failed in Cloudinary: ${result.result}`
          );
        }
        return result;
      })
      .catch((error) => {
        console.error("Failed to delete book file:", error);
        if (throwOnError) {
          throw createHttpError(
            500,
            `Failed to communicate with Cloudinary for book file deletion: ${
              (error as Error).message
            }`
          );
        }
        return { result: "error", error };
      });
    deletionPromises.push(fileDeletion);
  }

  const results = await (throwOnError
    ? Promise.all(deletionPromises)
    : Promise.allSettled(deletionPromises));

  return {
    coverResult: results[0],
    fileResult: results[1],
  };
};
