<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
interface indexProps {
  fileTableData:any,
  fileFormRule:any,
  
}
const {} = defineProps<indexProps>()
const {} = useState({

})
onMounted(()=>{

})
</script>
<template>
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
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
  </el-card>
</template>

<style lang='scss' scoped>
.container{

}
</style>
