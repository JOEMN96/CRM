import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { localATStratergy, localRTStratergy } from './stratergies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, localATStratergy, localRTStratergy],
  controllers: [AuthController],
})
export class AuthModule {}
