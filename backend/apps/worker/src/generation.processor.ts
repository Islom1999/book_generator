import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Queues } from '@app/queues';
import type { Job } from 'bullmq';

/**
 * Consumes AI generation jobs. Phase 1 moves the OpenRouter / Replicate
 * pipeline from `legacy/api` here.
 */
@Processor(Queues.GENERATION)
export class GenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(GenerationProcessor.name);

  async process(job: Job) {
    this.logger.log(`Received ${job.name} job ${job.id}`);
  }
}
