import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone } = registerDto;

    // 檢查用戶是否已存在
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('此電郵已被註冊');
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建用戶
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    // 生成 JWT
    const token = this.generateToken(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 查找用戶
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('電郵或密碼錯誤');
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('電郵或密碼錯誤');
    }

    // 生成 JWT
    const token = this.generateToken(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
