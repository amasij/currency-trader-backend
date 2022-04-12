import {Service} from "typedi";
import {AppRepository} from "../../repositories/app.repository";
import {Currency} from "../../models/entity/currency.model";
import {CurrencyFilter} from "../../domain/filters/currency.filter";
import {StatusConstant} from "../../models/enums/status-constant";

@Service()
export class CurrencyService {
    constructor(private appRepository: AppRepository) {
    }

    async search(filter: CurrencyFilter): Promise<Currency[]> {
        const query = this.appRepository.getRepository(Currency).createQueryBuilder('currency').where({status: StatusConstant.ACTIVE});

        if (filter && (filter.supported != null || filter.supported != undefined)) {
            query.where('currency.supported = :supported', {supported: filter.supported});
        }
        return await query.getMany();
    }

}