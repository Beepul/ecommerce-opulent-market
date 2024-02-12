export type ResponseError = {
    data?: {
        message?: string;
        stack?: string;
    },
    status: number;
}