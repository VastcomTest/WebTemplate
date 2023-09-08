<script setup lang="ts">
import { useState } from '@/hooks/useState';
import { usePaymentMethodStore } from '@/store/modules/PaymentMethod';
import type { FormInstance, FormRules } from 'element-plus'
import { storeToRefs } from 'pinia';
import { onUnmounted, watch } from 'vue';
import { onMounted } from 'vue';
interface Props{
  beneficiaryName:string,
  emailAddress:string,
  contactNumber:string,
  index:number
}
const { beneficiaryName ,  emailAddress, contactNumber, index } = defineProps<Props>()
const { paymentMethodCached } = storeToRefs(usePaymentMethodStore())
const { ruleForm }  = useState({
  ruleForm:{
    beneficiaryName: beneficiaryName,
    taxIDOrIDNumber:'USD',
    emailAddress:emailAddress,
    contactNumber:contactNumber,
  }
})

const { rules } = useState({
  rules:{
    beneficiaryName:[{ required:true , trigger:'blur' }],
    taxIdOrIDNumber:[{ required:true , trigger:'blur' }],
    emailAddress:[{  required:true , trigger: 'blur' }],
    contactNumber:[{  required:true , trigger: 'blur' }]
  } as FormRules<typeof ruleForm>
})

watch(ruleForm,()=>{
  paymentMethodCached.value[index].cashierOrder = ruleForm.value
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
        <el-form-item   label="Tax ID / ID Number" prop="taxIDOrIDNumber" style="display: flex;flex: 1;">
          <el-input  style="width: 80%;"  size="small" v-model="ruleForm.taxIDOrIDNumber" />
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
