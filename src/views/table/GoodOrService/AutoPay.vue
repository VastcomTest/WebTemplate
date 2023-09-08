<script setup lang="ts">
import { useState } from '@/hooks/useState';
import { usePaymentMethodStore } from '@/store/modules/PaymentMethod';
import type { FormInstance, FormRules } from 'element-plus'
import { onUnmounted } from 'vue';
import { onMounted , watch} from 'vue';
interface Props{
  beneficiaryName:string,
  taxIDOrIDNumber:string,
  emailAddress:string,
  contactNumber:string,
  index:number
}
const { beneficiaryName , taxIDOrIDNumber , emailAddress, contactNumber, index } = defineProps<Props>()
const { paymentMethodCached } = usePaymentMethodStore()
const { ruleForm }  = useState({
  ruleForm:{
    beneficiaryName: beneficiaryName,
    bankAccountNumber:'',
    bankName:'BOC',
    taxIdOrIDNumber:taxIDOrIDNumber,
    emailAddress:emailAddress,
    contactNumber:contactNumber,
  }
})

const { rules } = useState({
  rules:{
    beneficiaryName:[{ required:true , trigger:'blur' }],
    bankAccountNumber:[{ required:true ,trigger:'blur' }],
    bankName:[{ required:true , trigger:'blur' }],
    taxIdOrIDNumber:[{ required:true , trigger:'blur' }],
    emailAddress:[{  required:true , trigger: 'blur' }],
    contactNumber:[{  required:true , trigger: 'blur' }]
  } as FormRules<typeof ruleForm>
})

function bankAccountNumberRestrict(v:string){
  const currentLetter = v.charAt(v.length-1)
  const isValid = /^[0-9]+/.test(currentLetter)
  isValid? ruleForm.value.bankAccountNumber = v : ruleForm.value.bankAccountNumber = v.substring(0,v.length-1)
}

watch(ruleForm,()=>{
  paymentMethodCached[index].autoPay = ruleForm.value
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
        <el-form-item   label="Bank Account Number" prop="bankAccountNumber" style="display: flex;flex: 1;">
          <el-input  @input="bankAccountNumberRestrict" style="width: 80%;" size="small" v-model="ruleForm.bankAccountNumber" />
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-form-item   label="Bank Name" prop="bankName" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.bankName" />
        </el-form-item>
        <el-form-item   label="Tax ID / ID Number" prop="taxIdOrIDNumber" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.taxIdOrIDNumber" />
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
