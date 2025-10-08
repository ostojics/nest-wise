import {HelpRequestDTO} from '@nest-wise/contracts';
import httpClient from './http-client';

export const sendHelp = (dto: HelpRequestDTO) => {
  return httpClient.post('v1/emails/help', {json: dto}).json<{message: string}>();
};
