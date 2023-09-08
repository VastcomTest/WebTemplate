import { useState } from "@/hooks/useState";
import { AutoPay, BankDraft, CashierOrder, TelegraphicTransfer } from "@/types/entity/goodOrService";
import { defineStore } from "pinia";


export const usePaymentMethodStore = defineStore('paymentMethod',()=>{

  const { paymentMethodCached ,submitFn } = useState({
    paymentMethodCached:[] as {
      telegraphicTransfer:TelegraphicTransfer,
      cashierOrder:CashierOrder,
      bankDraft:BankDraft,
      autoPay: AutoPay
    }[],
    submitFn:[] as {
      telegraphicTransfer: ()=>{},
      cashierOrder:()=>{},
      bankDraft:()=>{},
      autoPay:()=>{}
    }[],

  })
  const paymentMethodHistoryCached = new Map()
  return {
    paymentMethodCached,
    submitFn,
    paymentMethodHistoryCached
  }
})
