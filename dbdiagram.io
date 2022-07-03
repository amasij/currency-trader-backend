table User{
id int [pk]
  firstName varchar
  lastName varchar
  phoneNumber varchar
  email varchar
  status EntityStatus
  password varchar
  code varchar
}

table UserAddress{
  id int [pk]
  user User
  address Address
  status EntityStatus
}

table Address{
  id int [pk]
  description varchar
  stateCode varchar
}

table UserAccountDetail{
  id int [pk]
  accountDetails AccountDetails
  user User
  status EntityStatus
}

table UserRole{
  id int [pk]
  user User
  role Role
  status EntityStatus
}

table AccountDetails{
  id int [pk]
  username varchar
  bank Bank
  BVN varchar
  firstName varchar
  lastName varchar
  accountNumber varchar
  currency Currency
  accountType AccountTypeConstatnt

}

table Order{
  id int [pk]
  status EntityStatus
  code varchar
  user User
  trackingId varchar
  userFirstName varchar
  userLastName varchar
  userPhoneNumber varchar
  note varchar
  address Address
  orderType OrderTypeStatus
  accountDetails AccountDetails
  amount int
  mode OrderModeConstant
  fromCurrency Currency
  toCurrency Currency
  currentFromCurrencyNairaBuyValue int
  currentFromCurrencyNairaSellValue int
  currentToCurrencyNairaBuyValue int
  currentToCurrencyNairaSellValue int
}

table PaymentTransaction{
  id int [pk]
}
enum OrderModeConstant{
  BUY
  SELL
}
enum OrderTypeStatus{
  TRANSFER_TO_CASH
  TRANSFER_TO_BANK
  CARD_TO_CASH
  CARD_TO_BANK
  CASH_TO_CASH
  CASH_TO_BANK
}

table Permission{
  id int [pk]
  name varchar
}

table RolePermission{
  id int [pk]
  role Role
  permission Permission
}

table Role{
  id int [pk]
  description varchar
  name varchar
}

table Currency{
  id int [pk]
  name varchar
  symbol varchar
  supported boolean
  nairaValueBuy int
  nairaValueSell int
}

table CurrencyOrderTypeModel{
  id int [pk]
  currency Currency
  type OrderTypeStatus
}

table Bank{
  id int [pk]
  name varchar
  code varchar
  status EntityStatus
}

enum AccountTypeConstatnt{
  SAVINGS
  CURRENT
}

Ref{
  Order.fromCurrency - Currency.id

}
Ref{
  Order.toCurrency - Currency.id
}
Ref{
  Order.accountDetails - AccountDetails.id
}
Ref{
  Order.address - Address.id
}
Ref{
  Order.user - User.id
}
Ref{
  CurrencyOrderTypeModel.currency - Currency.id
}
Ref{
  UserRole.user - User.id
}

Ref{
  UserRole.role - Role.id
}

Ref{
  RolePermission.role - Role.id
}

Ref{
  RolePermission.permission - Permission.id
}

Ref{
  UserAccountDetail.accountDetails - AccountDetails.id
}
Ref{
  UserAccountDetail.user - User.id
}
Ref{
  AccountDetails.currency - Currency.id
}
Ref{
  AccountDetails.bank - Bank.id
}
Ref{
  UserAddress.address - Address.id
}

Ref{
  UserAddress.user - User.id
}