export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user?: any;
}