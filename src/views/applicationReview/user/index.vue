<script lang="ts" setup>
import { useState } from '@/hooks/useState';
import { usePaymentMethodStore } from '@/store/modules/PaymentMethod';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, reactive, ref, watch , watchEffect } from 'vue';
import { useRoute , useRouter } from 'vue-router'
import AutoPay from '@/views/table/GoodOrService/AutoPay.vue';
import BankDraft from '@/views/table/GoodOrService/BankDraft.vue';
import CashierOrder from '@/views/table/GoodOrService/CashierOrder.vue';
import TelegraphicTransfer from '@/views/table/GoodOrService/TelegraphicTransfer.vue';
import { useFileState } from '@/hooks/data/file';
import { useHeaderState } from '@/hooks/data/header';
import { useInfoForPayment } from '@/hooks/data/infoForPayment';
import { usePaymentState } from '@/hooks/data/payment';
import { useReimbursement } from '@/hooks/data/reimbursement';
import { useTelegrahpicTransferState } from '@/hooks/data/telegraphicTransfer';

import { useAppStore } from '@/store/modules/app';
import { Payment, Reimbursement } from '@/types/entity/goodOrService';
import { VxeTablePropTypes } from 'vxe-table';
import CacheKey from '@/constants/cache-key';
import { GoodOrService, setGoodOrServiceCached } from '@/utils/cache/local-storage';
import { ElMessage } from 'element-plus';
import { MarkType } from '@/types/entity/goodOrService'
import { log } from 'console';
import SideNavigationBar from '@/components/SideNavigationBar/index.vue'
import { useSideNavigationBar } from '@/hooks/useSideNavigationBar';
import { useDebounceFn, useElementBounding , useMutationObserver ,useThrottleFn,watchThrottled } from '@vueuse/core'
import * as TimelineFn from '@/utils/Timeline'
import { addAndMerge } from '@/utils/table';
interface Props{
  appId?:string
}
const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const { applicationId , basicForm } = useHeaderState()
const { paymentTableData ,paymentTableRef,summaryDataForPayment} = usePaymentState()
const { reimbursementTableData , summaryDataForReim ,getSummaries , reimbursementTableRef }  = useReimbursement()
const { informationForPaymentTableData ,createPaymentMethod } = useInfoForPayment()
const { fileTableData } = useFileState()
const { sidebar  }  =  storeToRefs(appStore)
const isOpenSideBar = computed(()=> sidebar.value.opened)
const { paymentMethodCached  } = storeToRefs(usePaymentMethodStore())
const { goodOrService, dialogVisible ,markDialogVisible ,
  reasonDialogVisible, reason , markVal , markOption,markAsUpdatedArr ,
  currentEditIndex,updatedArr,asComponent
} = useState({
  goodOrService:{} as GoodOrService,
  dialogVisible:false,
  markDialogVisible:false,
  reasonDialogVisible:false,
  reason:'',
  markVal:'approved' as MarkType,
  markOption:[{
    label:'rejected',
    value:'rejected'
  },{
    label:'approved',
    value:'approved'
  }],
  currentEditIndex:-1,
  updatedArr:[] as number[],
  markAsUpdatedArr:{},
  asComponent:props.appId ? true : false
})

// sidebar
const {
  dataList , onClick , container ,  paymentContainer,
  reimbursementContainer, informationForPaymentContainer ,
  paymentRefs,getTopOfAllForm , observeOnScroll,currentTop
} = useSideNavigationBar();


const checkboxConfig = reactive<VxeTablePropTypes.CheckboxConfig<any>>({
  // checkMethod: ({ row }) => {
  //   return row.mark == 'to be processed'
  // },
  visibleMethod ({ row }) {
    return row.mark === 'to be processed'
  },
  trigger:'row',
  showHeader:false
})

