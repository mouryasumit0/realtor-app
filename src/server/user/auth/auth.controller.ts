import { Controller, Get, Post, Body, Param, ParseEnumPipe, UnauthorizedException } from '@nestjs/common';
import { Usertype } from '@prisma/client';
import { SignupDto, SigninDto, GenerateProductKeyDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { User, Userinfo } from '../decorator/user.decorator';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('signup/:userType')
    async signup(@Body() body: SignupDto, @Param("userType", new ParseEnumPipe(Usertype)) userType: Usertype ){

        if(userType !== Usertype.BUYER){
            if(!body.productKey){
                throw new UnauthorizedException();
            }
        }
        const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
        const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey)
        if(!isValidProductKey){
            throw new UnauthorizedException();
        }
        return this.authService.signup(body,userType);
    }

    
    @Post('signin')
    signin(@Body() body: SigninDto){
        return this.authService.signin(body)
    }

    @Post('key')
    generateProductKey(@Body() {email, userType}: GenerateProductKeyDto){
        return this.authService.generateProductKey(email, userType)
    }

    @Get('me')
    me(@User() user: Userinfo){
        return user
    }
}
