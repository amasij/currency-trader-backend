import express from 'express';
import {NextFunction, Request, Response} from "express-serve-static-core";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {Constants} from "../../constants";
import {AppConfigurationProperties} from "../app-configuration-properties";
import {Container} from "typedi";
import {AppRepository} from "../../repositories/app.repository";
import {User} from "../../models/entity/user.model";

const jwt = require('jsonwebtoken');

export abstract class RouteConfiguration {
    app: express.Application;
    name: string;
    appConfigProperties!: AppConfigurationProperties;
    appRepository!: AppRepository;

    protected constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.appConfigProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
        this.appRepository = Container.get(AppRepository);
        this.register();
    }

    getName() {
        return this.name;
    }


    public validate(klass: any) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const output: any = plainToInstance(klass, req.body);
            const errors = await validate(output, {skipMissingProperties: true}).catch();
            if (errors && errors.length) {
                return res.status(HttpStatusCode.UNAUTHORIZED).send([].concat.apply([], (errors.map(x => x.constraints).map(o => Object.keys(o!).map(key => o![key]))) as []));
            }
            next();
        };
    }

    public isPublicApi(req: Request, res: Response, next: NextFunction) {
        res.locals[Constants.PUBLIC_API] = true;
        next();
    }


    public async handle(req: Request, res: Response, next: NextFunction, f: () => Promise<Response> | Response) {
        try {
            if (!(!!res.locals[Constants.PUBLIC_API])) {
                if (!(!!req.headers.authorization)) {
                    return RouteConfiguration.unauthorized(res, 'Unauthorized');
                }
                const authResponse = this.authenticate(req.headers.authorization);
                if (authResponse.valid) {
                    const user = await this.getUser(authResponse.userId!);
                    if (!user) {
                        return RouteConfiguration.unauthorized(res, 'Unauthorized');
                    } else {
                        res.locals[Constants.LOGGED_IN_USER] = user;
                    }
                } else {
                    return RouteConfiguration.unauthorized(res, 'Invalid token');
                }
            }
            return await f();
        } catch (e) {
            return next(e);
        }
    }

    private async getUser(id: number): Promise<User | null | undefined> {
        return await this.appRepository.connection.getRepository(User).findOne({id}).catch();
    }


    private authenticate(token: string): { userId?: number | null; valid?: boolean } {
        try {
            const decoded = jwt.verify(token.replace('Bearer ',''), this.appConfigProperties.jwtSecret);
            return {userId: decoded.userId, valid: true};
        } catch (e) {
            return {userId: null, valid: false};
        }
    }

    private static unauthorized(res: Response, message: string): Response {
        return res.status(HttpStatusCode.UNAUTHORIZED).send(message);
    }


    abstract register(): express.Application;
}