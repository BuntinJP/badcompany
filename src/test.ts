import {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
} from '@discordjs/builders';

// Create the modal
const modal = new ModalBuilder().setCustomId('myModal').setTitle('My Modal');

// Add components to modal

// Create the text input components
const favoriteColorInput = new TextInputBuilder()
  .setCustomId('favoriteColorInput')
  // The label is the prompt the user sees for this input
  .setLabel("What's your favorite color?")
  // Short means only a single line of text
  .setStyle(1);

const hobbiesInput = new TextInputBuilder()
  .setCustomId('hobbiesInput')
  .setLabel("What's some of your favorite hobbies?")
  // Paragraph means multiple lines of text.
  .setStyle(2);

const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

// Add inputs to the modal
modal.addComponents(firstActionRow, secondActionRow);
