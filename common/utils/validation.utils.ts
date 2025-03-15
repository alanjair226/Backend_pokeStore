import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

export async function validate<T>(
  value: any,
  key: string,
  repository: Repository<T>,
): Promise<T> {
  const criteria = typeof value === 'object' ? value : { [key]: value };

  const entity = await repository.findOneBy(criteria);

  if (!entity) {
    throw new BadRequestException(`${key} not found`);
  }

  return entity;
}
