import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Acronym, AcronymDocument } from './schemas/acronym.schema';
import { Model } from 'mongoose';
import { AcronymsFiltersInterface } from './interfaces/acronyms-filters.interface';

@Injectable()
export class AcronymsService {
  constructor(
    @InjectModel(Acronym.name) private readonly model: Model<AcronymDocument>,
  ) {}
  private getSearchStage(term: string) {
    return {
      $search: {
        text: {
          query: term,
          path: 'key',
          fuzzy: {
            maxEdits: 2,
            prefixLength: 1,
            maxExpansions: 500,
          },
        },
      },
    };
  }
  private getFilterQuery(filters?: AcronymsFiltersInterface) {
    const aggregationPipeline: any[] = [];
    if (typeof filters.search != 'undefined' && filters.search.trim() != '') {
      aggregationPipeline.push(this.getSearchStage(filters.search.trim()));
    }
    if (typeof filters.from != 'undefined' && filters.from >= 0) {
      aggregationPipeline.push({
        $skip: Number.parseInt(filters.from.toString()),
      });
    }
    if (typeof filters.limit != 'undefined' && filters.limit >= 0) {
      aggregationPipeline.push({
        $limit: Number.parseInt(filters.limit.toString()),
      });
    }
    return aggregationPipeline;
  }
  async getByFilter(filters?: AcronymsFiltersInterface): Promise<Acronym[]> {
    const pipeline: any = this.getFilterQuery(filters);
    return pipeline.length > 0
      ? this.model.aggregate(pipeline).exec()
      : this.model.find().exec();
  }
  async count(filters?: AcronymsFiltersInterface): Promise<number> {
    const pipeline: any = [];
    if (typeof filters.search != 'undefined' && filters.search.trim() != '') {
      pipeline.push(this.getSearchStage(filters.search.trim()));
    }
    pipeline.push({
      $count: 'count',
    });
    const result = await this.model.aggregate(pipeline).exec();
    return result[0] ? result[0].count : 0;
  }
  async getByKey(key: string): Promise<Acronym> {
    const acronym = await this.model.findOne({ key }).exec();
    if (!acronym) throw new NotFoundException();
    return acronym;
  }
  async getRandom(count = 1): Promise<Acronym[]> {
    return this.model.aggregate([
      { $sample: { size: Number.parseInt(count.toString()) } },
    ]);
  }
  async create(key: string, description: string): Promise<Acronym> {
    const acronym = new Acronym();
    acronym.key = key;
    acronym.description = description;
    await this.model.create(acronym);
    return acronym;
  }
  async update(key: string, description: string): Promise<Acronym> {
    const acronym = await this.model.findOne({ key }).exec();
    if (!acronym) throw new NotFoundException();
    acronym.description = description;
    await acronym.save();
    return acronym;
  }
  async delete(key: string): Promise<void> {
    await this.model.findOneAndRemove({ key }).exec();
  }
}
