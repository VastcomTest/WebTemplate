export interface Role {
    id: number;
    name: string;
    description?: string;
    lastUpdatedAt: Date;
    createdByUsername?: string;
    createdAt?: Date;
    updatedByUsername?: string;
    updatedAt?: Date;
}