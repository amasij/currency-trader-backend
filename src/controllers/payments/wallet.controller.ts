import {RouteConfiguration} from "../../config/routes/route-config";
import {AppConfigurationProperties} from "../../config/app-configuration-properties";
import {UserService} from "../../services/user/user.service";
import express, {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import {plainToInstance} from "class-transformer";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {WalletCreditDto} from "../../domain/dto/wallet-credit.dto";
import {WalletService} from "../../services/wallet/wallet.service";

export class WalletController extends RouteConfiguration{
    private walletService!: WalletService;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.walletService = Container.get(WalletService);
    }

    register() {
        this.app.post(`${this.prefix}/credit`,  this.validate(WalletCreditDto), (req: Request, res: Response, next: NextFunction) =>
            this.handle(req, res, next, async () => {
                const dto = plainToInstance(WalletCreditDto, req.body);
                return res.status(HttpStatusCode.OK).json(await this.walletService.creditWallet(dto));
            }));

        return this.app;
    }

}