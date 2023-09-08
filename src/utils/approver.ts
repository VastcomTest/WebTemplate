import { ElMessage } from "element-plus"
import { GoodOrService, setGoodOrServiceCached } from "./cache/local-storage"
import * as TimelineFn from '@/utils/Timeline'
import { Ref } from "vue"
import { Payment } from "@/types/entity/goodOrService"

async function handleApprove(goodOrService:GoodOrService,role :'fo'|'approver'){
  goodOrService.paymentTableData.forEach(v=>{
    if(v.mark !=='updated'){
      v.mark = 'approved'
    }
  })
  goodOrService.status =  role ==='fo'? 'Payment Process' : 'Approved'
  goodOrService.timeline.push( role ==='fo' ? TimelineFn.approveApp('FO') : TimelineFn.approveApp('Approver') )
  goodOrService.paymentTableData.forEach(v=>{
    v.mark = 'approved'
  })
  setGoodOrServiceCached(goodOrService)
  ElMessage({
    message:"Approved successfully",
    type:'success'
  })
}

async function handleReject(goodOrService:GoodOrService,reason:Ref<string> ,role :'fo'|'approver'){
  goodOrService.rejectReason = reason.value
  goodOrService.status = 'rejected'
  goodOrService.timeline.push( role ==='fo' ? TimelineFn.rejectApp('FO') : TimelineFn.rejectApp('Approver') )
  setGoodOrServiceCached(goodOrService)
  ElMessage({
    message:"reject successfully",
    type:'success'
  })
  reason.value = ''
}

async function handleReturn(goodOrService:GoodOrService,reason:Ref<string>){
  goodOrService.status = 'to be amended'
  goodOrService.returnReason = reason.value
  // goodOrService.tobeUpdatedFields = markAsUpdatedArr.value
  goodOrService.timeline.push( TimelineFn.returnApp('FO') )
  setGoodOrServiceCached(goodOrService)
  reason.value = ''
  ElMessage({
    message:"Return successfully",
    type:'success'
  })
}

async function handleMark(rowIndex:number , approve = true,reason:string ,paymentTableData:Payment[], goodOrService:GoodOrService ){
  paymentTableData[rowIndex].mark = approve ? 'approved' : 'rejected'
  paymentTableData[rowIndex].markComment = approve? '' : reason
  setGoodOrServiceCached(goodOrService)
}

function canSubmit(  name:'approve' |'reject' | 'return' , paymentTableData:Payment[]  ){
  let disable = false
  paymentTableData.forEach(v=>{
    if(v.mark === 'to be processed'){
      disable = true
    }
  })
  if(disable) return disable

  if(name === 'approve'){
    paymentTableData.forEach(v=>{
      if(v.mark != 'approved'){
        disable = true
      }
    })
  }
  // at least one item is reject
  if(name === 'reject' || name ==='return'){
    for (let i = 0; i < paymentTableData.length; i++) {
      const el = paymentTableData[i];
      if(el.mark === 'rejected'){
        disable = false
        break;
      }else{
        disable = true
      }
    }
  }
  return disable
}

function canUseMark(goodOrService:GoodOrService,role:'fo' | 'approver'){
  if(role === 'approver'){
    return goodOrService.status != 'Submitted'
  }
  return !(goodOrService.status === 'Approved' || goodOrService.status === 'amended' )
}

export {
  handleApprove,
  handleReject,
  handleReturn,
  handleMark,
  canSubmit,
  canUseMark
}
