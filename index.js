const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
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

  const channel = await message.guild.channels.create({
    name: name,
    type: 0, // text channel
    parent: '1497403261399859351',
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

  message.reply(`✅ Created ${channel}`);
});

client.login(process.env.TOKEN);