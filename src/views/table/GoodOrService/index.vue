<script lang="tsx" setup>
import { computed, reactive, ref, watch, watchEffect,  nextTick, onUpdated, onUnmounted } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, TableColumnCtx } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Paperclip } from "@element-plus/icons-vue"
import { useState } from "@/hooks/useState"
import { Good, Payment as PaymentEntity, Service } from "@/types/entity/goodOrService";
import { table } from "console";
import { cloneDeep, cloneDeepWith, head, uniqueId } from "lodash-es";
import TelegraphicTransfer from "./TelegraphicTransfer.vue";
import CashierOrder from "./CashierOrder.vue";
import BankDraft from "./BankDraft.vue";
import AutoPay from "./AutoPay.vue";
import { useFormRules } from "@/hooks/useFormRules";
import { random } from "xe-utils";
import { storeToRefs } from "pinia";
import { usePaymentMethodStore } from "@/store/modules/PaymentMethod";
import { onMounted } from "vue";
import { LocationQueryValue, useRoute, useRouter } from "vue-router";
import { getCurrentDate , getCurrentDateTime } from "@/utils/Date";
import { VxeTablePropTypes ,VXETable } from "vxe-table";
import { Row } from "element-plus/es/components/table-v2/src/components";
import { ru } from "element-plus/es/locale";
import { useAppStore } from "@/store/modules/app";
import { useHeaderState } from "@/hooks/data/header";
import { usePaymentState } from '@/hooks/data/payment'
import { useReimbursement } from '@/hooks/data/reimbursement'
import { useFileState } from '@/hooks/data/file'
import { useInfoForPayment } from "@/hooks/data/infoForPayment";
import { getGoodOrServiceCached, GoodOrService, setGoodOrServiceCached , setGoodOrServiceCachedByArr } from "@/utils/cache/local-storage";
import SideNavigationBar from '@/components/SideNavigationBar/index.vue'
import { useSideNavigationBar } from '@/hooks/useSideNavigationBar'
import CacheKey from "@/constants/cache-key";
import * as TimelineFn from "@/utils/Timeline";
import { addAndMerge } from "@/utils/table";
import { refAutoReset } from "@vueuse/core";
import ApplicationReview from '@/views/applicationReview/user/index.vue'
import BasicInfo from '@/components/BasicInfo/index.vue'
import Payment from '@/components/Payment/index.vue'
import Reimbursement from '@/components/Reimbursement/index.vue'
import InfoForPayment from '@/components/InfoForPayment/index.vue'
import Attachment from '@/components/Attachment/index.vue'
defineOptions({
  // 命名当前组件
  name: "GoodOrService"
})

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const { paymentMethodCached , submitFn } = storeToRefs(usePaymentMethodStore())
const { sidebar  }  =  storeToRefs(appStore)
const isOpenSideBar = computed(()=> sidebar.value.opened)
const docName = '<Personal Data Collections Statement of University of/Finance Office of University of Macau>'

const updateLock = ref(false)
const cacheForPayment = new Map()
const openReviewWindow = ref(false)
// sideNavigation
const {
  paymentRefs,container,paymentContainer,reimbursementContainer,
  currentTop,informationForPaymentContainer,dataList,
  getTopOfAllForm,observeOnScroll,onClick, reMeasure
} = useSideNavigationBar()

// header
const {
  applicationId , isOpen , isReadDoc,
  basicForm, basicFormRef , basicFormRule,brNoRestrict
} = useHeaderState()

// payment
const {
  paymentTableData , paymentTableRef , paymentFormRule,
  expandRef , expandRule , summaryDataForPayment,
  createInstance,setPaymentRef
}  = usePaymentState()

// reimbursement
const {
  reimbursementFormRule , reimbursementTableData ,reimbursementTableRef ,
  summaryDataForReim,getSummaries , createInstanceReim,setReimbursementRef
}  = useReimbursement()

const randomId = random(1000,9999)

// information for payment

const { informationForPaymentTableData ,createPaymentMethod } = useInfoForPayment()

// file
const { fileFormRef, fileFormRule, fileTableData , fileValidate } = useFileState()

