# Nebula's backend
welcome to the backend of Nebula, a network of spaghetti code that handles the bulk of what Nebula does.

## Setting up (v1.0 or below):
### Prerequisites (that is one annoying word):
- node, not sure what version is the minimum but i use v22.8.0
- i use pnpm 9.6.0 but i think(?) you can just use npm
- typescript. `pnpm i -g typescript`
- a bot on discord (google if you dont know how to get one of those)

### ok how do i actually do the funny
1. open your terminal of choice and navigate to the server-side directory.
2. pnpm i 
3. edit the first few lines of index.ts (namely, the guild and channel id one)
4. tsc
5. use your operating system's way to set the environment variable BOT_TOKEN to the token of the bot
6. node index.js
7. profit
