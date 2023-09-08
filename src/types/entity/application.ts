export type ApplicationStatus = 'draft' | 'Submitted' | 'rejected' |
                                'amended' | 'Approved' | 'Payment Process' |
                                'Partially Approved' |  'to be amended'
                                | 'amended'

export type ApplicationType = 'Good/Service' | 'Trip' | 'Stipend'

export type ApplicationTypeInForm  =
  'All applications' | 'Waiting for submission' | 'Submitted applications' |
  'Rejected applications' | 'Applications to be amended' | 'Approved'
  | 'Payment Process' | 'Rejected by FO'

export interface ApplicationData {
  no:number
  applicationId: string,
  applicationType:ApplicationType,
  subject:string,
  status:ApplicationStatus,
  submissionDate:string,
  rejectReason:string
}