// curd function
async function insertRow(tableName:'payment' | 'reimbursement',copyRow?:any) {

  tableName === 'payment' ? paymentTableData.value = [ ...paymentTableData.value,createInstance() ]  :reimbursementTableData.value.push(createInstanceReim())
  // for nav
  if(tableName === 'payment'){
    const payeeName = paymentTableData.value[paymentTableData.value.length-1].payeeName
    const uniqueId = paymentTableData.value[paymentTableData.value.length-1].id
    const temp = createPaymentMethod()
    temp.id = uniqueId
    temp.payee = payeeName
    informationForPaymentTableData.value.push( temp )
    await nextTick()
    const offset = paymentRefs.value[paymentRefs.value.length-1].offsetTop - 120
    summaryDataForPayment.value.push({
      id:uniqueId,
      payeeName:payeeName,
      amount: paymentTableData.value[paymentTableData.value.length-1].amount,
      currencyType: paymentTableData.value[paymentTableData.value.length-1].paymentCurrencyVal
    })
    dataList.value.push({
        title: payeeName,
        clickAction: () => container.value?.parentElement?.scrollTo({ 'behavior': 'smooth', top: offset }),
        top: offset,
        paddingLeft: 20,
        complete: false
    })
  }
  await nextTick()
  reMeasure(informationForPaymentTableData.value)
  ElMessage('insert Row successfully')
}

async function copyRow(tableName:'payment' | 'reimbursement'){

  // @ts-ignore
  const rows : Payment[] = tableName === 'payment' ? paymentTableRef.value?.getCheckboxRecords() : reimbursementTableRef.value?.getSelectionRows()
  if(rows.length ===0 ){
    ElMessage('please select one item at least ')
    return
  }
  const row = cloneDeep(rows[0])
  const payeeName = row.payeeName
  const uniqueId = row.id
  const temp = createPaymentMethod()
  for (const key in row) {
    if(key.includes('VXE')){
      //@ts-ignore
      delete row[key]
    }
  }
  temp.id = uniqueId
  temp.payee = payeeName
  informationForPaymentTableData.value.push( temp )
  paymentTableData.value.push( row )
  await nextTick()
  const offset = paymentRefs.value[paymentRefs.value.length-1].offsetTop - 120
  summaryDataForPayment.value.push({
    id:uniqueId,
    payeeName:payeeName,
    amount: row.amount,
    currencyType: row.paymentCurrencyVal
  })
  dataList.value.push({
title: payeeName,
clickAction: () => container.value?.parentElement?.scrollTo({ 'behavior': 'smooth', top: offset }),
top: offset,
paddingLeft: 20,
complete: false
})
  onPayeeNameChange(paymentTableData.value.length-1)
  reMeasure(informationForPaymentTableData.value)
  ElMessage('Copy Row successfully')
}

async function deleteRow(tableName:'payment' | 'reimbursement'){
  //@ts-ignore
  if(tableName === 'payment'){
    //@ts-ignore
    const rows :Payment[] = await paymentTableRef.value.getCheckboxRecords(true)
    const payeeNameArr =  rows.map(v=>v.payeeName)

    paymentTableData.value = paymentTableData.value.filter(v=>{
      return payeeNameArr.findIndex(val=>String(val) === v.payeeName) === -1
    })
    summaryDataForPayment.value =  summaryDataForPayment.value.filter((v: { payeeName: string; })=>{
      return payeeNameArr.findIndex(val=>String(val) === v.payeeName) === -1
    })
    informationForPaymentTableData.value =  informationForPaymentTableData.value.filter(v=>{
      return payeeNameArr.findIndex(val=>String(val) === v.payee) === -1
    })
    dataList.value = dataList.value.filter((v,index)=>{
      return payeeNameArr.findIndex(val=>String(val) === v.title) === -1
    })
  }else{
    //@ts-ignore
    reimbursementTableRef.value.removeCheckboxRow()
  }
  reMeasure(informationForPaymentTableData.value)
  ElMessage('delete Row successfully')
}

function importData(){
  // to be completed
}

function saveAllInfo(type:'save' | 'submit' | 'temp' ){
  const data = {
    applicationId: `2023-${basicForm.value.facultyOrDepartmentVal}-${randomId}`,
    basicForm: basicForm.value,
    reimbursementTableData: reimbursementTableData.value,
    informationForPaymentTableData: informationForPaymentTableData.value,
    fileTableData: fileTableData.value,
    paymentTableData: paymentTableData.value,
    paymentMethodCached: paymentMethodCached.value,
    status: type === 'temp'?  'temp' : type === 'submit' ? 'Submitted' : 'draft',
    submitDate: type === 'submit' ? getCurrentDateTime() : '',
    rejectReason: '',
    returnReason: '',
    tobeUpdatedFields: {},
  } as unknown as GoodOrService

  if(type ==='submit'){
    data.timeline = [ TimelineFn.submitApp() ]
  }
  // @ts-ignore
  setGoodOrServiceCached(data)
  applicationId.value  = data.applicationId
  if(type === 'temp') return
  ElMessage( type==='save' ? ' Saved ! ':' Submitted  !')
}

