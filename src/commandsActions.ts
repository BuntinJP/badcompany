import { getImageUrl } from './utils/reddit';
import { Command, CommandAction } from './types';
import { commands } from './commands';

import * as dc from './utils/discordUtils';

interface Archive {
  title: string;
  episodes: string[];
}
interface DirectoryOutbound {
  titles: string[];
  outbound: Archive[];
}

const testurl = 'https://www.reddit.com/r/EGirls/hot.json';

const info = `mode:"production"|"develop" => "debug\nserver:string => "manga.buntin.xyz\nstate:string => "running"\nversion:string => "0.0.1"\nuptime:string => "0:00:00"\n`;
const actions: CommandAction[] = [
  //info
  async (env) => ({
    type: 4,
    data: {
      content: info,
    },
  }),
  //help
  async () => ({
    type: 4,
    data: {
      content: 'ヘルプはこちら\n(https://github.com/BuntinJP/badcompany)',
    },
  }),
  //hello
  async () => ({
    type: 4,
    data: {
      content: 'Hello, Cloudflare Worker!',
    },
  }),
  //hnti
  async () => {
    const imageUrl = await getImageUrl(testurl);
    return {
      type: 4,
      data: {
        content: imageUrl,
      },
    };
  },
  //invite
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
  //me-title
  async (env, options) => {
    if (!options) {
      console.log('optionsがありません');
      return {
        type: 4,
        data: {
          content: 'optionsがありません',
        },
      };
    } else {
      console.log('options');
      console.log(options);
    }
    return {
      type: 4,
      data: {
        content:
          'command: me-title\n payload:\n' + JSON.stringify(options, null, 2),
      },
    };
  },
];

export const commandsWithAction: Command[] = commands.map((command, index) => ({
  entity: command,
  action: actions[index],
}));
