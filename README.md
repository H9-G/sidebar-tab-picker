# Sidebar Tab Picker

**English** | [日本語](docs/README.ja.md) | [简体中文](docs/README.zh-CN.md) | [繁體中文](docs/README.zh-TW.md) | [한국어](docs/README.ko.md) | [Español](docs/README.es.md) | [Français](docs/README.fr.md) | [Deutsch](docs/README.de.md)

Choose which tabs the right sidebar shows, and in what order. Hidden tabs stay hidden after a restart.

## How to use

1. Open **Settings → Sidebar Tab Picker**. Every tab that has been in the right sidebar is listed: Backlinks, Outline, tabs of other plugins and so on.
2. Turn a tab **off** to hide it, and **on** to show it again.
3. **Drag** a tab in the list to change the order.
4. Both changes take effect in the sidebar right away.

- Tabs you open, close or move by hand in the sidebar are followed in the list.
- When Obsidian starts, tabs that other plugins open by themselves are closed again if they are turned off.
- **Read the sidebar** adds the tabs that are open now. **Show all** turns every tab on. The delete button of a row forgets that tab, for example after removing its plugin.
- The settings and commands are available in English, Japanese, Simplified Chinese, Traditional Chinese, Korean, Spanish, French and German. The language follows Obsidian on first use and can be changed in the settings.

## Good to know

- A hidden tab is really closed, and opened again when it is shown. Its scroll position and similar state are reset. When the order changes, only the tabs from the first one out of place onwards are reopened.
- Only the right sidebar is handled.

## Network use

None. The plugin works offline and collects no data.

## License

MIT
