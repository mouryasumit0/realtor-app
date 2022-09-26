import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface Userinfo {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user = request.user
  if(!user){
    throw new UnauthorizedException
  }
  return user
  
});
