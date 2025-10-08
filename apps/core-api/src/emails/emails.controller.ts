import {Controller, Post, Body, UseGuards, UsePipes, HttpCode, HttpStatus} from '@nestjs/common';
import {HelpRequestDTO, helpRequestSchema} from '@nest-wise/contracts';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {EmailsService} from './emails.service';

@Controller({
  version: '1',
  path: 'emails',
})
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(helpRequestSchema))
  @HttpCode(HttpStatus.CREATED)
  @Post('help')
  async sendHelpEmail(@Body() dto: HelpRequestDTO, @CurrentUser() user: JwtPayload): Promise<{message: string}> {
    await this.emailsService.sendHelpEmail({
      email: user.email,
      message: dto.message,
      userId: user.sub,
    });

    return {message: 'Poruka je poslata'};
  }
}
