<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, onUpdated} from 'vue';
import {useState} from '@/hooks/useState';
interface ReimbursementProps {
  fileTableData:any,
  insertRow:(v:'payment'|'reimbursement')=>void,
  copyRow:(v:'payment'|'reimbursement')=>void,
  deleteRow:(v:'payment'|'reimbursement')=>void,
  importData:()=>void,
  reimbursementTableData:any,
  reimbursementFormRule:any,
  toggleRowExpand:(row:any)=>void,
  onPayeeNameChange:(index:number)=>void,
  expandRule:any,
  setReimbursementRef:(ref:any)=>void,
  summaryDataForReim:any,
  onExchangeVal:(val:any)=>void,
}
const {setReimbursementRef} = defineProps<ReimbursementProps>()
const { reimbursementTableRef } = useState({
  reimbursementTableRef:null
})
onMounted(()=>{
  setReimbursementRef(reimbursementTableRef.value)
})


</script>
<template>
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
</template>

<style lang='scss' scoped>
.container{

}
</style>
