import { getCurrentDate, getCurrentDateTime } from "./Date"
import { ApplicationStatus } from "@/types/entity/application"

export interface Timeline<T = object>{
  dateTime:string,
  date:string,
  title:'Submitted' | 'Amended' | 'Approved' | 'Rejected' | 'To be amended',
  content:string
  status:ApplicationStatus,
  extendFields?:T,
  approver?:string
}

function submitApp(){
  const dateTime = getCurrentDateTime()
  return {
    title:'Submitted',
    content:'User had submitted Application ' + dateTime ,
    date:getCurrentDate(),
    dateTime:dateTime,
    status:'Submitted'
  } as Timeline
}

function amendApp(){
  const dateTime = getCurrentDateTime()
  return {
    title:'Amended',
    content:'User had amended Application ' + dateTime,
    dateTime:dateTime,
    date:getCurrentDate(),
    status:'amended',
  } as Timeline
}

function approveApp(approver:string){
  const dateTime = getCurrentDateTime()
  return {
    title:'Approved',
    content:'Application had been approved ' + dateTime,
    dateTime:dateTime,
    date:getCurrentDate(),
    status:'Approved',
    approver
  } as Timeline
}

function rejectApp(approver:string){
  const dateTime = getCurrentDateTime()
  return {
    title:'Rejected',
    content:'Application had been rejected ' + dateTime,
    dateTime:dateTime,
    date:getCurrentDate(),
    status:'rejected',
    approver
  } as Timeline
}

function returnApp(approver:string){
  const dateTime = getCurrentDateTime()
  return {
    title:'To be amended',
    content:'Application had been returned ' + dateTime,
    dateTime:dateTime,
    date:getCurrentDate(),
    status:'to be amended',
    approver
  } as Timeline
}

export {
  submitApp,
  amendApp,
  approveApp,
  rejectApp,
  returnApp
}





