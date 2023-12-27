import { IdpTaskStatus } from "@core/enums/idp-task-status";

export interface IdpTaskDetail {
    taskSn: string;
    taskName: string;
    status: IdpTaskStatus;
    createAt: Date;
    externalLink: string;
}