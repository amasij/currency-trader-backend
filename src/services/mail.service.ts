import {Container, Service} from "typedi";
import nodemailer, {Transporter} from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {AppConfigurationProperties} from "../config/app-configuration-properties";
import {Constants} from "../constants";
import * as fs from "fs";
import * as path from "path";
import hbs from 'handlebars';
import {ErrorResponse} from "../config/error/error-response";
import {HttpStatusCode} from "../domain/enums/http-status-code";

@Service()
export class MailService {
    private transporter!: Transporter<SMTPTransport.SentMessageInfo>;
    private appConfigurationProperties!: AppConfigurationProperties;

    constructor() {
        this.appConfigurationProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: this.appConfigurationProperties.mailUsername,
                pass: this.appConfigurationProperties.googleAppPassword
            }
        });
    }

    async sendMail(config: { locals: {}, to: string; subject: string; template:string}) {
       try{
           const source = fs.readFileSync(path.join(__dirname.replace('/services', ''), `/templates/${config.template}.hbs`), 'utf8');
           const template = hbs.compile(source);
           const res = await this.transporter.sendMail({
               from: 'simonjoseph750@gmail.com',
               to: config.to,
               subject: config.subject,
               html: template(config.locals),
           });
       }catch (e){
           throw new ErrorResponse({code:HttpStatusCode.INTERNAL_SERVER,description:'Unable to send mail'});
       }
    }
}