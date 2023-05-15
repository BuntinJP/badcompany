/**
 * @fileoverview Cloudflare Worker メインエントリー
 */

import { Router } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { commands } from './commands';
import { getImageUrl } from './reddit';

const testurl = 'https://www.reddit.com/r/FutaCum/hot.json';

class JsonResponse extends Response {
  constructor(body: any, init?: ResponseInit) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}
const router = Router();

router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

router.post('/', async (request, env) => {
  const message = await request.json();
  console.log(message);
  if (message.type === InteractionType.PING) {
    console.log('Handling Ping request');
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }
  if (message.type === InteractionType.APPLICATION_COMMAND) {
    //handle slash commands
    switch (message.data.name.toLowerCase()) {
      case commands[0].name.toLowerCase(): {
        return new JsonResponse({
          type: 4,
          data: {
            content: 'pong',
          },
        });
      }
      case commands[1].name.toLowerCase(): {
        return new JsonResponse({
          type: 4,
          data: {
            content: 'ヘルプはこちら\n(https://github.com/BuntinJP/badcompany)',
          },
        });
      }
      case commands[2].name.toLowerCase(): {
        return new JsonResponse({
          type: 4,
          data: {
            content: 'Hello, Cloudflare Worker!',
          },
        });
      }
      case commands[3].name.toLowerCase(): {
        const imageUrl = await getImageUrl(testurl);
        return new JsonResponse({
          type: 4,
          data: {
            content: imageUrl,
          },
        });
      }
      case commands[4].name.toLowerCase(): {
        const applicationId = env.DISCORD_APPLICATION_ID;
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
        return new JsonResponse({
          type: 4,
          data: {
            content: INVITE_URL,
            flags: 64,
          },
        });
      }
      default:
        console.error('Unknown Command');
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  }
  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  async fetch(request: Request, env: any) {
    const signature = request.headers.get('X-Signature-Ed25519') || '';
    const timestamp = request.headers.get('X-Signature-Timestamp') || '';
    const body = await request.clone().arrayBuffer();
    console.log(signature, timestamp, env.DISCORD_PUBLIC_KEY);
    const isValidRequest = verifyKey(
      body,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY
    );
    if (!isValidRequest) {
      return new Response('Invalid request signature', { status: 401 });
    }
    return router.handle(request, env);
  },
};
