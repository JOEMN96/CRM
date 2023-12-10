import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard, RolesGuard } from './auth/common';
import { ProjectsModule } from './projects/projects.module';
import { CalenderModule } from './calender/calendar.module';
import { UsersModule } from './users/users.module';
import { NotificationModule } from './notification/notification.module';
import { ProfileModule } from './profile/profile.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '/uploads/public'),
      serveStaticOptions: { index: false },
    }),
    AuthModule,
    PrismaModule,
    ProjectsModule,
    CalenderModule,
    UsersModule,
    NotificationModule,
    ProfileModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
