import { ApiError } from "@/src/utils/api-response";

export class AppError extends Error {
    public statusCode: number;
    public errorType: ApiError["errorType"];

    constructor(message: string, statusCode: number, errorType: ApiError["errorType"]) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;

        // Giữ đúng cấu trúc kế thừa Class trong TypeScript
        Object.setPrototypeOf(this, AppError.prototype);
    }
}