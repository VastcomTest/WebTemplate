<script setup lang="ts">
import { ref } from 'vue';
//@ts-ignore
import html2pdf from 'html2pdf.js'
import axios from 'axios';
import Ipdf from '@/components/Pdf/index.vue'
import Profile from '@/components/Profile/index.vue'

const url = "https://api61.ilovepdf.com/v1/download/7snggtsjygjfg61rclb2yw1drAnyp11qwt5nfjvkbA1spkhzn3f3g8qr67j5qz8tgn15ckpktt6l2jAspsn7c44mtvc79hvzms4ksvxvj66Aw49r8t7l0qfcbhtAswz5kp3xm3brqpcgmnvk4dx05264dmf9kb78603tg81wgl6d5pwxkl3q"
const pdfRef = ref<InstanceType<typeof Ipdf>>();

const previewPdf = ()=>{
  pdfRef.value?.requsetPdf(url);
  pdfRef.value?.openDialog();
}

</script>

<template>
  <div>
    <el-button @click="previewPdf">
      testPDF
    </el-button>
    <Ipdf ref="pdfRef" />
  </div>
</template>