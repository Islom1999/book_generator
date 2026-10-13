import { PartialType } from '@nestjs/swagger';
import { CreatePostOfficeDto } from './create-post-office.dto.js';

export class UpdatePostOfficeDto extends PartialType(CreatePostOfficeDto) {}
