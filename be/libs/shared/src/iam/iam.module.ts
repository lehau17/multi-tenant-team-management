// src/shared/modules/iam/iam.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/iam.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        global:true
      }),
    }),
  ],
  providers: [JwtStrategy], // Strategy nằm ở đây
  exports: [PassportModule, JwtModule], // Export ra để các module khác dùng Guard
})
export class IamModule {}
