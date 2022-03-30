import {Column, Entity, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {UserWallet} from "./user-wallet.model";
import {WalletCurrencyBalance} from "./wallet-currency-balance.model";
import {PaymentTransaction} from "./payment-transaction.model";
import {Trade} from "./trade.model";

@Entity()
export class Wallet extends BaseModel {

    @Column({})
    name!: string;

    @OneToMany(type => UserWallet, userWallet => userWallet.wallet)
    userWallets!: UserWallet[];

    @OneToMany(type => WalletCurrencyBalance, walletCurrencyBalance => walletCurrencyBalance.wallet)
    walletCurrencyBalance!: WalletCurrencyBalance[];


}