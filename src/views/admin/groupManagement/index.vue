<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, TabsPaneContext } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Upload } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { useState } from "@/hooks/useState"
import { ApplicationData, ApplicationType, ApplicationTypeInForm } from '@/types/entity/application'
import { log, table } from "console"
import { onMounted } from "vue"
import { uniqueId } from "xe-utils"
import { random ,cloneDeep, debounce } from "lodash-es"
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/store/user"
import { storeToRefs } from "pinia"
import CacheKey from "@/constants/cache-key"
import { onUpdated } from "vue"
import { onActivated } from "vue"
import { IService } from "@/service/Index"
import { Group } from "@/models/group"
import { Identity } from '@/enums/identity'
import { getFullTime } from "@/utils/Date"
import { VxeTablePropTypes } from "vxe-table"
import { Permission } from "@/models/permission"
import { AxiosResponse } from "axios"
import { Response } from '@/api/request'
import { Role } from "@/models/role"
import { getTokenInfo } from "@/utils/token"
import { UserAuth } from "@/models/user-auth"
import { UserService } from "@/service/user"
import CreateGroup from '@/views/admin/groupManagement/createGroup/index.vue'
import EditGroup from '@/views/admin/groupManagement/editGroup/index.vue'
import { useShared } from "./shared"
defineOptions({
  name: "GroupManagement",
})
const router = useRouter()
const route = useRoute()
// tableaPage
const pagination = usePagination()
const { paginationData, handleCurrentChange, handleSizeChange } = pagination
// group
const groupPagination = usePagination()
// share
const { createDialogVisible ,editDialogVisible,currentItem , loading } = storeToRefs(useShared())
const { getAllRole  } = useShared()
const { tableData , content ,field,order} = useState({
  tableData: [] as unknown as Group[],
  content:'',
  field:'',
  order:'' as 'asc' | 'desc'
})

const header:any = [
  { title: 'Name', key:'name',value: 'name' ,sortable:true  },
  { title: 'Identity', key:'identity',value: 'identity' ,sortable:true },
  { title: 'Updated At', key:'updatedAt',value: 'updatedAt' ,sortable:true  },
  // {
  //   title: 'Name',
  //   key: 'fullName',
  //   sortable:true,
  //   //value: (item:) => `${item.firstName} ${item.lastName}`,
  // },
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


//#region CRUD  create delete edit
const createItem = () =>{
  createDialogVisible.value = true
}

const editItem = ( row:Group)=>{
  editDialogVisible.value = true
  currentItem.value = row
}

const deleteItem = async(row:Group)=>{
  ElMessageBox.confirm(
    `Are you sure you want to delete this group? Group Name:  ${row.name}`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      await IService.groupservice.deleteGroup(row.id);
      await getTableData()
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: 'Delete canceled',
      // })
    })    
}



//#endregion

// fn

const getTableData = async () => {
  const { data } = await IService.groupservice.getGroupsByCondition(content.value,field.value,order.value,paginationData.currentPage,paginationData.pageSize);
  tableData.value = data.data
  paginationData.total = data.totalCount
  loading.value = false
}


const fn = debounce(async()=>{
  loading.value = true
  await getTableData()
  loading.value = false
},300)

const commit = async (evenet: any)=>{
  fn()
}

//#region life cycle 
onActivated(() => {
  console.log('hello');

}),
//#endregion

onMounted(async() => {
  // get all roles
  await getAllRole()

})
</script>

<template>
  <div id="app" class="app-container">
    <div shadow="never">
      <v-btn 
        color="primary" 
        class="text-none"
        @click="createItem"
        style="border-radius: 20px;width: 150px;margin-bottom: 20px;"
        prependIcon="mdi-plus"
       >
       Create Group
      </v-btn>
      <v-text-field v-model="content" @keydown="commit" label="Search">
        <template v-slot:append>
          <v-btn color="primary" icon="mdi-search"  size="x-large"></v-btn>
        </template>
      </v-text-field>
      <v-data-table 
        :items="tableData"
        :headers="header"
        :loading="loading"
        @update:options="loadItems"
        id="itable"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn color="secondary" @click="editItem(item)" variant="text" icon="mdi-pencil"></v-btn>
          <v-btn color="secondary" @click="deleteItem(item)" variant="text" icon="mdi-delete"></v-btn>
        </template>
        <template v-slot:item.identity="{ item }">
          <v-chip color="primary" >{{ Identity[item.identity] }}</v-chip>
        </template>
        <template v-slot:item.updatedAt="{ item }">
          <div>{{ getFullTime(item.updatedAt!) }}</div>
        </template>
        <template v-slot:no-data>
          No data
        </template>
      </v-data-table>
    </div>

    <!-- Create -->
    
    <CreateGroup :paginationData="paginationData" :getTableData="getTableData" />
    
    <!-- EDIT -->
    <EditGroup :paginationData="paginationData" :getTableData="getTableData"/>
  </div>
</template>

<style lang="scss" scoped>

.table-wrapper :deep(.keyword-lighten){
  color: #FFF;
  background-color: rgb(64,158,255);
}


.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
@/utils/local-storage