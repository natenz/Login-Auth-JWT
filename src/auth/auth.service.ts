// auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>, // Pastikan menggunakan nama model yang benar
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async signup(username: string, password: string): Promise<any> {
    try {
      const existingUser = await this.userModel.findOne({ username }).exec();
      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = new this.userModel({ username, password: hashedPassword });
      await newUser.save();

      const payload = { username: newUser.username, sub: newUser._id };
      const accessToken = this.jwtService.sign(payload);

      return { access_token: accessToken };
    } catch (error) {
      throw new BadRequestException(`Failed to signup: ${error.message}`);
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
