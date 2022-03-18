import express from "express";
import {Container} from "typedi";
import {AppConfigurationProperties} from "../config/app-configuration-properties";
import {RouteConfiguration} from "../config/routes/route-config";
import {Constants} from "../constants";
import {HttpStatusCode} from "../domain/enums/http-status-code";

export class UserController extends RouteConfiguration {
    private appConfigurationProperties!: AppConfigurationProperties;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.appConfigurationProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
    }

    register() {
        this.app.post(`${this.prefix}/register`, (...args) =>
            this.handle(...args, async () => {
                const [req, res] = args;
                console.log(req.body);
                return res.status(HttpStatusCode.OK).json({});
            }));

        return this.app;
    }
}