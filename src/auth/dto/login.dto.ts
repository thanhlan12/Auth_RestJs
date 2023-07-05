import {IsNotEmpty,IsEmail,IsString} from 'class-validator';




export class LoginDto{
    @IsNotEmpty()
    @IsEmail({},{message:'Enter your email'})
    readonly email:string;

    @IsNotEmpty()
    @IsString()
    readonly password:string;

}


