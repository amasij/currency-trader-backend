import {Service} from "typedi";
import {AppRepository} from "../../repositories/app.repository";
import {SequenceGeneratorService} from "../sequence-generator.service";
import {Transactional} from "typeorm-transactional-cls-hooked";
import {Wallet} from "../../models/entity/wallet.model";
import {User} from "../../models/entity/user.model";
import {StatusConstant} from "../../models/enums/status-constant";
import {WalletCurrencyBalance} from "../../models/entity/wallet-currency-balance.model";
import {Currency} from "../../models/entity/currency.model";
import {UserWallet} from "../../models/entity/user-wallet.model";

@Service()
export class WalletService {
    constructor(private appRepository: AppRepository,
                private sequenceService: SequenceGeneratorService) {

    }

    @Transactional()
    async createWallet(user: User, name: string): Promise<Wallet> {
        const wallet: Wallet = new Wallet();
        wallet.code = await this.sequenceService.getNextValue(Wallet.name, 'WA');
        wallet.name = name;
        wallet.status = StatusConstant.ACTIVE;
        wallet.dateCreated = new Date();
        const savedWallet: Wallet = await this.appRepository.getRepository(Wallet).save(wallet);
        await this.createDefaultWalletCurrencyBalance(savedWallet);
        await this.createUserWallet(user,savedWallet);
        return savedWallet;
    }

    private async createUserWallet(user: User, wallet: Wallet) {
        const userWallet: UserWallet = new UserWallet();
        userWallet.wallet = wallet;
        userWallet.user = user;
        userWallet.code = await this.sequenceService.getNextValue(UserWallet.name, 'UW');
        await this.appRepository.getRepository(UserWallet).save(userWallet);
    }

    private async createDefaultWalletCurrencyBalance(wallet: Wallet) {
        const wcb: WalletCurrencyBalance = new WalletCurrencyBalance();
        wcb.currency = await this.appRepository.connection.getRepository(Currency).findOneOrFail({code: 'NGN'});
        wcb.code = await this.sequenceService.getNextValue(Wallet.name, 'WCB');
        wcb.wallet = wallet;
        wcb.amount = 0;
        await this.appRepository.getRepository(WalletCurrencyBalance).save(wcb);

    }


}