export interface UserAttributes {
    id: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Username: string;
    EncryptedPassword: string;
    /* Salt: Buffer; */
}
export interface UserCreationAttributes extends Omit<UserAttributes, "id"> {}
