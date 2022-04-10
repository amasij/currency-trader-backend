import {RouteConfiguration} from "../../config/routes/route-config";
import {AppConfigurationProperties} from "../../config/app-configuration-properties";
import {UserService} from "../../services/user/user.service";
import express, {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import {Constants} from "../../constants";
import {UserRegistrationDto} from "../../domain/dto/user-registration.dto";
import {plainToInstance} from "class-transformer";
import {User} from "../../models/entity/user.model";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {UserLoginDto} from "../../domain/dto/user-login.dto";
import {UserLoginResponse} from "../../domain/pojo/user-login-response";
import {WalletCreditDto} from "../../domain/dto/wallet-credit.dto";
import {WalletService} from "../../services/wallet/wallet.service";
import {WalletCreditPojo} from "../../domain/pojo/wallet-credit-pojo";

export class WalletController extends RouteConfiguration{
    private appConfigurationProperties!: AppConfigurationProperties;
    private walletService!: WalletService;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.appConfigurationProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
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