import Discord   from 'discord.js'
import config    from './lib/config.js'
import OpenAI    from './lib/openai.js'

const myIntents = new Discord.IntentsBitField([
  Discord.GatewayIntentBits.DirectMessages,
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent
]);

const client = new Discord.Client({ intents: myIntents });


// permissions 3213312 read, send messages, voice: connect, speak
client.once('ready', () => {
  console.log('Bot is ready!')
});

client.on('messageCreate', async message => {
  console.log('received message (',message.content,')')
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.channel.send('Pong!')
    return
  }

  if (message.content.startsWith('!gmbot')) {
    const query = message.content.slice(7).trim();
    if (query.length === 0) {
      message.channel.send('Please provide a query. Example: !dmbot generate an interesting NPC.');
      return;
    }

    const prompt = `As a Dungeon Master's assistant, ${query}`;
    const response = await askOpenAI(prompt);
    message.channel.send(response);
    return
  }


  if (message.mentions.has(client.user.id)) {
    // const mentionRegex = new RegExp(`^<@${client.user.id}>`); // RegExp to match mention of the bot
    // const query = message.content.replace(mentionRegex, '').trim(); // Remove mention and extract query
    const query = message.content.slice(23).trim();
    console.log('query',query)


    if (query.length === 0) {
      message.channel.send('Please provide a query. Example: @gm_bot generate an interesting NPC.');
      return;
    }

    const prompt = `As a Dungeon Master's assistant, ${query}`;
    console.log('prompt',prompt)
    let iLimit = 10
    async function getMessages(iLimit, prompt) {
      const fetchedMessages = await message.channel.messages.fetch({ limit: iLimit });
      let aMessages = []
      for (let m of fetchedMessages.values()) {
        console.log('m',m)
        aMessages.push({ role: 'user', name: m.author.username, content: m.content})
      }
      aMessages.push({ role: 'user', name: message.author.username, content: prompt})
      return aMessages
    }
    let aMessages = await getMessages(iLimit, prompt)
    // let promptRequest = prompt
    while (OpenAI.countTokens(JSON.stringify(aMessages)) > 4000) {
      iLimit = iLimit - 1
      aMessages = await getMessages(iLimit, prompt)
    }
    console.log({aMessages: aMessages})
    const response = await OpenAI.askOpenAI(aMessages);
    message.channel.send(response);
    return
  }
});


client.login(config.discord_bot.token);
