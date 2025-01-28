import { Setting } from 'obsidian';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsTabBase';

import type { ReadingRecordPlugin } from './ReadingRecordPlugin.ts';

export class ReadingRecordPluginSettingsTab extends PluginSettingsTabBase<ReadingRecordPlugin> {
  public override display(): void {
    this.containerEl.empty();

    new Setting(this.containerEl)
      .setName('Books Path')
      .setDesc('Path in vault where new books should be added.')
      .addText((text) => this.bind(text, 'bookPath', {
        componentToPluginSettingsValueConverter: (uiValue: string) => uiValue,
        onChanged: () => { this.display(); },
        pluginSettingsToComponentValueConverter: (pluginSettingsValue: string) => pluginSettingsValue,
        valueValidator: async (uiValue) => uiValue.length > 0 ? undefined : 'Value must be non-empty'
      }).setPlaceholder('Enter a value'));
  }
}
