import { Injectable } from '@nestjs/common';
import { readSetting, type SettingKey } from '@app/entities';
import { DataSource } from 'typeorm';

/** Typed read access to runtime settings for any API module. */
@Injectable()
export class SettingsReader {
  constructor(private readonly dataSource: DataSource) {}

  get<K extends SettingKey>(key: K) {
    return readSetting(this.dataSource.manager, key);
  }
}
