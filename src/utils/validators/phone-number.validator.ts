import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import {PhoneNumberService} from "../../services/phone-number.service";

@ValidatorConstraint({ name: 'isValidPhoneNumber', async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
    validate(phoneNumber: string, args: ValidationArguments) {
        return PhoneNumberService.isValid(phoneNumber,'NG');
    }

    defaultMessage(args: ValidationArguments) {
        return 'Not a valid phone number';
    }
}