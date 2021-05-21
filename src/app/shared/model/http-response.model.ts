export interface HttpResponse {
    errors: {
        email: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
        locked: string | undefined;
        role: string | undefined;
        userId: string | undefined;
        userNo: string | undefined;
        username: string | undefined;
        password: string | undefined;
    };
    httpStatus: number;
    httpStatusCode: number;
    message: string;
    reason: string;
    timestamp: string
}
