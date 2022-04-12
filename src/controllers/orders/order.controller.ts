import {RouteConfiguration} from "../../config/routes/route-config";
import express, {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import {OrderService} from "../../services/orders/order.service";
import {plainToInstance} from "class-transformer";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {OrderCreationDto} from "../../domain/dto/order-creation.dto";

export class OrderController extends RouteConfiguration {
    private orderService!: OrderService;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.orderService = Container.get(OrderService);
    }

    register() {
        this.app.post(`${this.prefix}/create`, [this.isPublicApi, this.validate(OrderCreationDto)], (req: Request, res: Response, next: NextFunction) =>
            this.handle(req, res, next, async () => {
                const dto = plainToInstance(OrderCreationDto, req.body);
                return res.status(HttpStatusCode.OK).json(await this.orderService.createOrder(dto));
            }));

        return this.app;
    }


}