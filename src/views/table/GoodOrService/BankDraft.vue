<script setup lang="ts">
import { useState } from '@/hooks/useState';
import { usePaymentMethodStore } from '@/store/modules/PaymentMethod';
import type { FormInstance, FormRules } from 'element-plus'
import { onUnmounted, watch } from 'vue';
import { onMounted } from 'vue';
interface Props{
  beneficiaryName:string,
  idOrPassportNumber:string,
  emailAddress:string,
  contactNumber:string,
  index:number
}
const { beneficiaryName , idOrPassportNumber , emailAddress, contactNumber, index } = defineProps<Props>()
const { paymentMethodCached } = usePaymentMethodStore()
const { ruleForm }  = useState({
  ruleForm:{
    beneficiaryName: beneficiaryName,
    designatedCurrencyVal:'HKD',
    designatedCurrencyType:[{
      value:'USD',
      label:'USD'
    },{
      value:'HKD',
      label:'HKD'
    }],
    mailingAddress:'',
    idOrPassportNumber: idOrPassportNumber,
    beneficiaryChineseName:'',
    genderVal:'',
    genderType:[{
      value:'Male',
      label:'Male'
    },{
      value:'Female',
      label:'Female'
    }],
    dateOfBirth:'',
    cityOfBirth:'',
    emailAddress:emailAddress,
    contactNumber:contactNumber,
  }
})

const { rules } = useState({
  rules:{
    designatedCurrencyVal: [{ required:true , trigger:'blur' }],
    mailingAddress:[{ required:true , trigger:'blur' }],
    idOrPassportNumber:[{ required:true , trigger:'blur' }],
    beneficiaryName:[{  required:true , trigger: 'blur' }],
    gender:[{  required:true , trigger: 'blur' }],
    dateOfBirth:[{  required:true , trigger: 'blur' }],
    cityOfBirth:[{  required:true , trigger: 'blur' }],
    emailAddress:[{  required:true , trigger: 'blur' }],
    contactNumber:[{  required:true , trigger: 'blur' }]

  } as FormRules<typeof ruleForm>
})

onMounted(()=>{

})

watch(ruleForm,()=>{
  paymentMethodCached[index].bankDraft = ruleForm.value
},{
  deep:true,
  immediate:true
})

</script>
<template>
  <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
      label-position="left"
      label-width="200px"
      style="font-size: 12px;"
      status-icon
    >
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Beneficiary Name" prop="beneficiaryName"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.beneficiaryName" />
        </el-form-item>
        <el-form-item   label="Designated Currency " prop="designatedCurrencyVal" style="display: flex;flex: 1;">
          <el-select style="width: 80%;" size="small" v-model="ruleForm.designatedCurrencyVal"   >
                <el-option
                  v-for="item in ruleForm.designatedCurrencyType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
          </el-select>
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Mailing Address" prop="mailingAddress" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.mailingAddress" />
        </el-form-item>
        <el-form-item   label="ID / Passport Number" prop="idOrPassportNumber" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.idOrPassportNumber" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Beneficiary Chinese Name (Chinese Citizenship) " prop="beneficiaryChineseName"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.beneficiaryChineseName" />
        </el-form-item>
        <el-form-item   label="Gender" prop="genderVal" style="display: flex;flex: 1;">
          <el-select style="width: 80%;" size="small" v-model="ruleForm.genderVal" placeholder="gender"   >
                <el-option
                  v-for="item in ruleForm.genderType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Date of Birth" prop="dateOfBirth" style="display: flex;flex: 1;">
          <el-input  style="width: 80%"  size="small" v-model="ruleForm.dateOfBirth" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="City of Birth" prop="idOrPassportNumber" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.cityOfBirth" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Email address"  style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.emailAddress" />
        </el-form-item>
        <el-form-item label="Contact number" style="display: flex;flex: 1;" >
          <el-input style="width: 80%;"   size="small" v-model="ruleForm.contactNumber" />
        </el-form-item>
      </div>
    </el-form>
</template>

<style>
</style>
