<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, reactive, computed} from 'vue';
import {useState , useProxyState } from '@/hooks/useState';
import { Group } from '@/models/group';
import { Upload } from "@element-plus/icons-vue"
import { IService } from '@/service/Index';
import { useShared } from '../shared';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { PaginationData } from '@/hooks/usePagination'
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { Role } from '@/models/role';
import { DeviceEnum } from '@/constants/app-key';
import { useAppStore } from '@/store/modules/app';
interface indexProps {
  getTableData:()=>Promise<void>,
  paginationData:PaginationData
}
const appStore = useAppStore()
const { sidebar, device } = storeToRefs(appStore)
const isMobile = computed(() => device.value === DeviceEnum.Mobile)
const { getTableData } = defineProps<indexProps>()
const { createDialogVisible } = storeToRefs(useShared())
const { activeName , currentRole } = useState({
  activeName:'first',
  currentRole:''
})

const createTemp = reactive({
  name:'',
  description:''
})

const rules = {
  name: { required },
}

const v$ = useVuelidate(rules,createTemp )

const submit = async ()=>{
  
  try {
    const valid = await v$.value.$validate()
    if(!valid){
      return
    }
    //@ts-ignore
    const { data } = await IService.roleservice.createRole({
      name:createTemp.name,
      description:createTemp.description,
    })
    ElMessage.success({
      message:"create Role successfully"
    })
  } catch (error:any) {
    ElMessage.error({
      message:error
    })
  }
  createDialogVisible.value = false
  // get new data 
  await getTableData()
}

const closeDialog = ()=>{
  activeName.value = "Group"
  currentRole.value = ""
  Object.keys(createTemp).forEach((key)=>{
    //@ts-ignore
    createTemp[key] = ''
  })
  createDialogVisible.value = false
  v$.value.$reset()
}

onMounted(()=>{

})
</script>
<template>
  <v-dialog
    v-model="createDialogVisible"
    :width="isMobile ? '90%': '50%'"
    scrollable
  >
  <div class="dialog-container scrollbar" >
    <div class="header">
      <h2>Create Role</h2>
      <v-btn color="primary" @click="closeDialog"  icon="mdi-close"></v-btn>
    </div>
    <v-card color="surface-container">
      <v-tabs
        fixed-tabs
        v-model="activeName"
        bg-color="surface-container"
      >
        <v-tab color="primary" style="max-width: 1000px;" value="Group">
          <v-icon size="x-large" style="margin-right: 10px;">mdi-form</v-icon>
          <div>Form</div>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window  v-model="activeName">
          <v-window-item value="Group">
            <form >
              <v-text-field
                v-model="createTemp.name"
                :error-messages="v$.name.$errors.map((e:any) => e.$message)"
                required
                label="Name"
              ></v-text-field>
              
              <v-text-field
                v-model="createTemp.description"
                label="Description"
              ></v-text-field>

              <div style="display: flex;justify-content: end;">
                <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                prependIcon="mdi-plus"
                @click="submit"
              >
                Create
              </v-btn>
              </div>
            </form>
          </v-window-item>

          <v-window-item value="groups">
            hello
          </v-window-item>
        </v-window>
      </v-card-text>
  </v-card>
  </div>
 </v-dialog> 
</template>

<style lang='scss' scoped>
</style>