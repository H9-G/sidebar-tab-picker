export const LANGUAGES = {
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
} as const;

export type LangCode = keyof typeof LANGUAGES;

export const isLangCode = (v: unknown): v is LangCode =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(LANGUAGES, v);

const en = {
  cmdApply: "Apply the tab list to the right sidebar",
  cmdShowAll: "Show all tabs in the right sidebar",
  applied: "The right sidebar was updated.",
  language: "Language",
  languageDesc: "Language of this plugin's settings and commands. Command names update after restarting Obsidian.",
  listHeading: "Tabs in the right sidebar",
  listEmpty: "No tabs found yet. Open the right sidebar once, then press Read the sidebar.",
  listDesc: "Turn a tab off to hide it, and drag a tab to move it. Both take effect right away. Tabs you open, close or move by hand in the sidebar are followed here.",
  rescan: "Read the sidebar",
  rescanDesc: "Adds the tabs that are open in the right sidebar now.",
  showAll: "Show all",
  showAllDesc: "Turns every tab in the list on.",
};

export type MessageKey = keyof typeof en;
type Dict = Record<MessageKey, string>;

const ja: Dict = {
  cmdApply: "タブの一覧を右サイドバーに反映",
  cmdShowAll: "右サイドバーのタブをすべて表示",
  applied: "右サイドバーを更新しました。",
  language: "言語",
  languageDesc: "このプラグインの設定とコマンドの言語です。コマンド名はObsidianの再起動後に変わります。",
  listHeading: "右サイドバーのタブ",
  listEmpty: "まだタブが見つかっていません。右サイドバーを一度開いてから「サイドバーを読み込む」を押してください。",
  listDesc: "オフにしたタブは隠れ、ドラッグしたタブは並び順が変わります。どちらもすぐに反映されます。サイドバーで手でタブを開く・閉じる・動かすと、ここにも反映されます。",
  rescan: "サイドバーを読み込む",
  rescanDesc: "いま右サイドバーで開いているタブを一覧に加えます。",
  showAll: "すべて表示",
  showAllDesc: "一覧のタブをすべてオンにします。",
};

const zhCN: Dict = {
  cmdApply: "将标签列表应用到右侧边栏",
  cmdShowAll: "显示右侧边栏的所有标签",
  applied: "右侧边栏已更新。",
  language: "语言",
  languageDesc: "本插件设置和命令使用的语言。命令名称在重启 Obsidian 后更新。",
  listHeading: "右侧边栏的标签",
  listEmpty: "还没有找到标签。请先打开一次右侧边栏，然后点击“读取侧边栏”。",
  listDesc: "关闭某个标签即可隐藏它，拖动标签即可调整顺序，两者都会立即生效。在侧边栏中手动打开、关闭或移动标签，也会同步到这里。",
  rescan: "读取侧边栏",
  rescanDesc: "将右侧边栏中当前打开的标签加入列表。",
  showAll: "全部显示",
  showAllDesc: "打开列表中的所有标签。",
};

const zhTW: Dict = {
  cmdApply: "將分頁清單套用到右側邊欄",
  cmdShowAll: "顯示右側邊欄的所有分頁",
  applied: "右側邊欄已更新。",
  language: "語言",
  languageDesc: "本外掛設定與指令使用的語言。指令名稱會在重新啟動 Obsidian 後更新。",
  listHeading: "右側邊欄的分頁",
  listEmpty: "尚未找到分頁。請先開啟一次右側邊欄，再按「讀取側邊欄」。",
  listDesc: "關閉某個分頁即可隱藏它，拖曳分頁即可調整順序，兩者都會立即生效。在側邊欄中手動開啟、關閉或移動分頁，也會同步到這裡。",
  rescan: "讀取側邊欄",
  rescanDesc: "將右側邊欄目前開啟的分頁加入清單。",
  showAll: "全部顯示",
  showAllDesc: "開啟清單中的所有分頁。",
};

const ko: Dict = {
  cmdApply: "탭 목록을 오른쪽 사이드바에 적용",
  cmdShowAll: "오른쪽 사이드바의 모든 탭 표시",
  applied: "오른쪽 사이드바를 업데이트했습니다.",
  language: "언어",
  languageDesc: "이 플러그인의 설정과 명령에 쓰이는 언어입니다. 명령 이름은 Obsidian을 다시 시작한 뒤 바뀝니다.",
  listHeading: "오른쪽 사이드바의 탭",
  listEmpty: "아직 찾은 탭이 없습니다. 오른쪽 사이드바를 한 번 연 다음 '사이드바 읽기'를 누르세요.",
  listDesc: "탭을 끄면 숨겨지고, 탭을 끌면 순서가 바뀝니다. 둘 다 바로 적용됩니다. 사이드바에서 직접 탭을 열거나 닫거나 옮기면 여기에도 반영됩니다.",
  rescan: "사이드바 읽기",
  rescanDesc: "지금 오른쪽 사이드바에 열려 있는 탭을 목록에 추가합니다.",
  showAll: "모두 표시",
  showAllDesc: "목록의 모든 탭을 켭니다.",
};

