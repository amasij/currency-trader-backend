import express, {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import {AppConfigurationProperties} from "../../config/app-configuration-properties";
import {RouteConfiguration} from "../../config/routes/route-config";
import {Constants} from "../../constants";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {UserRegistrationDto} from "../../domain/dto/user-registration.dto";
import {UserService} from "../../services/user/user.service";
import {plainToInstance} from "class-transformer";
import {User} from "../../models/entity/user.model";
import {UserLoginDto} from "../../domain/dto/user-login.dto";
import {UserLoginResponse} from "../../domain/pojo/user-login-response";

export class UserController extends RouteConfiguration {
    private appConfigurationProperties!: AppConfigurationProperties;
    private userService!: UserService;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.appConfigurationProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
        this.userService = Container.get(UserService);
    }

    register() {
        this.app.post(`${this.prefix}/register`, [this.isPublicApi, this.validate(UserRegistrationDto)], (req: Request, res: Response, next: NextFunction) =>
            this.handle(req, res, next, async () => {
                const dto = plainToInstance(UserRegistrationDto, req.body);
                const user: User = await this.userService.createUser(dto);
                return res.status(HttpStatusCode.OK).json({id: user.id});
            }));

        this.app.post(`${this.prefix}/login`, [this.isPublicApi, this.validate(UserLoginDto)], (req: Request, res: Response, next: NextFunction) =>
            this.handle(req, res, next, async () => {
                const dto = plainToInstance(UserLoginDto, req.body);
                const userLoginResponse: UserLoginResponse = await this.userService.loginUser(dto);
                return res.status(HttpStatusCode.OK).json(userLoginResponse);
            }));

        this.app.get(`${this.prefix}/test`, (...args) =>
            this.handle(...args, async () => {
                const [req, res] = args;
                return res.status(HttpStatusCode.OK).send('done');
            }));

        return this.app;
    }
}
