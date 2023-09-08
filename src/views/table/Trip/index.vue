<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, TableColumnCtx } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Paperclip } from "@element-plus/icons-vue"
import { useState } from "@/hooks/useState"
import { Good, Service } from "@/types/entity/goodOrService";
import { table } from "console";
import { uniqueId } from "lodash-es";
import TelegraphicTransfer from "./TelegraphicTransfer.vue";
import CashierOrder from "./CashierOrder.vue";
import BankDraft from "./BankDraft.vue";
import AutoPay from "./AutoPay.vue";


defineOptions({
  // 命名当前组件
  name: "GoodOrService"
})

const {
  ruleForm ,applicationId
} = useState({
  applicationId:'2023-FAH-1234',
  ruleForm:{
    date:'2023-07-13',
    brNo:'',
    fundingSourceVal:'',
    fundingSource:[
      {
        value:'Research-Internal',
        label:'Research-Internal'
      }
    ],
    staffName:'staff A',
    alternateContactPerson:'Staff B',
    facultyOrDepartmentVal:'',
    facultyOrDepartment:[
      {
        value: 'department1',
        label: 'department1',
      },
      {
        value: 'Option2',
        label: 'department2',
      },
      {
        value: 'Option3',
        label: 'department3',
      },
    ],
    subject:'',
    staffInvolved:'',
    destination:'',
    tripPeriod:''
  },

})

function brNoRestrict(v:string){
  const currentLetter = v.charAt(v.length-1)
  const isValid = /\d+|\,/.test(currentLetter)
  isValid? ruleForm.value.brNo = v : ruleForm.value.brNo = v.substring(0,v.length-1)
}


</script>

<template>
  <div class="app-container">
    <el-card  shadow="never" class="header" style="margin-bottom: 20px;">
      <div style="width: 100%;flex-direction: column;">
        <div style="width: 70%;justify-content: space-between;display: flex;align-items: center;">
          <h4 style=";font-size: 20px;" >Application No: {{ applicationId }}</h4>
          <div style="display: flex;align-items: center;">
            <el-button type="primary" >Submit</el-button>
            <el-button type="primary" >Save</el-button>
          </div>
        </div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          class="demo-ruleForm"
          label-position="left"
          label-width="170px"
          status-icon
        >
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-form-item   label="Date" prop="date"  style="display: flex;flex: 1;">
              <el-input  :disabled="true" style="width: 80%;"  size="small" v-model="ruleForm.date" />
            </el-form-item>
            <el-form-item   label="Bank Account Number" prop="bankAccountNumber" style="display: flex;flex: 1;">
              <el-input  :disabled="true" style="width: 80%;" size="small" v-model="ruleForm.staffName" />
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-form-item   label="Br No." prop="brNo."  style="display: flex;flex: 1;">
              <el-input  @input="brNoRestrict" style="width: 80%;"  size="small" v-model="ruleForm.brNo" />
            </el-form-item>
            <el-form-item label="Alternate Contact Person" prop="alternateContactPerson" style="display: flex;flex: 1;">
              <el-input  style="width: 80%;" size="small" v-model="ruleForm.alternateContactPerson" />
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-form-item label="Funding Source" prop="fundingSource" style="display: flex;flex: 1;">
              <el-select  size="small" v-model="ruleForm.fundingSourceVal"  placeholder="Select" >
                <el-option
                  v-for="item in ruleForm.fundingSource"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Faculty / Department " prop="facultyOrDepartment" style="display: flex;flex: 1;" >
              <el-select  size="small" v-model="ruleForm.facultyOrDepartmentVal"  placeholder="Select" >
                <el-option
                  v-for="item in ruleForm.facultyOrDepartment"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-form-item   label="Subject" prop="subject"  style="display: flex;flex: 1;">
              <el-input   style="width: 80%;"  size="small" v-model="ruleForm.subject" />
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-form-item   label="Staff Involved" prop="staffInvolved"  style="display: flex;flex: 1;">
              <el-input   style="width: 80%;"  size="small" v-model="ruleForm.staffInvolved" />
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-form-item   label="Destination" prop="destination"  style="display: flex;flex: 1;">
              <el-input   style="width: 80%;"  size="small" v-model="ruleForm.destination" />
            </el-form-item>
          </div>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-form-item   label="Trip Period" prop="tripPeriod"  style="display: flex;flex: 1;">
                <el-date-picker
                  v-model="ruleForm.tripPeriod"
                  type="daterange"
                  range-separator="To"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  :size="'small'"
                />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.app-container{
  padding-bottom: 100px;
}
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
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
