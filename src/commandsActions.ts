import {getImageUrl} from './utils/reddit';
import {Command, CommandAction} from './types';
import {commands} from './commands';
//import { ModalBuilder } from 'discord.js';
import * as testModal from './modals/testModal.json';
import * as dcUtils from './utils/discordUtils';
import * as scUtils from './utils/scrapeUtils';
import {ExtendedAPIModalInteractionResponse, BaseOption, BC_GeneralPayload} from './types';

const msg = 4;
const deffer = 5;
const modal = 9;

import * as dc from './utils/discordUtils';
import {InteractionResponseType} from 'discord.js';

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
  async (env) => {
    const serverUrl = env.SERVER_URL;
    const state = await fetch(`${serverUrl}/version/info`);
    return {
      type: msg,
      data: {
        content: `Cloudflare Worker Bot Client Version : ${env.VERSION}\nServerStatus:\n${JSON.stringify((await state.json()), null, 2)}`,
      },
    }
  },
  //help
  async () => ({
    type: msg,
    data: {
      content: 'ヘルプはこちら\n(https://github.com/BuntinJP/badcompany)',
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
  async (env) => {
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
  //'me-fetch-mangarawjp.io'
  async (env, interaction) => {
    const data = interaction?.data;
    const ops = data?.options as BaseOption[];
    if (!ops) return {
      type: msg,
      data: {
        content: 'no options',
      },
    };
    //check url serquence
    let [ urlops, ifPushops ] = ops;
    const url = urlops.value as string;
    const isValid = scUtils.checkUrl((url as unknown) as string);
    if (!isValid) return {
      type: msg,
      data: {
        content:
          `url is invalid\nurl:'${url}'`,
      },
    };
    //create payload
    const id = interaction?.id;
    const token = interaction?.token;
    const guild_id = interaction?.guild_id || '0';
    const channel_id = interaction?.channel?.id || '0';
    if (!id || !token) return {
      type: msg,
      data: {
        content: 'id or token is empty',
      },
    }
    const ifPush = (!ifPushops?.value || ifPushops.value === 'false') ? false : true;
    const pl: BC_GeneralPayload = {
      type: ifPush ? 'deferred-fetch-push' : 'deferred-fetch',
      eventInfo: {
        guild_id: guild_id,
        channel_id: channel_id,
        token: token,
        app_id: env.DISCORD_APPLICATION_ID,
      },
      data: {
        content: 'deferred',
      },
    };
    //check server
    if (!(await scUtils.checkMEserver(`${env.SERVER_URL}/version`))) {
      return {
        type: msg,
        data: {
          content: 'server is down',
        },
      };
    }
    fetch(`${env.SERVER_URL}/badcompany`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pl),
    });
    //send defer
    return {
      type: deffer,
    };
  },
  //'defer-test'
  async (env, interaction) => {
    return {
      type: 5,
    }
  }
];

export const commandsWithAction: Command[] = commands.map((command, index) => ({
  entity: command,
  action: actions[ index ],
}));
