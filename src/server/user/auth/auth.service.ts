import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/server/prisma/prisma.service';
import { SignupDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Usertype } from '@prisma/client';

interface SignupParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface SigninParams {
    email: string;
    password: string;
  }
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ name, phone, email, password }: SignupParams, userType: Usertype) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        user_type: userType,
      },
    });
    return this.generateWebToken(user.id, user.name);
  }

  async signin({ email, password }: SigninParams){
    const user = await this.prismaService.user.findUnique({
        where:{
            email
        }
    })
    if(!user){
        throw new HttpException("Invalid credentials", 400)
    } 
     const hashedPassword = user.password;
     const isValidPassword = await bcrypt.compare(password, hashedPassword)

     if(!isValidPassword){
        throw new HttpException("Invalid credentials", 400)
     }

     return this.generateWebToken(user.id, user.name);
  }

  async generateProductKey(email: string, userType: Usertype){
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10)
  }

  private generateWebToken(id: number, name: string){
    return jwt.sign(
        {
          name,
          id
        },
        process.env.JSON_TOKEN_KEY, {
          expiresIn: 36000
        }
      )

  }
}
