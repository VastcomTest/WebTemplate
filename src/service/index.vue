<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table"
import { type GetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
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
defineOptions({
  // 命名当前组件
  name: "Application",

})


const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter()
const { roles  } = storeToRefs(useUserStore())
const { tableData, cachedData,applicationOptions, option ,applicationType, applicationTypeVal ,dialogVisible } = useState({
  tableData: [] as unknown as ApplicationData[],
  cachedData: [] as any[],
  option: "All applications",
  applicationOptions: [
{
value: "All applications",
label: "All applications"
},
{
value: "Waiting for submission",
label: "Waiting for submission"
},
{
value: "Submitted applications",
label: "Submitted applications"
},
{
value: "Applications rejected by FO",
label: "Applications rejected by FO"
},
{
  value: "Applications to be amended",
  label: "Applications to be amended"
},
{
value: "Approved",
label: "Approved"
},
{
  value:'Payment Process',
  label:'Payment Process'
}
  ] as unknown as [{value:ApplicationTypeInForm, label:ApplicationTypeInForm}],
  applicationTypeVal: 'Good/Service',
  applicationType:[{
    label:'Good/Service',
    value:'Good/Service',
  },{
    label:'Trip',
    value:'Trip'
  },{
    label:'Stipend',
    value:'Stipend'
  }],
  dialogVisible:false,
})

const getTableData = () => {
  loading.value = false
}

function handleApprove(index:any,row:any){

  cachedData.value.forEach((v,i)=>{
    if(v.applicationId === row.applicationId){
      v.status = 'Approved'
    }
  })
  tableData.value.forEach(v=>{
    if(v.applicationId === row.applicationId){
      v.status = 'Approved'
    }
  })

  localStorage.setItem("Good/Service",JSON.stringify(cachedData.value))
  ElMessage('approved successfully')
}

function handleReviewApplication(index:any,row:any){
  const appId = tableData.value[index].applicationId
  router.push({
    path:'/applicationReview',
    query:{
      appId
    }
  })
}


function handleReject(index:any,row:any){
  cachedData.value.forEach((v,i)=>{
    if(v.applicationId === row.applicationId){
      v.status = 'rejected'
    }
  })
  tableData.value.forEach(v=>{
    if(v.applicationId === row.applicationId){
      v.status = 'rejected'
    }
  })
  localStorage.setItem("Good/Service",JSON.stringify(cachedData.value))
  ElMessage('rejected successfully')
}

//#endregion

onMounted(() => {
  const data = localStorage.getItem('Good/Service')
  if(data){
    const applications:[] = JSON.parse(data)
    let tempArr: any[] = []
    console.log(applications);

    applications.forEach(v=>{
      if(v.status === 'Submitted' || v.status === 'Approved'){
        const tempObj:ApplicationData ={
          no: random(0, 100),
          applicationId: v.applicationId,
          applicationType: "Good/Service",
          subject: v.basicForm.subject,
          status: v.status,
          submissionDate: v.submitDate
        }
        tempArr.push(tempObj)
    }
    })
    cachedData.value.push( ...cloneDeep(applications))
    tableData.value = tempArr
  }
}),
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card shadow="never">
      <div v-loading="loading" class="table-wrapper">
        <el-table row-key="no" :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" label="No" width="50" />
          <el-table-column prop="applicationId" label="Application ID" align="center" />
          <el-table-column prop="applicationType" label="Application Type" align="center" width="150" />
          <el-table-column prop="subject" label="Subject" align="center" />
          <el-table-column prop="status" label="Status" align="center">
            <template #default="scope">
              <div style="display: flex; align-items: center;justify-content: center;padding: 0 12px;">
                <span style="margin-left: 10px">{{ scope.row.status }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="submissionDate" label="Submission date" align="center" width="150"/>
          <el-table-column label="Operations" width="250">
            <template  #default="scope">
              <div  >
                <el-button
                  v-if="scope.row.status === 'Submitted' "
                  size="small"
                  type="primary"
                  @click="handleApprove(scope.$index, scope.row)"
                >
                approve
                </el-button>
                <el-button
                  v-if="scope.row.status === 'Submitted' "
                  size="small"
                  :type="'danger'"
                  @click="handleReject(scope.$index, scope.row)"
                >
                reject
                </el-button>
                <el-button
                  size="small"
                  type="success"
                  @click="handleReviewApplication(scope.$index, scope.row)"
                >
                check
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
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
