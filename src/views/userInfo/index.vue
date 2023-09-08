<script lang="ts" setup>
import { useState } from '@/hooks/useState';
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { random } from 'xe-utils';
const {role , iconStyle ,date } = useState({
  role:'' as 'user' | 'approver' | 'FO',
  iconStyle:{},
  date:undefined as unknown as Date
})
const router = useRouter()
const navigateToApplicationPage = (type:'to be handled' | 'processing' | 'Processed') =>{
  switch (role.value) {
    case 'user':
      router.push({
        path:'viewOfMyApplication',
        query:{
          type
        }
      })
      break;
    case 'approver':
      router.push({
        path:'application',
        query:{
          type
        }
      })
      break;
    case 'FO':
      router.push({
        path:'applicationForFO',
        query:{
          type
        }
      })
      break;
    default:
      break;
  }
}
const navigateToApplicationByCalender = (){
  
}

const num = random(1,30)
onMounted(() => {
  // @ts-ignore
  role.value = localStorage.getItem('role')!
})

</script>

<template>
  <div class="app-container">
    <div v-if="role ==='user'">
      <div class="to-do-container">
        <div class="approve" @click="navigateToApplicationPage('to be handled')" style="cursor: pointer;;border-radius: 20px;width: 100%;" :shadow="'hover'">
          <div>
            <div style="font-weight: 600;font-size: 32px;color: #303133;margin-bottom: 5px;">14</div>
            <div style="padding-left: 5px;font-size: 14px;color: #606266;">To be handled</div>
          </div>
          <div class="icon-container">
            <el-icon :size="27">
              <Tickets />
            </el-icon>
          </div>
        </div>
        <div class="approve" @click="navigateToApplicationPage('processing')" style="cursor: pointer;;border-radius: 20px;width: 100%;" :shadow="'hover'">
          <div>
            <div style="font-weight: 600;font-size: 32px;color: #303133;margin-bottom: 5px;">12</div>
            <div style="padding-left: 5px;font-size: 14px;color: #606266;">Processing</div>
          </div>
          <div class="icon-container">
            <el-icon :color="'rgb(39,231,50)'" :size="28">
              <EditPen />
            </el-icon>
          </div>
        </div>
        <div class="approve" @click="navigateToApplicationPage('Processed')" style="cursor: pointer;;border-radius: 20px;width: 100%;" :shadow="'hover'">
          <div>
            <div style="font-weight: 600;font-size: 32px;color: #303133;margin-bottom: 5px;">12</div>
            <div style="padding-left: 5px;font-size: 14px;color: #606266;">Processed</div>
          </div>
          <div class="icon-container">
            <el-icon :color="'rgb(64,158,255)'" :size="28">
              <CircleCheck />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="date" style="padding-top: 20px;border-radius: 10px;" :shadow="'hover'">
          <div style="display: flex;flex: 1;align-items: center;border-radius: 20px;background-color: #FFF;padding: 30px;" >
            <div >
              <el-avatar
                :size="'large'"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
            </div >
            <div style="color: #606266;width: 70%;display: flex;flex-direction: column;gap: 10px;">
              <div>Department: IT </div>
              <div>{{ 'role: ' + role }}</div>
            </div>

          </div>
      </div>
    </div>
    <div v-else>
      <div class="to-do-container">
        <div class="approve" @click="navigateToApplicationPage('to be handled')" style="cursor: pointer;;border-radius: 20px;width: 100%;" :shadow="'hover'">
          <div>
            <div style="font-weight: 600;font-size: 32px;color: #303133;margin-bottom: 5px;">14</div>
            <div style="padding-left: 5px;font-size: 14px;color: #606266;">To be handled</div>
          </div>
          <div class="icon-container">
            <el-icon :size="27">
              <Tickets />
            </el-icon>
          </div>
        </div>
        <div class="approve" @click="navigateToApplicationPage('Processed')" style="cursor: pointer;;border-radius: 20px;width: 100%;" :shadow="'hover'">
          <div>
            <div style="font-weight: 600;font-size: 32px;color: #303133;margin-bottom: 5px;">12</div>
            <div style="padding-left: 5px;font-size: 14px;color: #606266;">Processed</div>
          </div>
          <div class="icon-container">
            <el-icon :color="'rgb(64,158,255)'" :size="28">
              <CircleCheck />
            </el-icon>
          </div>
        </div>
        <div class="date" style="border-radius: 10px;" :shadow="'hover'">
          <div style="display: flex;flex: 1;align-items: center;border-radius: 20px;background-color: #FFF;padding: 30px;" >
            <div >
              <el-avatar
                :size="'large'"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
            </div >
            <div style="color: #606266;width: 70%;display: flex;flex-direction: column;gap: 10px;">
              <div>Department: IT </div>
              <div>{{ 'role: ' + role }}</div>
            </div>

          </div>
      </div>
      </div>

    </div>
    <div >
      <div class="card" style="width: 100%">
        <el-calendar v-model="date" >
          <template #date-cell="{ data }"  >
            <div @click="" style="font-size: 13px;">
              <div style="margin-bottom: 10px;" :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-').slice(1).join('-') }}
              </div>
              <div >
                <el-icon><CircleCheck /></el-icon>
                Processed: {{ num}}
              </div>
              <div>
                <el-icon><MessageBox /></el-icon>
                Received: {{ num }}
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-container{
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 25px;
  .to-do-container{
    display: flex;
    gap: 20px;
    .approve{
      display: flex;
      flex: 0.6;
      height: 140px;
      background-color: #FFF;
      border-radius: 10px;
      justify-content: space-around;
      align-items: center;
      .icon-container{
        width: 55px;
        height: 55px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border-color: #F4F4F4;
        background-color: #F4F4F4;
        border-width: 1px;
        padding: 10px;
        border-style: solid;
      }
    }
    .done{
      display: flex;
      flex: 0.7;
    }
    .date{
      display: flex;
      flex: 1;
    }
  }
}
</style>
