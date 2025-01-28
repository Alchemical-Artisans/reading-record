import { PluginSettingsBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsBase';

export class ReadingRecordPluginSettings extends PluginSettingsBase {
  public bookPath = 'Books';

  public constructor(data: unknown) {
    super();
    this.init(data);
  }
}
