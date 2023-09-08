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
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { storeToRefs } from "pinia"
import { PaymentMethodCached } from "@/types/entity/goodOrService"
import { getGoodOrServiceCached, GoodOrService, setGoodOrServiceCached } from "@/utils/cache/local-storage"
import CacheKey from "@/constants/cache-key"
import { onUpdated } from "vue"
import { onActivated } from "vue"
import { applicationStatusSelectionForFO } from '@/constants/selection'
import { ShareLogic } from "../shareLogic"
defineOptions({
  // 命名当前组件
  name: "ApplicationForFO",
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter()
const route = useRoute()
const { roles  } = storeToRefs(useUserStore())
const { tableData, cachedData,applicationOptions,rejectReason, option,dialogVisible ,currentRow } = useState({
  tableData: [] as  ApplicationData[],
  cachedData: [] as ApplicationData[],
  option: "All applications" as ApplicationTypeInForm,
  applicationOptions: applicationStatusSelectionForFO,
  dialogVisible:false,
  currentRow:{} as ApplicationData,
  rejectReason:''
})
const shareLogic = new ShareLogic(cachedData,tableData,paginationData)
const formInline = reactive({
  status:'',
  content:''
})

const getTableData = () => {
  loading.value = false
}

function handlePrint(index:number){
  window.print()
  // ElMessage({
  //   message:`row - ${index+1} has been printed successfully`
  // })
}


type Type = 'to be handled' | 'processing' | 'Processed'
const navigateFromHomePage = () =>{
  const type:Type = route.query.type as unknown as Type
  switch (type) {
    case 'to be handled':
      tableData.value =  tableData.value.filter(v=>{
        return v.status === 'Approved' || v.status ==='amended'
      })
      break;
    case 'Processed':
      tableData.value =  tableData.value.filter(v=>{
        return v.status === 'rejected' || v.status === 'Payment Process'
      })
      break;
    default:
      break;
  }
}

onMounted(() => {
  const data = getGoodOrServiceCached()
  if(data){
    const applications = data
    let tempArr: ApplicationData[] = []
    applications.forEach(v=>{
        if(v.status==='Approved' || v.status=== 'to be amended' || v.status ==='amended' || v.status ==='Payment Process'){
        const tempObj:ApplicationData ={
          no: random(0, 100),
          applicationId: v.applicationId,
          applicationType: "Good/Service",
          subject: v.basicForm.subject,
          status: v.status,
          submissionDate: v.submitDate,
          rejectReason: v.rejectReason
        }
        tempArr.push(tempObj)
        }
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
    <div shadow="never">
      <div class="toolbar-wrapper card">
        <el-form  :size="'default'" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item >
            <el-select @change="shareLogic.onSelectionChange(option)" v-model="option"  placeholder="Select">
              <el-option  v-for="item in applicationOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item >
            <vxe-input v-model="formInline.content" type="search" placeholder="Global search" @keyup="shareLogic.searchEvent(formInline.content)"></vxe-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" @click="onSubmit">Search</el-button> -->
            <el-button type="primary" @click="shareLogic.onReset">Reset</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="loading" style="padding-bottom: 30px;" class="table-wrapper card">
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
          <vxe-column type="html" title="Operations" width="250">
            <template  #default="{ row , rowIndex }">
              <div v-if="row.status != 'draft' " style="display: flex;gap: 10px;align-items: center;">
                <el-button
                    size="small"
                    :type="'primary'"
                    @click="shareLogic.handleReviewApplication( rowIndex, row)"
                  >
                  Review
                </el-button>
                <el-button
                    size="small"
                    :type="'success'"
                    @click="shareLogic.navigateToTimeline(rowIndex,router)"
                  >
                  Progress
                </el-button>
                <el-button
                    size="small"
                    :type="'success'"
                    @click="handlePrint(rowIndex)"
                  >
                  Print
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
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
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
