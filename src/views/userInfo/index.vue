<script lang="ts" setup>
import { useState } from '@/hooks/useState';
import { IService } from '@/service';
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { random } from 'xe-utils';
const {role , iconStyle ,date } = useState({
  role:'',
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
const navigateToApplicationByCalender = () => {

}

const num = random(1,30)
onMounted(() => {
  // @ts-ignore
  role.value = "TEST"
})

</script>

<template>
  <v-container>
    <v-row justify="space-around">
      <v-date-picker elevation="24"></v-date-picker>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.app-container{
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 25px;
  
}
</style>
@/service