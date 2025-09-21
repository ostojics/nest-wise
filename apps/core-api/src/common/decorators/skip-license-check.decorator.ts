import {SetMetadata} from '@nestjs/common';
import {SKIP_LICENSE_CHECK} from '../guards/license.guard';

export const SkipLicenseCheck = () => SetMetadata(SKIP_LICENSE_CHECK, true);
