// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModel } from './user.model'; // Pastikan import UserModel yang benar
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserModel.schema }]), // Pastikan menggunakan UserModel.schema
    PassportModule,
    JwtModule.register({
      secret: 'ezGamingBangetYGY25', // Ganti dengan secret key yang aman
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
