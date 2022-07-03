import {Container, Service} from "typedi";
import {UserRegistrationDto} from "../../domain/dto/user-registration.dto";
import {User} from "../../models/entity/user.model";
import {AppRepository} from "../../repositories/app.repository";
import {PhoneNumberService} from "../phone-number.service";
import {SequenceGeneratorService} from "../sequence-generator.service";
import {StatusEnum} from "../../models/enums/status.enum";
import {titleCase} from "typeorm/util/StringUtils";
import {Transactional} from "typeorm-transactional-cls-hooked";
import bcrypt from "bcrypt";
import {MailService} from "../mail.service";
import {UserLoginDto} from "../../domain/dto/user-login.dto";
import {UserLoginResponse} from "../../domain/pojo/user-login-response";
import {Repository} from "typeorm";
import {ErrorResponse} from "../../config/error/error-response";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {AppConfigurationProperties} from "../../config/app-configuration-properties";
import {Constants} from "../../constants";
import {UserPojo} from "../../domain/pojo/user-pojo";

const jwt = require('jsonwebtoken');

@Service()
export class UserService {
    private appConfigProperties!: AppConfigurationProperties;

    constructor(private appRepository: AppRepository,
                private mailService: MailService,
                private sequenceService: SequenceGeneratorService) {
        this.appConfigProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
    }

    @Transactional()
    async createUser(dto: UserRegistrationDto): Promise<User> {
        const user: User = new User();
        user.code = await this.sequenceService.getNextValue(User.name, 'USR');
        user.dateCreated = new Date();
        user.status = StatusEnum.ACTIVE;
        user.email = dto.email.toLowerCase();
        user.password = await this.hashPassword(dto.password);
        user.phoneNumber = PhoneNumberService.format(dto.phoneNumber, 'NG');
        user.firstName = titleCase(dto.firstName);
        user.lastName = titleCase(dto.lastName);
        const savedUser = await this.appRepository.getRepository(User).save(user);
        this.sendWelcomeEmail(savedUser);
        return savedUser;
    }

    private sendWelcomeEmail(user: User) {
        this.mailService.sendMail({
            template: 'users/user-registration.template',
            subject: 'Welcome to Trader',
            to: user.email,
            locals: {
                firstName: user.firstName,
                lastName: user.lastName
            },
        });
    }

    private async hashPassword(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, 15);
    }

    private async comparePassword(plainPassword: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, encryptedPassword).catch();
    }

    get userRepository(): Repository<User> {
        return this.appRepository.connection.getRepository(User);
    }

    async loginUser(dto: UserLoginDto): Promise<UserLoginResponse> {
        const user = await this.userRepository.createQueryBuilder('user')
            .where("LOWER(user.email) = :email AND status = :status", {
                email: dto.email.toLowerCase(),
                status: StatusEnum.ACTIVE
            }).getOne();

        if (!user) {
            this.badRequest('Invalid username or password');
        }
        const isValid = await this.comparePassword(dto.password, user!.password);
        if (!isValid) {
            this.badRequest('Invalid username or password');
        }
        const token = jwt.sign({userId: user?.id}, this.appConfigProperties.jwtSecret, {expiresIn: this.appConfigProperties.jwtExpiry});
        return this.getUserLoginResponse(user!, token);
    }

    badRequest(description: string) {
        throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description});
    }

    static getUserPojo(user: User) {
        const data = new UserPojo();
        data.lastName = user.lastName;
        data.firstName = user.firstName;
        data.email = user.email;
        data.phoneNumber = user.phoneNumber;
        data.code = user.code;
        return data;
    }

    private getUserLoginResponse(user: User, token: string): UserLoginResponse {
        const data = {} as UserLoginResponse;
        data.token = token;
        data.user = UserService.getUserPojo(user);
        return data;
    }
}