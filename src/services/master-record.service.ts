import {Service} from "typedi";
import {MasterRecordRepository} from "../repositories/master-record.repository";
import {StateRepository} from "../repositories/state.repository";
import {CountryRepository} from "../repositories/country.repository";
import {Transaction} from "typeorm";
import {Country} from "../models/entity/country.model";
import {copyProperties, print, resolve} from "../utils/utils";
import {StatusConstant} from "../models/enums/status-constant";
import {State} from "../models/entity/state.model";
import {StateJSON} from "../domain/interface/state-json.interface";
import {SequenceGeneratorService} from "./sequence-generator.service";


const countryList = require('../resources/country.json');
const stateList = require('../resources/state.json');

@Service()
export class MasterRecordService {
    constructor(private masterRecordRepository: MasterRecordRepository,
                private countryRepository: CountryRepository,
                private sequenceGenerator:SequenceGeneratorService,
                private stateRepository: StateRepository) {
    }

    countAllStates() {
        return this.masterRecordRepository.countAllStates();
    }

    countAllCountries() {
        return this.masterRecordRepository.countAllCountries();
    }

    @Transaction()
    async loadCountries() {
        const countries: Country[] = [];
       let resolutions  = (countryList as Country[]).map(async  item => {
            let country: Country = new Country();
            copyProperties<Country>(item, country);
            country.status = StatusConstant.ACTIVE;
            country.dateCreated = new Date();
            country.isSupported = false;
            country.code = await this.sequenceGenerator.getNextValue(Country.name,'CON');
            countries.push(country);
        });
        await resolve(resolutions);
        await this.countryRepository.saveAll(countries);
        print("All countries loaded");
    }

    @Transaction()
    async loadStates() {
        const states: State[] = [];
        let resolutions = (stateList as StateJSON[]).map(async (item, index) => {
            const country: Country = await this.countryRepository.findByAlpha2(item.countryAlpha2);
            if (!country) {
                throw new Error("Cannot find country with alpha2: " + item.countryAlpha2);
            }
            let state: State = new State();
            state.name = item.name;
            state.code = item.code;
            state.country = country;
            state.status = StatusConstant.ACTIVE;
            state.dateCreated = new Date();
            state.isSupported = false;
            states.push(state);
        });
        await resolve(resolutions);
        await this.stateRepository.saveAll(states);
    }
}