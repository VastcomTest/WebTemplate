export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    nickName?: string;
    chineseName?: string;
    requireChangePassword: boolean;
    passwordNeverExpire: boolean;
    passwordExpiresAt: Date;
    passwordChangedAt: Date;
    emailConfirmed: boolean;
    systemAccount: boolean;
    localAccount: boolean;
    azureAccountId?: string;
    azureAccount: boolean;
    oktaAccountId?: string;
    oktaAccount: boolean;
    locked: boolean;
    terminateAt: Date;
    createdByUsername?: string;
    createdAt?: Date;
    updatedByUsername?: string;
    updatedAt?: Date;
}