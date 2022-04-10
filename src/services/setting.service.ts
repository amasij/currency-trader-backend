import {Service} from "typedi";
import {AppRepository} from "../repositories/app.repository";
import {Setting} from "../models/entity/setting.model";
import {SequenceGeneratorService} from "./sequence-generator.service";
import {Transactional} from "typeorm-transactional-cls-hooked";

@Service()
export class SettingService {
    constructor(private appRepository: AppRepository,
                private sequenceService: SequenceGeneratorService
    ) {
    }

    async getNumber(name: string, defaultValue: number): Promise<number> {
        const data = await this.getValue(name);
        if (data) {
            return parseInt(data.value);
        }
        const setting: Setting = await this.setValue(name, defaultValue);
        return parseInt(setting.value);
    }

    async getString(name: string, defaultValue: string): Promise<string> {
        const data = await this.getValue(name);
        if (data) {
            return data.value.toString();
        }
        const setting: Setting = await this.setValue(name, defaultValue);
        return setting.value.toString();
    }

    @Transactional()
    private async setValue(name: string, value: any): Promise<Setting> {
        const setting = new Setting();
        setting.value = value.toString();
        setting.name = name.toUpperCase();
        setting.code = await this.sequenceService.getNextValue(Setting.name, 'SETT');
        return await this.appRepository.getRepository(Setting).save(setting);
    }

    private getValue(name: string): Promise<Setting> {
        return this.appRepository.getRepository(Setting).findOne({name: name.toUpperCase()});
    }
}