import {Inject, Service} from "typedi";
import "reflect-metadata";
import {Constants} from "../constants";
import {Connection} from "typeorm";

@Service()
export class AppRepository {

    constructor(@Inject(Constants.DB_CONNECTION) private _connection: Connection) {

    }

    get connection(): Connection {
        return <Connection>this._connection;
    }

    async close() {
        if (this._connection) {
            await this._connection.close();
        }
    }

}