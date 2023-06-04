/**
 * @fileoverview Cloudflare Worker メインエントリー
 */

import { Router, IRequest } from 'itty-router';
import { verifyKey } from 'discord-interactions';
import { commandsWithAction } from './commandsActions';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-api-types/v10';
import { ACInteraction, Validability } from './types';

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

router.post('/', async (request, env) => {
  const { isValid, interaction } = await parseReqest(request, env);
  if (!isValid || !interaction) {
    return new JsonResponse({ error: 'Invalid Request' }, { status: 400 });
  }
  console.log(JSON.stringify(interaction, null, 2));
  const handlers: Record<
    InteractionType,
    (env: Env, interaction: ACInteraction) => Promise<JsonResponse>
  > = {
    [InteractionType.Ping]: async () => {
      console.log('Handling Ping request');
      return new JsonResponse({
        type: InteractionResponseType.Pong,
      });
    },
    [InteractionType.ApplicationCommand]: async (env, interaction) => {
      console.log(JSON.stringify(interaction, null, 2));
      console.log('Handling ApplicationCommand request');
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
        return new JsonResponse({ error: 'Unknown command' }, { status: 400 });
      }
    },
    [InteractionType.ModalSubmit]: async (env, interaction) => {
      console.log('Handling ModalSubmit request');
      const data = interaction.data;
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
    },
    [InteractionType.MessageComponent]: async (env, interaction) => {
      console.log('Handling ModalSubmit request');
      const data = interaction.data;
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
    },
    [InteractionType.ApplicationCommandAutocomplete]: async (
      env,
      interaction
    ) => {
      console.log('Handling ApplicationCommandAutocomplete request');
      return new JsonResponse({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'ApplicationCommandAutocomplete',
          allowed_mentions: {
            parse: [],
          },
          flags: 64,
        },
      });
    },
  };
  const handler = handlers[interaction.type];
  if (handler) {
    return handler(env, interaction);
  } else {
    return new JsonResponse(
      { error: 'Unknown interaction type' },
      { status: 400 }
    );
  }
});

router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  async fetch(req: Request, env: Env) {
    return router.handle(req, env);
  },
};

const parseReqest = async (req: IRequest, env: Env) => {
  const sig = req.headers.get('X-Signature-Ed25519') || undefined;
  const ts = req.headers.get('X-Signature-Timestamp') || undefined;
  const b = await req.text();
  const isValid = sig && ts && verifyKey(b, sig, ts, env.DISCORD_PUBLIC_KEY);
  if (!isValid) {
    return { isValid: false } as Validability;
  }
  return { isValid: true, interaction: JSON.parse(b) as ACInteraction };
};

/*   //ping
  if (_ixnType === InteractionType.Ping) {
    console.log('Handling Ping request');
    return new JsonResponse({
      type: InteractionResponseType.Pong,
    });
  }
  //application command
  if (_ixnType === InteractionType.ApplicationCommand) {
    console.log('Handling ApplicationCommand request');
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
      return new JsonResponse({ error: 'Unknown command' }, { status: 400 });
    }
  }
  //modal submit
  if (_ixnType === InteractionType.ModalSubmit) {
    console.log('Handling ModalSubmit request');
    const data = interaction.data;
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
    const data = interaction.data;
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
  } */
