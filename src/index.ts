/**
 * @fileoverview Cloudflare Worker メインエントリー
 */

import { Router } from 'itty-router';
import { verifyKey } from 'discord-interactions';
import { commandsWithAction } from './commandsActions';
import { SlashCommandBuilder } from 'discord.js';
import {
  APIBaseInteraction,
  APIChatInputApplicationCommandInteractionData,
  InteractionType,
  InteractionResponseType,
  APIApplicationCommandInteractionDataOption
} from 'discord.js';

type Interaction = APIBaseInteraction<
  InteractionType,
  APIChatInputApplicationCommandInteractionData
>;

export interface Command {
  entity: SlashCommandBuilder;
  action?: CommandAction;
}
export type CommandAction = (env: Env, option?: APIApplicationCommandInteractionDataOption[]) => Promise<any>;


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

router.post('/', async (request, env: Env) => {
  const interaction: Interaction = await request.json();
  if (interaction.type === InteractionType.Ping) {
    console.log('Handling Ping request');
    return new JsonResponse({
      type: InteractionResponseType.Pong,
    });
  }
  if (interaction.type === InteractionType.ApplicationCommand) {
    const command = commandsWithAction.find(
      (c) => c.entity.name.toLowerCase() === interaction.data?.name.toLowerCase()
    );
    if (command && command.action) {
      //コマンド実行
      console.log(`Handling command: ${command.entity.name}`);
      return new JsonResponse(await command.action(env, interaction.data?.options));
    } else {
      //コマンドなし
      console.error('Unknown command');
      return new JsonResponse({ error: 'Unknown command' }, { status: 400 });
    }
  }
  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  async fetch(request: Request, env: Env) {
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
