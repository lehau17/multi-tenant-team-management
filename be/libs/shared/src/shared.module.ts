import { Global, Module } from '@nestjs/common';
import { SharedService } from './shared.service';

@Global()
@Module({
  imports : [],
  providers: [
    SharedService,

  ],
  exports: [],
})
export class SharedModule {}
