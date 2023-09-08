<script setup lang="ts">
import { useFormRules } from '@/hooks/useFormRules';
import { useState } from '@/hooks/useState';
import { usePaymentMethodStore } from '@/store/modules/PaymentMethod';
import type { FormInstance, FormRules } from 'element-plus'
import { storeToRefs } from 'pinia';
import { onUnmounted, watch } from 'vue';
import { onMounted } from 'vue';
import { useTelegrahpicTransferState } from '@/hooks/data/telegraphicTransfer';
interface Props{
  beneficiaryName:string,
  bankAccountNumber:string,
  idOrPassportNumber:string,
  emailAddress:string,
  contactNumber:string,
  index:number,
  disable?:boolean
}
const { beneficiaryName , bankAccountNumber , idOrPassportNumber , emailAddress, contactNumber , index, disable } = defineProps<Props>()
const { paymentMethodCached ,submitFn } = storeToRefs(usePaymentMethodStore())
const { telegraphicTransferTableData } = useTelegrahpicTransferState()
const { rules , ruleFormRef } = useState({
  rules:{
    swiftCode : [{  required:true ,validator: swiftCodeRestrict, trigger: 'blur' }],
    beneficiaryName: [{ required:true , trigger:'blur' }],
    bankAccountNumber:[{ required:true , trigger:'blur' }],
    bankName: [{ required:true , trigger:'blur' }],
    designatedCurrencyVal:[{ required:true , trigger:'blur' }],
    countryOrDistrictOfBeneficiary:[{ required:true , trigger:'blur' }],
    bankAddress:[{ required:true , trigger:'blur' }],
    idOrPassportNumber:[{ required:true , trigger:'blur' }],
    beneficiaryHomeAddress:[{ required:true , trigger:'blur' }],
    stateorprovinceorcityofbeneficiary:[{ required:true , trigger:'blur' }],
    countryAndDistrictOfBeneficiaryBank:[{ required:true , trigger:'blur' }],
    routeCodeWithUKOrAustralia:[{validator:routingCodeWithUKRestrict}],
    routeCodeWithUsOrCanada:[{validator:routingCodeWithUSRestrict}]
  } as FormRules<typeof telegraphicTransferTableData>,
  ruleFormRef:null
})


function bankAccountNumberRestrict(v:string){
  const currentLetter = v.charAt(v.length-1)
  const isValid = /^[a-zA-Z0-9]+/.test(currentLetter)
  isValid? telegraphicTransferTableData.value.bankAccountNumber = v : telegraphicTransferTableData.value.bankAccountNumber = v.substring(0,v.length-1)
}

function swiftCodeRestrict(rule: any, value: any, callback: any){
  if(value ===''){
    callback()
  }
  if (/^[0-9]{8}$/.test(telegraphicTransferTableData.value.swiftCode)) {
    callback()
    return
  }
  callback(new Error('8 or 11 digits'))
}

function routingCodeWithUSRestrict(rule: any, value: any, callback: any){
  if(value ===''){
    callback()
    return
  }
  if (/^[0-9]{9}$/.test(telegraphicTransferTableData.value.routeCodeWithUsOrCanada)) {
    callback()
    return
  }
  callback(new Error('9 digits'))
}

function routingCodeWithUKRestrict(rule: any, value: any, callback: any){
  if(value ===''){
    callback()
    return
  }
  if (/^[0-9]{6}$/.test(telegraphicTransferTableData.value.routeCodeWithUKOrAustralia)) {
    callback()
    return
  }
  callback(new Error('6 digits'))
}


onMounted(()=>{
  if(!submitFn.value[index]){
    //@ts-ignore
    submitFn.value[index] = {}
  }
  // @ts-ignore
  submitFn.value[index].telegraphicTransfer = ()=>{
    let status = false
    // @ts-ignore
    telegraphicTransferTableDataRef.value.validate((valid) => {
      if (valid) {
        console.log('t  submit!')
      } else {
        console.log('t  error submit!')
        return false
      }
    })
    return status
  }
})

onUnmounted(()=>{
  //@ts-ignore
  submitFn.value[index].telegraphicTransfer = ()=>{}
  //@ts-ignore
  paymentMethodCached.value[index].telegraphicTransfer = {}
})

