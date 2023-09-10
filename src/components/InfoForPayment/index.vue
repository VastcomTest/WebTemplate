<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
interface indexProps {
  informationForPaymentTableData:any,

}
const {} = defineProps<indexProps>()
const {} = useState({

})
onMounted(()=>{

})
</script>
<template>
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
</template>

<style lang='scss' scoped>
.container{

}
</style>
