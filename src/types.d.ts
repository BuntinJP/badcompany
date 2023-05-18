import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  APIApplicationCommandInteractionDataOption,
  APIBaseInteraction,
  APIChatInputApplicationCommandInteractionData,
  InteractionType,
} from 'discord-api-types/v10';

export type Options = APIApplicationCommandInteractionDataOption[];

export type CommandEntity = RESTPostAPIChatInputApplicationCommandsJSONBody;
export type CommandAction = (env: Env, option?: Options) => Promise<any>;

export interface Command {
  entity: CommandEntity;
  action?: CommandAction;
}

export type Interaction = APIBaseInteraction<
  InteractionType,
  APIChatInputApplicationCommandInteractionData
>;
