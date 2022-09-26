import { PropertyType } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";



export class HomeResponseDto {
    id: number;

    address: string;

    @Exclude()
    number_of_bedroom: number;

    @Expose({name: "numberOfBedroom"})
    numberOfBedroom(){
        return this.number_of_bedroom
    }
    
    @Exclude()
    number_of_bathroom: number;

    @Expose({name: "numberOfBathroom"})
    numberOfBathroom(){
        return this.number_of_bathroom;
    }
    
    city: string;

    @Exclude()
    listed_date: Date;

    @Expose({name: "listedDate"})
    listedDate(){
        return this.listed_date;
    }

    price: number;

    @Exclude()
    land_size: number;

    @Expose({name: "landSize"})
    landSize(){
        return this.land_size;
    }

    @Exclude()
    property_type: PropertyType;

    @Expose({name: "propertyType"})
    propertyType(){
        return this.property_type;
    }

    @Exclude()
    created_at: Date;

    @Exclude()
    modified_at: Date;

    @Exclude()
    realtor_id: number;

    image: string;

    constructor(partial: Partial<HomeResponseDto>){
        Object.assign(this, partial)
    }
}

class Image {
    @IsNotEmpty()
    @IsString()
    url: string
}

export class CreateHomeDto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsPositive()
    numberOfBedroom:number;

    @IsNumber()
    @IsPositive()
    numberOfBathroom:number;

    @IsString()
    @IsNotEmpty()
    city :string;

    @IsNumber()
    @IsPositive()
    price:number;

    @IsNumber()
    @IsPositive()
    landSize:number;

    @IsEnum(PropertyType)
    propertyType:PropertyType;  
    
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>Image)
    images: Image[]
    
  }

  export class UpdateHomeDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBedroom?:number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBathroom?:number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city? :string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?:number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    landSize?:number;

    @IsOptional()
    @IsEnum(PropertyType)
    propertyType?:PropertyType;  
    
  }