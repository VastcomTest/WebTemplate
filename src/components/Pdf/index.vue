<script setup lang="ts">

import { ref } from 'vue';
//@ts-ignore
import html2pdf from 'html2pdf.js'
import axios from 'axios';
import { useState } from '@/hooks/useState';

const { dialogVisible } = useState({
  dialogVisible:false,

})
const payurl = ref();
function requsetPdf(url:string) {
      axios({
        method: 'get',
        url,
        responseType: 'arraybuffer', 
      })
        .then((res) => {
          console.log('???');
          
          let result = res.data
          var binaryData = []
          binaryData.push(result)
          //解析文件类型为pdf类型的文件流
          let Blobs = new Blob(binaryData, { type: 'application/pdf' })
          //生成一个blob链接
          let str = URL.createObjectURL(Blobs)
          console.log(str);
          payurl.value = str
        })
        .catch((err) => {
          console.log(err)
        })
}

function requestLocalPdf(url:string){
  payurl.value = payurl.value
}

function openDialog(){
  console.log(dialogVisible.value);
  dialogVisible.value = !dialogVisible.value
}

defineExpose({ requestLocalPdf , requsetPdf, openDialog })

</script>

<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="80%"
    >
      <span>This is a message</span>
      <iframe width="1080" height="700" :src="payurl" type="application/pdf" />
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>