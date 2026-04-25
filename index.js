const { Client, GatewayIntentBits, PermissionsBitField, ChannelType } = require('discord.js');
const express = require('express');

console.log('STARTING BOT FILE...');

const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web server running on port ${PORT}`);
});

const token = process.env.TOKEN;

console.log('TOKEN LOADED:', token ? 'YES' : 'NO');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith('!channel')) return;

  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return message.reply('❌ You need Manage Channels.');
  }

  const user = message.mentions.users.first();
  if (!user) return message.reply('Use: `!channel @user`');

  const random = Math.floor(1000 + Math.random() * 9000);
  const channelName = `client-${random}`;

  try {
    const channel = await message.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: '1497403261399859351',
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.AddReactions,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        },
        {
          id: message.author.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.AddReactions,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }
      ]
    });

    message.reply(`✅ Created private channel ${channel} for ${user}`);
  } catch (error) {
    console.error('CHANNEL ERROR:', error);
    message.reply('❌ Error creating channel.');
  }
});

client.login(token).catch((error) => {
  console.error('LOGIN ERROR:', error);
});
