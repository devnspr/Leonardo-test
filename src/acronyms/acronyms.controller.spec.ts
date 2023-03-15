import { Test, TestingModule } from '@nestjs/testing';
import { AcronymsController } from './acronyms.controller';
import { AcronymsService } from './acronyms.service';
import { Acronym, AcronymDocument } from './schemas/acronym.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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

describe('AcronymsController', () => {
  let controller: AcronymsController;
  let service: AcronymsService;
  let model: Model<AcronymDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcronymsController],
      providers: [
        AcronymsService,
        {
          provide: getModelToken(Acronym.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockAcronym()),
            constructor: jest.fn().mockResolvedValue(mockAcronym()),
            find: jest.fn().mockResolvedValue(acronymArray),
            findOne: jest.fn().mockResolvedValue(mockAcronym()),
            aggregate: jest.fn().mockResolvedValue(acronymArray),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn().mockResolvedValue(acronymArray),
          },
        },
      ],
    }).compile();

    controller = module.get<AcronymsController>(AcronymsController);
    service = module.get<AcronymsService>(AcronymsService);
    model = module.get<Model<AcronymDocument>>(getModelToken(Acronym.name));
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });
  it('should get some random acronyms', async function () {
    const response = await controller.getRandom(3);
    expect(response).toBeDefined();
    expect(response.acronyms).toBeDefined();
    expect(response.acronyms.length).toBeGreaterThan(0);
  });
});
