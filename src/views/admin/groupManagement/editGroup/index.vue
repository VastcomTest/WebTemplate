<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, Ref, reactive, watch, computed} from 'vue';
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
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { DeviceEnum } from '@/constants/app-key';
import { useAppStore } from '@/store/modules/app';
import { debounce } from 'lodash-es';
import { create } from 'domain';
interface indexProps {
  getTableData:()=>Promise<void>,
  paginationData:PaginationData
}

const appStore = useAppStore()
const { sidebar, device } = storeToRefs(appStore)
const isMobile = computed(() => device.value === DeviceEnum.Mobile)
const { getTableData ,paginationData} = defineProps<indexProps>()
const { availableRoleList ,editDialogVisible , currentItem , loading } = storeToRefs(useShared())
const { activeName , currentRole,content,groupMemberType ,members,field,order} = useState({
  activeName:'first',
  currentRole:'',
  content:'',
  groupMemberType:'Group Member',
  members:[] as User[],
  field:'',
  order:'asc' as 'asc' | 'desc'
})


const createTemp = reactive({
  id:-1,
  name:'',
  description:'',
  role:'',
})

const rules = {
  name: { required },
  role: { required },
}

const v$ = useVuelidate(rules,createTemp )

const header:any = [
  { title: 'Username',key:'username', value: 'username' ,sortable:true , },
  { title: 'Name', key: 'name' },
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

const groupOperation = async (type:'add' | 'remove' = 'add',row:User)=>{
  try{
    if(type === 'add'){
      
      await IService.groupservice.addGroupMember(currentItem.value.id,row.id)
      ElMessage.success({message:"Group Member updated Successfully"})
    }else{
      await IService.groupservice.removeGroupMember(currentItem.value.id,row.id)
      ElMessage.success({message:"Group Member removed Successfully"})
    }
    await getGroupMembers()
  }catch(err:any){
    ElMessage.error({message:err})
  }
  
}

const submit = async ()=>{

  try {
    const updateRoleId = availableRoleList.value.find(v=>v.name == createTemp.role)?.id
    if(!updateRoleId){
      ElMessage.error("non exist role ID") 
      return;
    }
    
    await IService.groupservice.updateGroup(createTemp.id,{
      name:createTemp.name,
      description:createTemp.description,
      roleId:updateRoleId
    })
    ElMessage.success({
      message:'updated group successfully'
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

const closeDialog = ()=>{
  activeName.value = "Name"
  currentRole.value = ""
  Object.keys(createTemp).forEach((key)=>{
    //@ts-ignore
    createTemp[key] = ''
  })
  editDialogVisible.value = false
}

const getGroupMembers = async()=>{
  if(groupMemberType.value === 'Group Member'){
    members.value =  (await IService.userservice.getGroupMembersByCondition(currentItem.value.id,content.value,"email",order.value,paginationData.currentPage,paginationData.pageSize)).data.data
    return;
  }
  members.value =  (await IService.userservice.getAvailableGroupMembersByCondition(currentItem.value.id,content.value,"email",order.value,paginationData.currentPage,paginationData.pageSize)).data.data
}

watch(editDialogVisible,async()=>{
  if(editDialogVisible.value){
    Object.keys(createTemp).forEach((key)=>{
      //@ts-ignore
      createTemp[key] = currentItem.value[key]
    })
    // @ts-ignore
    createTemp.role = availableRoleList.value.find(v=>v.id == currentItem.value.roleId)?.name
    await getGroupMembers()
  }else{
    closeDialog()
  }
})

watch(groupMemberType,async()=>{
  await getGroupMembers()
})

onMounted(async()=>{
  
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
      <h2>Edit Group</h2>
      <v-btn color="primary" @click="closeDialog"  icon="mdi-close"></v-btn>
    </div>
    <v-card color="surface-container">
      <v-tabs
        fixed-tabs
        v-model="activeName"
        bg-color="surface-container"
        style="margin-bottom: 20px;"
      >
        <v-tab color="primary" style="max-width: 1000px;" value="Name">
          <v-icon size="x-large" style="margin-right: 10px;">mdi-form</v-icon>
          <div>Name</div>
        </v-tab>
        <v-tab color="primary" style="max-width: 1000px;" value="Member">
          <v-icon size="x-large" style="margin-right: 10px;">mdi-account-group</v-icon>
          <div>Member</div>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window  v-model="activeName">
          <v-window-item value="Name">
            <form >
              <v-text-field
                v-model="createTemp.name"
                :error-messages="v$.name.$errors.map((e:any) => e.$message)"
                required
                label="Group Name"
              ></v-text-field>
              
              <v-text-field
                v-model="createTemp.description"
                label="Description"
              ></v-text-field>

              <v-select
                v-model="createTemp.role"
                :items="availableRoleList.map(v=>v.name)"
                required
                :error-messages="v$.role.$errors.map((e:any) => e.$message)"
                label="Role"
              ></v-select>
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
          <v-window-item value="Member">
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
                v-for="size in ['Group Member','Not Group Member']"
                :key="size"
                :value="size"
              >
                {{ size }}
              </v-chip>
            </v-chip-group>
            <v-data-table 
              :items="members"
              :headers="header"
              :loading="loading"
              @update:options="loadItems"
              style="background-color: rgb(var(--v-theme-surface-container));"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn v-if="groupMemberType === 'Group Member'"  color="warning" @click="groupOperation('remove',item)" variant="text" icon="mdi-account-multiple-minus"></v-btn>
                <v-btn v-else color="primary"  @click="groupOperation('add',item!)" variant="text" icon="mdi-account-multiple-plus"></v-btn>
              </template>
              <template v-slot:item.username="{ item }">
                <div>{{ item.username }}</div>
              </template>
              <template v-slot:item.name="{ item }">
                <div>{{ `${ item.firstName} ${item.lastName}` }}</div>
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