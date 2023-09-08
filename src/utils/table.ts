import { Payment } from "@/types/entity/goodOrService"
import { Ref } from "vue"

export function addAndMerge(table:any[],summaryTable:any[]){
  let isExist = false
  table.forEach((v,i)=>{
    const index  = summaryTable.findIndex(va=>va.payeeName === v.payeeName)
    if( index === -1){
      const newEl = {
        amount:String(v.amount),
        currencyType:v.currency,
        payeeName:v.payeeName
      }
      summaryTable.push(newEl)
    }else{
      // merge amount
      isExist = true
      summaryTable[index].amount =  Number(summaryTable[index].amount) + Number(v.amount)
    }
  })
  return isExist
}
