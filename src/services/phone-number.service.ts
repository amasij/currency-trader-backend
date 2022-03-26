import {Service} from "typedi";

const PhoneNumber = require( 'awesome-phonenumber' );

@Service()
export class PhoneNumberService{
    static isValid(phoneNumber:string,countryCode:string):boolean{
        const pn = new PhoneNumber(phoneNumber, countryCode );
        return pn.isValid();
    }

    static format(phoneNumber:string,countryCode:string):string{
        const pn = new PhoneNumber(phoneNumber.toString(), countryCode );
        return pn.getNumber( );
    }
}