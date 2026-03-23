import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HadsModule } from './hads/hads.module';


@Module({
  imports: [PrismaModule, ArticlesModule, UsersModule, AuthModule, HadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
