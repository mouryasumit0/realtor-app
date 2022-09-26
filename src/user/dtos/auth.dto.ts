import { Usertype } from '@prisma/client';
import {IsNotEmpty, IsString, IsEmail, MinLength, Matches, IsEnum, IsOptional} from 'class-validator'


export class SignupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
        message: "Phone must be a valid phone number"
    }) 
    phone: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    productKey?: string

}

export class SigninDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    password: string;
}

export class GenerateProductKeyDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(Usertype)
    userType: Usertype

}