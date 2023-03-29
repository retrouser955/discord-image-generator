# AI Image generator bot

discord-image-generator is a Discord bot that is able to use [Hugging Face](https://huggingface.co) to generate AI images based on prompts. Discord image generator support two models: Stable Diffusion and Open Journey!

## Deploying

First thing first, install NodeJS from their official [Website](https://nodejs.org)  
Now start up a new terminal/command prompt/powershell session and type in the following commands

```bash
cd path/to/a/folder
git clone https://github.com/retrouser955/discord-image-generator.git
cd discord-image-generator
npm install
```

### Creating a hugging face account

Create a [hugging face](https://huggingface.co) account.  
Click on your profile icon -> settings -> access tokens and create a new token  

### Creating a Discord bot account

Follow the instructions at [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html) to create a bot account

### Starting the bot

Type in the following commands in the same powershell session as step 1

```bash
npm start
```

*If all goes well, you should see `[ Info ] : Logged into Discord as Your Bot Name#Tag` in powershell*

Then fill in `.env.example` and rename it to `.env`.