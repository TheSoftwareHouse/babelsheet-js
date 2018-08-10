import AppError from './app';
export default class NotFoundError extends AppError {
    message: string;
    constructor(message: string);
}
