# Dify Bot

#### [Website](https://dify.ai) • [Docs](https://docs.dify.ai) • [Twitter](https://twitter.com/dify_ai)
## Description

A unified bot for Discord and Slack and etc. Powered by [Dify.AI](https://dify.ai/).

### Supported Platforms

- [x] Slack
- [x] Discord
- [ ] Coming Soon

## Before you start

```bash
DEBUG=debug
MODE=chat # chat or completion
ADAPTER=slack
# Dify 
DIFY_API_KEY=app-OxxxxxxxxxxxxxTxxxxxxx
# Slack
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxx-xxxxxxxxxxxxx-V25CBgH7347xxxxxxxxxxxxx
SLACK_APP_TOKEN=xapp-1-A05KP4WSVS4-xxxxxxxxxxxxx-4208xxxxxxxxxxxxxca9dxxxxxxxxxxxxxc33a0d8bb311d40axxxxxxxxxxxxx
# Discord
DISCORD_TOKEN=MTExMjAyMTMxOxxxxxxxxxxxxx.GkPR5t.xIrYZxxxxxxxxxxxxxBN1jqkxxxxxxxxxxxxx
DISCORD_ID=1112021318955708487
```

- For Slack bot you need to create a bot user and install the app to your workspace. You need SLACK_BOT_TOKEN and SLACK_APP_TOKEN to run the bot. You can find the tokens in the [Slack API](https://api.slack.com/apps) page.

- For Discord bot you need to create a bot user and get the token in the [Discord Developer Portal](https://discord.com/developers/applications). You nded DISCORD_TOKEN and DISCORD_ID to run the bot. You can find the tokens in the [Discord Developer Portal](https://discord.com/developers/applications) as well.

## OAuth Scopes

TODO
## Installation

You will need node.js 20.0.0 or newer.

```bash
cp /env.example .env
npm install
```

## Usage

```bash
npm run build
npm run start
```
docker build . -t pinkbanana/bot:latest
## Development

```bash
npm run dev
```

## Production

```
docker build . -t pinkbanana/bot:latest
docker run -it --env-file .env pinkbanana/bot:latest
```

## License

MIT License

## Author

- [小红书](https://www.xiaohongshu.com/user/profile/55b646aa3397db5ad6136b9c) 点个关注 ➕
