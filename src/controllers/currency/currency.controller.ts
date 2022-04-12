import express, {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import {plainToInstance} from "class-transformer";
import {RouteConfiguration} from "../../config/routes/route-config";
import {CurrencyService} from "../../services/currency/currency.service";
import {CurrencyFilter} from "../../domain/filters/currency.filter";
import {HttpStatusCode} from "../../domain/enums/http-status-code";

export class CurrencyController extends RouteConfiguration {
    private currencyService!: CurrencyService;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.currencyService = Container.get(CurrencyService);
    }

    register() {
        this.app.get(`${this.prefix}/search`,this.isPublicApi, (req: Request, res: Response, next: NextFunction) =>
            this.handle(req, res, next, async () => {
                const filter = plainToInstance(CurrencyFilter, req.query);
                return res.status(HttpStatusCode.OK).json(await this.currencyService.search(filter));
            }));

        return this.app;
    }


}