function setSelectedForApprovedRow(){
  // payment
  goodOrService.value.paymentTableData.forEach((v,i)=>{
    if(v.approved){
      paymentTableRef.value.toggleCheckboxRow(paymentTableData.value[i])
    }
  })

  goodOrService.value.reimbursementTableData.forEach((v,i)=>{
    if(v.approved){
      reimbursementTableRef.value.toggleCheckboxRow(reimbursementTableData.value[i])
    }
  })
}

async function getSelectedRow(){
  let paymentRows :Payment[]
  let reimbursementRows :Reimbursement[]
  paymentRows =  await paymentTableRef.value.getCheckboxRecords(true)
  //reimbursementRows =  await reimbursementTableRef.value.getCheckboxRecords(true)

  return {
    paymentRows,
    //reimbursementRows
  }
}

async function handleReject(){
  const { paymentRows  } = await getSelectedRow()
  const rows = [...paymentRows]
  rows.forEach(v=>{
    return v.mark = 'rejected'
  })
  goodOrService.value.status = 'rejected'
  setGoodOrServiceCached(goodOrService.value)
  ElMessage({
    message:"reject successfully",
    type:'success'
  })
  router.replace('/application')
}

function confirm(){
  handleReject()
}

async function resubmit(){
  paymentTableData.value.forEach(v=>{
    v.mark = 'to be processed'
  })
  goodOrService.value.status = 'Submitted'
  goodOrService.value.paymentTableData = paymentTableData.value
  setGoodOrServiceCached(goodOrService.value)
  ElMessage({
    message:'Resubmit successfully'
  })
}

function amend(){
  goodOrService.value.status = 'amended'
  goodOrService.value.timeline.push( TimelineFn.amendApp() )
  goodOrService.value.paymentTableData.forEach(v=>{
    if(v.mark === 'rejected'){
      v.mark = 'updated'
    }
  })
  setGoodOrServiceCached(goodOrService.value)
  ElMessage({
    message:'Amended successfully'
  })
}

function onEdit({row,rowIndex}){
  currentEditIndex.value = rowIndex
  return true;
}

function rowClassName({ row  }:{row :Payment}){
  return row.mark
}

function cellClassName({ rowIndex, columnIndex }){
    if(markAsUpdatedArr.value[rowIndex] && markAsUpdatedArr.value[rowIndex][columnIndex]){
      return  'col-orange'
    }
    return  null;
}

function visibleMethod({row}){
  return row.payeeTypeVal === 'Individual'
}

function expandRow(){
  paymentTableData.value.forEach(v=>{
    if(v.payeeTypeVal === 'Individual'){
      paymentTableRef.value.toggleRowExpand(v)
    }
  })
}

onMounted(async ()=>{
  const appId = props.appId || route.query.appId
  const data = localStorage.getItem(CacheKey.GOOD_OR_SERVICE)
  if(!appId) return
  if(data){
    const applications:[] = JSON.parse(data)
    //@ts-ignore
    const applicationForm:GoodOrService =  applications.find(v=>{
      return v.applicationId === appId
    })


    //@ts-ignore
    applicationId.value = applicationForm.applicationId
    //@ts-ignore
    basicForm.value = applicationForm.basicForm
    //@ts-ignore
    paymentTableData.value = applicationForm.paymentTableData
    //@ts-ignore
    reimbursementTableData.value = applicationForm.reimbursementTableData
    //@ts-ignore
    informationForPaymentTableData.value = applicationForm.informationForPaymentTableData
    // summary
    paymentTableData.value.forEach(v=>{
      summaryDataForPayment.value.push({
        amount:String(v.amount),
        currencyType:v.currency,
        payeeName:v.payeeName
      })
    })

    markAsUpdatedArr.value = applicationForm.tobeUpdatedFields ?? {}
    //@ts-ignore
    paymentMethodCached.value = applicationForm.paymentMethodCached
    goodOrService.value = applicationForm
  }
  setSelectedForApprovedRow()
  expandRow()
  // set navigation
  await getTopOfAllForm(paymentTableData.value)
  observeOnScroll()


})


