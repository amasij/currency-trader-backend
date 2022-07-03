
import {Service} from "typedi";
import {Repository} from "typeorm";
import {BaseRepository} from "./base.repository";
import {AppRepository} from "./app.repository";
import {State} from "../models/entity/state.model";
import {Country} from "../models/entity/country.model";
import {StatusEnum} from "../models/enums/status.enum";

@Service()
export class StateRepository extends BaseRepository<State> {
    constructor(private db: AppRepository) {
        super(db, State);
    }

    async findActiveStatesByCountryAlpha2(alpha2: string): Promise<State[]> {
        const repository: Repository<State> = this.db.connection.getRepository(State);
        return repository.createQueryBuilder('state')
            .leftJoin(Country, 'country', 'country.id = state.countryId')
            .where('country.alpha2 = :alpha2', {alpha2})
            .andWhere('state.status = :status', {status: StatusEnum.ACTIVE})
            .getMany();
    }

}