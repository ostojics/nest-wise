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

export class InviteUserSwaggerDTO {
  @ApiProperty({
    description: 'Email address of the user to invite',
    example: 'new.member@example.com',
    format: 'email',
    maxLength: 255,
  })
  email: string;
}

export class AcceptInviteSwaggerDTO {
  @ApiProperty({
    description: 'Desired username (alphanumeric, underscore, and hyphen allowed)',
    example: 'jane_doe',
    minLength: 1,
    maxLength: 50,
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'jane@example.com',
    format: 'email',
    maxLength: 255,
  })
  email: string;

  @ApiProperty({
    description: 'Password (min 8 chars, must contain uppercase, lowercase, and number)',
    example: 'StrongPass123',
    minLength: 8,
    maxLength: 128,
  })
  password: string;

  @ApiProperty({
    description: 'Password confirmation (must match password)',
    example: 'StrongPass123',
  })
  confirm_password: string;

  @ApiProperty({
    description: 'Invitation token received via email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
