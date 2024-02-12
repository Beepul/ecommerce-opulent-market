export type User = {
    _id: string;
    accessToken: string;
    email: string;
    role: 'customer' | 'admin';
    pic: string;
    name: string;
}

export type LoginRegisterData = {
    name?: string;
    email: string;
    password: string;
    cPassword?: string;
}