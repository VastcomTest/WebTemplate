import { ApplicationType, ApplicationTypeInForm } from "@/types/entity/application";
import { ExpenseType, FacultyOrDepartment, FundingSource, PayeeType, PaymentCurrencyType } from "@/types/entity/goodOrService";


export type Selection<T> = Array<{
  value:T,
  label:T
}>

export type SelectionDiff<L,V> = Array<{
  value:V,
  label:L
}>

// for user
const applicationStatusSelectionForUser = [
  {
    value: "All applications",
    label: "All applications"
  },
  {
    value: "Waiting for submission",
    label: "Waiting for submission"
  },
  {
    value: "Submitted applications",
    label: "Submitted applications"
  },
  {
    value: "Rejected applications",
    label: "Rejected applications"
  },
  {
    value: "Applications to be amended",
    label: "Applications to be amended"
  },
  {
    value: "Approved",
    label: "Approved"
  },
  {
    value: 'Payment Process',
    label: 'Payment Process'
  }
] as Selection<ApplicationTypeInForm>

// for approver
const applicationStatusSelectionForApprover = [
  {
    value: "All applications",
    label: "All applications"
  },
  {
    value: "Submitted applications",
    label: "Submitted applications"
  },
  {
    value: "Rejected applications",
    label: "Rejected applications"
  },
  {
    value: "Approved",
    label: "Approved"
  },
  {
    value: 'Payment Process',
    label: 'Payment Process'
  }
] as Selection<Omit<ApplicationTypeInForm,'Waiting for submission' | 'Payment Process' | 'Applications to be amended'>>



// for FO
const applicationStatusSelectionForFO = [
  {
    value: "All applications",
    label: "All applications"
  },
  {
    value: "Submitted applications",
    label: "Submitted applications"
  },
  {
    value: "Applications rejected by FO",
    label: "Applications rejected by FO"
  },
  {
    value: "Applications to be amended",
    label: "Applications to be amended"
  },
  {
    value: "Approved",
    label: "Approved"
  },
  {
    value: 'Payment Process',
    label: 'Payment Process'
  }
] as Selection<Omit<ApplicationTypeInForm,'Waiting for submission' >>



const applicationType = [{
  label:'Good/Service',
  value:'Good/Service',
},{
  label:'Trip',
  value:'Trip'
},{
  label:'Stipend',
  value:'Stipend'
}] as Selection<ApplicationType>

const fundingSource = [
  {
    value:'Non-research',
    label:'Non-research'
  },
  {
    value:'Research-External',
    label:'Research-External'
  },
  {
    value:'Research-Internal',
    label:'Research-Internal'
  }
] as Selection<FundingSource>

const facultyOrDepartment = [
  {
    label:'FAH',
    value:'FAH'
  },
  {
    label:'EF',
    value:'EF'
  },
  {
    label:"IF",
    value:"IF"
  }
] as Selection<FacultyOrDepartment>

const expenseType = [{
  label:'Good',
  value:'Good'
},{
  label:'Service',
  value:'Service'
}] as Selection<ExpenseType>

const paymentCurrency = [{
  label:'MOP',
  value:'MOP'
},{
  label:'HKD',
  value:'HKD'
},{
  label:'RMB',
  value:'RMB'
}] as Selection<PaymentCurrencyType>

const payeeType =  [{
  value:'Staff',
  label:'Staff'
},{
  value:'Student',
  label:'Student'
},{
  value:'Individual',
  label:'Individual'
},{
  value:'Company',
  label:'Company'
}] as Selection<PayeeType>

export {
  applicationStatusSelectionForUser,
  applicationStatusSelectionForApprover,
  applicationStatusSelectionForFO,
  applicationType,
  fundingSource,
  facultyOrDepartment,
  expenseType,
  paymentCurrency,
  payeeType
}
