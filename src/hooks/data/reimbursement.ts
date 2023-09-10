import { useState } from "@/hooks/useState"
import { TableColumnCtx } from "element-plus"
import { random, uniqueId } from "lodash-es"
import { ref } from "vue"

export function useReimbursement(){

  const { reimbursementTableData , reimbursementTableRef, reimbursementCurrentIndex ,summaryDataForReim } = useState({
    reimbursementTableData:[{
      id:'',
      expenseTypeVal:'Good',
      expenseType:[{
        value:'Good',
        label:'Good'
      },{
        value:'Service',
        label:"Service"
      }],
      item:'PC',
      servicePeriod:'',
      currency:'MOP',
      amount:1000.00,
      exchangeRateTypeVal:'UM default',
      exchangeRateType:[{
        value:'UM default',
        label:'UM default'
      },{
        value:'User define',
        label:'User define'
      }],
      rateDate:'2023/7/1',
      rate:1.1,
      amountInMop:1100.00,
      payeeTypeVal:'Company',
      payeeType:[{
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
      }],
      payeeName:'Company A',
      staffNumber:'SN-182',
    }],
    reimbursementTableRef:null,
    reimbursementCurrentIndex:0,
    summaryDataForReim:[] as {
      currencyType:string,
      amount:string,
      payeeName:string
    }[],
  })

  const reimbursementFormRule = ref({
    expenseTypeVal: [{ required: true, trigger: 'blur' }],
    item: [{ required: true,  trigger: 'blur' }],
    servicePeriod: [{ required: true, trigger: 'blur' }],
    currency: [{ required: true,  trigger: 'blur' }],
    amount: [{ required: true,  trigger: 'blur' }],
    payeeTypeVal: [{ required: true, trigger: 'blur' }],
    payeeName: [{ required: true, trigger: 'blur' }],
    staffNumber: [{ required: true,  trigger: 'blur' }],
    exchangeRateTypeVal: [{ required: true, trigger: 'blur' }],
  })

  function getSummaries(parmas:{
    columns: TableColumnCtx<any>[]
    data: any[]
  }){
    const { columns , data } = parmas
    let res = new Array(12) as string[];
    let sum = 0
    data.forEach(v=>{
      sum += Number(v.amountInMop)
    })
    res.fill(' ')
    res[9] = 'MOP'
    res[10] = String(sum)
    res[11] = 'Company A'
    return [res]
  }

  function createInstanceReim(){
    return {
      id:uniqueId(),
      expenseTypeVal:'Good',
      expenseType:[{
        value:'Good',
        label:'Good'
      },{
        value:'Service',
        label:"Service"
      }],
      item:'Tools',
      servicePeriod:'',
      currency:'MOP',
      amount:1000.00,
      exchangeRateTypeVal:'UM default',
      exchangeRateType:[{
        value:'UM default',
        label:'UM default'
      },{
        value:'User define',
        label:'User define'
      }],
      rateDate:'2023/7/1',
      rate:1.1,
      amountInMop:random(1000,2000),
      payeeTypeVal:'Company',
      payeeType:[{
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
      }],
      payeeName:'Company '+random(1000,2000).toFixed(0),
      staffNumber:'SN-182',
    }
  }

  function setReimbursementRef(Ref:any){
    reimbursementTableRef.value = Ref
  }

  return {
    reimbursementCurrentIndex,
    reimbursementTableData,
    reimbursementTableRef,
    reimbursementFormRule,
    summaryDataForReim,
    getSummaries,
    createInstanceReim,
    setReimbursementRef
  }
}
