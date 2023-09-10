import { InformationForPayment } from '@/types/entity/goodOrService';
import { useState } from "@/hooks/useState";

export function useInfoForPayment(){
  const { informationForPaymentTableData } = useState({
    informationForPaymentTableData:[
      {
        payee:'Company A',
        bankInformationVal:'Latest Information to be provided',
        bankInformationType:[{
          value:'Latest Information to be provided',
          label:'Latest Information to be provided'
        },{
          value:'Information provided in the past',
          label:'Information provided in the past'
        }],
        paymentMethodVal:'Telegraphic transfer (Non-local payee)',
        paymentMethodType:[{
          label:'Telegraphic transfer (Non-local payee)',
          value:'Telegraphic transfer'
        },{
          label:'Auto-pay (Local payee)',
          value:'Auto-pay'
        },{
          label:'Cheque/Cashier Order (Local payee)',
          value:'Cheque/Cashier Order'
        },{
          label:'Bank Draft (Non-local payee)',
          value:'Bank Draft'
        }]
      }
    ] as InformationForPayment[]
  })

  function createPaymentMethod(){
    return {
        payee:'Company A',
        bankInformationVal:'Latest Information to be provided',
        bankInformationType:[{
          value:'Latest Information to be provided',
          label:'Latest Information to be provided'
        },{
          value:'Information provided in the past',
          label:'Information provided in the past'
        }],
        paymentMethodVal:'Telegraphic transfer (Non-local payee)',
        paymentMethodType:[{
          label:'Telegraphic transfer (Non-local payee)',
          value:'Telegraphic transfer'
        },{
          label:'Auto-pay (Local payee)',
          value:'Auto-pay'
        },{
          label:'Cheque/Cashier Order (Local payee)',
          value:'Cheque/Cashier Order'
        },{
          label:'Bank Draft (Non-local payee)',
          value:'Bank Draft'
        }]
    }
  }


  return {
    informationForPaymentTableData,
    createPaymentMethod
  }
}
