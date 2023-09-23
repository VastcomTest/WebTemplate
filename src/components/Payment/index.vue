<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, onUpdated} from 'vue';
import {useState} from '@/hooks/useState';
interface PaymentProps {
  fileTableData:any,
  insertRow:(v:'payment'|'reimbursement')=>void,
  copyRow:(v:'payment'|'reimbursement')=>void,
  deleteRow:(v:'payment'|'reimbursement')=>void,
  importData:()=>void,
  paymentTableData:any,
  paymentFormRule:any,
  toggleRowExpand:(row:any)=>void,
  onPayeeNameChange:(index:number)=>void,
  summaryDataForPayment:any,
  expandRule:any,
  setPaymentRef:(ref:any)=>void
}
const { setPaymentRef } = defineProps<PaymentProps>()
const { paymentTableRef } = useState({
  paymentTableRef:null
})
onMounted(()=>{
  setPaymentRef(paymentTableRef.value)
})


</script>
<template>
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
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
          </div>
        </div>
        <div style="display: flex;align-items: center;">
          <el-button @click="insertRow('payment')" type="primary" >Insert row</el-button>
          <el-button @click="copyRow('payment')" type="primary" >Copy row</el-button>
          <el-button @click="deleteRow('payment')" type="primary" >Delete row</el-button>
          <el-upload :showFileList="false" style="margin-left: 12px;" action='' :auto-upload="false" @change="importData">
            <el-button  type="primary" >Import Data</el-button>
          </el-upload>
        </div>
      </div>
    </div>
    <div>
      <vxe-table
        ref="paymentTableRef"
        border
        keepSource
        empty-text="No Data"
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
</template>

<style lang='scss' scoped>
.container{

}
</style>
