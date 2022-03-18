import {Service} from "typedi";
import {AppRepository} from "../repositories/app.repository";

@Service()
export class SequenceGeneratorService {
    constructor(private appRepository: AppRepository) {
    }

    async getNextValue(klass: any, prefix: string = ''): Promise<string> {
        await this.appRepository.connection.manager.query(`create sequence if not exists ${klass.toString().toLowerCase()}_sequence increment 1 start 1000`);
        const nextVal = await this.appRepository.connection.query(`SELECT nextval('${klass.toString().toLowerCase()}_sequence')`);
        return `${prefix}${nextVal[0]['nextval']}`;
    }
}