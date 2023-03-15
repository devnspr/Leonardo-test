import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AcronymsController } from './acronyms.controller';
import { AcronymsService } from './acronyms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Acronym, AcronymSchema } from './schemas/acronym.schema';
import { AuthMiddleware } from './auth.middleware';

@Module({
  controllers: [AcronymsController],
  providers: [AcronymsService],
  imports: [
    MongooseModule.forFeature([{ name: Acronym.name, schema: AcronymSchema }]),
  ],
})
export class AcronymsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/acronym/:key', method: RequestMethod.PUT },
        { path: '/acronym/:key', method: RequestMethod.DELETE },
      );
  }
}
