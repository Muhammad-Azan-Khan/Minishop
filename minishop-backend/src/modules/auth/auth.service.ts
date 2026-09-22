import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

import { User, UserRole } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const role =
      registerDto.email === adminEmail ? UserRole.ADMIN : UserRole.USER;

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name:user.name,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'REFRESH_EXPIRES_IN',
      ) as StringValue,
    });

    await this.userRepository.update(user.id, {
      currentRefreshToken: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
      message: 'Login Successful',
    };
  }

 async refreshAccessToken(refreshToken: string) {
  let payload: any;

  try {
    payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
    });
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }

  const user = await this.usersService.findById(payload.sub);

  if (user.currentRefreshToken !== refreshToken) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const newPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = this.jwtService.sign(newPayload);

  return { accessToken };
}

  async logout(userId: number) {
    await this.userRepository.update(userId, { currentRefreshToken: null });
    return { message: 'Logged out successfully' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('No account found with that email');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    return { message: 'Password reset successfully' };

  }

  async forgotPassword(dto: ForgotPasswordDto) {
  // Find user by email
  const user = await this.usersService.findByEmail(dto.email);

  if (!user) {
    throw new NotFoundException('No account found with that email');
  }

  // Verify old password
  const isOldPasswordCorrect = await bcrypt.compare(
    dto.oldPassword,
    user.password,
  );

  if (!isOldPasswordCorrect) {
    throw new UnauthorizedException('Old password is incorrect');
  }

  // Optional: prevent using the same password again
  const isSamePassword = await bcrypt.compare(
    dto.newPassword,
    user.password,
  );

  if (isSamePassword) {
    throw new BadRequestException(
      'New password cannot be the same as the old password',
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

  // Update password
  await this.userRepository.update(user.id, {
    password: hashedPassword,
  });

  return {
    message: 'Password reset successfully',
  };
}
}