import { useState } from "@/hooks/useState";

export function useTelegrahpicTransferState(){
  const { telegraphicTransferTableData }  = useState({
    telegraphicTransferTableData:{
      beneficiaryName: '',
      bankAccountNumber: '',
      bankName:'ABC Bank',
      designatedCurrencyVal:'MOP',
      designatedCurrencyType:[{
        value:'RMB',
        label:'RMB'
      },{
        value:'HKD',
        label:'HKD'
      },{
        value:'MOP',
        label:'MOP'
      }],
      countryAndDistrictOfBeneficiaryBank:'',
      swiftCode:'',
      bankAddress:'',
      idOrPassportNumber: '',
      beneficiaryHomeAddress:'',
      stateorprovinceorcityofbeneficiary:'',
      countryOrDistrictOfBeneficiary:'',
      routeCodeWithUsOrCanada:'',
      routeCodeWithUKOrAustralia:'',
      intermediaryBankName:'',
      intermediaryBankSwiftCode:'',
      intermediaryBankAddress:'',
      emailAddress:'',
      contactNumber:'',
      specialArrangement:''
    }
  })

  return {
    telegraphicTransferTableData
  }
}