watch(paymentTableData,(val,OldVal)=>{
  if(paymentTableData.value.length === 0) return
  // collect all
  summaryDataForPayment.value = []
  const markedArr = val.filter(v=>{
    return v.mark === 'approved'
  })
  addAndMerge(markedArr,summaryDataForPayment.value)
},{
  deep:true,
  immediate:true
})

watch(reimbursementTableData,(val,oldVal)=>{
  val.forEach(v=>{
    v.amountInMop = Number( (v.amount * v.rate).toFixed(3) )
  })
  summaryDataForReim.value = []
  addAndMerge(val,summaryDataForReim.value)
},{
  deep:true,
  immediate:true
})



</script>



<template>
  <div  ref="container" :style="{paddingTop:asComponent?'0px':'60px'}" class="container">
    <div v-if="!asComponent" class="header" :style="{ width : isOpenSideBar  ?  'calc( 100% - 220px )': 'calc( 100% - 58px)' }"
    style=";z-index: 1000;position: fixed;top: 80px;:right:0px;">
      <div class="box-card" style="height: 60px;padding: 20px 20px;padding-bottom: 0px;background-color:#FFF;box-shadow: 0 5px 10px #CDCDCD;">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <div style="display: flex;align-items: center;gap: 5px;">
            <el-icon><Edit /></el-icon>
            <div>Status : </div>
            <div style="color:cadetblue;" >{{ goodOrService.status }}</div>
          </div>
          <div   style="display: flex;">
            <el-button v-if="goodOrService.status === 'rejected' " type="success" @click="resubmit" >Resubmit </el-button>
            <el-button v-if="goodOrService.status === 'rejected' || goodOrService.status ==='to be amended' " type="info" @click="reasonDialogVisible  = true" >View Reject / Reject Reason </el-button>
            <el-button v-if="goodOrService.status === 'to be amended' " type="success" @click="amend" >amend </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container" v-if="basicForm" >
      <el-card style="margin-bottom: 20px;">
        <div style="width: 70%;flex-direction: column;">
          <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
            <h4 style="font-size: 20px;" >BasicInfo</h4>
          </div>
        </div>
        <el-descriptions  class="margin-top" :column="3" direction="vertical" border>
          <el-descriptions-item label="Application Id">{{ applicationId }}</el-descriptions-item>
          <el-descriptions-item label="Br No.">{{ basicForm.brNo }}</el-descriptions-item>
          <el-descriptions-item label="Alternate Contact Person" >{{ basicForm.alternateContactPerson }}</el-descriptions-item>
          <el-descriptions-item label="Date">{{ basicForm.date }}</el-descriptions-item>
          <el-descriptions-item label="Faculity / Department">{{ basicForm.facultyOrDepartmentVal }}</el-descriptions-item>
          <el-descriptions-item label="Funding Source">{{ basicForm.fundingSourceVal }}</el-descriptions-item>
          <el-descriptions-item label="Staff Name">{{ basicForm.staffName }}</el-descriptions-item>
          <el-descriptions-item label="Subject">{{ basicForm.subject }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <div ref="paymentContainer">
        <el-card   shadow="never" class="payment" style="margin-bottom: 20px;">
        <div style="width: 70%;flex-direction: column;">
          <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
            <h4 style="font-size: 20px;" >Payment</h4>
          </div>
        </div>
        <div>
          <vxe-table
            ref="paymentTableRef"
            border
            keep-source
            show-overflow
            :expand-config="{ visibleMethod:visibleMethod }"
            :data="paymentTableData"
            :column-config="{resizable: true}"
            :checkbox-config="checkboxConfig"
            :row-config="{}"
            class="mytable-style"
            :cell-class-name="cellClassName"
            :edit-config="{enabled:goodOrService.status === 'draft' || goodOrService.status === 'rejected' || goodOrService.status ==='to be amended' ,trigger: 'click', mode:'row',showStatus:true,beforeEditMethod:onEdit}"
          >
            <vxe-column :type="'expand'"  width="30">
              <template #content="{ row , rowIndex }">
                <div style="padding-left: 20px;padding-top: 20px;max-width: 500px;;">
                  <el-form  :inline="true" ref="expandRef" :model="row" :label-position="'left'" >
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
            <vxe-column  title="Mark" width="80" field="approved"  >
              <template #default="scope"  >
                <el-popover
                    placement="top-start"
                    :title="scope.row.mark"
                    :width="200"
                    trigger="hover"
                    :content="scope.row.markComment"
                  >
                  <template #reference>
                    <div  style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
                        <div v-if="scope.row.mark === 'approved'" style="border-radius: 5px;width: 30px;height: 30px;background-color: #adff2f;"></div>
                        <div v-else-if="scope.row.mark === 'rejected'" style="border-radius: 5px;width: 30px;height: 30px;background-color: #ff0000;"></div>
                        <div v-else-if="scope.row.mark === 'updated'" style="border-radius: 5px;width: 30px;height: 30px;background-color: #ffff00;"></div>
                        <div v-else style="border-radius: 5px;width: 30px;height: 30px;background-color: #808080;"></div>
                    </div>
                  </template>
                </el-popover>
              </template>
            </vxe-column>
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
            <vxe-column field="currency"  title="Currency" width="100" :edit-render="{}">
              <template #edit="scope">
                  <el-input  size="small" type="text" v-model="scope.row.currency" />
              </template>
            </vxe-column>
            <vxe-column field="amount"  title="Amount" width="100" :edit-render="{}">
              <template #edit="scope">
                  <el-input  size="small" type="text" v-model="scope.row.amount" />
              </template>
            </vxe-column>
            <vxe-column field="paymentCurrencyVal" title="Payment Currency" width="150"  :edit-render="{autofocus: '.vxe-input--inner'}">
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
                <el-select   size="small"  v-model="row.payeeTypeVal"  placeholder="Select" >
                    <el-option
                      v-for="item in row.payeeType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                </el-select>
              </template>
            </vxe-column>
            <vxe-column field="payeeName" title="PayeeName" width="100" :edit-render="{}">
              <template #edit="scope">
                  <el-input  size="small" type="text" v-model="scope.row.payeeName" />
              </template>
            </vxe-column>
            <vxe-column field="staffNumber" title="Staff / Student Number" width="200" :edit-render="{}">
              <template #edit="scope">
                  <el-input :disabled="scope.row.payeeTypeVal === 'Company' || scope.row.payeeTypeVal === 'Individual'" size="small" type="text" v-model="scope.row.staffNumber" />
              </template>
            </vxe-column>
          </vxe-table>
        </div>
        <div style="padding-bottom: 20px;"></div>
        <!--  bottom information -->
        <div style="display: flex;align-items: center;justify-content: center;">
          <div style="margin-right: 20px;">Summary of payee:</div>
          <el-table  :data="summaryDataForPayment"  style="width: 490px;">
            <el-table-column prop="currencyType" label="currency" width="180" />
            <el-table-column prop="amount" label="amount" width="180" />
            <el-table-column prop="payeeName" label="payeeName" width="130" />
          </el-table>
        </div>
        </el-card>
      </div>
      <div  ref="reimbursementContainer">
        <el-card  shadow="never" class="reimbursement" style="margin-bottom: 20px;">
          <div style="width: 70%;flex-direction: column;">
            <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
              <h4 style="font-size: 20px;" >Reimbursement</h4>
            </div>
          </div>
          <vxe-table
                ref="reimbursementTableRef"
                border
                keep-source
                show-overflow
                :data="reimbursementTableData"
                :column-config="{resizable: true}"
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
              <vxe-column field="currency"  title="Currency" width="100" :edit-render="{}">
                <template #edit="scope">
                    <el-input  size="small" type="text" v-model="scope.row.currency" />
                </template>
              </vxe-column>
              <vxe-column field="amount"  title="Amount" width="100" :edit-render="{}">
                <template #edit="scope">
                    <el-input  size="small" type="text" v-model="scope.row.amount" />
                </template>
              </vxe-column>
              <vxe-column field="exchangeRateTypeVal" title="Exchange Rate Type " width="180"  :edit-render="{autofocus: '.vxe-input--inner'}">
                <template #edit="{ row }">
                  <el-select  @change="onExchageVal(row)" size="small"  v-model="row.exchangeRateTypeVal"  placeholder="Select" >
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
              <vxe-column field="amountInMop" title="Amount in MOP" width="180" :edit-render="{}">
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
              <vxe-column field="payeeName" title="PayeeName" width="100" :edit-render="{}">
                <template #edit="scope">
                    <el-input  size="small" type="text" v-model="scope.row.payeeName" />
                </template>
              </vxe-column>
              <vxe-column field="staffNumber" title="Staff / Student Number" width="200" :edit-render="{}">
                <template #edit="scope">
                    <el-input :disabled="scope.row.payeeTypeVal === 'Company' || scope.row.payeeTypeVal === 'Individual'" size="small" type="text" v-model="scope.row.staffNumber" />
                </template>
              </vxe-column>
          </vxe-table>
          <div style="padding-bottom: 20px;"></div>
          <!--  bottom information -->
          <div style="display: flex;align-items: center;justify-content: center;">
              <div style="margin-right: 20px;">Summary of payee:</div>
              <el-table  :data="summaryDataForReim"  style="width: 490px;">
                <el-table-column prop="currencyType" label="currency" width="180" />
                <el-table-column prop="amount" label="amount" width="180" />
                <el-table-column prop="payeeName" label="payeeName" width="130" />
              </el-table>
            </div>
          </el-card>
      </div>
      <div ref="informationForPaymentContainer">
        <el-card   shadow="never" class="informationForPayment" style="margin-bottom: 20px;">
        <div style="width: 70%;flex-direction: column;">
          <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
            <h4 style="font-size: 20px;" >Information for payment</h4>
          </div>
        </div>
        <el-table border :data="informationForPaymentTableData" style="width: 600px">
          <el-table-column label="Payee" width="150" >
            <template #default="scope">
              <el-input :disabled="true" size="small" type="text" v-model="scope.row.payee" />
            </template>
          </el-table-column>
          <el-table-column label="Bank information" width="160" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-select :disabled="true" size="small"   v-model="scope.row.bankInformationVal"  placeholder="bank information" >
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
          <el-table-column label="Payment method" width="300" >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-select  v-model="scope.row.paymentMethodVal" :disabled="true"  placeholder="payment method" >
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
        </el-table>
      </el-card>
      </div>
      <div ref="paymentRefs" v-for="(item,index) in informationForPaymentTableData" :key="item.id"  >
        <el-card v-if="item && item.bankInformationVal !== 'Information provided in the past' "  shadow="never" class="Payment Method" style="margin-bottom: 20px;">
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
                :disable="true"
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
    <!-- <div ref="paymentRefs" v-for="(item,index) in informationForPaymentTableData"  >
      <el-card v-if="informationForPaymentTableData[index] && informationForPaymentTableData[index].bankInformationVal !== 'Information provided in the past' "  shadow="never" class="Payment Method" style="margin-bottom: 20px;">
          <div style="width: 70%;flex-direction: column;">
            <div style="width: 100%;justify-content: space-between;display: flex;flex-direction: column;margin-bottom: 20px;">
              <h4 style="font-size: 20px;" >Payment Method: {{ informationForPaymentTableData[index].paymentMethodVal +' - '+informationForPaymentTableData[index].payee }}</h4>
            </div>
          </div>
          <el-descriptions  class="margin-top" :column="3" direction="vertical" border>
            <el-descriptions-item label="Beneficiary name">{{ paymentMethodCached[index].telegraphicTransfer.beneficiaryName }}</el-descriptions-item>
            <el-descriptions-item label="Bank Name">{{ paymentMethodCached[index].telegraphicTransfer.bankName }}</el-descriptions-item>
            <el-descriptions-item label="Bank Address" >{{ paymentMethodCached[index].telegraphicTransfer.bankAddress }}</el-descriptions-item>
            <el-descriptions-item label="Bank Account Number">{{ paymentMethodCached[index].telegraphicTransfer.bankAccountNumber }}</el-descriptions-item>
            <el-descriptions-item label="Bank Beneficiary Home Address">{{ paymentMethodCached[index].telegraphicTransfer.beneficiaryHomeAddress }}</el-descriptions-item>
            <el-descriptions-item label="Contact Number">{{ paymentMethodCached[index].telegraphicTransfer.contactNumber }}</el-descriptions-item>
            <el-descriptions-item label="Conuntry / district of beneficiaryBank">{{ paymentMethodCached[index].telegraphicTransfer.conuntryAndDistrictOfBeneficiaryBank }}</el-descriptions-item>
            <el-descriptions-item label="countryOrDistrictOfBeneficiary">{{ paymentMethodCached[index].telegraphicTransfer.countryOrDistrictOfBeneficiary }}</el-descriptions-item>
            <el-descriptions-item label="Designated Currency ">{{ paymentMethodCached[index].telegraphicTransfer.designatedCurrencyVal }}</el-descriptions-item>
            <el-descriptions-item label="Email Address ">{{ paymentMethodCached[index].telegraphicTransfer.emailAddress }}</el-descriptions-item>
            <el-descriptions-item label="ID / Passport Number ">{{ paymentMethodCached[index].telegraphicTransfer.idOrPassportNumber }}</el-descriptions-item>
            <el-descriptions-item label="intermediaryBankAddress ">{{ paymentMethodCached[index].telegraphicTransfer.intermediaryBankAddress }}</el-descriptions-item>
          </el-descriptions>
      </el-card>
    </div> -->
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
                  :limit="1"
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

                  :limit="1"
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

                  :limit="1"
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

                  :limit="1"
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

                  :limit="1"
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    </div>

    <SideNavigationBar
      v-if="!asComponent"
      review @click="onClick"
      :dataList="dataList"
      :currentTop="currentTop"
    />

    <!-- return reject -->
    <el-dialog
      v-model="dialogVisible"
      title="Return / Reject reason"
      width="50%"
      align-center
    >
      <el-input
        v-model="reason"
        :autosize="{ minRows: 5, maxRows: 10 }"
        type="textarea"
        placeholder="reason...."
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirm">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- view  reason -->
    <el-dialog
      v-model="reasonDialogVisible"
      title="Reason"
      width="40%"
      align-center
    >
      <el-text>{{  goodOrService.status ==='rejected' ? goodOrService.rejectReason : goodOrService.returnReason }} </el-text>
    </el-dialog>
  </div>
</template>

<style scoped>
.header{
  transition: width 0.35s;
}
.container{
  padding-top: 60px;
}

/**
case 'approved':
      return '#adff2f'
    case 'rejected':
      return '#ff0000'
    case 'updated':
      return '#ffff00'
    case 'to be processed':
    return '#808080'
*/
::v-deep(.mytable-style.vxe-table .vxe-body--row.approved) {
  background-color:#adff2f;
}

::v-deep(.mytable-style.vxe-table .vxe-body--row.rejected) {
  background-color: #ff0000;
}

::v-deep(.mytable-style.vxe-table .vxe-body--row.updated) {
  background-color: #ffff00;
}

::v-deep(.mytable-style.vxe-table .vxe-body--row.to-be-processed) {
  background-color: #808080;
}



</style>

