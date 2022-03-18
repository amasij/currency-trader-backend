
import {Repository} from "typeorm";
import {print} from "../utils/utils";
import {Service} from "typedi";
import {BaseRepository} from "./base.repository";
import {Country} from "../models/entity/country.model";
import {AppRepository} from "./app.repository";

@Service()
export class CountryRepository extends BaseRepository<Country>{
    constructor(private db: AppRepository) {
        super(db,Country);
    }

    async findByAlpha2(alpha2:string):Promise<Country>{
        const repository:Repository<Country> = this.db.connection.getRepository(Country);
        return repository.findOneOrFail({alpha2});
    }

}