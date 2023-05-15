import { REST, Routes } from 'discord.js';
import fs from 'fs';
const { client_id, token } = JSON.parse(
  fs.readFileSync('./config.json', 'utf8')
);

const commandId = '';
const guildId = '';
const ifGuildOnly = true;

const rest = new REST().setToken(token);

if (ifGuildOnly) {
  rest
    .put(Routes.applicationGuildCommands(client_id, guildId), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);
} else {
  rest
    .delete(Routes.applicationCommand(client_id, commandId))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);
}
