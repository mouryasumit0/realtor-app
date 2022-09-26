import { Controller, Delete, Get, Param, Post, Put, Query, ParseIntPipe, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PropertyType, Usertype } from '@prisma/client';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dtos/home.dto';
import { HomeService } from './home.service';
import { User, Userinfo } from 'src/server/user/decorator/user.decorator'
import { AuthGuard } from 'src/server/guards/auth.guards';
import { Roles } from 'src/server/decorators/decorator.roles';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService){}
    @Get("/")
    getAllHomes(@Query('city') city: string, @Query('minPrice') minPrice: string, @Query('maxPrice') maxPrice: string, @Query('propertyType') propertyType: PropertyType,): Promise<HomeResponseDto[]>{
        const price = minPrice || maxPrice ? {
            ...(minPrice && {gte: parseFloat(minPrice)}),
            ...(maxPrice && {lte: parseFloat(maxPrice)})
        }: undefined
        const filters = {
            ...(city && {city}),
            ...(price && {price}),
            ...(propertyType && {propertyType})
        }
        return this.homeService.getAllHomes(filters)
    }

    @Get(':id')
    getHome(@Param("id", ParseIntPipe) id: number) :Promise<HomeResponseDto>{


        return this.homeService.getHome(id);
    }

    @Roles(Usertype.REALTOR)
    @Post()
    createHome(@Body() body : CreateHomeDto, @User() user: Userinfo){
        return this.homeService.createHome(body, user.id)
    }


    @Roles(Usertype.REALTOR)
    @Put(':id')
    async updateHome(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateHomeDto, @User() user: Userinfo){
        const realtor = await this.homeService.getRealtorId(id)
        if(user.id!== realtor.id){
            throw new UnauthorizedException;
        }
        return this.homeService.updateHome(id,body)
    }


    @Roles(Usertype.REALTOR)
    @Delete(':id')
    async deleteHome(@Param('id',ParseIntPipe) id: number,@User() user: Userinfo){
        const realtor = await this.homeService.getRealtorId(id)
        
        if(user.id!== realtor.id){
            throw new UnauthorizedException;
        }

        return this.homeService.deleteHome(id)
    }

}
