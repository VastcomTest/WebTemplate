<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted, reactive, computed, watch} from 'vue';
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
import { log } from 'console';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { DeviceEnum } from '@/constants/app-key';
import { useAppStore } from '@/store/modules/app';
import { SnackBarUtil } from '@/store/modules/snackbar';
interface indexProps {
  getTableData:()=>Promise<void>,
  paginationData:PaginationData
}
type PermissionOption = {
  moduleName:string,
  checkList:string[]
}
const appStore = useAppStore()
const { sidebar, device } = storeToRefs(appStore)
const isMobile = computed(() => device.value === DeviceEnum.Mobile)
const { getTableData ,paginationData} = defineProps<indexProps>()
const { editDialogVisible , currentItem , loading ,permissionList } = storeToRefs(useShared())
const { activeName , currentRole,content,field,order,groups, selectionPermissionList} = useState({
  activeName:'Name',
  currentRole:'',
  content:'',
  groups:[] as Group[],
  field:'',
  order:'asc' as 'asc' | 'desc',
  selectionPermissionList:[] as string[]
})

const createTemp = reactive({
  id:-1,
  name:'',
  description:''
})

const rules = {
  name: { required },
}

const v$ = useVuelidate(rules,createTemp)

const header:any = [
  { title: 'Name', key: 'name' ,value: 'string', sortable:true },
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


const { permissionOptionList } = useState({
  permissionOptionList:[
    {
      moduleName:"User",
      checkList:[]
    },
    {
      moduleName:"Group",
      checkList:[]
    },
    {
      moduleName:"Role",
      checkList:[]
    },
    {
      moduleName:"Config",
      checkList:[]
    }
  ] as PermissionOption[],
})

const fn = debounce(async()=>{
  loading.value = true
  await getGroupMembers()
  loading.value = false
},300)

const commit = async ()=>{
  fn()
}

const getGroupMembers = async()=>{
   groups.value = (await IService.groupservice.getRoleGroupsByCondition(currentItem.value.id,content.value,"name",order.value,paginationData.currentPage,paginationData.pageSize)).data.data
}
const saveRole = async ()=>{
  try {

    await IService.roleservice.updateRole(createTemp.id,{
      name:createTemp.name,
      description:createTemp.description,
    })
    SnackBarUtil.success('update Role  successfully')
    await getTableData()
    return
  } catch (error:any) {
    ElMessage.error({
      message:error
    })
  }
  // get new data 
  await getTableData()
}

const saveRolePermission =async () => {
  try {
    const curPermissionList = selectionPermissionList.value
    const curPermissionIds = [] as number[]
    curPermissionList.forEach(v=>{
      //@ts-ignore
      curPermissionIds.push( permissionList.value.find(per=>per.value === v).id )
    })
    await IService.roleservice.updateRolePermissions(currentItem.value.id,curPermissionIds)
    SnackBarUtil.success('update Role permission successfully')
  } catch (err:any) {
    ElMessage.error({message:err})
  }
}

const getRolePermission = async ()=>{
  try {
    const { data } = await  IService.roleservice.getPermissionsByRoleId(currentItem.value.id)
    data.forEach(v=>{
      selectionPermissionList.value.push(v.value)
    })
  } catch (error:any) {
    ElMessage.error({message:error.toString()})
  }
}


const closeDialog = ()=>{
  activeName.value = "Name"
  currentRole.value = ""
  Object.keys(createTemp).forEach((key)=>{
    //@ts-ignore
    createTemp[key] = ''
  })
  permissionOptionList.value.forEach(v=>{
    v.checkList = []
  })
  selectionPermissionList.value = []
  editDialogVisible.value = false
}

watch(editDialogVisible,async()=>{
  if(editDialogVisible.value){
    Object.keys(createTemp).forEach((key)=>{
      //@ts-ignore
      createTemp[key] = currentItem.value[key]
    })
    //console.log(permissionList.value);
    permissionList.value.forEach(v=>{
      const type = v.group
      const index = permissionOptionList.value.findIndex(val=>val.moduleName === type)
      if(index === -1 ) return;
      permissionOptionList.value[index].checkList.push(v.value)
    })
    await getGroupMembers()
    await getRolePermission()
  }else{
    closeDialog()
  }
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
      <h2>Edit Role</h2>
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
        <v-tab color="primary" style="max-width: 1000px;" value="Permission">
          <v-icon size="x-large" style="margin-right: 10px;">mdi-list-status</v-icon>
          <div>Permission</div>
        </v-tab>
        <v-tab color="primary" style="max-width: 1000px;" value="Group">
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
              <div style="display: flex;justify-content: end;">
                <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                prependIcon="mdi-plus"
                @click="saveRole"
              >
                Save
              </v-btn>
              </div>
            </form>
            
          </v-window-item>
          <v-window-item value="Permission">
            <h3 style="margin-bottom: 30px;font-weight: 500;">Management</h3>
            <div class="permission-item" v-for="item in permissionOptionList">
              <div style="display: flex;align-items: center;height: 50px;">
                <div style="display: flex;flex: 0.25;height: 50px;">
                  <v-chip style="width: 100%;font-weight: 500;">{{ item.moduleName }}</v-chip>
                </div>
                <div class="checkbox-container" style="display: flex;align-items: center;flex: 1;">
                  <v-checkbox

                    v-for="val in item.checkList"
                    color="primary"
                    v-model="selectionPermissionList"
                    :label="val.split('.')[1]"
                    :value="val"
                  ></v-checkbox>
                </div>
                
              </div>
              
            </div>
            <div style="display: flex;justify-content: end;">
              <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                prependIcon="mdi-plus"
                @click="saveRolePermission"
              >
                Save
              </v-btn>
            </div>
          </v-window-item>
          <v-window-item value="Group">
            <v-text-field v-model="content" @keydown="commit" label="Search">
              <template v-slot:append>
                <v-btn color="primary" icon="mdi-search"  ></v-btn>
              </template>
            </v-text-field>

            <v-data-table 
              :items="groups"
              :headers="header"
              :loading="loading"
              @update:options="loadItems"
              style="background-color: rgb(var(--v-theme-surface-container));"
            >
              <template v-slot:item.name="{ item }">
                <div>{{ item.name }}</div>
                <div style="font-size: 13px;">{{ item.description }}</div>
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
.checkbox-container{
  :deep(.v-label.v-label--clickable){
    font-size: 16px;
    font-weight: 500;
    font-family: Roboto, sans-serif;
  }
}

</style>