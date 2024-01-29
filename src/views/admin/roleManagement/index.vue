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
import { IService } from "@/service"
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
import CreateGroup from '@/views/admin/roleManagement/createGroup/index.vue'
import EditGroup from '@/views/admin/roleManagement/editGroup/index.vue'
import { useShared } from "./shared"
defineOptions({
  // 命名当前组件
  name: "RoleManagement",

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
const { getAllRole ,getAllPermission } = useShared()
const { tableData , content , field , order } = useState({
  tableData: [] as unknown as Role[],
  content:'',
  field:'',
  order:'' as 'asc' | 'desc'
})

const header:any = [
  { title: 'Name', key:'name',value: 'name' ,sortable:true  },
  { title: 'Updated At', key:'updatedAt',value: 'updatedAt' ,sortable:true  },
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

const editItem = ( row:Role)=>{
  editDialogVisible.value = true
  currentItem.value = row
}

const deleteItem = async(row:Role)=>{
  ElMessageBox.confirm(
    `Are you sure you want to delete this role? Role Name:  ${row.name}`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      await IService.roleservice.deleteRole(row.id);
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

const getTableData = async () => {
  const { data } = await IService.roleservice.getRolesByCondition(content.value,field.value,order.value,paginationData.currentPage,paginationData.pageSize);
  tableData.value = data.data
  paginationData.total = data.totalCount
  loading.value = false
}
//#endregion


// fn



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
 
}),
//#endregion

onMounted(async() => {
  // get all roles
  await getAllRole()
  await getAllPermission()
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
       Create Role
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
        <template v-slot:item.name="{ item }">
          <div>{{ item.name }}</div>
          <div style="font-size: 13px;">{{ item.description }}</div>
        </template>
        <template v-slot:item.updatedAt="{ item }">
          <div>{{ getFullTime(item.updatedAt!) }}</div>
        </template>
        <template v-slot:no-data>
          No data
        </template>
      </v-data-table>
      <!-- <div v-loading="loading" style="padding-bottom: 30px;" class="table-wrapper card">
        <vxe-table
          :data="tableData"
          :column-config="{useKey: true}"
          :row-config="{useKey: true}"
          :sort-config="{remote:true}"
          @sort-change="sortChangeEvent"

         >
          <vxe-column type="seq" title="No" width="60" />
          <vxe-column type="html" field="name" title="Name" sortable  />
          <vxe-column type="html" field="updatedAt" title="Updated At" sortable >
            <template  #default="{ row , rowIndex }">
              <div v-if="row && row.updatedAt">{{ getFullTime(row.updatedAt) }}</div>
            </template>
          </vxe-column>
          <vxe-column type="html" title="Operations" width="180">
            <template  #default="{ row , rowIndex }">
              <div v-if="row.status != 'draft' " style="display: flex;gap: 10px;align-items: center;">
                <el-button
                    @click="editItem(row)"
                    size="small"
                    :type="'primary'"
                  >
                  Edit
                </el-button>
                <el-button
                    @click="deleteItem(row)"
                    size="small"
                    :type="'success'"
                  >
                  Delete
                </el-button>
              </div>
            </template>
          </vxe-column>
          <template #empty>
            <el-empty  />
          </template>
        </vxe-table>
      </div> -->

      <!-- Create -->
      
      <CreateGroup :paginationData="paginationData" :getTableData="getTableData" />
      
      <!-- EDIT -->
      <EditGroup :paginationData="paginationData" :getTableData="getTableData"/>
    </div>
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
@/utils/local-storage@/service