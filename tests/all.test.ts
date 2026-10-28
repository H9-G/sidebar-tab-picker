import assert from "node:assert/strict";
import { discover, followUser, move, plan, reorderPlan, sanitizeItems, syncOrder } from "../src/tabs";
import { allDicts, detectLanguage, tr } from "../src/i18n";

let passed = 0;
let failed = 0;
const queue: [string, () => unknown][] = [];
const test = (name: string, fn: () => unknown) => queue.push([name, fn]);

const items = [
  { type: "backlink", name: "Backlinks", icon: "links-coming-in", visible: true },
  { type: "outline", name: "Outline", icon: "list", visible: false },
  { type: "tag", name: "Tags", icon: "tags", visible: true },
];

test("new tabs in the side bar are added as shown; names are refreshed", () => {
  const out = discover(items, [
    { type: "outline", name: "アウトライン", icon: "list" },
    { type: "checkbox-reminder-list", name: "リマインダー", icon: "alarm-clock" },
  ]);
  assert.equal(out.length, 4);
  assert.equal(out[1].name, "アウトライン");
  assert.equal(out[1].visible, false, "a hidden tab stays hidden");
  assert.deepEqual(out[3], { type: "checkbox-reminder-list", name: "リマインダー", icon: "alarm-clock", visible: true });
  assert.equal(items[1].name, "Outline", "input is not changed");
});
test("plan opens missing shown tabs and closes hidden ones", () => {
  assert.deepEqual(plan(items, ["outline", "backlink", "file-explorer"]), { open: ["tag"], close: ["outline"] });
});
test("tabs closed or opened by hand are followed, but not the plugin's own changes", () => {
  const before = new Set(["backlink", "tag"]);
  const after = new Set(["tag", "outline"]);
  const out = followUser(items, before, after, new Set());
  assert.deepEqual(out.map((i) => i.visible), [false, true, true]);
  const ours = followUser(items, before, after, new Set(["backlink", "outline"]));
  assert.deepEqual(ours.map((i) => i.visible), [true, false, true]);
});
test("moving items", () => {
  assert.deepEqual(move(["a", "b", "c"], 2, 0), ["c", "a", "b"]);
  assert.deepEqual(move(["a", "b", "c"], 0, 5), ["b", "c", "a"]);
});
test("saved data is cleaned", () => {
  const out = sanitizeItems([{ type: "a", visible: false }, { type: "a" }, { name: "x" }, null, { type: "b", name: "B", icon: 3 }]);
  assert.deepEqual(out, [
    { type: "a", name: "a", icon: "", visible: false },
    { type: "b", name: "B", icon: "", visible: true },
  ]);
  assert.deepEqual(sanitizeItems("junk"), []);
  assert.equal(tr("ja", "showAll"), "すべて表示");
});
test("reordering reopens only the tabs from the first one out of place", () => {
  assert.deepEqual(reorderPlan(["a", "b", "c", "d"], ["a", "b", "d", "c"]), { detach: ["c", "d"], open: ["d", "c"] });
  assert.deepEqual(reorderPlan(["a", "b"], ["a", "b"]), { detach: [], open: [] });
  assert.deepEqual(reorderPlan(["b", "a"], ["a", "b"]), { detach: ["b", "a"], open: ["a", "b"] });
  assert.deepEqual(reorderPlan(["a"], ["a", "b"]), { detach: [], open: ["b"] }, "a newly shown tab is added at the end");
});
test("moving tabs by hand in the side bar reorders the list; hidden tabs keep their place", () => {
  const out = syncOrder(items, ["tag", "backlink"]);
  assert.deepEqual(out.map((i) => i.type), ["tag", "outline", "backlink"]);
});
test("every language has every message, and languages are detected like Open Mode Control", () => {
  const dicts = allDicts();
  const keys = Object.keys(dicts.en).sort();
  for (const [lang, d] of Object.entries(dicts)) {
    assert.deepEqual(Object.keys(d).sort(), keys, lang);
    for (const k of keys) assert.ok((d as Record<string, string>)[k].trim() !== "", `${lang}.${k}`);
  }
  assert.equal(Object.keys(dicts).length, 8);
  assert.equal(detectLanguage("ja"), "ja");
  assert.equal(detectLanguage("zh-TW"), "zh-TW");
  assert.equal(detectLanguage("zh"), "zh-CN");
  assert.equal(detectLanguage("de-AT"), "de");
  assert.equal(detectLanguage("ru"), "en");
  assert.equal(detectLanguage(undefined), "en");
});

(async () => {
  for (const [name, fn] of queue) {
    try {
      await fn();
      passed++;
      console.log("ok   " + name);
    } catch (e) {
      failed++;
      console.error("FAIL " + name + "\n     " + String((e as Error).message).split("\n").join("\n     "));
    }
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