function submitWithoutRules(){
  saveAllInfo('submit')
  navigateToResultPage()
  // isOpen.value = true
}

function navigateToResultPage(){
  router.replace('/result')

}

function onExchangeVal(row: { exchangeRateTypeVal: string; rate: number; }){
  if(row.exchangeRateTypeVal === 'UM default'){
    row.rate = 1.1
  }
}

async function submit(){
  let canSubmit = false
  // basic
  //@ts-ignore
  basicFormRef.value.validate((valid) => {
    if (valid) {
      canSubmit = true
    } else {
      return false
    }
  })
  // payment
  // @ts-ignore
  const errMap = await paymentTableRef.value.validate(true)
  canSubmit = errMap === undefined
  // paymentMethod
  for (const index in submitFn.value) {
    for (const key in submitFn.value[index]) {
      // @ts-ignore
      submitFn.value[index][key] &&  submitFn.value[index][key]()
    }
  }
  // @ts-ignore
  expandRef.value?.validate((valid) => {
    if (valid) {
      canSubmit = true
      console.log('Expeand Info submit!')
    } else {
      console.log('Expand  Info error submit!')
      return false
    }
  })

  // file
  //@ts-ignore
  fileFormRef.value.validate((valid) => {
    if (valid) {
      canSubmit = true
      console.log('file submit!')
    } else {
      console.log('file error submit!')
      return false
    }
  })

  !canSubmit && ElMessage({message :'Please fill all required forms' ,type:'warning'})
  isOpen.value = canSubmit
  saveAllInfo('submit')
  navigateToResultPage()
}

function toggleRowExpand(row: { payeeTypeVal: string; }){
  // @ts-ignore
  paymentTableRef.value.setRowExpand(row, row.payeeTypeVal === 'Individual')
}


function onPayeeNameChange(rowIndex:number){
  // cache what user updated just now
  cacheForPayment.set(paymentTableData.value[rowIndex].id , informationForPaymentTableData.value[rowIndex])
  // merge summaryData - payment
  summaryDataForPayment.value = []
  const isExist = addAndMerge(paymentTableData.value,summaryDataForPayment.value)
  // update navigation List
  dataList.value = dataList.value.slice(0,4)
  dataList.value.push(...summaryDataForPayment.value.map(v=>{
    return {
      paddingLeft:20,
      top:0,
      title:v.payeeName,
      clickAction:()=>{},
      complete:false
    }
  }))

  // update information - payment
  // but no cache
  informationForPaymentTableData.value = summaryDataForPayment.value.map(v=>{
    const el = createPaymentMethod()
    el.payee = v.payeeName
    return el
  })

  reMeasure(informationForPaymentTableData.value)
}

function clearupCache(done:()=>void){
  let cachedData = getGoodOrServiceCached()!
  cachedData =  cachedData.filter(v=>{
    //@ts-ignore
    return v.status !== 'temp'
  })
  setGoodOrServiceCachedByArr(cachedData)
  done()
}

onMounted(async()=>{
  const appId = route.query.applicationId
  const cachedData = localStorage.getItem(CacheKey.GOOD_OR_SERVICE)
  let dataJson
  if(cachedData && appId){
    dataJson = JSON.parse(cachedData)
    dataJson.forEach((el:any) => {
      if(appId === el.applicationId){
        applicationId.value = el.applicationId
        basicForm.value = el.basicForm
        fileTableData.value = el.fileTableData
        informationForPaymentTableData.value = el.informationForPaymentTableData
        paymentTableData.value = el.paymentTableData
        reimbursementTableData.value = el.reimbursementTableData
        paymentMethodCached.value =  el.paymentMethodCached
      }
    });

  }
  await getTopOfAllForm(paymentTableData.value)
  observeOnScroll()
  basicForm.value.date = getCurrentDate()
})




