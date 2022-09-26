import { Usertype } from "@prisma/client";
import { SetMetadata } from '@nestjs/common'
 
export const Roles = (...roles: Usertype[])=>SetMetadata('roles',roles)