import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {AppRepository} from "../../repositories/app.repository";
import {Container} from "typedi";
import {User} from "../../models/entity/user.model";
import {PhoneNumberService} from "../../services/phone-number.service";
import {Repository} from "typeorm";
import {StatusConstant} from "../../models/enums/status-constant";

@ValidatorConstraint({name: 'isUniqueResource', async: true})
export class UniqueResourceValidator implements ValidatorConstraintInterface {
    private appRepository!: AppRepository;

    constructor() {
        this.appRepository = Container.get(AppRepository);
    }

    async validate(identifier: string, args: ValidationArguments) {
        if (UniqueResourceValidator.hasConstraints(args)) return true;
        switch (args.constraints[0]) {
            case 'EMAIL':
                return (await this.userRepository.createQueryBuilder('user')
                    .where("LOWER(user.email) = :email AND status = :status", {
                        email: identifier.toLowerCase(),
                        status: StatusConstant.ACTIVE
                    }).getCount()) < 1;
            case 'PHONE_NUMBER':
                return (await this.userRepository.count({
                    phoneNumber: PhoneNumberService.format(identifier, 'NG'),
                    status: StatusConstant.ACTIVE
                }) < 1);
        }

        return true;
    }

    get userRepository(): Repository<User> {
        return this.appRepository.connection.getRepository(User);
    }

    private static hasConstraints(args: ValidationArguments) {
        return (!args.constraints) || (!(args.constraints && args.constraints.length));
    }

    defaultMessage(args: ValidationArguments) {
        if (UniqueResourceValidator.hasConstraints(args)) return 'Not valid';
        return `${args.constraints[0] == 'EMAIL' ? 'Email' : 'Phone number'} is already being used`;
    }
}