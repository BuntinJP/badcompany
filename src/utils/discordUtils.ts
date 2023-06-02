import { ExtendedAPIModalInteractionResponseCallbackData, ExtendedRESTPostAPIInteractionCallbackJSONBody } from '../types';
import { sleep } from './meUtils';
export const genTable = (a: string[]) => {
  const iLen = a.length.toString().length;
  const vLen = Math.max(...a.map((x) => x.length));
  const sep = '-'.repeat(
    Math.max(iLen, 'index'.length) + Math.max(vLen, 'array[index]'.length) + 7
  );
  let tbl = `\n${ sep }\n| ${ 'index'.padEnd(iLen) } | ${ 'array[index]'.padEnd(
    vLen
  ) } |\n${ sep }\n`;
  a.forEach(
    (v, i) => (tbl += `| ${ i.toString().padEnd(iLen) } | ${ v.padEnd(vLen) } \n`)
  );
  return '```' + tbl + sep + '\n```';
};

export const genModal = (title: string, custom_id: string) => {
  //
  const t: ExtendedAPIModalInteractionResponseCallbackData = {
    title: title,
    custom_id: custom_id,
    components: [
      {
        type: 1,
        components: [
          {
            type: 3,
            custom_id: "class_select_1",
            options: [
              {
                label: "Rogue",
                value: "rogue",
                description: "Sneak n stab",
                emoji: {
                  name: "rogue",
                  id: "625891304148303894"
                }
              },
              {
                label: "Mage",
                value: "mage",
                description: "Turn 'em into a sheep",
                emoji: {
                  name: "mage",
                  id: "625891304081063986"
                }
              },
              {
                label: "Priest",
                value: "priest",
                description: "You get heals when I'm done doing damage",
                emoji: {
                  name: "priest",
                  id: "625891303795982337"
                }
              }
            ],
            placeholder: "Choose a class",
            min_values: 1,
            max_values: 3
          }
        ]
      }
    ]
  };
  const tt: ExtendedAPIModalInteractionResponseCallbackData = {
    title: "My First Modal",
    custom_id: "modal_1",
    "components": [
      {
        "type": 1,
        "components": [
          {
            "type": 2,
            "label": "Click me!",
            "style": 1,
            "custom_id": "click_one"
          }
        ]
      }
    ]
  }
  return tt;
}

export const respondDiscordInteraction = (id: string, token: string, data: ExtendedRESTPostAPIInteractionCallbackJSONBody) => {
  return fetch(`https://discord.com/api/v10/interactions/${ id }/${ token }/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
