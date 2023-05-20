import { getImageUrl } from './utils/reddit';
import { Command, CommandAction } from './types';
import { commands } from './commands';
//import { ModalBuilder } from 'discord.js';
import * as testModal from './modals/testModal.json';
import { Modaldata } from './types';

const msg = 4;
const modal = 9;

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
    type: msg,
    data: {
      content: info,
    },
  }),
  //help
  async () => ({
    type: msg,
    data: {
      content: 'ヘルプはこちら\n(https://github.com/BuntinJP/badcompany)',
    },
  }),
  //hello
  async () => ({
    type: msg,
    data: {
      content: 'Hello, Cloudflare Worker!',
    },
  }),
  //hnti
  async () => {
    const imageUrl = await getImageUrl(testurl);
    return {
      type: msg,
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
      type: msg,
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
      type: msg,
      data: {
        content: dc.genTable(titles),
      },
    };
  },
  //me-title
  async (env, options) => {
    return {
      type: msg,
      data: {
        content:
          'command: me-title\n payload:\n' + JSON.stringify(options, null, 2),
      },
    };
  },
  //modal-test
  async () => {
    const tt: Modaldata = testModal;
    return {
      type: modal,
      data: tt,
    };
  },
];

export const commandsWithAction: Command[] = commands.map((command, index) => ({
  entity: command,
  action: actions[index],
}));
