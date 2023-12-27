export interface Permission {
    id: number;
    group: string;
    action: string;
    value: string;
    description?: string;
}