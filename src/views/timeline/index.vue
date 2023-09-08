<script lang="ts" setup>
import { onMounted ,ref } from 'vue';
import { useRoute , useRouter } from 'vue-router'
import CacheKey from '@/constants/cache-key';
import { Timeline } from '@/utils/Timeline';
import { ApplicationStatus } from '@/types/entity/application';

const route = useRoute()
const router =  useRouter()
const timeline = ref<Timeline[]>()

function statusColor(status:ApplicationStatus){
  let color = {
    'to be amended' : 'rgb(249,201,103)',
    'rejected' : 'rgb(255,0,0)',
    'amended':'rgb(35,196,229)',
    'approved' : ''
  }
  // @ts-ignore
  return color[status] ? color[status] : 'rgb(103,194,58)'
}

onMounted(()=>{
  const appId = route.query.appId
  const data = localStorage.getItem(CacheKey.GOOD_OR_SERVICE)
  if(!appId) return
  if(data){
    const applications:[] = JSON.parse(data)
    //@ts-ignore
    const applicationForm:GoodOrService =  applications.find(v=>{
      return v.applicationId === appId
    })
    timeline.value = applicationForm.timeline
    timeline.value = timeline.value?.reverse()
  }
})
</script>

<template>
  <div class="app-container">
    <h1 style="color:#606266;padding-left: 5px;">Progress</h1>
    <div class="card" style="max-width: 1000px;">
      <el-timeline>
        <el-timeline-item :color="statusColor(item.status)" v-for="(item,index) in timeline" :type="'success'" :size="'large'"   :timestamp="item.date" placement="top">
          <el-card :class="{'current-status':index === 0} " >
            <div style="display:flex;justify-content: space-between;">
              <h2 style="margin: 0px;color:#606266">{{ 'Status: '+ item.title }}</h2>
              <h3 style="margin: 0px;color:#606266" v-if="item.approver" >{{ 'Approver: ' + item.approver }}</h3>
            </div>
            <p style="color:#303133">{{ item.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style scoped>
.current-status{
  border-radius: 15px;
  border-width: 5px;
  border-color: rgb(64,158,255);
}
.el-timeline{
  padding-left:0px;
}
.app-container{
  padding:20px;
  padding-top:0px
}
</style>
