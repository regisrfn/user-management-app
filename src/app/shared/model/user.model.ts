export class User {
    active = true
    authorities: string[] | undefined
    createdAt: string | undefined
    email: string | undefined
    firstName: string | undefined
    info: string | undefined
    lastLoginDate: string | undefined
    lastName: string | undefined
    locked = false
    role = "ROLE_USER"
    userId: string | undefined
    userNo: string | undefined
    username: string | undefined
    password:string | undefined
    image: string | undefined
}
