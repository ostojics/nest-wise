import {ApiProperty} from '@nestjs/swagger';

class UserRegistrationSwaggerDTO {
  @ApiProperty({
    description: 'Username (alphanumeric, underscore, and hyphen allowed)',
    example: 'john_doe',
    minLength: 1,
    maxLength: 50,
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
    format: 'email',
    maxLength: 255,
  })
  email: string;

  @ApiProperty({
    description: 'Password (min 8 chars, must contain uppercase, lowercase, and number)',
    example: 'MySecurePassword123',
    minLength: 8,
    maxLength: 128,
  })
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    example: 'MySecurePassword123',
  })
  confirm_password: string;
}

class CreateHouseholdSwaggerDTO {
  @ApiProperty({
    description: 'Household name',
    example: 'Smith Family',
    maxLength: 255,
  })
  name: string;

  @ApiProperty({
    description: 'Currency code (3-letter ISO code)',
    example: 'USD',
    pattern: '^[A-Z]{3}$',
  })
  currencyCode: string;
}

export class SetupSwaggerDTO {
  @ApiProperty({
    description: 'License key for household setup',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  licenseKey: string;

  @ApiProperty({
    description: 'User registration data',
    type: UserRegistrationSwaggerDTO,
  })
  user: UserRegistrationSwaggerDTO;

  @ApiProperty({
    description: 'Household creation data',
    type: CreateHouseholdSwaggerDTO,
  })
  household: CreateHouseholdSwaggerDTO;
}

export class LoginSwaggerDTO {
  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'MySecurePassword123',
  })
  password: string;
}

export class AuthSuccessResponseSwaggerDTO {
  @ApiProperty({
    description: 'Success message',
    example: 'Setup completed successfully',
  })
  message: string;
}

export class UserResponseSwaggerDTO {
  @ApiProperty({
    description: 'User ID',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

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
