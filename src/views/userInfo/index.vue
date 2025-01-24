<script lang="ts" setup>
import { useState } from '@/hooks/useState';
import { IService } from '@/service';
import { log } from 'console';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { random } from 'xe-utils';
//@ts-ignore
import QRCode from 'qrcode';
import { http } from '@/api/config';
import { uniqueId } from 'lodash-es';
import { randomUUID } from 'crypto';
const {role , iconStyle ,date, metadata, icon, ir , white, status ,loading, qrCode, chip } = useState({
  role:'',
  iconStyle:{},
  date:undefined as unknown as Date,
  metadata: "",
  icon: "",
  ir:"",
  white: "",
  status: "disconnected",
  loading: true,
  qrCode: "",
  chip: ""
})
const router = useRouter()
const uuid = ref<string>("")
let ws:WebSocket;
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
async function generateQRCode(jsonStr:string)  {
  try {
    qrCode.value = await QRCode.toDataURL(jsonStr);
  } catch (error) {
    console.error('Invalid JSON:', error);
    qrCode.value = '';
  }
}
async function uploadFile (base64String:string)  {
  try {
    // 將 Base64 字符串轉換為二進制數據
    const base64Data = base64String.split(",")[1];

    // 2. 將 Base64 字符串轉換為二進制數據
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 3. 創建 Blob 物件
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // 4. 使用 FormData 封裝 Blob
    const formData = new FormData();
    formData.append('Image', blob, 'uploaded_image.jpg'); // 'file' 是 API 的參數名稱
    //@ts-ignore
    formData.append('UUID', uuid.value);
    fetch('https://10.173.1.57:7443/api/v1/reader/create', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    
  } catch (error) {
      console.error('Error uploading file', error);
  }
}

const num = random(1,30)

function setDefaultSettings() {
  // let request = {
  //   Type: "Request",
  //   Commands: [
  //     {Command:"Set", Operand:"RFID", Param:"Y"}, /* 设置识别芯片信息 */
  //     {Command:"Set", Operand:"VIZ", Param:"Y"}   /* 设置识别版面信息 */
  //   ]
  // };
  let request = {
    Type: "Request",
    Commands: [
      {Command:"Set", Operand:"RFID", Param:"True"}, /* 设置识别芯片信息 */
      {Command:"Set", Operand:"VIZ", Param:"True"}   /* 设置识别版面信息 */
    ]
  };
  
  sendJson(request);
}

function getWebConstants() {
  let request = {
    Type: "Request",
    Commands: [
      {Command:"Get", Operand:"WebConstant", Param:"CardRecogSystem"},
      {Command:"Get", Operand:"WebConstant", Param:"Connect"},
      {Command:"Get", Operand:"WebConstant", Param:"Disconnect"},
      {Command:"Get", Operand:"WebConstant", Param:"Save"},
      {Command:"Get", Operand:"WebConstant", Param:"IDCANCEL"},
      {Command:"Get", Operand:"WebConstant", Param:"DeviceStatus"},
      {Command:"Get", Operand:"WebConstant", Param:"DeviceName"},
      {Command:"Get", Operand:"WebConstant", Param:"DeviceSerialno"},
      {Command:"Get", Operand:"WebConstant", Param:"DeviceNotConnected"},
      {Command:"Get", Operand:"WebConstant", Param:"DescOfWebsocketError"},
      {Command:"Get", Operand:"WebConstant", Param:"DescFailSetRFID"},
      {Command:"Get", Operand:"WebConstant", Param:"DescFailSetVIZ"},
      {Command:"Get", Operand:"WebConstant", Param:"PlaceHolderCardTextInfo"},
      {Command:"Get", Operand:"WebConstant", Param:"DeviceOffLine"},
      {Command:"Get", Operand:"WebConstant", Param:"DeviceReconnected"},
      {Command:"Get", Operand:"WebConstant", Param:"DescFailSendWebsocket"},
      {Command:"Get", Operand:"WebConstant", Param:"WebDescDeviceNotFound"},
      {Command:"Get", Operand:"WebConstant", Param:"WebDescRequireRestartSvc"},
      {Command:"Get", Operand:"WebConstant", Param:"WebDescAskForSupport"},
      {Command:"Get", Operand:"WebConstant", Param:"WebDescRequireReconnect"},
      {Command:"Get", Operand:"WebConstant", Param:"DeviceConnected"}
    ]
  };
  
  sendJson(request);
}

function setDGContent() {
  var request = {
    Type: "Request",
    Command: "Set",
    Operand: "DGSource"
  };		
  sendJson(request);
}

function sendJson(jsonData:any) {
  try {
    if (ws !== null) {
      ws.send(JSON.stringify(jsonData));
    }
  } catch (exception) {
    //document.getElementById("msg").innerHTML = strDescFailSendWebsocket;
  }
}

onMounted(() => {
  // @ts-ignore
  role.value = "TEST"
  ws = new WebSocket('ws://127.0.0.1:90/echo')
  ws.onmessage = (e) => {
    console.log("Msg from server: ");
    let data = JSON.parse(e.data);
    console.log(data);
    
    // CardContentText
    if(data.Operand === "CardContentText"){
      let uuidT = generateUUID()
      uuid.value = uuidT
      data.Param.UUID = uuidT
      metadata.value = data.Param;
      generateQRCode(JSON.stringify(data.Param))
    }
    // Images
    if(data.Operand === "Images"){
      uuid.value = uuid.value
      ir.value = data.Param.IR;
      icon.value = data.Param.OcrHead
      white.value = data.Param.White
      loading.value = false
      chip.value = data.Param.ChipHead
      //uploadFile(data.Param.IR)
    }
  }

  ws.onopen = (e) => {
    console.log("Connected to server");
    
    status.value = "connected"

    getWebConstants();
						
    setDefaultSettings();

    /*设置获取DG源信息*/
    setDGContent(); 
  }
})

</script>

<template>
  <v-container class="app-container">
    <div >
      <v-row style="margin-bottom: 10px;">
        <div>Status:</div>
        <div>{{ status }}</div>
      </v-row>
      <v-col v-if="!loading">
        <v-row style="margin-bottom: 10px;">
          <div>JSON:</div>
          <div>{{ metadata }}</div>
        </v-row>
        <v-row>
          <div>QRCode</div>
          <div>
            <img class="img" :src="qrCode" />
          </div>
        </v-row>
        <v-row>
          <div>ID Card</div>
          <div>
            <img class="img" :src="ir" />
          </div>
        </v-row>
        <v-row>
          <div>Icon</div>
          <div>
            <img class="img" :src="icon" />
          </div>
        </v-row>
        <v-row>
          <div>White</div>
          <div>
            <img class="img" :src="white" />
          </div>
        </v-row>
        <v-row>
          <div>CHIP</div>
          <div>
            <img class="img" :src="chip" />
          </div>
        </v-row>
      </v-col>
      <v-col>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-col>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
.app-container{
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 40px;
  .img{
    width: 400px;
    height: 200px;
    object-fit: contain;
  }
}
</style>
@/service