import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandEntity } from './types';

export const commands: CommandEntity[] = [
  new SlashCommandBuilder()
    .setName( 'info' )
    .setDescription( 'botに関する情報を表示します。' )
    .toJSON(),
  new SlashCommandBuilder()
    .setName( 'help' )
    .setDescription( 'ヘルプを表示します' )
    .toJSON(),
  new SlashCommandBuilder()
    .setName( 'hnti' )
    .setDescription( 'E-Girlガチャ' )
    .toJSON(),
  new SlashCommandBuilder()
    .setName( 'invite' )
    .setDescription( 'このbotを招待します' )
    .toJSON(),
  new SlashCommandBuilder()
    .setName( 'me-titles' )
    .setDescription( 'manga-eaterサーバーのタイトル一覧を返します。' )
    .toJSON(),
  new SlashCommandBuilder()
    .setName( 'me-title' )
    .setDescription( 'manga-eaterサーバーのタイトルを返します。' )
    .addIntegerOption( ( option ) =>
      option.setName( 'id' ).setDescription( 'タイトルのID' ).setRequired( true )
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName( 'me-fetch-mangarawjp' )
    .setDescription( '指定タイトルの指定話数をフェッチします。' )
    .addStringOption( ( option ) =>
      option.setName( 'url' ).setDescription( 'mangarawurl' ).setRequired( true )
    )
    .addBooleanOption( ( option ) =>
      option.setName( 'ifpush' ).setDescription( 'ここにDLするか' ).setRequired( false )
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName( 'defer-test' )
    .setDescription( 'deferテスト' )
    .toJSON(),
];
