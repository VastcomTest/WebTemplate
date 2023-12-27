export interface UserAuth {
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    nickName?: string;
    chineseName?: string;
    roleIds: number[];
    permissions: string[];
    documentPermissions: string[];
    token: string;
    refreshToken: string;
    localAccount: boolean;
    oktaAccount: boolean;
    oktaAccountId?: string;
    requireChangePassword: boolean;
}