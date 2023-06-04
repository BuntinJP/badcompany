import {
  APIBaseInteraction,
  APIChatInputApplicationCommandInteractionData,
  RESTPostAPIApplicationCommandsJSONBody,
  InteractionType,
  RESTPostAPIInteractionCallbackJSONBody,
  APIModalInteractionResponseCallbackData,
  InteractionResponseType,
  APIActionRowComponent,
  APIModalActionRowComponent,
  APIModalInteractionResponse,
  APIStringSelectComponent,
  APISelectMenuComponent,
  APIButtonComponent,
  APIApplicationCommandInteractionDataBasicOption,
} from 'discord-api-types/v10';

type ExtendedAPIModalActionRowComponet =
  | APIModalActionRowComponent
  | APISelectMenuComponent
  | APIButtonComponent;

export type BaseOption = APIApplicationCommandInteractionDataBasicOption;

export type ExtendedAPIModalInteractionResponseCallbackData = {
  /**
   * A developer-defined identifier for the component, max 100 characters
   */
  custom_id: string;
  /**
   * The title of the popup modal
   */
  title: string;
  /**
   * Between 1 and 5 (inclusive) components that make up the modal
   */
  components: APIActionRowComponent<ExtendedAPIModalActionRowComponet>[];
};

export type ExtendedAPIModalInteractionResponse = {
  type: InteractionResponseType.Modal;
  data: ExtendedAPIModalInteractionResponseCallbackData;
};

export type ExtendedRESTPostAPIInteractionCallbackJSONBody =
  | RESTPostAPIInteractionCallbackJSONBody
  | ExtendedAPIModalInteractionResponse;

//export type Options = APIApplicationCommandInteractionDataOption[];

export type CommandEntity = RESTPostAPIApplicationCommandsJSONBody;
export type CommandAction = (
  env: Env,
  data?: ACInteraction
) => Promise<ExtendedRESTPostAPIInteractionCallbackJSONBody>;

export interface Command {
  entity: CommandEntity;
  action?: CommandAction;
}

export interface BC_GeneralPayload {
  type: string;
  eventInfo: {
    guild_id: string;
    channel_id: string;
    token: string;
    app_id: string;
  };
  data: any;
}

export type ACInteraction = APIBaseInteraction<
  InteractionType,
  APIChatInputApplicationCommandInteractionData
>;

type BCTask = {
  type: string;
  url?: string;
  id: string;
  channelId?: string;
};

export type BCState = {
  version: string;
  queue: BCTask[];
  isProcessing: boolean;
};

interface Archive {
  title: string;
  episodes: string[];
}
export interface DirectoryOutbound {
  titles: string[];
  outbound: Archive[];
}

export interface Validability {
  isValid: boolean;
  interaction?: ACInteraction;
}
