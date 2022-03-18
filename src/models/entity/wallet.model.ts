import {Column, Entity, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {UserWallet} from "./user-wallet.model";
import {WalletCurrencyBalance} from "./wallet-currency-balance.model";
import {PaymentTransaction} from "./payment-transaction.model";
import {Trade} from "./trade.model";

@Entity()
export class Wallet extends BaseModel {
    @Column()
    amount!: number;

    @Column({})
    name!: string;


    @OneToMany(type => PaymentTransaction, paymentTransaction => paymentTransaction.wallet)
    paymentTransactions!: PaymentTransaction[];

    @OneToMany(type => UserWallet, userWallet => userWallet.wallet)
    userWallets!: UserWallet[];

    @OneToMany(type => Trade, trade => Trade)
    trade!: Trade[];

    @OneToMany(type => WalletCurrencyBalance, walletCurrencyBalance => walletCurrencyBalance.wallet)
    walletCurrencyBalance!: WalletCurrencyBalance[];


}