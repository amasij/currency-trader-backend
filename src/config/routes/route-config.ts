import express from 'express';
import {NextFunction, Request, Response} from "express-serve-static-core";

export abstract class RouteConfiguration {
    app: express.Application;
    name: string;

    protected constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.register();
    }
    getName() {
        return this.name;
    }

    async handle(req: Request, res: Response, next: NextFunction, f: () => Promise<Response> | Response) {
        try {
            console.log(req.body);
            return await f();
        } catch (e) {
            return next(e);
        }

    }

    abstract register(): express.Application;
}