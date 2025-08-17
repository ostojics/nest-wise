import {ApiProperty} from '@nestjs/swagger';
import {HouseholdResponseSwaggerDTO} from './households.swagger.dto';

export class UserResponseSwaggerDTO {
  @ApiProperty({
    description: 'User ID',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'User household',
    type: HouseholdResponseSwaggerDTO,
  })
  household: HouseholdResponseSwaggerDTO;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date;
}
