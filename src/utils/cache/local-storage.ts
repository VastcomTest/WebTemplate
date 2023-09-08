/** 统一处理 localStorage */

import CacheKey from "@/constants/cache-key"
import { type SidebarOpened, type SidebarClosed } from "@/constants/app-key"
import { type ThemeName } from "@/hooks/useTheme"
import { type TagView } from "@/store/modules/tags-view"
import { type LayoutSettings } from "@/config/layouts"
import { ApplicationStatus, ApplicationType } from "@/types/entity/application"
import { Attachment, AutoPay, BankDraft, BaseInfo, CashierOrder, InformationForPayment, Payment, PaymentMethodCached, Reimbursement, TelegraphicTransfer } from "@/types/entity/goodOrService"
import { InformationEvent } from "http"
import { json } from "stream/consumers"
import { Timeline } from "../Timeline"


//#region 系统布局配置
export const getConfigLayout = () => {
  const json = localStorage.getItem(CacheKey.CONFIG_LAYOUT)
  return json ? (JSON.parse(json) as LayoutSettings) : null
}
export const setConfigLayout = (settings: LayoutSettings) => {
  localStorage.setItem(CacheKey.CONFIG_LAYOUT, JSON.stringify(settings))
}
export const removeConfigLayout = () => {
  localStorage.removeItem(CacheKey.CONFIG_LAYOUT)
}
//#endregion

//#region 侧边栏状态
export const getSidebarStatus = () => {
  return localStorage.getItem(CacheKey.SIDEBAR_STATUS)
}
export const setSidebarStatus = (sidebarStatus: SidebarOpened | SidebarClosed) => {
  localStorage.setItem(CacheKey.SIDEBAR_STATUS, sidebarStatus)
}
//#endregion

//#region 正在应用的主题名称
export const getActiveThemeName = () => {
  return localStorage.getItem(CacheKey.ACTIVE_THEME_NAME) as ThemeName | null
}
export const setActiveThemeName = (themeName: ThemeName) => {
  localStorage.setItem(CacheKey.ACTIVE_THEME_NAME, themeName)
}
//#endregion

//#region 标签栏
export const getVisitedViews = () => {
  const json = localStorage.getItem(CacheKey.VISITED_VIEWS)
  return JSON.parse(json ?? "[]") as TagView[]
}
export const setVisitedViews = (views: TagView[]) => {
  views.forEach((view) => {
    // 删除不必要的属性，防止 JSON.stringify 处理到循环引用
    delete view.matched
    delete view.redirectedFrom
  })
  localStorage.setItem(CacheKey.VISITED_VIEWS, JSON.stringify(views))
}
export const getCachedViews = () => {
  const json = localStorage.getItem(CacheKey.CACHED_VIEWS)
  return JSON.parse(json ?? "[]") as string[]
}
export const setCachedViews = (views: string[]) => {
  localStorage.setItem(CacheKey.CACHED_VIEWS, JSON.stringify(views))
}
//#endregion

export interface GoodOrService{
  applicationId:string,
  basicForm:BaseInfo,
  reimbursementTableData:Reimbursement[],
  informationForPaymentTableData:InformationForPayment,
  fileTableData:Attachment,
  paymentTableData:Payment[],
  paymentMethodCached:PaymentMethodCached,
  status:ApplicationStatus,
  submitDate:string,
  rejectReason:string,
  returnReason:string

  // extendfields
  tobeUpdatedFields:any
  timeline:Timeline[]
}

export function setGoodOrServiceCached(data:GoodOrService){
  const arr = getGoodOrServiceCached()
  const applicationId = data.applicationId
  if(arr){
    const applications  = arr
    const index = applications.findIndex(v=>{
      return v.applicationId === applicationId
    })
    // new
    if(index === -1){
      localStorage.setItem(CacheKey.GOOD_OR_SERVICE,JSON.stringify(
        [ data,...applications]
      ))
    }else{
      applications[index] = data
      localStorage.setItem(CacheKey.GOOD_OR_SERVICE,JSON.stringify(applications))
    }
  }else{
    localStorage.setItem(CacheKey.GOOD_OR_SERVICE,JSON.stringify([data]))
  }
}

export function setGoodOrServiceCachedByArr(data:GoodOrService[]){
  localStorage.setItem(CacheKey.GOOD_OR_SERVICE,JSON.stringify(data))
}


export function getGoodOrServiceCached():GoodOrService[] | undefined{
  const jsonStr = localStorage.getItem(CacheKey.GOOD_OR_SERVICE)
  if(jsonStr) return JSON.parse(jsonStr)
}

export type Role = 'FO' | 'approver' | 'user'
// role
export function getRole():Role{
  return localStorage.getItem('role')! as Role
}