// follow status change
watch(basicForm,(t)=>{
  // for (const key in basicForm.value) {
  //   const el = basicForm.value[key]
  //   if(el === ''){
  //     pass =  false;
  //     break
  //   }
  // }
  // basicFormRef.value.validate(v=>{
  //   dataList.value[0].complete = v
  // })
  let pass = true
  const form = basicForm.value
  for (const key in form) {
    const el = form[key];
    if( el === ''){
        pass =  false;
        break
      }
  }
  dataList.value[0].complete = pass
},{deep:true})

watch(paymentTableData,async (v)=>{
  let pass = true
  paymentTableData.value.forEach(v => {
    const mapKey = ['expenseType','item','servicePeriod','currency','amount',
    'paymentCurrency','payeeName','staffNumber']
    for (const key of mapKey) {
      const el = v[key]
      if(key === 'servicePeriod' && v.expenseTypeVal === 'Good') continue
      if( el === ''){
        pass =  false;
        break
      }
    }
  });
  //@ts-ignore
  // const errMap = await paymentTableRef.value?.validate()
  // console.log(errMap);
  dataList.value[1].complete = pass
},{deep:true})

watch(reimbursementTableData,(v)=>{
  let pass = true
  reimbursementTableData.value.forEach(v => {
    const mapKey = ['expenseType','item','servicePeriod','currency',
    'amount','exchangeRate','rateDate','rate','amountInMop','payeeName','staffNumber']
    for (const key of mapKey) {
      const el = v[key]
      if(key === 'servicePeriod' && v.expenseTypeVal === 'Good') continue
      if( el === ''){
        pass =  false;
        break
      }
    }
  });
  dataList.value[2].complete = pass
},{deep:true})

watch(reimbursementTableData,(val,oldVal)=>{
  val.forEach(v=>{
    v.amountInMop = Number( (v.amount * v.rate).toFixed(3) )
  })
  summaryDataForReim.value = []
  addAndMerge(val,summaryDataForReim.value)
},{
  deep:true,
  immediate:true,
})

watch(informationForPaymentTableData.value,(v,oldV)=>{
  //@ts-ignore
  reMeasure(informationForPaymentTableData.value)
},{
  deep:true
})

</script>

