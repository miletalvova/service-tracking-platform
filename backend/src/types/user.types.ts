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
export interface UserCreationAttributes extends Omit<UserAttributes, "id"> {}
