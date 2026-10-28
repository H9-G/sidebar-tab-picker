import { App, Notice, PluginSettingTab, SettingDefinitionItem, setIcon } from "obsidian";
import type SidebarTabPickerPlugin from "./main";
import { LANGUAGES, MessageKey, isLangCode } from "./i18n";
import { move } from "./tabs";

export class SidebarSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: SidebarTabPickerPlugin) {
    super(app, plugin);
  }

  getControlValue(key: string): unknown {
    return key === "language" ? this.plugin.language : undefined;
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key !== "language" || !isLangCode(value)) return;
    await this.plugin.setLanguage(value);
    this.update(); // redraw in the new language
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    const t = (k: MessageKey) => this.plugin.t(k);
    const p = this.plugin;
    return [
      {
        name: t("language"),
        desc: t("languageDesc"),
        control: { type: "dropdown", key: "language", options: { ...LANGUAGES } },
      },
      {
        type: "list",
        heading: t("listHeading"),
        emptyState: t("listEmpty"),
        // Dragging a row moves the tab in the side bar at once.
        onReorder: (from, to) => {
          void p.reorder(move(p.items, from, to)).then(() => this.update());
        },
        onDelete: (index) => {
          void p.forget(index).then(() => this.update());
        },
        items: p.items.map((item) => ({
          name: item.name,
          desc: item.type,
          render: (setting) => {
            if (item.icon) {
              const icon = createSpan({ cls: "sidebar-tab-picker-icon" });
              setIcon(icon, item.icon);
              setting.nameEl.prepend(icon);
            }
            setting.addToggle((tg) =>
              tg.setValue(item.visible).onChange((v) => {
                void p.setVisible(item.type, v);
              })
            );
          },
        })),
      },
      { name: t("listDesc"), searchable: false },
      {
        name: t("rescan"),
        desc: t("rescanDesc"),
        action: () => {
          void p.rescan().then(() => this.update());
        },
      },
      {
        name: t("showAll"),
        desc: t("showAllDesc"),
        action: () => {
          void p.setAll(true).then(() => new Notice(t("applied")));
        },
      },
    ];
  }
}
