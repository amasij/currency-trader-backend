import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {AppConfigurationProperties} from "./config/app-configuration-properties";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {Container} from "typedi";
import {Constants} from "./constants";
import {ErrorResponse} from "./config/error/error-response";
import {HttpStatusCode} from "./domain/enums/http-status-code";
import {MasterRecordLoader} from "./loaders/master-record.loader";
import {Routes} from "./config/routes/routes";
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository
} from "typeorm-transactional-cls-hooked";

(async () => {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    dotenv.config();
    const appConfigurationProperties = new AppConfigurationProperties();

    const connection: Connection = await createConnection({
        type: appConfigurationProperties.databaseEngine,
        host: appConfigurationProperties.databaseHost,
        port: appConfigurationProperties.databasePort,
        username: appConfigurationProperties.databaseUsername,
        password: appConfigurationProperties.databasePassword,
        database: appConfigurationProperties.databaseName,
        entities: [
            __dirname + "/models/entity/*.ts"
        ],
        synchronize: true,
    } as PostgresConnectionOptions).catch();

    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: ['http://localhost:5200']
    }));


    Container.set(Constants.DB_CONNECTION, connection);
    Container.set(Constants.APPLICATION_CONTEXT, app);
    Container.set(Constants.APP_CONFIGURATION_PROPERTIES, appConfigurationProperties);

    await new MasterRecordLoader().load();
    Routes.register(app);

    app.use((e: any, req: any, res: any, next: any) => {
        console.log(e)
        res.status((e && e.statusCode)??HttpStatusCode.INTERNAL_SERVER).json({message: (e instanceof ErrorResponse) ? e.message : 'An error occurred'});
    });

    app.listen(appConfigurationProperties.serverPort, () => {
        console.log(`The application is listening on port ${appConfigurationProperties.serverPort}`);
    });


})();


