/* ---------- Config: stat columns per category (edit freely) ---------- */
export const STAT_COLUMNS = {
  batting:  ["GP-GS","AVG","OBP","SLG","OPS","AB","H","2B","3B","HR","TB","R","RBI","BB","HBP","SO","BB:SO","SF","SH","GDP","SB-ATT"],
  pitching: ["ERA","W-L","APP-GS","IP","H","R","ER","BB","SO","2B","3B","HR","WP","HBP","BK","SFA","SHA"],
  fielding: ["FLD%","G-GS","PO","A","E","TC","DP","SBA","CSB","IP","PB","CI"]
};
export const CATEGORY_LABEL = { batting:"Batting", pitching:"Pitching", fielding:"Fielding" };
export const DEFAULT_SORT = { batting:"AVG", pitching:"ERA", fielding:"FLD%" };

/* Derived stats: computed from other fields rather than entered by hand.
   Each function receives the category's stat object and returns a display
   string. Sorting and rendering both read through getStatValue() below,
   so a derived column behaves like any other for click-to-sort. */
export const DERIVED_STATS = {
  batting: {
    "BB:SO": stats => {
      const bb = parseFloat(stats.BB), hbp = parseFloat(stats.HBP), so = parseFloat(stats.SO);
      if(isNaN(bb) || isNaN(so) || so === 0) return "";
      const ratio = (bb + (isNaN(hbp) ? 0 : hbp)) / so;
      return ratio.toFixed(2);
    }
  }
};
export function getStatValue(player, category, col){
  const derived = DERIVED_STATS[category] && DERIVED_STATS[category][col];
  return derived ? derived(player[category]) : player[category][col];
}
