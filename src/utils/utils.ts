import {HttpStatusCode} from "../domain/enums/http-status-code";
import {validate} from "class-validator";
import {ErrorResponse} from "../config/error/error-response";
import crypto from "crypto";

export const print = (v: any, y?: any) => console.log(v, y || '');

export const copyProperties = <T>(from: T, to: T): void => {
    Object.getOwnPropertyNames(from).forEach(prop => {
        (to as any)[prop] = (from as any)[prop];
    });
};

export class Utils {
    public static generateReference(): string {
        return crypto.randomUUID();
    }


    public static formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US',).format(amount / 100);
    }


    public static async validateClass(data: any, errorMessage: string) {
        const errors = await validate(data, {skipMissingProperties: false}).catch();
        if (errors && errors.length) {
            throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: errorMessage});
        }
    }

    public static async resolve(resolutions: Promise<any>[]) {
        await Promise.all(resolutions);
    }
}

