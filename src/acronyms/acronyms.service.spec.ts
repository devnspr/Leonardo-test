import { Test, TestingModule } from '@nestjs/testing';
import { AcronymsService } from './acronyms.service';
import { Model } from 'mongoose';
import { Acronym, AcronymDocument } from './schemas/acronym.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockAcronym = (
  key = 'H&NO0',
  description = 'this is test description',
): Acronym => {
  const acronym = new Acronym();
  acronym.key = key;
  acronym.description = description;
  return acronym;
};

const acronymArray = [
  mockAcronym(),
  mockAcronym('BKJVG', 'BJHBSKFJBLKNDV'),
  mockAcronym('BJHB', 'VKGHVKJVHHJBLHJ'),
  mockAcronym('NBHJBNJK', 'VKHGVDFNLJKSF'),
];

const mockAcronymDoc = (mock?: Partial<Acronym>): Partial<AcronymDocument> => ({
  key: mock?.key || 'H&NO0',
  description: mock?.description || 'this is test description',
});

const acronymDocArray = [
  mockAcronymDoc(),
  mockAcronymDoc({ key: 'BKJVG', description: 'BJHBSKFJBLKNDV' }),
  mockAcronymDoc({ key: 'BJHB', description: 'VKGHVKJVHHJBLHJ' }),
  mockAcronymDoc({ key: 'NBHJBN', description: 'VKHGVDDDFNLJF' }),
];

describe('AcronymsService', () => {
  let service: AcronymsService;
  let model: Model<AcronymDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcronymsService,
        {
          provide: getModelToken(Acronym.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockAcronym()),
            constructor: jest.fn().mockResolvedValue(mockAcronym()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AcronymsService>(AcronymsService);
    model = module.get<Model<AcronymDocument>>(getModelToken(Acronym.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

});
