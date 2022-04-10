import {Service} from "typedi";
import {MasterRecordRepository} from "../repositories/master-record.repository";
import {StateRepository} from "../repositories/state.repository";
import {CountryRepository} from "../repositories/country.repository";
import {Transaction} from "typeorm";
import {Country} from "../models/entity/country.model";
import {StatusConstant} from "../models/enums/status-constant";
import {State} from "../models/entity/state.model";
import {StateJSON} from "../domain/interface/state-json.interface";
import {SequenceGeneratorService} from "./sequence-generator.service";
import {Transactional} from "typeorm-transactional-cls-hooked";
import {Currency} from "../models/entity/currency.model";
import {CurrencyJSON} from "../domain/interface/currencyJSON";
import {AppRepository} from "../repositories/app.repository";
import {copyProperties, Utils} from "../utils/utils";


const countryList = require('../resources/country.json');
const stateList = require('../resources/state.json');
const currencyList = require('../resources/currency.json');

@Service()
export class MasterRecordService {
    constructor(private masterRecordRepository: MasterRecordRepository,
                private countryRepository: CountryRepository,
                private appRepository:AppRepository,
                private sequenceGenerator: SequenceGeneratorService,
                private stateRepository: StateRepository) {
    }

    countAllCurrencies(): Promise<number> {
        return this.masterRecordRepository.countAllCurrencies();
    }
    countAllStates(): Promise<number> {
        return this.masterRecordRepository.countAllStates();
    }

    countAllCountries(): Promise<number> {
        return this.masterRecordRepository.countAllCountries();
    }



    @Transactional()
    async loadCurrencies(){
        const currencies:Currency[] = [];
        let resolutions = (currencyList as CurrencyJSON[]).map(async item => {
            let currency: Currency = new Currency();
            currency.status = StatusConstant.ACTIVE;
            currency.dateCreated = new Date();
            currency.code = item.cc;
            currency.symbol = item.symbol;
            currency.name = item.name;
            currency.nairaValue = 580;
            currencies.push(currency);
        });
        await Utils.resolve(resolutions);
        await  this.appRepository.getRepository(Currency).save(currencies);
    }

    @Transactional()
    async loadCountries() {
        const countries: Country[] = [];
        let resolutions = (countryList as Country[]).map(async item => {
            let country: Country = new Country();
            copyProperties<Country>(item, country);
            country.status = StatusConstant.ACTIVE;
            country.dateCreated = new Date();
            country.isSupported = false;
            country.code = await this.sequenceGenerator.getNextValue(Country.name, 'CON');
            countries.push(country);
        });
        await Utils.resolve(resolutions);
        await this.countryRepository.saveAll(countries);
    }

    @Transactional()
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
        await Utils.resolve(resolutions);
        await this.stateRepository.saveAll(states);
    }
}