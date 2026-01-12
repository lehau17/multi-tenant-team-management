import { Global, Module } from '@nestjs/common';
import { IamModule } from './iam/iam.module';
import { SharedService } from './shared.service';

@Global()
@Module({
  imports : [IamModule],
  providers: [
    SharedService,

  ],
  exports: [],
})
export class SharedModule {}
