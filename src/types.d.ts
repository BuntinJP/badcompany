import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  APIApplicationCommandInteractionDataOption,
  APIBaseInteraction,
  APIChatInputApplicationCommandInteractionData,
  RESTPostAPIApplicationCommandsJSONBody,
  InteractionType,
} from 'discord-api-types/v10';

export type Options = APIApplicationCommandInteractionDataOption[];

export type CommandEntity = RESTPostAPIApplicationCommandsJSONBody;
export type CommandAction = (
  env: Env,
  option?: Options,
  data?: APIChatInputApplicationCommandInteractionData
) => Promise<any>;

export interface Command {
  entity: CommandEntity;
  action?: CommandAction;
}

export type Interaction = APIBaseInteraction<
  InteractionType,
  APIChatInputApplicationCommandInteractionData
>;