watch(telegraphicTransferTableData,()=>{
  if(!paymentMethodCached.value[index]){
    // @ts-ignore
    paymentMethodCached.value[index] = {}
  }
  paymentMethodCached.value[index].telegraphicTransfer = telegraphicTransferTableData.value

},{
  deep:true,
  immediate:true
})


// function swiftCodeRestrict(v:string){
//   const currentLetter = v.charAt(v.length-1)
//   const isValid = /^[0-9]{8}/.test(currentLetter)
//   isValid? telegraphicTransferTableData.value.swiftCode = v : telegraphicTransferTableData.value.swiftCode = v.substring(0,v.length-1)
// }

</script>
<template>
  <el-form
      ref="telegraphicTransferTableDataRef"
      :model="telegraphicTransferTableData"
      :rules="rules"
      class="demo-telegraphicTransferTableData"
      label-position="left"
      label-width="200px"
      style="font-size: 12px;"
      status-icon
      :disabled=" disable ? disable:false "
    >
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Beneficiary name" prop="beneficiaryName"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.beneficiaryName" />
        </el-form-item>
        <el-form-item  label="Bank Account Number" prop="bankAccountNumber" style="display: flex;flex: 1;" >
          <el-input @input="bankAccountNumberRestrict" style="width: 80%;"   size="small" v-model="telegraphicTransferTableData.bankAccountNumber" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Bank Name" prop="bankName" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.bankName" />
        </el-form-item>
        <el-form-item   label="Designated Currency type" prop="designatedCurrencyVal" style="display: flex;flex: 1;">
          <el-select style="width: 80%;" size="small" v-model="telegraphicTransferTableData.designatedCurrencyVal"  placeholder="Select" >
                <el-option
                  v-for="item in telegraphicTransferTableData.designatedCurrencyType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Country / District of beneficiary " prop="countryOrDistrictOfBeneficiary"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.countryOrDistrictOfBeneficiary" />
        </el-form-item>
        <el-form-item   label="Swift code" prop="swiftCode" style="display: flex;flex: 1;">
          <el-input   style="width: 80%;"  size="small" v-model.number="telegraphicTransferTableData.swiftCode" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Bank address" prop="bankAddress" style="display: flex;flex: 1;">
          <el-input  style="width: 80%"  size="small" v-model="telegraphicTransferTableData.bankAddress" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="ID / Passport Number" prop="idOrPassportNumber" style="display: flex;flex: 1;">
          <el-input  style="width: 50%;"  size="small" v-model="telegraphicTransferTableData.idOrPassportNumber" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Beneficiary home address" prop="beneficiaryHomeAddress" style="display: flex;flex: 1;">
          <el-input  style="width: 50%;"  size="small" v-model="telegraphicTransferTableData.beneficiaryHomeAddress" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="State / Province / City of Beneficiary"  prop="stateorprovinceorcityofbeneficiary" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.stateorprovinceorcityofbeneficiary" />
        </el-form-item>
        <el-form-item label="Country / district of beneficiary bank" prop="countryAndDistrictOfBeneficiaryBank" style="display: flex;flex: 1;" >
          <el-input style="width: 80%;"   size="small" v-model="telegraphicTransferTableData.countryAndDistrictOfBeneficiaryBank" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Routing code (US/Canada)" prop="routeCodeWithUsOrCanada" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.routeCodeWithUsOrCanada" />
        </el-form-item>
        <el-form-item label="Routing code (UK/Australia)" prop="routeCodeWithUKOrAustralia" style="display: flex;flex: 1;" >
          <el-input style="width: 80%;"   size="small" v-model="telegraphicTransferTableData.routeCodeWithUKOrAustralia" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Intermediary Bank Name"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.intermediaryBankName" />
        </el-form-item>
        <el-form-item label="Intermediary bank swift code" style="display: flex;flex: 1;" >
          <el-input style="width: 80%;"   size="small" v-model="telegraphicTransferTableData.intermediaryBankSwiftCode" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Intermediary Bank Address"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.intermediaryBankAddress" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Email address"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.emailAddress" />
        </el-form-item>
        <el-form-item label="Contact number" style="display: flex;flex: 1;" >
          <el-input style="width: 80%;"   size="small" v-model="telegraphicTransferTableData.contactNumber" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item  label="Special arrangement"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="telegraphicTransferTableData.specialArrangement" />
        </el-form-item>
      </div>
    </el-form>
</template>

<style>
</style>
../../../hooks/data/telegraphicTransfer
