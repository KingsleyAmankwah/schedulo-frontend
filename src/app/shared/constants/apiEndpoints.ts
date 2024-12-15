import { environment } from '../../../environments/environment';

const BASE_URL = environment.BASE_URL;
export const auth = `${BASE_URL}/auth`;
export const events = `${BASE_URL}/events`;
export const availability = `${BASE_URL}/availability`;
export const meeting = `${BASE_URL}/public`;
export const user = `${BASE_URL}/user`;