<template>
  <div ref="container" class="app-container" style="position: relative;padding-top: 100px;">
    <div class="header" :style="{ width : isOpenSideBar  ? 'calc( 100% - 220px )': 'calc( 100% - 58px)' }"
    style=";z-index: 1000;position: fixed;top: 80px;transform: translateX(-20px)">
      <div class="box-card" style="height: 60px;padding: 20px 20px;padding-bottom: 0px;background-color:#FFF;box-shadow: 0 5px 5px #CDCDCD;">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <div style="display: flex;align-items: center;gap: 5px;">
            <el-icon><Edit /></el-icon>
            <div>Editing</div>
          </div>
          <div style="display: flex;">
            <el-button type="primary"   @click="isOpen = true" >Submit</el-button>
            <el-button type="primary"   @click="saveAllInfo('save')" >Save</el-button>
          </div>
        </div>
      </div>
    </div>
    <BasicInfo
      :fileTableData="fileTableData"
      :basicForm="basicForm"
      :basicFormRule="basicFormRule"
      :brNoRestrict="brNoRestrict"
    />

    <div ref="paymentContainer" class="payment">
      <Payment
        :fileTableData="fileTableData"
        :insertRow="insertRow"
        :copyRow="copyRow"
        :importData="importData"
        :deleteRow="deleteRow"
        :paymentTableData="paymentTableData"
        :expandRule="expandRule"
        :summaryDataForPayment="summaryDataForPayment"
        :paymentFormRule="paymentFormRule"
        :toggleRowExpand="toggleRowExpand"
        :onPayeeNameChange="onPayeeNameChange"
        :setPaymentRef="setPaymentRef"
      />
    </div>

    <div ref="reimbursementContainer" class="reimbursement" >
      <Reimbursement
        :fileTableData="fileTableData"
        :insertRow="insertRow"
        :copyRow="copyRow"
        :importData="importData"
        :deleteRow="deleteRow"
        :reimbursementTableData="reimbursementTableData"
        :expandRule="expandRule"
        :summaryDataForReim="summaryDataForReim"
        :reimbursementFormRule="reimbursementFormRule"
        :toggleRowExpand="toggleRowExpand"
        :onPayeeNameChange="onPayeeNameChange"
        :setReimbursementRef="setReimbursementRef"
        :onExchangeVal="onExchangeVal"
      />
    </div>
    <div ref="informationForPaymentContainer" class="informationForPayment">
      <InfoForPayment :informationForPaymentTableData="informationForPaymentTableData" />
    </div>
    <div ref="paymentRefs" v-for="(item,index) in informationForPaymentTableData" :key="item.id"  >
      <el-card v-if="item && item.bankInformationVal !== 'Information provided in the past'"  shadow="never" class="Payment Method" style="margin-bottom: 20px;">
          <div style="width: 70%;flex-direction: column;">
            <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
              <h4 style="font-size: 20px;" >Payment Method: {{ informationForPaymentTableData[index].paymentMethodVal +' - '+informationForPaymentTableData[index].payee }}</h4>
            </div>
          </div>
          <TelegraphicTransfer
              :bank-account-number="'412348923XABA'"
              :beneficiary-name="'Daniel'"
              :id-or-passport-number="'1345124(2)'"
              :email-address="'xxx@homtmail.com'"
              :contact-number="'+853 62198402'"
              :index="index"
              v-if="informationForPaymentTableData[index].paymentMethodVal === 'Telegraphic transfer (Non-local payee)'"
          />
          <BankDraft
              :beneficiary-name="'Daniel'"
              :id-or-passport-number="'1345124(2)'"
              :email-address="'xxx@homtmail.com'"
              :contact-number="'+853 62198402'"
              :index="index"
              v-if="informationForPaymentTableData[index].paymentMethodVal === 'Bank Draft (Non-local payee)'"
          />
          <AutoPay
              :beneficiary-name="'Daniel'"
              :tax-i-d-or-i-d-number="'USD'"
              :email-address="'xxx@homtmail.com'"
              :contact-number="'+853 62198402'"
              :index="index"
              v-if="informationForPaymentTableData[index].paymentMethodVal === 'Auto-pay (Local payee)'"
          />
          <CashierOrder
              :beneficiary-name="'Daniel'"
              :email-address="'xxx@homtmail.com'"
              :contact-number="'+853 62198402'"
              :index="index"
              v-if="informationForPaymentTableData[index].paymentMethodVal === 'Cheque/Cashier Order (Local payee)'"
          />
      </el-card>
    </div>
    <div class="attachment">
      <Attachment :fileFormRule="fileFormRule" :fileTableData="fileTableData" />
    </div>
    <!-- navigation -->
    <SideNavigationBar  @click="onClick" :dataList="dataList" :currentTop="currentTop"/>
    <!-- policy -->
    <el-dialog
      v-model="isOpen"
      title="Important"
      width="60%"
    >
      <div style="margin-bottom: 20px;display: flex;flex-direction: column;row-gap: 5px;">
        <span style="margin-bottom: 10px;">
          I declare that i take full responsible of this payment/reimbursement
          application for and not limited to the following:
        </span>
        <div style="padding-left: 10px;">
          All expenditures are necessary for performing my work;
        </div>
        <div style="padding-left: 10px;">
          All expenditure supporting documents and related amounts are true and correct;
        </div>
        <div style="padding-left: 10px;">
          All relevant laws, regulations , rules and guidelines are complied with.
        </div>
        <div style="padding-top: 10px;">
          i have acknowledged and understood the
          <a target="_blank" style="color:aquamarine"  href="#" >{{ docName }} </a>
        </div>
        <div>
          i confirm the exchange rate applied in the application is correct and appropriate
        </div>
        <div style="display: flex;justify-content: center;padding-top: 10px;">
          <el-button type='danger' @click="isReadDoc = true " >Acknowledged</el-button>
        </div>
      </div>

      <div v-if="isReadDoc" style="max-width: 150px; display: flex;gap: 10px;flex-direction: column;">
        <el-button @click="openReviewWindow = true;saveAllInfo('temp')" type='success'>Preview Application</el-button>
        <el-button style="margin-left: 0px;" @click="submitWithoutRules" type="primary" >Confirm and Submit</el-button>
      </div>
    </el-dialog>
    <!-- preview -->
    <el-dialog
      v-model="openReviewWindow"
      title="Preview form"
      :beforeClose="clearupCache"
      width="60%"
    >
      <ApplicationReview :appId="applicationId" />
      <div v-if="isReadDoc" style="max-width: 150px; display: flex;gap: 10px;flex-direction: column;">
        <el-button @click="openReviewWindow = false " type='primary'>OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>

.box-card{

}
.header{
  transition: all 0.5s;
}
.app-container{
  padding-bottom: 100px;
}
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.el-card{
  :deep(.el-upload-list__item-file-name){
    text-overflow: unset;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
