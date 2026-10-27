import multer from 'multer';
import { ValidationError } from '../../../domain/errors.js';
import { ImageFile } from '../../../domain/value-objects/ImageFile.js';

/** Reads one multipart file field named "file" into memory (size-capped); the use case checks its content. */
export class ImageUploadMiddleware
{
  #upload;
  #maxBytes;

  constructor(maxBytes)
  {
    this.#maxBytes = maxBytes;
    this.#upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes, files: 1 } }).single('file');
  }

  handle = (req, res, next) =>
  {
    this.#upload(req, res, (error) => next(error ? this.#toDomainError(error) : undefined));
  };

  #toDomainError(error)
  {
    if (error.code === 'LIMIT_FILE_SIZE') return new ValidationError(ImageFile.tooLargeMessage(this.#maxBytes));
    return error instanceof multer.MulterError ? new ValidationError('The file could not be uploaded.') : error;
  }
}
