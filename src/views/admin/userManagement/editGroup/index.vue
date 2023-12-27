<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, reactive, computed} from 'vue';
import {useState , useProxyState } from '@/hooks/useState';
import { Group } from '@/models/group';
import { Minus, Plus, Search, Upload } from "@element-plus/icons-vue"
import { IService } from '@/service/Index';
import { useShared } from '../shared';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { getFullTime } from '@/utils/Date';
import { PaginationData } from '@/hooks/usePagination';
import CacheKey from '@/constants/cache-key';
import { UserAuth } from '@/models/user-auth';
import { VxeTablePropTypes } from 'vxe-table';
import { User } from '@/models/user';
import { debounce } from 'lodash-es';
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { watch } from 'vue';
import { Identity } from '@/enums/identity';
import { SnackBarUtil } from '@/store/snackbar';
import { DeviceEnum } from '@/constants/app-key';
import { useAppStore } from '@/store/app';
interface indexProps {
  getTableData:()=>Promise<void>,
  paginationData:PaginationData
}
type PermissionOption = {
  moduleName:string,
  checkList:string[]
}
const { getTableData ,paginationData} = defineProps<indexProps>()
const { editDialogVisible , currentItem , loading } = storeToRefs(useShared())
const { 
  activeName , currentRole,content,field,
  order,groups,checkList ,groupMemberType
} = useState({
  activeName:'info',
  currentRole:'',
  content:'',
  groups:[] as Group[],
  field:'',
  order:'asc' as 'asc' | 'desc',
  checkList:[] as string[],
  groupMemberType:'Group',
})

// ismobile
const appStore = useAppStore()
const { sidebar, device } = storeToRefs(appStore)
const isMobile = computed(() => device.value === DeviceEnum.Mobile)
const iterateVals = ["Require Change Password","Password Never Expire","Local Account","Locked"]
const iterateKeys = ["requireChangePassword","passwordNeverExpire","localAccount","locked"]

const createTemp = reactive({
  username:'',
  email:'',
  firstName:'',
  lastName:'',
  chineseName:'',
  nickName:'',
  requireChangePassword:false,
  passwordNeverExpire:false,
  localAccount:false,
  locked:false,
})

const rules = {
  username: { required },
  email: { email },
  firstName: { required },
  lastName: { required },
}

const v$ = useVuelidate(rules,createTemp )

const header:any = [
  { title: 'Name',key:'name', value: 'name' ,sortable:true , },
  { title: 'Identity', key: 'identity',value: 'identity' },
  { title: '', key: 'actions', sortable: false },
]

const loadItems =async (props:any) => {
  const { page, itemsPerPage, sortBy } = props
  loading.value = true
  paginationData.currentPage = page
  paginationData.pageSize = itemsPerPage
  if(sortBy != null && sortBy.length > 0){
    const res = sortBy[0]
    field.value = res.key
    order.value = res.order
  }
  await getTableData()
  loading.value = false
}

const submit = async ()=>{

  try {
    //@ts-ignore
    const row = currentItem.value
    checkList.value.forEach(v=>{
      const index = iterateVals.findIndex(val=>v==val)
      //@ts-ignore
      currentItem.value[ iterateKeys[index] ] = true
    })
    await IService.userservice.updateUser(row.id,{
      ...currentItem.value
    })
    ElMessage.success({
      message:'updated User successfully'
    })
    editDialogVisible.value = false
    await getTableData()
    return
  } catch (error:any) {
    ElMessage.error({
      message:error
    })
  }
  editDialogVisible.value = false
  // get new data 
  await getTableData()
}

const fn = debounce(async()=>{
  loading.value = true
  await getGroupMembers()
  loading.value = false
},300)

const commit = async ()=>{
  fn()
}


const groupOperation = async (type:'add' | 'remove' = 'add',row:Group)=>{
  try{
    if(type === 'add'){
      await IService.groupservice.addGroupMember(row.id,currentItem.value.id)
    }else{
      await IService.groupservice.removeGroupMember(row.id,currentItem.value.id)
    }
    SnackBarUtil.showMessage(
    `Group Member ${type =='add'? 'updated':'remove' } Successfully`,
    type =='add'? 'success':'error'
  )
    await getGroupMembers()
  }catch(err:any){
    ElMessage.error({message:err})
  }
  
}

const getGroupMembers = async()=>{
  if(groupMemberType.value != 'Group'){
    groups.value = (await IService.groupservice.getAvailableMemberGroupsByCondition(currentItem.value.id,content.value,"name",order.value,paginationData.currentPage,paginationData.pageSize)).data.data
    return
  }
   groups.value = (await IService.groupservice.getMemberGroupsByCondition(currentItem.value.id,content.value,"name",order.value,paginationData.currentPage,paginationData.pageSize)).data.data
}


