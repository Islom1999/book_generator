import { Global, Module } from '@nestjs/common';
import { ReplicateService } from './replicate.service';

@Global()
@Module({
  providers: [ReplicateService],
  exports: [ReplicateService],
})
export class ReplicateModule {}
