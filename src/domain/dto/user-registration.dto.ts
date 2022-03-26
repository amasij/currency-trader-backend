import {IsDefined, IsMobilePhone, Matches, Validate} from "class-validator";
import {Expose} from "class-transformer";
import {UniqueResourceValidator} from "../../utils/validators/unique-resource.validator";

export class UserRegistrationDto {
    @IsDefined()
    @Expose()
    firstName!: string;

    @IsDefined()
    @Expose()
    lastName!: string;

    @IsDefined()
    @IsMobilePhone()
    @Expose()
    @Validate(UniqueResourceValidator, ['PHONE_NUMBER'], {})
    phoneNumber!: string;

    @IsDefined()
    @Expose()
        // @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
    password!: string;

    @IsDefined()
    @Expose()
    @Validate(UniqueResourceValidator, ['EMAIL'], {})
    @Matches(RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    email!: string;
}

