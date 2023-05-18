import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandEntity } from './types';

export const commands: CommandEntity[] = [
  new SlashCommandBuilder()
    .setName('info')
    .setDescription('botに関する情報を表示します。')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('ヘルプを表示します')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('hello')
    .setDescription('挨拶します')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('hnti')
    .setDescription('E-Girlガチャ')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('invite')
    .setDescription('このbotを招待します')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('me-titles')
    .setDescription('manga-eaterサーバーのタイトル一覧を返します。')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('me-title')
    .setDescription('manga-eaterサーバーのタイトルを返します。')
    .addIntegerOption((option) =>
      option.setName('id').setDescription('タイトルのID').setRequired(true)
    )
    .toJSON(),
];
