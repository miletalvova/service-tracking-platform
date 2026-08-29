import type { User } from '../types/user';
import api from "./axios";

export async function getCustomers(): Promise<User[]> {
    const response = await api.get('/api/users/customers');
    return response.data.data;
}