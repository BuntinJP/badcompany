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
    const command = commands.find(
      (cmd) => cmd.name.toLowerCase() === message.data.name.toLowerCase()
    );

    if (command && command.action) {
      console.log(`Handling command: ${command.name}`);
      const response = await command.action(env);
      return new JsonResponse(response);
    } else {
      console.error('Unknown command');
      return new JsonResponse({ error: 'Unknown command' }, { status: 400 });
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
