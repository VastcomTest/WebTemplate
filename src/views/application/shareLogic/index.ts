import { ApplicationTypeInForm } from "@/types/entity/application"
import { getRole } from "@/utils/cache/local-storage";
import { Ref, ref } from "vue"


class ShareLogic {
  private cachedData!: Ref<any[]>
  private tableData!: Ref<any[]>
  private paginationData:any;

  constructor(cachedData: Ref<any[]>,tableData: Ref<any[]>,paginationData: any){
    this.cachedData = cachedData
    this.tableData = tableData,
    this.paginationData = paginationData
  }

  searchEvent(content:string){
    const filterVal = String(content).trim().toLowerCase()
    if (filterVal) {
      const filterRE = new RegExp(filterVal, 'gi')
      const searchProps = ['applicationType', 'subject', 'status','submissionDate','applicationId']
      const rest = this.cachedData.value.filter(item => searchProps.some(key => String(item[key]).toLowerCase().indexOf(filterVal) > -1))
      this.tableData.value = rest.map(row => {
        const item = Object.assign({}, row)
        searchProps.forEach(key => {
          item[key] = String(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
        })
        return item
      })
    } else {
      this.tableData.value = this.cachedData.value
    }
  }

  navigateToTimeline(index:number,router:any){
    const appId = this.tableData.value[index].applicationId
    router.push({
      path:'/timeline',
      query:{
        appId
      }
    })
  }

  onSelectionChange (v:ApplicationTypeInForm){
    switch (v) {
      case 'All applications':
        this.tableData.value = [...this.cachedData.value]
        break;
      case 'Waiting for submission':
        this.tableData.value = this.cachedData.value.filter(v=>v.status === 'draft')
        break;
      case 'Submitted applications':
        this.tableData.value = this.cachedData.value.filter(v=>v.status === 'Submitted')
        break;
      case 'Rejected applications':
        this.tableData.value = this.cachedData.value.filter(v=>v.status === 'rejected')
        break;
      case 'Applications to be amended':
        this.tableData.value = this.cachedData.value.filter(v=>v.status === 'amended')
        break;
      case 'Approved':
        this.tableData.value = this.cachedData.value.filter(v=>v.status === 'Approved')
        break;
      case 'Payment Process':
        this.tableData.value = this.cachedData.value.filter(v=>v.status === 'Payment Process')
        break;
      default:
        break;
    }
    this.paginationData.total = this.tableData.value.length
  }

  onReset(){
    this.tableData.value = this.cachedData.value
  }

  handleReviewApplication(index:any,router:any){
    const appId = this.tableData.value[index].applicationId
    const role = getRole()
    const map = {
      'user':'applicationReview',
      'approver':'approve',
      'FO':'approveForFO'
    }
    router.push({
      path:map[role],
      query:{
        appId
      }
    })
  }
}

export {
  ShareLogic
}


