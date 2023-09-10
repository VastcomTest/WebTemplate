import { InformationForPayment } from '@/types/entity/goodOrService';
import { useThrottleFn } from "@vueuse/core";
import { nextTick, Ref } from "vue";
import { useState } from "./useState";
import { log } from "console";

type DataList = {
  title:string,
  clickAction:()=>void,
  top:number,
  paddingLeft?:number,
  complete:boolean
}[]

export function useSideNavigationBar( temp?:DataList){
    const { dataList , container ,paymentContainer ,
       reimbursementContainer , informationForPaymentContainer ,
       paymentRefs,currentTop, lock
    } = useState({
      dataList:temp ?? [] as DataList,
      container:{} as HTMLDivElement,
      paymentContainer:{} as HTMLDivElement,
      reimbursementContainer:{} as HTMLDivElement,
      informationForPaymentContainer:{} as HTMLDialogElement,
      paymentRefs:[] as HTMLDivElement[],
      currentTop:0,
      lock:false
    })

    const onClick = ()=> {
      lock.value  = true
      setTimeout(()=>{
        lock.value = false
      },200)
    }


    async function getTopOfAllForm( paymentTableData:any ){
      await nextTick()
      // baseInfo
      dataList.value.push({
        title:'BaseInfo',
        clickAction:()=>{
          container.value?.parentElement?.scrollTo({
            'behavior':'smooth',
            'top':0
          })
        },
        top:0,
        complete:false
      })
      // payment
      //const payment = useElementBounding(paymentContainer.value)
      let offsetPayment = paymentContainer.value?.offsetTop! - 180
      dataList.value.push({
        title:'Payment',
        clickAction:() => {
          container.value?.parentElement?.scrollTo({
            behavior:'smooth',
            top:offsetPayment
          })
        },
        top:offsetPayment,
        complete:false
      })

      let offsetReim = reimbursementContainer.value?.offsetTop!
      dataList.value.push({
        title:'Reimbursement',
        clickAction:() => {
          container.value?.parentElement?.scrollTo({
            behavior:'smooth',
            top:offsetReim
          })
        },
        top:offsetReim,
        complete:false
      })


      let offsetInfo = informationForPaymentContainer.value?.offsetTop!
      dataList.value.push({
        title:'Information for payment',
        clickAction:() => {
          container.value?.parentElement?.scrollTo({
            behavior:'smooth',
            top:offsetInfo
          })
        },
        top:offsetInfo,
        paddingLeft:20,
        complete:false
      })

      paymentRefs.value.forEach((v,index)=>{
        dataList.value.push({
          title:  paymentTableData[index].payeeName,
          clickAction: ()=>{
            container.value?.parentElement?.scrollTo({
              behavior:'smooth',
              top:paymentRefs.value[index].offsetTop - 120,
            })
          },
          top:paymentRefs.value[index].offsetTop,
          paddingLeft:17,
          complete:false
        })
      })


    }

    async function reMeasure(informationForPayment:InformationForPayment[]){
      await nextTick()
      // cache finish status
      const statusMap = new Map()
      dataList.value.forEach(v=>{
        statusMap.set(v.title,v.complete)
      })
      dataList.value = []
      // basic info
      dataList.value.push({
        title:'BaseInfo',
        clickAction:()=>{
          container.value?.parentElement?.scrollTo({
            'behavior':'smooth',
            'top':0
          })
        },
        complete:statusMap.get('BaseInfo'),
        top:0
      })
      // payment
      let offsetPayment = paymentContainer.value?.offsetTop! - 180
      dataList.value.push({
        title:'Payment',
        top:offsetPayment,
        clickAction:()=>{
          container.value?.parentElement?.scrollTo({
            behavior:'smooth',
            top:offsetPayment
          })
        },
        complete:statusMap.get('Payment')
      })

      let offsetReim = reimbursementContainer.value?.offsetTop!
      dataList.value.push({
        title:'Reimbursement',
        top:offsetReim,
        clickAction:()=>{
          container.value?.parentElement?.scrollTo({
            behavior:'smooth',
            top:offsetReim
          })
        },
        complete:statusMap.get('Reimbursement')
      })

      let offsetInfo = informationForPaymentContainer.value?.offsetTop!
      dataList.value.push({
        title:'Information for payment',
        top:offsetInfo,
        clickAction:()=>{
          container.value?.parentElement?.scrollTo({
            behavior:'smooth',
            top:offsetInfo,
          })
        },
        complete:statusMap.get('Information for payment'),
        paddingLeft:20
      })

      for (let i = 0; i < informationForPayment.length; i++) {
        if(informationForPayment[i].bankInformationVal === 'Information provided in the past') continue
        const offset = paymentRefs.value[i].offsetTop - 120
        dataList.value.push({
          title:informationForPayment[i].payee,
          top:offset,
          clickAction:()=>{
            container.value?.parentElement?.scrollTo({'behavior':'smooth',top:offset})
          },
          paddingLeft:17,
          complete:statusMap.get(informationForPayment[i].payee)
        })
      }


    }


    const throttledFn = useThrottleFn((offset)=>{
      if(lock.value) return
      currentTop.value = offset
    },16.6)

    function observeOnScroll(){
        container.value.parentElement.onscroll = (handler: any)=>{
          // @ts-ignore
          throttledFn(container.value?.parentElement?.scrollTop)
          return null
        }
    }

    return {
      dataList,
      container,
      paymentContainer,
      reimbursementContainer,
      informationForPaymentContainer,
      paymentRefs,
      currentTop,
      lock,
      onClick,
      getTopOfAllForm,
      observeOnScroll,
      reMeasure
    }
}
