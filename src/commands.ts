import { getImageUrl } from './reddit';

const testurl = 'https://www.reddit.com/r/FutaCum/hot.json';

interface Command {
  name: string;
  description: string;
  action?: (env: any) => Promise<any>;
}

const commands: Command[] = [
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
];

export { commands };
export type { Command };
