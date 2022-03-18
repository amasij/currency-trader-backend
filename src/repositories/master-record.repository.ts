import {Service} from "typedi";
import {AppRepository} from "./app.repository";
import {Repository} from "typeorm";
import {State} from "../models/entity/state.model";
import {Country} from "../models/entity/country.model";


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

}