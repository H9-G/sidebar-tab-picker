import { Plugin, WorkspaceLeaf, getLanguage } from "obsidian";
import { LangCode, MessageKey, detectLanguage, isLangCode, tr } from "./i18n";
import { SidebarSettingTab } from "./settingsTab";
import { SeenTab, TabItem, discover, followUser, plan, reorderPlan, sanitizeItems, syncOrder } from "./tabs";

/** Right after start-up, tabs opened by other plugins are closed again if they are hidden. */
const STARTUP_GRACE_MS = 5000;

interface SavedData {
  language?: unknown;
  items?: unknown;
}

export default class SidebarTabPickerPlugin extends Plugin {
  items: TabItem[] = [];
  language: LangCode = "en";
  private present = new Set<string>();
  private startedAt = 0;
  private applying = false;
  /** A change came in while the side bar was being updated; run once more afterwards. */
  private pending = false;
  private settingTab: SidebarSettingTab | null = null;

  t(key: MessageKey): string {
    return tr(this.language, key);
  }

  async onload(): Promise<void> {
    const data = (await this.loadData()) as SavedData | null;
    this.items = sanitizeItems(data?.items);
    // First run: follow the language Obsidian is using.
    this.language = isLangCode(data?.language) ? data.language : detectLanguage(getLanguage());
    if (!data) await this.save();

    this.settingTab = new SidebarSettingTab(this.app, this);
    this.addSettingTab(this.settingTab);

    this.addCommand({ id: "apply", name: this.t("cmdApply"), callback: () => void this.apply() });
    this.addCommand({ id: "show-all", name: this.t("cmdShowAll"), callback: () => void this.setAll(true) });

    this.app.workspace.onLayoutReady(async () => {
      this.startedAt = Date.now();
      this.items = discover(this.items, this.seen());
      await this.apply();
      this.registerEvent(this.app.workspace.on("layout-change", () => this.onLayoutChange()));
    });
  }

  async save(): Promise<void> {
    await this.saveData({ language: this.language, items: this.items });
  }

  async setLanguage(lang: LangCode): Promise<void> {
    this.language = lang;
    await this.save();
  }

  // ---- reading the side bar ---------------------------------------------------------------------

  /** The leaves of the right side bar, in the order they are shown. */
  private rightLeaves(): WorkspaceLeaf[] {
    const out: WorkspaceLeaf[] = [];
    const right = this.app.workspace.rightSplit;
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.getRoot() === right) out.push(leaf);
    });
    return out;
  }

  private seen(): SeenTab[] {
    return this.rightLeaves()
      .map((leaf) => ({ type: leaf.getViewState().type, name: leaf.getDisplayText(), icon: leaf.getIcon() }))
      .filter((s) => s.type !== "" && s.type !== "empty");
  }

  private onLayoutChange(): void {
    if (this.applying) return;
    const seen = this.seen();
    const after = new Set(seen.map((s) => s.type));
    let items = discover(this.items, seen);
    if (Date.now() - this.startedAt < STARTUP_GRACE_MS) {
      // Other plugins open their tabs while Obsidian starts; keep hidden ones hidden.
      this.items = items;
      this.present = after;
      if (plan(items, [...after]).close.length > 0) void this.apply();
      return;
    }
    // Follow what was done by hand in the side bar: tabs opened, closed or moved.
    items = syncOrder(followUser(items, this.present, after, new Set()), seen.map((s) => s.type));
    const changed = JSON.stringify(items) !== JSON.stringify(this.items);
    this.items = items;
    this.present = after;
    if (changed) {
      void this.save();
      this.settingTab?.update();
    }
  }

  // ---- changing the side bar --------------------------------------------------------------------

  /**
   * Make the side bar match the list: hidden tabs are closed, shown tabs are opened, and the shown tabs are
   * put in the list's order. Only the tabs from the first one out of place onwards are reopened.
   */
  async apply(): Promise<void> {
    if (this.applying) {
      this.pending = true;
      return;
    }
    this.applying = true;
    try {
      do {
        this.pending = false;
        await this.applyOnce();
      } while (this.pending);
    } finally {
      this.applying = false;
    }
  }

  private async applyOnce(): Promise<void> {
    const leaves = this.rightLeaves();
    const { close } = plan(this.items, leaves.map((l) => l.getViewState().type));
    for (const leaf of leaves) if (close.includes(leaf.getViewState().type)) leaf.detach();

    const managed = new Set(this.items.map((i) => i.type));
    const shown = this.rightLeaves().filter((l) => managed.has(l.getViewState().type));
    const desired = this.items.filter((i) => i.visible).map((i) => i.type);
    const { detach, open } = reorderPlan(shown.map((l) => l.getViewState().type), desired);
    for (const leaf of shown) if (detach.includes(leaf.getViewState().type)) leaf.detach();
    for (const type of open) {
      const leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) break;
      try {
        await leaf.setViewState({ type, active: false });
      } catch {
        // The view no longer exists (its plugin was removed or turned off).
      }
      if (leaf.getViewState().type !== type) leaf.detach();
    }
    this.present = new Set(this.seen().map((s) => s.type));
    await this.save();
  }

  async setVisible(type: string, visible: boolean): Promise<void> {
    this.items = this.items.map((i) => (i.type === type ? { ...i, visible } : i));
    await this.apply();
  }

  async setAll(visible: boolean): Promise<void> {
    this.items = this.items.map((i) => ({ ...i, visible }));
    await this.apply();
    this.settingTab?.update();
  }

  async reorder(items: TabItem[]): Promise<void> {
    this.items = items;
    await this.apply();
  }

  async forget(index: number): Promise<void> {
    this.items = this.items.filter((_, i) => i !== index);
    await this.save();
  }

  async rescan(): Promise<void> {
    this.items = discover(this.items, this.seen());
    await this.save();
  }
}
