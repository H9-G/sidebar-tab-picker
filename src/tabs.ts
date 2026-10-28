// What should be shown in the right side bar, decided from the saved list. Pure functions only.

export interface TabItem {
  /** View type, such as "backlink" or "outline". */
  type: string;
  /** Name shown in the settings, taken from the tab when it was last seen. */
  name: string;
  icon: string;
  visible: boolean;
}

export interface SeenTab {
  type: string;
  name: string;
  icon: string;
}

/** Add tabs seen in the side bar that are not in the list yet (shown), and refresh names and icons. */
export function discover(items: TabItem[], seen: SeenTab[]): TabItem[] {
  const out = items.map((i) => ({ ...i }));
  for (const s of seen) {
    const known = out.find((i) => i.type === s.type);
    if (known) {
      if (s.name) known.name = s.name;
      if (s.icon) known.icon = s.icon;
    } else {
      out.push({ type: s.type, name: s.name || s.type, icon: s.icon, visible: true });
    }
  }
  return out;
}

/** Which tabs to open and which to close so the side bar matches the list. */
export function plan(items: TabItem[], present: string[]): { open: string[]; close: string[] } {
  const here = new Set(present);
  return {
    open: items.filter((i) => i.visible && !here.has(i.type)).map((i) => i.type),
    close: items.filter((i) => !i.visible && here.has(i.type)).map((i) => i.type),
  };
}

/**
 * Follow what the user did by hand: a shown tab that was closed becomes hidden, and a hidden tab that
 * was opened becomes shown. Changes made by this plugin itself (`ours`) are not counted.
 */
export function followUser(items: TabItem[], before: Set<string>, after: Set<string>, ours: Set<string>): TabItem[] {
  return items.map((i) => {
    if (ours.has(i.type)) return i;
    if (i.visible && before.has(i.type) && !after.has(i.type)) return { ...i, visible: false };
    if (!i.visible && !before.has(i.type) && after.has(i.type)) return { ...i, visible: true };
    return i;
  });
}

export function move<T>(list: T[], from: number, to: number): T[] {
  const out = [...list];
  const [x] = out.splice(from, 1);
  if (x !== undefined) out.splice(Math.max(0, Math.min(to, out.length)), 0, x);
  return out;
}

export function sanitizeItems(raw: unknown): TabItem[] {
  if (!Array.isArray(raw)) return [];
  const out: TabItem[] = [];
  for (const r of raw as Record<string, unknown>[]) {
    if (!r || typeof r.type !== "string" || r.type === "" || out.some((o) => o.type === r.type)) continue;
    out.push({
      type: r.type,
      name: typeof r.name === "string" && r.name !== "" ? r.name : r.type,
      icon: typeof r.icon === "string" ? r.icon : "",
      visible: typeof r.visible === "boolean" ? r.visible : true,
    });
  }
  return out;
}

/**
 * How to bring the shown tabs from `current` order into `desired` order with as little reopening as possible:
 * tabs that are already in place at the start are kept, everything after the first difference is reopened.
 */
export function reorderPlan(current: string[], desired: string[]): { detach: string[]; open: string[] } {
  const cur = current.filter((t) => desired.includes(t));
  let k = 0;
  while (k < cur.length && k < desired.length && cur[k] === desired[k]) k++;
  const keep = new Set(cur.slice(0, k));
  return {
    detach: current.filter((t) => desired.includes(t) && !keep.has(t)),
    open: desired.filter((t) => !keep.has(t)),
  };
}

/** Put the list in the order the tabs have in the side bar; tabs that are not there keep their place. */
export function syncOrder(items: TabItem[], sidebar: string[]): TabItem[] {
  const inBar = items.filter((i) => sidebar.includes(i.type)).sort((a, b) => sidebar.indexOf(a.type) - sidebar.indexOf(b.type));
  let n = 0;
  return items.map((i) => (sidebar.includes(i.type) ? inBar[n++] : i));
}
