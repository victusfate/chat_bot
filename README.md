# chat_bot


setup your own by copying config_sample.json to config.json adding your discord and openai keys

connect via discord:
https://discord.com/developers/applications (setup your app)

then paste the generated url into a browser, to connect to your discord server(s) 
looks something like this:
https://discord.com/api/oauth2/authorize?client_id=<your_client_id>&permissions=274877979648&scope=bot

to run the bot:  
npm i  
node index  


quick code structure:
index.js -> main bot listener
lib/config.js -> configuration params
lib/openai.js -> openai interface to chat gpt 3.5 turbo (cheap/fast)
