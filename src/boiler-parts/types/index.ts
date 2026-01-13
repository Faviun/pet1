import { faker } from '@faker-js/faker';
import { Op } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

class BoilerParts {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  boiler_manufacturer: string;

  @ApiProperty({ example: 12345 })
  price: string;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  parts_manufacturer: string;

  @ApiProperty({ example: faker.internet.password() })
  vendor_code: string;

  @ApiProperty({ example: faker.lorem.word() })
  name: string;

  @ApiProperty({ example: faker.lorem.sentence() })
  description: string;

  @ApiProperty({ example: faker.lorem.sentence() })
  compatibility: string;

  @ApiProperty({ example: faker.image.url() })
  images: string;

  @ApiProperty({ example: 5 })
  in_stock: number;

  @ApiProperty({ example: true })
  bestseller: boolean;

  @ApiProperty({ example: false })
  new: boolean;

  @ApiProperty({ example: 123 })
  popularity: number;

  @ApiProperty({ example: '2023-01-31T19:46:45.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-31T19:46:45.000Z' })
  updatedAt: string;
}

export class PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: BoilerParts, isArray: true })
  rows: BoilerParts;
}

export class Bestsellers extends BoilerParts {
  @ApiProperty({ example: true })
  declare bestseller: boolean;
}

export class GetBestsellersResponse extends PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  declare count: number;

  @ApiProperty({ type: BoilerParts, isArray: true })
  declare rows: Bestsellers;
}

export class NewParts extends BoilerParts {
  @ApiProperty({ example: true })
  declare new: boolean;
}

export class GetNewResponse extends PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  declare count: number;

  @ApiProperty({ type: BoilerParts, isArray: true })
  declare rows: NewParts;
}

export class SearchByLetterResponse extends BoilerParts {
  @ApiProperty({ example: 'Provident incidunt.' })
  declare name: string;
}

export class SearchResponse extends PaginateAndFilterResponse {
  @ApiProperty({ type: SearchByLetterResponse, isArray: true })
  declare rows: SearchByLetterResponse;
}

export class SearchRequest {
  @ApiProperty({ example: 'pr' })
  search: string;
}

export class GetByNameResponse extends BoilerParts {
  @ApiProperty({ example: 'Provident incidunt.' })
  declarename: string;
}

export class GetByNameRequest {
  @ApiProperty({ example: 'Provident incidunt.' })
  name: string;
}

export class FindOneResponse extends BoilerParts {}

export interface IBoilerPartsQuery {
  limit: string;
  offset: string;
  boiler: string | undefined;
  parts: string | undefined;
  priceFrom: string | undefined;
  priceTo: string | undefined;
}

export interface IBoilerPartsFilter {
  boiler_manufacturer: string | undefined;
  parts_manufacturer: string | undefined;
  price: { [Op.between]: number[] };
}
