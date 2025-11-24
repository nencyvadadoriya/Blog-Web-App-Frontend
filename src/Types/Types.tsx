export  interface LoginBody{
    email : string,
    password : string
}

export interface RegisterUserBody{
    name : string,
    email : string,
    password : string,
    gender : string,
    about : string,
    profile_image : File  | null 
}

export interface OtpverifyPayload{
    email : string,
    OTP : string
}