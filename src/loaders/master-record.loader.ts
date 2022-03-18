import {Container} from "typedi";
import {MasterRecordService} from "../services/master-record.service";

export class MasterRecordLoader {
    masterRecordService!: MasterRecordService;

    constructor() {
        this.masterRecordService = Container.get(MasterRecordService);
        return this;
    }

    async load() {
        const numberOfCountries: number = await this.masterRecordService.countAllCountries();

        if (numberOfCountries == 0) {
            await this.masterRecordService.loadCountries();
        }

        const numberOfStatesLoaded: number = await this.masterRecordService.countAllStates();

        if (numberOfStatesLoaded == 0) {
            await this.masterRecordService.loadStates();
        }

    }
}