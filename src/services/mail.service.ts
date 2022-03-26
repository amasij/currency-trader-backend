import {Container, Service} from "typedi";
import nodemailer, {Transporter} from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {AppConfigurationProperties} from "../config/app-configuration-properties";
import {Constants} from "../constants";
import * as fs from "fs";
import * as path from "path";
import hbs from 'handlebars';

@Service()
export class MailService {
    private transporter!: Transporter<SMTPTransport.SentMessageInfo>;
    private appConfigurationProperties!: AppConfigurationProperties;

    constructor() {
        this.appConfigurationProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
        // this.transporter = nodemailer.createTransport({
        //     host: this.appConfigurationProperties.mailHostName,
        //     port: this.appConfigurationProperties.serverPort,
        //     secure: false,
        //     requireTLS: true,
        //     auth: {
        //         user: this.appConfigurationProperties.mailUsername,
        //         pass: this.appConfigurationProperties.mailPassword,
        //     },
        //     logger: true
        // });

        this.transporter = nodemailer.createTransport({
            service: 'Gmail',  // More at https://nodemailer.com/smtp/well-known/#supported-services
            auth: {
                user: this.appConfigurationProperties.mailUsername, // Your email id
                pass: 'nakqcfcuwgnidgcr'// Your password
            }
        });
    }

    async sendMail(templateName: string,locals:{}) {
        const source = fs.readFileSync(path.join(__dirname.replace('/services',''), `/templates/${templateName}.hbs`), 'utf8');
        const template = hbs.compile(source);
        const res = await this.transporter.sendMail({
            from: 'simonjoseph750@gmail.com',
            to: 'simonjoseph750@gmail.com',
            subject: 'Welcome to Trader',
            html: template(locals),
        });
    }
}