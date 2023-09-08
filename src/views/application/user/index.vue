<script lang="ts" setup>
import { onActivated, reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table"
import { type GetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElNotification } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { useState } from "@/hooks/useState"
import { ApplicationData, ApplicationType, ApplicationTypeInForm } from '@/types/entity/application'
import { log, table } from "console"
import { onMounted } from "vue"
import { uniqueId } from "xe-utils"
import { random ,cloneDeep } from "lodash-es"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { storeToRefs } from "pinia"
import { useRoute } from "vue-router"
import { getGoodOrServiceCached } from "@/utils/cache/local-storage"
import {  applicationStatusSelectionForUser , applicationType as applicationTypeT } from '@/constants/selection'

defineOptions({
  // 命名当前组件
  name: "ApplicationForUser",

})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter()
const route  = useRoute()
const { roles  } = storeToRefs(useUserStore())
const { tableData, cachedData,applicationOptions, option ,applicationType, applicationTypeVal ,dialogVisible } = useState({
  tableData: [] as unknown as ApplicationData[],
  cachedData: [] as unknown as ApplicationData[],
  option: "All applications",
  applicationOptions: applicationStatusSelectionForUser,
  applicationTypeVal: 'Good/Service',
  applicationType:applicationTypeT,
  dialogVisible:false,
})

// tools
const formInline = reactive({
  status:'',
  content:''
})
const onSelectionChange = (v:ApplicationTypeInForm)=>{
  switch (v) {
    case 'All applications':
      tableData.value = [...cachedData.value]
      break;
    case 'Waiting for submission':
      tableData.value = cachedData.value.filter(v=>v.status === 'draft')
      break;
    case 'Submitted applications':
      tableData.value = cachedData.value.filter(v=>v.status === 'Submitted')
      break;
    case 'Rejected applications':
      tableData.value = cachedData.value.filter(v=>v.status === 'rejected')
      break;
    case 'Applications to be amended':
      tableData.value = cachedData.value.filter(v=>v.status === 'amended')
      break;
    case 'Approved':
      tableData.value = cachedData.value.filter(v=>v.status === 'Approved')
      break;
    case 'Payment Process':
      tableData.value = cachedData.value.filter(v=>v.status === 'Payment Process')
      break;
    default:
      break;
  }
  paginationData.total = tableData.value.length
}
const getTableData = () => {
  loading.value = false
}
const handleCreate = () => {

  switch(applicationTypeVal.value){
    case 'Good/Service':
      router.push('/form/goodOrService')
      break;
    case 'Trip':
      router.push('/form/trip')
      break;
    case 'Stipend':
      router.push('/form/stipend')
      break;
    default:
      break;
  }
}
function handleReview(index:any,row:any){
  console.log(index);

  const appId = tableData.value[index].applicationId
  router.push({
    path:'/applicationReview',
    query:{
      appId
    }
  })
}

function handleDraft(index:any){
  const appId = tableData.value[index].applicationId
  router.push({
    path:'/form/goodOrService',
    query:{
      appId
    }
  })
}

const handleClickCreateBtn = ()=>{
  // const isExist = tableData.value.findIndex(v=>v.status === 'draft') !== -1
  // if(isExist){
  //   ElMessage({
  //     type:'warning',
  //     duration:2000,
  //     message:"you still have one application that hasn't submit yet ,please fill the table"
  //   })
  //   return
  // }
  dialogVisible.value = true
}

function navigateToTimeline(index:number){
  const appId = tableData.value[index].applicationId
  router.push({
    path:'/timeline',
    query:{
      appId
    }
  })
}

function onReset(){
  tableData.value = cachedData.value
}

const searchEvent = () => {
  const filterVal = String(formInline.content).trim().toLowerCase()
  if (filterVal) {
    const filterRE = new RegExp(filterVal, 'gi')
    const searchProps = ['applicationType', 'subject', 'status','submissionDate','applicationId']
    const rest = cachedData.value.filter(item => searchProps.some(key => String(item[key]).toLowerCase().indexOf(filterVal) > -1))
    tableData.value = rest.map(row => {
      const item = Object.assign({}, row)
      searchProps.forEach(key => {
        item[key] = String(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)

      })
      return item
    })
  } else {
    tableData.value = cachedData.value
  }
}
type Type = 'to be handled' | 'processing' | 'Processed'
const navigateFromHomePage = () =>{
  const type:Type = route.query.type as unknown as Type
  switch (type) {
    case 'to be handled':
      tableData.value =  tableData.value.filter(v=>{
        return v.status ==='draft' || v.status ==='to be amended' || v.status === 'rejected'
      })
      break;
    case 'processing':
      tableData.value =  tableData.value.filter(v=>{
        return v.status ==='Submitted' || v.status === 'amended' || v.status ==='Approved'
      })
      break;
    case 'Processed':
      tableData.value =  tableData.value.filter(v=>{
        return v.status === 'Payment Process'
      })
      break;
    default:
      break;
  }
}

onActivated(()=>{
  console.log('come in!');

})

onMounted(() => {

  const data = getGoodOrServiceCached()
  if(data){
    const applications = data
    let tempArr: ApplicationData[] = []
    applications.forEach(v=>{
      const tempObj:ApplicationData ={
        no: random(0, 100),
        applicationId: v.applicationId,
        applicationType: "Good/Service",
        subject: v.basicForm.subject || '',
        status: v.status,
        submissionDate: v.submitDate,
        rejectReason: v.rejectReason
      }
      tempArr.push(tempObj)
    })
    cachedData.value.push( ...cloneDeep(tempArr))
    tableData.value = tempArr
  }
  navigateFromHomePage()
}),
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <div class="header card" >
      <el-form  :size="'default'" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item >
          <el-select @change="onSelectionChange" v-model="option"  placeholder="Select">
            <el-option  v-for="item in applicationOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item >
          <vxe-input v-model="formInline.content" type="search" placeholder="Global search" @keyup="searchEvent"></vxe-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="onSubmit">Search</el-button> -->
          <el-button type="primary" @click="onReset">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content card" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleClickCreateBtn">Create Application</el-button>
        </div>
      </div>
      <div v-loading="loading" class="table-wrapper">
        <vxe-table
          :data="tableData"
          :column-config="{useKey: true}"
          :row-config="{useKey: true}"
         >
          <vxe-column type="seq" title="No" width="60" />
          <vxe-column type="html" field="applicationId" title="Application ID"  />
          <vxe-column type="html" field="applicationType" title="Application Type"  />
          <vxe-column type="html" field="subject" title="Subject"  ></vxe-column>
          <vxe-column type="html" field="status" title="Status"  >
          </vxe-column>
          <vxe-column type="html" field="submissionDate" title="Submission date" >
          </vxe-column>
          <vxe-column type="html" title="Operations" width="180">
            <template  #default="{ row , rowIndex }">
              <div v-if="row.status != 'draft' " style="display: flex;gap: 10px;align-items: center;">
                <el-button
                    size="small"
                    :type="'primary'"
                    @click="handleReview( rowIndex, row)"
                  >
                  Review
                </el-button>
                <el-button
                    size="small"
                    :type="'success'"
                    @click="navigateToTimeline(rowIndex)"
                  >
                  Progress
                </el-button>
              </div>
              <div v-else >
                <el-button
                    size="small"
                    :type="'success'"
                    @click="handleDraft(rowIndex)"
                  >
                  Draft
                </el-button>
              </div>
            </template>
          </vxe-column>
          <template #empty>
            <el-empty  />
          </template>
        </vxe-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Choose The Application Type !"
      width="30%"
    >
      <el-form :label-width="150" ref="formRef" label-position="left">
        <el-form-item prop="applicationTypeVal" label="Application Type">
          <el-select  v-model="applicationTypeVal" class="m-2" placeholder="Select">
            <el-option  v-for="item in applicationType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="handleCreate">create</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.app-container{
  .search-input:deep(.el-input__inner){
    width: 250px;
  }

  .table-wrapper :deep(.keyword-lighten){
    color: #FFF;
    background-color: rgb(64,158,255);
  }
}
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
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
