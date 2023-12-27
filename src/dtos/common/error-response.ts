export interface ErrorResponse {
    message: string;
    stackTrace?: string;
    innerException?: string;
    innerExceptionStackTrace?: string;
}