const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const express = require('express');

// ===== KEEP ALIVE SERVER (FOR RENDER) =====
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// ===== DISCORD BOT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!channel')) return;

  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return message.reply('You need Manage Channels.');
  }

  const user = message.mentions.users.first();
  if (!user) return message.reply('Mention a user.');

  const random = Math.floor(1000 + Math.random() * 9000);
  const name = `client-${random}`;

  try {
    const channel = await message.guild.channels.create({
      name: name,
      type: 0,
      parent: '1497403261399859351', // your category ID
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['ViewChannel']
        },
        {
          id: user.id,
          allow: ['ViewChannel', 'SendMessages', 'AttachFiles', 'AddReactions', 'ReadMessageHistory']
        },
        {
          id: message.author.id,
          allow: ['ViewChannel', 'SendMessages', 'AttachFiles', 'AddReactions', 'ReadMessageHistory']
        }
      ]
    });

    message.reply(`✅ Created private channel ${channel} for ${user}`);
  } catch (err) {
    console.error(err);
    message.reply('Error creating channel.');
  }
});

client.login(process.env.TOKEN);
