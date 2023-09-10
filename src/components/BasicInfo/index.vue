<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { BaseInfo } from '@/types/entity/goodOrService';

interface indexProps {
  fileTableData:any,
  basicFormRule:any,
  basicForm:BaseInfo,
  brNoRestrict:(v:string)=>void,
}
const { fileTableData } = defineProps<indexProps>()
const {} = useState({

})
onMounted(()=>{

})

</script>
<template>
  <el-card  shadow="never" class="application-base-info" style="margin-bottom: 20px;">
    <div style="width: 70%;flex-direction: column;">
      <div style="display: flex;justify-content: space-between;">
          <h4 style="font-size: 20px;" >Basic Info</h4>
          <div class="item" style="display: flex;align-items: center;">
              <div style="margin-right: 20px;">Passport / ID Copy</div>
              <el-upload
                  v-model:file-list="fileTableData.passportOrIDCopy"
                  class="upload-demo"
                  style="display:flex;align-items:center"
                  multiple
                  :auto-upload="false"
                >
                <el-icon ><Paperclip /></el-icon>
              </el-upload>
          </div>
        </div>
      <el-form
        ref="basicFormRef"
        :rules="basicFormRule"
        :model="basicForm"
        class="demo-basicForm"
        label-position="left"
        label-width="170px"
        status-icon
      >
        <div style="display: flex;justify-content: space-between;">
          <el-form-item   label="Date" prop="date" style="margin-right: 20px;">
            <el-input  :disabled="true" size="small" v-model="basicForm.date" />
          </el-form-item>
          <el-form-item label="Staff Name" prop="staffName">
            <el-input  :disabled="true"  size="small" v-model="basicForm.staffName" />
          </el-form-item>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <el-form-item label="BR No" prop="brNo" style="margin-right: 20px;" >
            <el-input @input="brNoRestrict" size="small" v-model="basicForm.brNo" />
          </el-form-item>
          <el-form-item label="Alternate Contact Person" prop="alternateContactPerson">
            <el-input  size="small" v-model="basicForm.alternateContactPerson" />
          </el-form-item>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <el-form-item label="Funding Source" prop="fundingSourceVal" style="margin-right: 20px;">
            <el-select  size="small" v-model="basicForm.fundingSourceVal"  placeholder="Select" >
              <el-option
                v-for="item in basicForm.fundingSource"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Faculty / Department " prop="facultyOrDepartmentVal" >
            <el-select  size="small" v-model="basicForm.facultyOrDepartmentVal"  placeholder="Select" >
              <el-option
                v-for="item in basicForm.facultyOrDepartment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="Subject" prop="subject">
            <el-input size="small" v-model="basicForm.subject" />
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<style lang='scss' scoped>
.container{

}
</style>
