export interface UserAttributes {
    id: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Username: string;
    EncryptedPassword: string;
    RoleId: number;
    /* Salt: Buffer; */
}
export type UserCreationAttributes = Omit<UserAttributes, 'id'>;
