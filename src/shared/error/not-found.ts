import AppError from './app';

export default class NotFoundError extends AppError {
  constructor(public message: string) {
    super(message, 404);
  }
}
