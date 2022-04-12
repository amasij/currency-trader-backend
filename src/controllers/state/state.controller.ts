import express, {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import {plainToInstance} from "class-transformer";
import {RouteConfiguration} from "../../config/routes/route-config";
import {CurrencyService} from "../../services/currency/currency.service";
import {CurrencyFilter} from "../../domain/filters/currency.filter";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {StateService} from "../../services/state/state.service";

export class StateController extends RouteConfiguration {
    private stateService!: StateService;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.stateService = Container.get(StateService);
    }

    register() {
        this.app.get(`${this.prefix}/search`,this.isPublicApi, (req: Request, res: Response, next: NextFunction) =>
            this.handle(req, res, next, async () => {
                return res.status(HttpStatusCode.OK).json(await this.stateService.getStates());
            }));

        return this.app;
    }


}