const es: Dict = {
  cmdApply: "Aplicar la lista de pestañas a la barra lateral derecha",
  cmdShowAll: "Mostrar todas las pestañas de la barra lateral derecha",
  applied: "Se ha actualizado la barra lateral derecha.",
  language: "Idioma",
  languageDesc: "Idioma de los ajustes y comandos de este plugin. Los nombres de los comandos cambian al reiniciar Obsidian.",
  listHeading: "Pestañas de la barra lateral derecha",
  listEmpty: "Aún no se ha encontrado ninguna pestaña. Abre la barra lateral derecha una vez y pulsa Leer la barra lateral.",
  listDesc: "Desactiva una pestaña para ocultarla y arrástrala para moverla. Ambos cambios se aplican al momento. Las pestañas que abras, cierres o muevas a mano en la barra lateral también se reflejan aquí.",
  rescan: "Leer la barra lateral",
  rescanDesc: "Añade las pestañas que están abiertas ahora en la barra lateral derecha.",
  showAll: "Mostrar todas",
  showAllDesc: "Activa todas las pestañas de la lista.",
};

const fr: Dict = {
  cmdApply: "Appliquer la liste d'onglets à la barre latérale droite",
  cmdShowAll: "Afficher tous les onglets de la barre latérale droite",
  applied: "La barre latérale droite a été mise à jour.",
  language: "Langue",
  languageDesc: "Langue des réglages et des commandes de ce plugin. Les noms des commandes changent après le redémarrage d'Obsidian.",
  listHeading: "Onglets de la barre latérale droite",
  listEmpty: "Aucun onglet trouvé pour l'instant. Ouvrez une fois la barre latérale droite, puis appuyez sur Lire la barre latérale.",
  listDesc: "Désactivez un onglet pour le masquer et faites-le glisser pour le déplacer. Les deux prennent effet immédiatement. Les onglets ouverts, fermés ou déplacés à la main dans la barre latérale sont aussi suivis ici.",
  rescan: "Lire la barre latérale",
  rescanDesc: "Ajoute les onglets ouverts en ce moment dans la barre latérale droite.",
  showAll: "Tout afficher",
  showAllDesc: "Active tous les onglets de la liste.",
};

const de: Dict = {
  cmdApply: "Tab-Liste auf die rechte Seitenleiste anwenden",
  cmdShowAll: "Alle Tabs in der rechten Seitenleiste anzeigen",
  applied: "Die rechte Seitenleiste wurde aktualisiert.",
  language: "Sprache",
  languageDesc: "Sprache der Einstellungen und Befehle dieses Plugins. Die Befehlsnamen ändern sich nach einem Neustart von Obsidian.",
  listHeading: "Tabs in der rechten Seitenleiste",
  listEmpty: "Noch keine Tabs gefunden. Öffne die rechte Seitenleiste einmal und drücke dann auf Seitenleiste einlesen.",
  listDesc: "Schalte einen Tab aus, um ihn auszublenden, und ziehe ihn, um ihn zu verschieben. Beides wirkt sofort. Tabs, die du in der Seitenleiste von Hand öffnest, schließt oder verschiebst, werden hier ebenfalls übernommen.",
  rescan: "Seitenleiste einlesen",
  rescanDesc: "Fügt die Tabs hinzu, die gerade in der rechten Seitenleiste geöffnet sind.",
  showAll: "Alle anzeigen",
  showAllDesc: "Schaltet alle Tabs der Liste ein.",
};

const DICTS: Record<LangCode, Dict> = { en, ja, "zh-CN": zhCN, "zh-TW": zhTW, ko, es, fr, de };

export function tr(lang: LangCode, key: MessageKey): string {
  return (DICTS[lang] ?? en)[key] ?? en[key];
}

export function allDicts(): Record<LangCode, Dict> {
  return DICTS;
}

/** Map a locale string (e.g. "ja", "zh-TW", "en-US") to a supported language; anything else is English. */
export function detectLanguage(locale: string | null | undefined): LangCode {
  if (!locale) return "en";
  const l = locale.toLowerCase().replace(/_/g, "-");
  if (l.startsWith("zh")) return /^zh-(tw|hk|mo|hant)/.test(l) ? "zh-TW" : "zh-CN";
  const base = l.split("-")[0];
  return isLangCode(base) ? base : "en";
}
