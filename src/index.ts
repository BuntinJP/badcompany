/**
 * @fileoverview Cloudflare Worker メインエントリー
 */

import {Router} from 'itty-router';
import {verifyKey} from 'discord-interactions';
import {commandsWithAction} from './commandsActions';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-api-types/v10';
import {ACInteraction} from './types';

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
  return new Response(`👋 ${JSON.stringify(env, null, 4)}`);
});

router.post('/', async (request, env: Env) => {
  const jsonBody = await request.json();
  const _ixnType: InteractionType = jsonBody.type;
  //ping
  if (_ixnType === InteractionType.Ping) {
    console.log('Handling Ping request');
    return new JsonResponse({
      type: InteractionResponseType.Pong,
    });
  }
  //application command
  if (_ixnType === InteractionType.ApplicationCommand) {
    console.log('Handling ApplicationCommand request');
    const interaction: ACInteraction = jsonBody;
    const command = commandsWithAction.find(
      (c) =>
        c.entity.name.toLowerCase() === interaction.data?.name.toLowerCase()
    );
    if (command && command.action) {
      //コマンド実行
      console.log(`Handling command: ${command.entity.name}`);
      return new JsonResponse(await command.action(env, interaction));
    } else {
      //コマンドなし
      console.error('Unknown command');
      return new JsonResponse({error: 'Unknown command'}, {status: 400});
    }
  }
  //modal submit
  if (_ixnType === InteractionType.ModalSubmit) {
    console.log('Handling ModalSubmit request');
    const data: any = jsonBody.data;
    //write a json file
    const json = JSON.stringify(data);
    return new JsonResponse({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: json,
        allowed_mentions: {
          parse: [],
        },
        flags: 64,
      },
    });

  }
  //message component
  if (_ixnType === InteractionType.MessageComponent) {
    //
    console.log('Handling MessageComponent request');
    const data: any = jsonBody.data;
    //write a json file
    const json = JSON.stringify(data);
    return new JsonResponse({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: json,
        allowed_mentions: {
          parse: [],
        },
        flags: 64,
      },
    });
  }
  console.error('Unknown Type');
  return new JsonResponse({error: 'Unknown Type'}, {status: 400});
});

router.all('*', () => new Response('Not Found', {status: 404}));

export default {
  async fetch(request: Request, env: Env) {
    const signature = request.headers.get('X-Signature-Ed25519') || '';
    const timestamp = request.headers.get('X-Signature-Timestamp') || '';
    const body = await request.clone().arrayBuffer();
    const isValidRequest = verifyKey(
      body,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY
    );
    if (!isValidRequest) {
      return new Response('Invalid request signature', {status: 401});
    }
    return router.handle(request, env);
  },
};
