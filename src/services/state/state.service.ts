import {Service} from "typedi";
import {AppRepository} from "../../repositories/app.repository";
import {State} from "../../models/entity/state.model";
import {StatusConstant} from "../../models/enums/status-constant";

@Service()
export class StateService{
    constructor(private appRepository:AppRepository) { }

    async getStates():Promise<State[]>{
        return await this.appRepository.getRepository(State).find({status:StatusConstant.ACTIVE,isSupported:true})
    }
}