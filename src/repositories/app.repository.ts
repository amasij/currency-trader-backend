import {Inject, Service} from "typedi";
import "reflect-metadata";
import {Constants} from "../constants";
import {Connection, Repository} from "typeorm";

@Service()
export class AppRepository {

    constructor(@Inject(Constants.DB_CONNECTION) private _connection: Connection) {

    }

    get connection(): Connection {
        return <Connection>this._connection;
    }

    getRepository(klass:any):Repository<any>{
        return this.connection.getRepository(klass);
    }

    async close() {
        if (this._connection) {
            await this._connection.close();
        }
    }

}