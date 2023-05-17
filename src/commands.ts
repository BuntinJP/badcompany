import { SlashCommandBuilder } from '@discordjs/builders';

export const commands: SlashCommandBuilder[] = [
  new SlashCommandBuilder().setName('ping').setDescription('ping pong'),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('ヘルプを表示します'),
  new SlashCommandBuilder().setName('hello').setDescription('挨拶します'),
  new SlashCommandBuilder().setName('hnti').setDescription('E-Girlガチャ'),
  new SlashCommandBuilder()
    .setName('invite')
    .setDescription('このbotを招待します'),
  new SlashCommandBuilder()
    .setName('me-titles')
    .setDescription('manga-eaterサーバーのタイトル一覧を返します。'),
  new SlashCommandBuilder()
    .setName('me-directory')
    .setDescription('manga-eaterサーバーのディレクトリ一覧を返します。'),
];
