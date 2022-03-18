import {HttpStatusCode} from "../../domain/enums/http-status-code";

export class BaseError extends Error {
    statusCode:HttpStatusCode;
    constructor (statusCode:HttpStatusCode, description:string) {
        super(description)

        Object.setPrototypeOf(this, new.target.prototype)
        this.statusCode = statusCode
        // Error.captureStackTrace(this)
    }
}