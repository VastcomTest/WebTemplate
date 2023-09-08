<script lang="tsx" setup>
import { computed, reactive, ref, watch, watchEffect,  nextTick, onUpdated, onUnmounted } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, TableColumnCtx } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Paperclip } from "@element-plus/icons-vue"
import { useState } from "@/hooks/useState"
import { Good, Payment, Service } from "@/types/entity/goodOrService";
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
  createInstance
}  = usePaymentState()

// reimbursement
const {
  reimbursementFormRule , reimbursementTableData ,reimbursementTableRef ,
  summaryDataForReim,getSummaries , createInstanceReim
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
      title:payeeName,
      clickAction:()=> container.value?.parentElement?.scrollTo({'behavior':'smooth',top:offset}),
      top:offset,
      paddingLeft:20,
    })
  }
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
    title:payeeName,
    clickAction:()=> container.value?.parentElement?.scrollTo({'behavior':'smooth',top:offset}),
    top:offset,
    paddingLeft:20,
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

function beforeUpload(){
  console.log('upload!');
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
      clickAction:()=>{}
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
    <div :style="{ width : isOpenSideBar  ? 'calc( 100% - 220px )': 'calc( 100% - 58px)' }" class="header"
    style=";z-index: 1000;position: fixed;top: 80px;transform: translateX(-20px)">
    <div class="box-card" style="height: 60px;padding: 20px 20px;padding-bottom: 0px;background-color:#FFF;box-shadow: 0 5px 5px #CDCDCD;">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <div style="display: flex;align-items: center;gap: 5px;">
            <el-icon><Edit /></el-icon>
            <div>Editing</div>
          </div>
          <div style="display: flex;">
            <el-button type="primary"     @click="isOpen = true" >Submit</el-button>
            <el-button type="primary"     @click="saveAllInfo('save')" >Save</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-card  shadow="never" class="application-base-info" style="margin-bottom: 20px;">
      <div style="width: 70%;flex-direction: column;">
        <div style="display: flex;justify-content: space-between;">
            <h4 style="font-size: 20px;" >Basic Info</h4>
            <div class="item" style="display: flex;align-items: center;">
                <div style="margin-right: 20px;">Passport / ID Copy</div>
                <el-upload
                    v-model:file-list="fileTableData.passportOrIDCopy"
                    class="upload-demo"
                    style="display:flex;align-items:center"
                    multiple
                    :auto-upload="false"
                    :before-upload="beforeUpload"
                  >
                  <el-icon ><Paperclip /></el-icon>
                </el-upload>
            </div>
          </div>
        <el-form
          ref="basicFormRef"
          :rules="basicFormRule"
          :model="basicForm"
          class="demo-basicForm"
          label-position="left"
          label-width="170px"
          status-icon
        >
          <div style="display: flex;justify-content: space-between;">
            <el-form-item   label="Date" prop="date" style="margin-right: 20px;">
              <el-input  :disabled="true" size="small" v-model="basicForm.date" />
            </el-form-item>
            <el-form-item label="Staff Name" prop="staffName">
              <el-input  :disabled="true"  size="small" v-model="basicForm.staffName" />
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-between;">
            <el-form-item label="BR No" prop="brNo" style="margin-right: 20px;" >
              <el-input @input="brNoRestrict" size="small" v-model="basicForm.brNo" />
            </el-form-item>
            <el-form-item label="Alternate Contact Person" prop="alternateContactPerson">
              <el-input  size="small" v-model="basicForm.alternateContactPerson" />
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-between;">
            <el-form-item label="Funding Source" prop="fundingSourceVal" style="margin-right: 20px;">
              <el-select  size="small" v-model="basicForm.fundingSourceVal"  placeholder="Select" >
                <el-option
                  v-for="item in basicForm.fundingSource"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Faculty / Department " prop="facultyOrDepartmentVal" >
              <el-select  size="small" v-model="basicForm.facultyOrDepartmentVal"  placeholder="Select" >
                <el-option
                  v-for="item in basicForm.facultyOrDepartment"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="Subject" prop="subject">
              <el-input size="small" v-model="basicForm.subject" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div ref="paymentContainer" class="payment">
      <el-card   shadow="never"  style="margin-bottom: 20px;">
      <div style="width: 100%;flex-direction: column;">
        <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
          <div style="display: flex;justify-content: space-between;">
            <h4 style="font-size: 20px;" >Payment</h4>
            <div class="item" style="display: flex;align-items: center;">
                <div style="margin-right: 20px;">Invoice / Receipts</div>
                <el-upload
                    v-model:file-list="fileTableData.invoicedOrReceipts"
                    class="upload-demo"
                    style="display:flex;align-items:center"
                    multiple
                    :auto-upload="false"
                    :before-upload="beforeUpload"
                  >
                  <el-icon ><Paperclip /></el-icon>
                </el-upload>
            </div>
          </div>
          <div style="display: flex;align-items: center;">
            <el-button @click="insertRow('payment')" type="primary" >Insert row</el-button>
            <el-button @click="copyRow('payment')" type="primary" >Copy row</el-button>
            <el-button @click="deleteRow('payment')" type="primary" >Delete row</el-button>
            <el-button @click="importData" type="primary" >Import Data</el-button>
          </div>
        </div>

      </div>
      <div>
        <vxe-table
          ref="paymentTableRef"
          border
          keepSource
          show-overflow
          :expand-config="{ visibleMethod:({row})=> row.payeeTypeVal === 'Individual' }"
          :data="paymentTableData"
          :edit-rules="paymentFormRule"
          :column-config="{resizable: true}"
          :edit-config="{trigger: 'click', mode:'row',showStatus:true}"
        >

          <vxe-column type="checkbox" width="80"></vxe-column>
          <vxe-column type="seq" :title="'No.'" width="60"></vxe-column>
          <vxe-column field="expenseTypeVal" width="150" title="Expense Type" :edit-render="{autofocus: '.vxe-input--inner'}">
            <template #edit="{ row }">
              <el-select  size="small"  v-model="row.expenseTypeVal"  placeholder="Select" >
                  <el-option
                    v-for="item in row.expenseType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="item" title="Item" width="100" :edit-render="{}">
            <template #edit="scope">
                <vxe-input v-model="scope.row.item" type="text" ></vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="servicePeriod" title="Service Period" width="150" :edit-render="{}">
            <template #edit="scope">
              <div style="display: flex; align-items: center">
                  <el-date-picker
                    :disabled="scope.row.expenseTypeVal === 'Good'"
                    size="small"
                    v-model="scope.row.servicePeriod"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                  />
              </div>
            </template>
          </vxe-column>
          <vxe-column field="currency"  title="Currency" width="150" :edit-render="{}">
            <template #edit="scope">
                <el-input  size="small" type="text" v-model="scope.row.currency" />
            </template>
          </vxe-column>
          <vxe-column field="amount"  title="Amount" width="150" :edit-render="{}">
            <template #edit="scope">
                <el-input  size="small" type="text" v-model="scope.row.amount" />
            </template>
          </vxe-column>
          <vxe-column field="paymentCurrencyVal" title="Payment Currency" width="190"  :edit-render="{autofocus: '.vxe-input--inner'}">
            <template #edit="{ row }">
              <el-select  size="small"  v-model="row.paymentCurrencyVal"  placeholder="Select" >
                  <el-option
                    v-for="item in row.paymentCurrency"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="payeeTypeVal" title="Payee Type" width="150"  :edit-render="{}">
            <template #edit="{ row ,rowIndex }">
              <el-select  @change="()=>toggleRowExpand(row)" size="small"  v-model="row.payeeTypeVal"  placeholder="Select" >
                  <el-option
                    v-for="item in row.payeeType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="payeeName" title="PayeeName" width="150" :edit-render="{}">
            <template #edit="scope">
                <el-input @input="v=>onPayeeNameChange(scope.rowIndex)" size="small" type="text" v-model="scope.row.payeeName" />
            </template>
          </vxe-column>
          <vxe-column field="staffNumber" title="Staff / Student Number" width="250" :edit-render="{}">
            <template #edit="scope">
                <el-input :disabled="scope.row.payeeTypeVal === 'Company' || scope.row.payeeTypeVal === 'Individual'" size="small" type="text" v-model="scope.row.staffNumber" />
            </template>
          </vxe-column>
          <vxe-column type="expand"  width="30"  :edit-render="{}">
            <template #content="{ row , rowIndex }">
               <div style="padding-left: 20px;padding-top: 20px;max-width: 500px;;">
                <el-form :rules="expandRule" ref="expandRef" :model="row" :label-position="'left'" label-width="130">
                  <el-form-item prop="radio" style="display: flex;">
                    <el-radio v-model="row.radio" label="1">Macau Civil Servant</el-radio>
                    <el-radio v-model="row.radio" label="2">Service provided in Macau</el-radio>
                  </el-form-item>
                  <el-form-item label="ID/Passport No." prop="IDOrPassportNumber">
                    <el-input v-model="row.IDOrPassportNumber" />
                  </el-form-item>
                  <el-form-item label="Issuance in" prop="issuanceIn">
                    <el-input v-model="row.issuanceIn" />
                  </el-form-item>
                  <el-form-item label="Email" prop="email">
                    <el-input v-model="row.email" />
                  </el-form-item>
                  <el-form-item label="Contact No." prop="contactNumber">
                    <el-input v-model="row.contactNumber" />
                  </el-form-item>
                </el-form>
               </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <div style="padding-bottom: 20px;"></div>
      <!--  bottom information -->
      <div style="display: flex;align-items: center;justify-content: center">
        <div style="margin-right: 20px;">Summary of payee:</div>
        <el-table  :data="summaryDataForPayment"  style="width: 490px;">
          <el-table-column prop="currencyType" label="currency" width="180" />
          <el-table-column prop="amount" label="amount" width="180" />
          <el-table-column prop="payeeName" label="payeeName" width="130" />
        </el-table>
      </div>
    </el-card>
    </div>
    <div ref="reimbursementContainer" class="reimbursement" >
      <el-card  shadow="never" style="margin-bottom: 20px;">
      <div style="width: 100%;flex-direction: column;">
        <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
          <div style="display: flex;justify-content: space-between;">
            <h4 style="font-size: 20px;" >Reimbursement</h4>
            <div class="item" style="display: flex;align-items: center;">
                <div style="margin-right: 20px;">Actual exchange rate justification</div>
                <el-upload
                    v-model:file-list="fileTableData.actualExchangeRateJustification"
                    class="upload-demo"
                    style="display:flex;align-items:center"
                    multiple
                    :auto-upload="false"
                    :before-upload="beforeUpload"
                  >
                  <el-icon ><Paperclip /></el-icon>
                </el-upload>
            </div>
          </div>
          <div style="display: flex;align-items: center;">
            <el-button @click="insertRow('reimbursement')" type="primary" >Insert row</el-button>
            <el-button @click="copyRow('reimbursement')" type="primary" >Copy row</el-button>
            <el-button @click="deleteRow('reimbursement')" type="primary" >Delete row</el-button>
            <el-button @click="importData" type="primary" >Import Data</el-button>
          </div>
        </div>
      </div>
      <vxe-table
            ref="reimbursementTableRef"
            border
            keep-source
            show-overflow
            :data="reimbursementTableData"
            :edit-rules="reimbursementFormRule"
            :column-config="{resizable: true}"
            :edit-config="{trigger: 'click', mode:'row',showStatus:true}"
        >
          <vxe-column type="checkbox" width="80"></vxe-column>
          <vxe-column type="seq" :title="'No.'" width="60"></vxe-column>
          <vxe-column field="expenseTypeVal" width="150" title="Expense Type" :edit-render="{autofocus: '.vxe-input--inner'}">
            <template #edit="{ row }">
              <el-select  size="small"  v-model="row.expenseTypeVal"  placeholder="Select" >
                  <el-option
                    v-for="item in row.expenseType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="item" title="Item" width="100" :edit-render="{}">
            <template #edit="scope">
                <el-input  size="small" type="text" v-model="scope.row.item" />
            </template>
          </vxe-column>
          <vxe-column field="servicePeriod" title="Service Period" width="150" :edit-render="{}">
            <template #edit="scope">
              <div style="display: flex; align-items: center">
                  <el-date-picker
                    :disabled="scope.row.expenseTypeVal === 'Good'"
                    size="small"
                    v-model="scope.row.servicePeriod"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                  />
              </div>
            </template>
          </vxe-column>
          <vxe-column field="currency"  title="Currency" width="150" :edit-render="{}">
            <template #edit="scope">
                <el-input  size="small" type="text" v-model="scope.row.currency" />
            </template>
          </vxe-column>
          <vxe-column field="amount"  title="Amount" width="150" :edit-render="{}">
            <template #edit="scope">
                <el-input  size="small" type="text" v-model="scope.row.amount" />
            </template>
          </vxe-column>
          <vxe-column field="exchangeRateTypeVal" title="Exchange Rate Type " width="200"  :edit-render="{autofocus: '.vxe-input--inner'}">
            <template #edit="{ row }">
              <el-select  @change="onExchangeVal(row)" size="small"  v-model="row.exchangeRateTypeVal"  placeholder="Select" >
                  <el-option
                    v-for="item in row.exchangeRateType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="rateDate" title="Rate Date" width="150"  :edit-render="{autofocus: '.vxe-input--inner'}">
            <template #edit="{ row }">
              <el-date-picker
                    size="small"
                    v-model="row.rateDate"
                    type="date"
                  />
            </template>
          </vxe-column>
          <vxe-column field="rate" title="Rate" width="100" :edit-render="{}">
            <template #edit="scope">
                <el-input :disabled="scope.row.exchangeRateTypeVal === 'UM default' "  size="small" type="text" v-model="scope.row.rate" />
            </template>
          </vxe-column>
          <vxe-column field="amountInMop" title="Amount in MOP" width="150" :edit-render="{}">
            <template #edit="scope">
                <el-input  :disabled="true" size="small" type="text" v-model="scope.row.amountInMop" />
            </template>
          </vxe-column>
          <vxe-column field="payeeTypeVal" title="Payee Type" width="150"  :edit-render="{autofocus: '.vxe-input--inner'}">
            <template #edit="{ row }">
              <el-select  size="small"  v-model="row.payeeTypeVal"  placeholder="Select" >
                  <el-option
                    v-for="item in row.payeeType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="payeeName" title="PayeeName" width="150" :edit-render="{}">
            <template #edit="scope">
                <el-input  size="small" type="text" v-model="scope.row.payeeName" />
            </template>
          </vxe-column>
          <vxe-column field="staffNumber" title="Staff / Student Number" width="250" :edit-render="{}">
            <template #edit="scope">
                <el-input :disabled="scope.row.payeeTypeVal === 'Company' || scope.row.payeeTypeVal === 'Individual'" size="small" type="text" v-model="scope.row.staffNumber" />
            </template>
          </vxe-column>
      </vxe-table>
      <div style="padding-bottom: 20px;"></div>
      <!--  bottom information -->
      <!--  bottom information -->
      <div style="display: flex;align-items: center;justify-content: center">
        <div style="margin-right: 20px;">Summary of payee:</div>
        <el-table  :data="summaryDataForReim"  style="width: 490px;">
          <el-table-column prop="currencyType" label="currency" width="180" />
          <el-table-column prop="amount" label="amount" width="180" />
          <el-table-column prop="payeeName" label="payeeName" width="130" />
        </el-table>
      </div>
      </el-card>
    </div>
    <div ref="informationForPaymentContainer" class="informationForPayment">
      <el-card  shadow="never" class="informationForPayment" style="margin-bottom: 20px;">
      <div style="width: 70%;flex-direction: column;">
        <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
          <h4 style="font-size: 20px;" >Information for payment</h4>
        </div>
      </div>
      <el-table border v-if="informationForPaymentTableData.length!==0" :data="informationForPaymentTableData" style="width: 660px">
        <el-table-column label="Payee" width="150" >
          <template #default="scope">
            <el-input :disabled="true" size="small" type="text" v-model="scope.row.payee" />
          </template>
        </el-table-column>
        <el-table-column label="Bank information" width="160" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-select v-if="scope.row" size="small"   v-model="scope.row.bankInformationVal"  placeholder="bank information" >
                <el-option
                  v-for="item in scope.row.bankInformationType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Payment method" width="250" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-select  :disabled="scope.row.bankInformationVal === 'Information provided in the past' " size="small"   v-model="scope.row.paymentMethodVal"  placeholder="payment method" >
                <el-option
                  v-for="item in scope.row.paymentMethodType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="operation" width="100" >
          <template #default="scope">
            <div v-if="scope.row.bankInformationVal !== 'Information provided in the past' " style="display: flex; align-items: center">
              <el-button :type="'primary'" size="small">edit</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      </el-card>
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
              v-if="informationForPaymentTableData[index].paymentMethodVal === 'Telegraphic transfer'"
          />
          <BankDraft
              :beneficiary-name="'Daniel'"
              :id-or-passport-number="'1345124(2)'"
              :email-address="'xxx@homtmail.com'"
              :contact-number="'+853 62198402'"
              :index="index"
              v-if="informationForPaymentTableData[index].paymentMethodVal === 'Bank Draft'"
          />
          <AutoPay
              :beneficiary-name="'Daniel'"
              :tax-i-d-or-i-d-number="'USD'"
              :email-address="'xxx@homtmail.com'"
              :contact-number="'+853 62198402'"
              :index="index"
              v-if="informationForPaymentTableData[index].paymentMethodVal === 'Auto-pay'"
          />
          <CashierOrder
              :beneficiary-name="'Daniel'"
              :email-address="'xxx@homtmail.com'"
              :contact-number="'+853 62198402'"
              :index="index"
              v-if="informationForPaymentTableData[index].paymentMethodVal === 'Cheque/Cashier Order'"
          />
      </el-card>
    </div>
    <el-card  shadow="never" class="Attachment" style="margin-bottom: 20px;">
      <div style="width: 70%;flex-direction: column;">
        <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
          <h4 style="font-size: 20px;" >Attachment</h4>
        </div>
      </div>
      <div class="table-list">
        <el-form ref="fileFormRef" :model="fileTableData" :rules="fileFormRule" label-width="200" label-position="left" status-icon  >
          <el-form-item label="Proposal" prop="proposal"  >
            <div class="item" style="display: flex;align-items: center;">
              <el-upload
                  v-model:file-list="fileTableData.proposal"
                  class="upload-demo"
                  style="display:flex;align-items:center"
                  multiple
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="Invoices/receipts" prop="invoicedOrReceipts"  >
            <div class="item" style="display: flex;align-items: center;">
              <el-upload
                  v-model:file-list="fileTableData.invoicedOrReceipts"
                  class="upload-demo"
                  style="display:flex;align-items:center"
                  multiple
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="Actual exchange rate justification" prop="actualExchangeRateJustification" >
            <div class="item" style="display: flex;align-items: center;">
              <el-upload
                  v-model:file-list="fileTableData.actualExchangeRateJustification"
                  class="upload-demo"
                  style="display:flex;align-items:center"
                  multiple
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="Passport/ID Copy"  prop="passportOrIDCopy" >
            <div class="item" style="display: flex;align-items: center;">
              <el-upload
                  v-model:file-list="fileTableData.passportOrIDCopy"
                  class="upload-demo"
                  style="display:flex;align-items:center"
                  multiple
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="Others"  prop="others">
            <div class="item" style="display: flex;align-items: center;">
              <el-upload
                  v-model:file-list="fileTableData.others"
                  class="upload-demo"
                  style="display:flex;align-items:center"
                  multiple
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <SideNavigationBar  @click="onClick" :dataList="dataList" :currentTop="currentTop"/>

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
