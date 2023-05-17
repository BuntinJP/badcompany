/**
 * @fileoverview
 * DiscordAPIで、commands.tsに定義されたコマンドを登録する
 */

import fs from 'fs';
import { commands } from './commands.js';

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const token = config.token;
const applicationId = config.appId;
//必要情報のチェック
if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.'
  );
}

(async () => {
  const t = commands.map((command) => {
    return command.toJSON();
  });
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  console.log('Registering commands');
  console.log(commands);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(t),
  });

  if (response.ok) {
    console.log('Registered all commands');
  } else {
    console.error('Error registering commands');
    const text = await response.text();
    console.error(text);
  }
  return response;
})();
