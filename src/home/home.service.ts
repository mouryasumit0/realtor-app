import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeResponseDto } from './dtos/home.dto';

interface CreateHomeParams{
        address: string;
        numberOfBedroom:number;
        numberOfBathroom:number;
        city :string;
        price:number;
        landSize:number;
        propertyType:PropertyType;  
        images: {url: string}[]
    
}

interface UpdateHomeParams{
    address?: string;
    numberOfBedroom?:number;
    numberOfBathroom?:number;
    city?:string;
    price?:number;
    landSize?:number;
    propertyType?:PropertyType;

}

@Injectable()
export class HomeService {
    constructor(private readonly prismaService: PrismaService){}
    async getAllHomes(filters: { propertyType: PropertyType; price: { lte: number; gte: number; }; city: string; }): Promise<HomeResponseDto[]>{
        const homes = await this.prismaService.home.findMany({
            where:filters,
            select:{
                id: true,
                address: true,
                city: true,
                price: true,
                number_of_bedroom: true,
                number_of_bathroom: true,
                listed_date: true,
                land_size: true,
                property_type: true,
                images: {
                    select:{
                        url: true,
                    },
                    take: 1
                }


            }
        })
        return homes.map((home)=>{
            const fetchHome = {...home, image:home.images[0].url}
            delete fetchHome.images
            return new HomeResponseDto(fetchHome)
        })
}

    async getHome(id: number) : Promise<HomeResponseDto>{
        const home = await this.prismaService.home.findUnique({
            where:{
                id
            },select:{
                id: true,
                address: true,
                city: true,
                price: true,
                number_of_bedroom: true,
                number_of_bathroom: true,
                listed_date: true,
                land_size: true,
                property_type: true,
                images: {
                    select:{
                        url: true,
                    },
                    take: 1
                }
            }

        })
        if(!home){
            throw new NotFoundException()
        }

        return new HomeResponseDto(home)
    }

    async createHome({address,numberOfBathroom,numberOfBedroom,city,price,landSize,propertyType,images}: CreateHomeParams, userId:number){
        const home = await this.prismaService.home.create({
            data:{
                address,
                number_of_bathroom:numberOfBathroom,
                number_of_bedroom:numberOfBedroom,
                city,
                price,
                land_size:landSize,
                property_type: propertyType,
                realtor_id:userId
            }
        })
        const homeImages = images.map((image)=>{
            return {...image, home_id: home.id}
        })
        await this.prismaService.image.createMany({
            data:homeImages
         })
        return new HomeResponseDto(home)
    }

    async updateHome(id:number,data: UpdateHomeParams){
        const home = await this.prismaService.home.findUnique({
            where:{
                id
            }
        })

        if(!home){
            throw new NotFoundException
        }
        const updatedHome = await this.prismaService.home.update({
            where:{
                id
            },
            data
        })

        return new HomeResponseDto(updatedHome)
    }

    async deleteHome(id: number){
        await this.prismaService.image.deleteMany({
            where:{
                home_id: id
            }
        });

        await this.prismaService.home.delete({
            where:{
                id
            }
        })
    }

    async getRealtorId(homeId: number){
        const home = await this.prismaService.home.findUnique({
            where:{
                id: homeId
            }, select:{
                realtor:{
                    select:{
                        id: true,
                    }
                }
            }
        })
        return home.realtor
    }
}

// "id": 1,
// "address": "",
// "city": "indore",
// "price": 3000000,
// "numberOfBedroom": 3,
// "numberOfBathroom": 2,
// "listedDate": "2022-09-22T08:20:56.840Z",
// "landSize": 3000,
// "propertyType": "RESIDENTIAL"