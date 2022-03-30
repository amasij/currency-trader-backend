import {Service} from "typedi";
import {AppRepository} from "./app.repository";
import {Repository} from "typeorm";
import {State} from "../models/entity/state.model";
import {Country} from "../models/entity/country.model";
import {Currency} from "../models/entity/currency.model";


@Service()
export class MasterRecordRepository {
    constructor(private db: AppRepository) {

    }

    async countAllStates(): Promise<number> {
        const stateRepository: Repository<State> = this.db.connection.getRepository(State);
        return stateRepository.count();
    }

    async countAllCountries(): Promise<number> {
        const countryRepository: Repository<Country> = this.db.connection.getRepository(Country);
        return countryRepository.count();
    }

    async countAllCurrencies(): Promise<number> {
        const currencyRepository: Repository<Currency> = this.db.connection.getRepository(Currency);
        return currencyRepository.count();
    }

}