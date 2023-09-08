<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter()
function backToApplications(){
  router.replace('/viewOfMyApplication')
}
</script>


<template>
  <el-result
    icon="success"
    title="Commit Successfully"
    sub-title="You can click the button to check your application  "
  >
    <template #extra>
      <el-button @click="backToApplications" type="primary">Back to Applications</el-button>
    </template>
  </el-result>
</template>

<style>
</style>
