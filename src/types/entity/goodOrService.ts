import { SelectionDiff } from './../../constants/selection';
import { Selection } from '@/constants/selection'

export type FundingSource = 'Non-Research' | 'Research-Internal' | 'Research-External'

export type FacultyOrDepartment = 'FAH' | 'IF' | 'EF'

export interface BaseInfo {
  date:string,
  brNo:string,
  fundingSourceVal:FundingSource,
  fundingSource:Selection<FundingSource>,
  staffName:string,
  alternateContactPerson:string,
  facultyOrDepartmentVal:FacultyOrDepartment,
  facultyOrDepartment:Selection<FacultyOrDepartment>,
  subject:''
}
export type MarkType = 'approved' | 'rejected' | 'updated' | 'to be processed'

export interface tableExtendField {
  expand:boolean,
  mark:MarkType,
  markComment:string,
  showPopover:boolean,
  /**
   * the unique ID that VEXTABLE create
   */
  _VXE_ID:string
}

export type ExpenseType = 'Good' | 'Service'

export type PaymentCurrencyType  = 'RMB' | 'HKD' | "MOP"

export type PayeeType = 'Company' | 'Staff' | 'student' | 'Individual'

export interface Payment extends tableExtendField{
  id:string,
  expenseTypeVal:ExpenseType,
  expenseType:Selection<ExpenseType>,
  item:string,
  servicePeriod:string,
  currency:string,
  amount:number,
  paymentCurrencyVal:PaymentCurrencyType,
  paymentCurrency:Selection<PaymentCurrencyType>,
  payeeTypeVal:PayeeType,
  payeeType:Selection<PayeeType>,
  payeeName:string,
  staffNumber:string,
  radio:'1' | '2',
  IDOrPassportNumber:string,
  issuanceIn:string,
  email:string,
  contactNumber:string
}

export type ExchangeRateType = 'UM default' | 'User define'

export interface Reimbursement extends tableExtendField{
  id:string,
  expenseTypeVal:ExpenseType,
  expenseType:Selection<ExpenseType>,
  item:string,
  servicePeriod:string,
  currency:string,
  amount:number,
  exchangeRateTypeVal:ExchangeRateType,
  exchangeRateType:Selection<ExchangeRateType>,
  rateDate:string,
  rate:number,
  amountInMop:number,
  payeeTypeVal:PayeeType,
  payeeType:Selection<PayeeType>,
  payeeName:'Company A',
  staffNumber:'SN-182',
}



// to be updated
export type BankInformation = 'Latest Information to be provided' | 'Information provided in the past'
export type PaymentMethod = 'Telegraphic transfer' | 'Auto-pay' | 'Cheque/Cashier Order' | 'Bank Draft'
export type PaymentMethodPrompt = 'Telegraphic transfer (Non-local payee)' | 'Auto-pay (Local payee)' | 'Cheque/Cashier Order (Local payee)' | 'Bank Draft (Non-local payee)'
export interface InformationForPayment{
  payee:string,
  bankInformationVal:BankInformation,
  bankInformationType:Selection<BankInformation>,
  paymentMethodVal:PaymentMethod,
  paymentMethodType:SelectionDiff<PaymentMethodPrompt,PaymentMethod>
}

export interface Attachment{
  proposal:string[],
  invoicedOrReceipts:string[],
  actualExchangeRateJustification:string[],
  passportOrIDCopy:string[],
  others:string[]
}


export type DesignatedCurrency = 'MOP' | 'HKD' | 'RMB'

// paymentMethod
export interface TelegraphicTransfer{
  beneficiaryName: string,
  bankAccountNumber: string,
  bankName:string,
  designatedCurrencyVal:DesignatedCurrency,
  designatedCurrencyType:Selection<DesignatedCurrency>,
  countryAndDistrictOfBeneficiaryBank:string,
  swiftCode:string,
  bankAddress:string,
  idOrPassportNumber: string,
  beneficiaryHomeAddress:string,
  stateorprovinceorcityofbeneficiary:string,
  countryOrDistrictOfBeneficiary:string,
  routeCodeWithUsOrCanada:string,
  routeCodeWithUKOrAustralia:string,
  intermediaryBankName:string,
  intermediaryBankSwiftCode:string,
  intermediaryBankAddress:string,
  emailAddress:string,
  contactNumber:string,
  specialArrangement:string
}

export interface AutoPay{
  beneficiaryName: string,
  bankAccountNumber:string,
  bankName:string,
  taxIdOrIDNumber:string,
  emailAddress:string,
  contactNumber:string,
}

export interface BankDraft{
  beneficiaryName: string,
  designatedCurrencyVal:'HKD' | 'USD',
  designatedCurrencyType:[{
    value:'USD',
    label:'USD'
  },{
    value:'HKD',
    label:'HKD'
  }],
  mailingAddress:string,
  idOrPassportNumber: string,
  beneficiaryChineseName:string,
  genderVal:'Male' | 'Feamle',
  genderType:[{
    value:'Male',
    label:'Male'
  },{
    value:'Female',
    label:'Female'
  }],
  dateOfBirth:string,
  cityOfBirth:string,
  emailAddress:string,
  contactNumber:string,
}

export interface CashierOrder{
  beneficiaryName: string,
  taxIDOrIDNumber:string,
  emailAddress:string,
  contactNumber:string,
}

export type PaymentMethodCached = {
  telegraphicTransfer:TelegraphicTransfer,
  cashierOrder:CashierOrder,
  bankDraft:BankDraft,
  autoPay: AutoPay
}[]

