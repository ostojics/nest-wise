import {ApiProperty} from '@nestjs/swagger';

export class VersionResponse {
  @ApiProperty({
    description: 'Application version (SemVer + build metadata)',
    example: '0.1.0+build.317-a1b2c3d',
  })
  appVersion: string;

  @ApiProperty({
    description: 'Core API version',
    example: '0.0.1',
  })
  apiVersion: string;

  @ApiProperty({
    description: 'Contracts package version',
    example: '0.0.1',
  })
  contractsVersion: string;

  @ApiProperty({
    description: 'Git commit SHA (short)',
    example: 'a1b2c3d',
  })
  gitCommit: string;

  @ApiProperty({
    description: 'Build timestamp (ISO 8601)',
    example: '2025-01-27T10:15:30.000Z',
  })
  buildDate: string;
}
