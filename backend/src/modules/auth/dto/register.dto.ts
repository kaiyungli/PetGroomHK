import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '張三' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '61234567' })
  @IsString()
  @IsOptional()
  phone?: string;
}
