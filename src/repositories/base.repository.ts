import {DeepPartial, EntityManager, EntityTarget} from "typeorm";
import {AppRepository} from "./app.repository";

export class BaseRepository<T> {
    constructor(private appRepository: AppRepository, private entity: EntityTarget<T>) {
    }

    get entityManager():EntityManager{
        return this.appRepository.connection.manager;
    }

    async saveAll(items: DeepPartial<T>[]): Promise<T[]> {
        const repository = this.appRepository.connection.getRepository<T>(this.entity);
        return await repository.save(items);

    }
}