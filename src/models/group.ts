import { Identity } from "@/enums/identity";

export interface Group {
    id: number;
    name: string;
    description?: string;
    lastSyncedAt: Date;
    identity: Identity;
    identityGroupId?: string;
    roleId: number;
    createdByUsername?: string;
    createdAt?: Date;
    updatedByUsername?: string;
    updatedAt?: Date;
}