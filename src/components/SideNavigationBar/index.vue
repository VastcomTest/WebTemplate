<script lang="ts" setup>
import { useState } from '@/hooks/useState';
import { watchEffect , watch, computed, toRefs , ref } from 'vue';
interface Props{
  dataList:{
    title:string,
    clickAction:()=>void,
    top:number,
    paddingLeft?:number
    complete?:boolean
  }[],
  currentTop:number,
  onClick:()=>void,
  review?:boolean
}
const props = defineProps<Props>()
const { show ,currentIndex  } = useState({
  show:false,
  currentIndex:0
})

const onClick = ()=>{
  show.value = !show.value
}

function check(offset:number){
  for (const index in props.dataList) {
    if(props.dataList[index].top -5 <= offset){
      currentIndex.value = Number(index)
    }
  }
}

function navigationOnClick(item: { clickAction: () => void; },index: number){
  props.onClick() ;
  item.clickAction();
}

watch(()=>props,()=>{
  check(props.currentTop)
},{deep:true})

</script>

<template>
  <div   @click="onClick" class="gear" :class="{ 'gear-close':show }">
    <div class="handle-button" >
      <el-icon v-if="!show" :size="20">
        <ArrowLeftBold />
      </el-icon>
      <el-icon  v-else :size="20">
        <ArrowRightBold />
      </el-icon>
    </div>
  </div>
  <div  class="outer-container" :class="{'close':show}">
    <div style="padding-left: 20px;display: flex;line-height: 30px;margin-bottom: 10px;">
      <el-icon v-if="!show" :size="25">
        <Document />
      </el-icon>
      <div style="padding-left: 5px;">Directory</div>
    </div>
    <div class="navigation-container">
      <div :style="{top: 40 * (currentIndex) + 'px'}" class="current-navigation"></div>
      <div
        :style="{paddingLeft:item.paddingLeft ? (50 + item.paddingLeft) +'px' : 50}"
        class="navigation-title"
        :class="{ 'active': index === currentIndex }"
        @click="navigationOnClick(item,index)"
        v-for="(item,index) in dataList"
      >
        <el-text  truncated class="el-text">
          <el-icon v-if="item.title !=='Information for payment' && item.complete && !review" :color="'rgb(103,194,58)'" ><CircleCheckFilled /></el-icon>
          <el-icon v-if="item.title !=='Information for payment' && !item.complete && !review" ><CircleCloseFilled /></el-icon>
          {{ item.title }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gear{
  width: 50px;
  height: 50px;
  position: fixed;
  right: 200px;
  top: calc( 90%);
  background-color: #409CEC;
  color: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  box-shadow: -3px 0px 10px 1px #CDCDCD;
  z-index: 11;
  cursor: pointer;
  transition: all 0.3s;
}
.gear-close{
  right: 0px;
}
.outer-container{
  width: 200px;
  height: calc( 100% - 144px );
  background-color: #FFF;
  box-shadow: 0 0 10px 3px #CDCDCD;
  position: fixed;
  right: 0;
  top: 140px;
  z-index: 10;
  transition: all 0.3s ;
  padding-top: 20px;
  .navigation-container{
    display: flex;
    flex-direction: column;
    padding-left: 0px;
    color: #606266;
    position: relative;
    .current-navigation{
      width: 100%;
      height: 40px;
      background-color: #409CEC;
      position: absolute;
      z-index: -1;
      transition: all  0.1s;
    }
    .navigation-title{
      cursor: pointer;
      height: 40px;
      font-size: 14px;
      padding: 10px;
      padding-left: 50px;
    }
    .navigation-title.active .el-text{
      color: #FFF;
    }
  }
}
.outer-container.close{
    right: -200px;
}


</style>
