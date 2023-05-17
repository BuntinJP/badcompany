import { getImageUrl } from './reddit';
import { APIEmbed } from 'discord.js';
import { Table } from 'embed-table';
import { Command } from './index';
import { commands } from './commands';

import * as dc from './discordUtils';

interface Archive {
  title: string;
  episodes: string[];
}
interface DirectoryOutbound {
  titles: string[];
  outbound: Archive[];
}

const createTable = (directory: DirectoryOutbound) => {
  const table = new Table({
    titles: ['Level', 'Money', 'Wins'],
    titleIndexes: [0, 8, 16],
    columnIndexes: [0, 6, 14],
    start: '`',
    end: '`',
    padEnd: 3,
  });
  return table.toString();
};
const genTable = (array: string[]) => {
  let maxIndexLength = array.length.toString().length;
  let maxValueLength = Math.max(...array.map((item) => item.length));

  let indexHeader = 'index'.padEnd(maxIndexLength, ' ');
  let valueHeader = 'array[index]'.padEnd(maxValueLength, ' ');

  let separatorLength =
    Math.max(maxIndexLength, indexHeader.length) +
    Math.max(maxValueLength, valueHeader.length) +
    7;
  let separator = '-'.repeat(separatorLength);

  let table = `\n${separator}\n| ${indexHeader} | ${valueHeader} |\n${separator}\n`;

  for (let i = 0; i < array.length; i++) {
    let index = i.toString().padEnd(maxIndexLength, ' ');
    let value = array[i].padEnd(maxValueLength, ' ');
    table += `| ${index} | ${value} |\n`;
  }

  table += `${separator}\n`;
  return table;
};

const testurl = 'https://www.reddit.com/r/EGirls/hot.json';

const actions: ((env: any) => Promise<any>)[] = [
  async () => ({
    type: 4,
    data: {
      content: 'pong',
    },
  }),
  async () => ({
    type: 4,
    data: {
      content: 'ヘルプはこちら\n(https://github.com/BuntinJP/badcompany)',
    },
  }),
  async () => ({
    type: 4,
    data: {
      content: 'Hello, Cloudflare Worker!',
    },
  }),
  async () => {
    const imageUrl = await getImageUrl(testurl);
    return {
      type: 4,
      data: {
        content: imageUrl,
      },
    };
  },
  async (env: any) => {
    const applicationId = env.DISCORD_APPLICATION_ID;
    const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
    return {
      type: 4,
      data: {
        content: INVITE_URL,
        flags: 64,
      },
    };
  },
  //me-titles
  async () => {
    const directory: DirectoryOutbound = await (
      await fetch('https://manga.buntin.xyz/directory')
    ).json();
    const titles = directory.titles;
    return {
      type: 4,
      data: {
        content: dc.genTable(titles),
      },
    };
  },
  async () => {
    const directory: DirectoryOutbound = await (
      await fetch('https://manga.buntin.xyz/directory')
    ).json();
    return {
      type: 4,
      data: {
        content: 'https://manga-eater.com/directory',
      },
    };
  },
];

export const commandsWithAction: Command[] = commands.map((command, index) => ({
  ...command,
  action: actions[index],
}));
