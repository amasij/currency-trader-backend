import {BaseError} from "./base-error";
import {HttpStatusCode} from "../../domain/enums/http-status-code";

export class ErrorResponse extends BaseError {
    constructor(data: IErrorResponse) {
        super(data.code, data.description);
    }
}

interface IErrorResponse {
    code: HttpStatusCode;
    description: string;
}