const closeDialog = ()=>{
  editDialogVisible.value = false
  activeName.value = "info"
  currentRole.value = ""
  Object.keys(createTemp).forEach((key)=>{
    //@ts-ignore
    createTemp[key] = ''
  })
}

watch(editDialogVisible,async()=>{
  if(editDialogVisible.value){
    Object.keys(createTemp).forEach((key)=>{
      //@ts-ignore
      createTemp[key] = currentItem.value[key]
    })
    
    iterateVals.forEach((v,i)=>{
      //@ts-ignore
      if(currentItem.value[ iterateKeys[i] ]){
        checkList.value.push(v)
      }
    
    })
      
    await getGroupMembers()
  }else{
    closeDialog()
  }
})

watch(groupMemberType,async()=>{
  await getGroupMembers()
})
</script>
<template>

<v-dialog
    v-model="editDialogVisible"
    :width="isMobile ? '90%': '50%'"
    scrollable
  >
  <div class="dialog-container scrollbar" >
    <div class="header">
      <h2>Edit User</h2>
      <v-btn color="primary" @click="closeDialog"  icon="mdi-close"></v-btn>
    </div>
    <v-card color="surface-container">
      <v-tabs
        fixed-tabs
        v-model="activeName"
        bg-color="surface-container"
        style="margin-bottom: 20px;"
      >
        <v-tab color="primary" style="max-width: 1000px;" value="info">
          <v-icon size="x-large" style="margin-right: 10px;">mdi-form</v-icon>
          <div>Info</div>
        </v-tab>
        <v-tab color="primary" style="max-width: 1000px;" value="groups">
          <v-icon size="x-large" style="margin-right: 10px;">mdi-account-group</v-icon>
          <div>Groups</div>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window  v-model="activeName">
          <v-window-item value="info">
            <form >
              <v-text-field
                v-model="createTemp.username"
                :error-messages="v$.username.$errors.map((e:any) => e.$message)"
                required
                label="User Name"
              ></v-text-field>
              
              <v-text-field
                v-model="createTemp.email"
                required
                :error-messages="v$.email.$errors.map((e:any) => e.$message)"
                label="Email"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.firstName"
                required
                :error-messages="v$.firstName.$errors.map((e:any) => e.$message)"
                label="First Name"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.lastName"
                required
                :error-messages="v$.lastName.$errors.map((e:any) => e.$message)"
                label="Last Name"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.chineseName"
                label="Chinese Name"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.nickName"
                label="Nick Name"
              ></v-text-field>
              <div>
                <v-checkbox
                  color="primary"
                  style="opacity: 1;height: 40px;color: rgb(var(--v-theme-on-surface));"
                  v-for="item in iterateVals"
                  v-model="checkList"
                  :label="item"
                  :value="item"
                />
              </div>
              <div style="display: flex;justify-content: end;">
                <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                prependIcon="mdi-plus"
                @click="submit"
              >
                Save
              </v-btn>
              </div>
            </form>
            
          </v-window-item>
          <v-window-item value="groups">
            <v-text-field v-model="content" @keydown="commit" label="Search">
              <template v-slot:append>
                <v-btn color="primary" icon="mdi-search"  ></v-btn>
              </template>
            </v-text-field>

            <v-chip-group
              v-model="groupMemberType"
              color="primary"
            >
              <v-chip
                filter
                color="primary"
                v-for="size in ['Group','Available Group']"
                :key="size"
                :value="size"
              >
                {{ size }}
              </v-chip>
            </v-chip-group>
            <v-data-table 
              :items="groups"
              :headers="header"
              :loading="loading"
              @update:options="loadItems"
              
              style="background-color: rgb(var(--v-theme-surface-container));"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn v-if="groupMemberType === 'Group'"  color="warning" @click="groupOperation('remove',item)" variant="text" icon="mdi-account-multiple-minus"></v-btn>
                <v-btn v-else color="primary"  @click="groupOperation('add',item)" variant="text" icon="mdi-account-multiple-plus"></v-btn>
              </template>
              <template v-slot:item.name="{ item }">
                <div>{{ item.name }}</div>
                <div style="font-size: 12px;">{{ item.description }}</div>
              </template>
              <template v-slot:item.identity="{ value }">
                <v-chip >
                  {{  Identity[value] }}
                </v-chip>
              </template>
              <template v-slot:no-data>
                No data
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
  </v-card>
  </div>
 </v-dialog> 
</template>

<style lang='scss' scoped>
</style>