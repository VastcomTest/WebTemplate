import { ExpenseType } from './../../types/entity/goodOrService';
import { useState } from "@/hooks/useState"
import { Payment } from "@/types/entity/goodOrService"
import { ref } from "vue"
import { expenseType ,paymentCurrency , payeeType } from '@/constants/selection'
import { uniqueId } from 'lodash-es';
import { random } from 'xe-utils';
export function usePaymentState(){
  const initId = uniqueId()
  const { paymentTableRef , paymentTableData ,expandRef ,summaryDataForPayment }  = useState({
    paymentTableData:[{
        showPopover:false,
        markComment:'',
        mark:'to be processed',
        expand:false,
        id:initId,
        expenseTypeVal:'Good' as ExpenseType,
        expenseType,
        item:'Tools',
        servicePeriod:'',
        currency:'MOP',
        amount:1000.00,
        paymentCurrencyVal:'MOP',
        paymentCurrency,
        payeeTypeVal:'Company',
        payeeType,
        payeeName:'Company A',
        staffNumber:'SN-182',
        radio:'1',
        IDOrPassportNumber:'',
        issuanceIn:'China',
        email:'',
        contactNumber:''
    }] as Payment[],
    expandStatus:[false] as boolean[],
    paymentTableRef:null,
    expandRef:null,
    expandConfig: {
      toggleMethod ({ expanded, row }:{expanded:boolean , row:Payment}) {
        // if (expanded) {
        //   if (row.sex === '1') {
        //     VXETable.modal.message({ id: 'openErr', content: '不允许展开', status: 'error' })
        //     return false
        //   }
        // } else {
        //   if (row.sex === '0') {
        //     VXETable.modal.message({ id: 'closeErr', content: '不允许关闭', status: 'error' })
        //     return false
        //   }
        // }
        return true
      }
    },
    summaryDataForPayment:[{
      id:initId,
      currencyType:'MOP',
      amount:1000.00,
      payeeName:'Company A'
    }] as {
      id:string
      currencyType:string,
      amount:number,
      payeeName:string
    }[],
  })

  const paymentFormRule = ref({
    expenseTypeVal:[{ required:true,message:'required'}],
    item:[{ required:true,message:'required'}],
    servicePeriod:[
      { required:true,
        validator ({ row }) {
          if(row.expenseTypeVal === 'Service'){
            return new Error('required')
          }
        },
        trigger:'blur',
        message:'required'
    }],
    currency:[{ required:true,message:'required'}],
    amount:[{ required:true,message:'required'}],
    paymentCurrencyVal:[{ required:true,message:'required' }],
    payeeTypeVal:[{ required:true,message:'required'}],
    payeeName:[{ required:true,tmessage:'required' }],
    staffNumber:[{ required:true,message:'required'}],
  })

  const expandRule = ref({
    radio:[{ required:true,validator:expandInfoValidate ,trigger:'blur' ,message:'required'}],
    issuanceIn:[{ required:true,validator:expandInfoValidate,trigger:'blur' ,message:'required'}],
    email:[{ trigger:'blur' ,message:'required'}],
    contactNumber:[{ trigger:'blur',message:'required' }],
    IDOrPassportNumber:[{ required:true,validator:expandInfoValidate,trigger:'blur',message:'required' }]
  })

  function expandInfoValidate(rule: any,val: string,cb: (arg?:any) => void){
    if(val !== ''){
      cb()
    }else{
      cb(new Error('required'))
    }
  }

  function createInstance(){
      return {
        showPopover:false,
        id: uniqueId(),
        mark:'to be processed',
        markComment:'',
        expenseTypeVal: 'Good',
        expenseType: [{
          value: 'Good',
          label: 'Good'
        }, {
          value: 'Service',
          label: "Service"
        }],
        item: '',
        servicePeriod: '',
        currency: 'MOP',
        amount: random(1000,2000),
        paymentCurrencyVal: 'MOP',
        paymentCurrency: [{
        value: 'RMB',
        label: 'RMB'
        }, {
        value: 'HKD',
        label: 'HKD'
        }, {
        value: 'MOP',
        label: 'MOP'
        }],
        payeeTypeVal: 'Staff',
        payeeType: [{
          value: 'Staff',
          label: 'Staff'
          }, {
          value: 'Student',
          label: 'Student'
          }, {
          value: 'Individual',
          label: 'Individual'
          }, {
          value: 'Company',
          label: 'Company'
        }],
        payeeName: 'Company '+ random(1000,2000).toFixed(0),
        staffNumber: '',
        expand: false,
        radio: "1",
        IDOrPassportNumber: "",
        issuanceIn: "",
        email: "",
        contactNumber: ""
    } as Payment
  }

  return {
    paymentTableData,
    paymentTableRef,
    expandRef,
    expandRule,
    paymentFormRule,
    summaryDataForPayment,
    expandInfoValidate,
    createInstance
  }
}
