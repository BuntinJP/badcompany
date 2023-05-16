import { getImageUrl } from './reddit';
import { APIEmbed } from 'discord.js';
import { Table } from 'embed-table';
import { Command } from './index';
import { commands } from './commands';

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

const testurl = 'https://www.reddit.com/r/FutaCum/hot.json';

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
  async () => {
    const directory: DirectoryOutbound = await (
      await fetch('https://manga.buntin.xyz/directory')
    ).json();
    return {
      type: 4,
      data: {
        content: createTable(directory),
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

/* export const commands: Command[] = [
  {
    name: 'ping',
    description: 'ping pong',
    action: async () => ({
      type: 4,
      data: {
        content: 'pong',
      },
    }),
  },
  {
    name: 'help',
    description: 'ヘルプを表示します',
    action: async () => ({
      type: 4,
      data: {
        content: 'ヘルプはこちら\n(https://github.com/BuntinJP/badcompany)',
      },
    }),
  },
  {
    name: 'hello',
    description: '挨拶します',
    action: async () => ({
      type: 4,
      data: {
        content: 'Hello, Cloudflare Worker!',
      },
    }),
  },
  {
    name: 'hnti',
    description: '^^',
    action: async () => {
      const imageUrl = await getImageUrl(testurl);
      return {
        type: 4,
        data: {
          content: imageUrl,
        },
      };
    },
  },
  {
    name: 'invite',
    description: 'このbotを招待します',
    action: async (env: any) => {
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
  },
  {
    name: 'me-titles',
    description: 'manga-eaterサーバーのタイトル一覧を返します。',
    action: async () => {
      const directory: DirectoryOutbound = await (
        await fetch('https://manga.buntin.xyz/directory')
      ).json();
      return {
        type: 4,
        data: {
          content: createTable(directory),
        },
      };
    },
  },
  {
    name: 'me-directory',
    description: 'manga-eaterサーバーのディレクトリ一覧を返します。',
    action: async () => {
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
  },
]; */
