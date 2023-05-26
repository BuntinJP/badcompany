import {
  APIBaseInteraction,
  APIChatInputApplicationCommandInteractionData,
  RESTPostAPIApplicationCommandsJSONBody,
  InteractionType,
  RESTPostAPIInteractionCallbackJSONBody,
  APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10';

//export type Options = APIApplicationCommandInteractionDataOption[];

export type CommandEntity = RESTPostAPIApplicationCommandsJSONBody;
export type CommandAction = (
  env: Env,
  data?: APIChatInputApplicationCommandInteractionData
) => Promise<RESTPostAPIInteractionCallbackJSONBody>;

export interface Command {
  entity: CommandEntity;
  action?: CommandAction;
}

export type ACInteraction = APIBaseInteraction<
  InteractionType,
  APIChatInputApplicationCommandInteractionData
>;

export type Modaldata = APIModalInteractionResponseCallbackData;
