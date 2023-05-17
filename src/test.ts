const genTable = (a: string[]) => {
  const iLen = a.length.toString().length;
  const vLen = Math.max(...a.map((x) => x.length));
  const sep = '-'.repeat(
    Math.max(iLen, 'index'.length) + Math.max(vLen, 'array[index]'.length) + 7
  );
  let tbl = `\n${sep}\n| ${'index'.padEnd(iLen)} | ${'array[index]'.padEnd(
    vLen
  )} |\n${sep}\n`;
  a.forEach(
    (v, i) => (tbl += `| ${i.toString().padEnd(iLen)} | ${v.padEnd(vLen)} \n`)
  );
  return '```' + tbl + sep + '\n```';
};

const titles = [
  'おかえりアりス',
  'この素晴らしい世界に祝福を!',
  'だれでも抱けるキミが好き',
  'とある魔術の禁書目録外伝とある科学の超電磁砲',
  'ゆるキャン',
  'よふかしのうた漫画',
  'アカイリンゴ',
  'シェアハウス',
  'シャドーハウス',
  'チェンソーマン第二部',
  'バキ道',
  'ブルーアーカイブ便利屋68業務日誌',
  'ペルソナ５',
  '売国機関',
  '平成ヲタクリメンバーズ',
  '暗号学園のいろは',
  '深東京',
  '満州アヘンスクワッド',
  '田んぼで拾った女騎士、田舎で俺の嫁だと思われている',
  '異世界ひろゆき',
  '虚構推理',
  '銀河英雄伝説',
];

console.log(genTable(titles));
