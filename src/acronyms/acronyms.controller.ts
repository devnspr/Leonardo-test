import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AcronymsService } from './acronyms.service';
import { AcronymsFilterDto } from './dto/acronyms-filter.dto';

@Controller('acronym')
export class AcronymsController {
  constructor(private service: AcronymsService) {}
  @Get()
  async getAcronyms(
    @Query() filters: AcronymsFilterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const acronyms = await this.service.getByFilter(filters);
    const count = await this.service.count(filters);
    const from =
      typeof filters.from != 'undefined' && filters.from > 0
        ? parseInt(filters.from.toString())
        : 0;
    response.setHeader(
      'more_items',
      acronyms.length + from < count ? 'yes' : 'no',
    );
    response.setHeader('total_count', count);
    return { acronyms };
  }
  @Get(':key')
  async getByKey(@Param('key') key: string) {
    const acronym = await this.service.getByKey(key);
    return { acronym };
  }
  @Get('/random/:count')
  async getRandom(@Param('count') count: number) {
    const acronyms = await this.service.getRandom(count);
    return { acronyms };
  }
  @Post()
  async create(
    @Body('key') key: string,
    @Body('description') description: string,
  ) {
    const acronym = await this.service.create(key, description);
    return { acronym };
  }
  @Put(':key')
  async edit(
    @Param('key') key: string,
    @Body('description') description: string,
  ) {
    const acronym = await this.service.update(key, description);
    return { acronym };
  }
  @Delete(':key')
  async delete(@Param('key') key: string) {
    await this.service.delete(key);
  }
}
