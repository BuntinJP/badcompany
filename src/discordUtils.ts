export const genTable = (a: string[]) => {
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
