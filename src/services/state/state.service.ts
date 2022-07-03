import {Service} from "typedi";
import {AppRepository} from "../../repositories/app.repository";
import {State} from "../../models/entity/state.model";
import {StatusEnum} from "../../models/enums/status.enum";

@Service()
export class StateService{
    constructor(private appRepository:AppRepository) { }

    async getStates():Promise<State[]>{
        return await this.appRepository.getRepository(State).find({status:StatusEnum.ACTIVE,isSupported:true})
    }
}