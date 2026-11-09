import { Bot } from 'yapin';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const token = process.env.YAPPER_BOT_TOKEN;
const assetDir = process.env.YAPMOJI_ASSET_DIR ?? join(process.cwd(), 'assets');
const statePath = process.env.YAPMOJI_STATE_PATH ?? join(process.cwd(), 'state.json');

if (!token) {
  throw new Error('YAPPER_BOT_TOKEN is required.');
}

const bot = new Bot(token);
const state = loadState();

bot.command('ping', 'Check Yapmoji bot responsiveness.', async (msg) => {
  const startedAt = performance.now();
  await msg.reply('pong');
  const latency = Math.round(performance.now() - startedAt);
  await msg.reply(`Yapmoji is online. Latency: ${latency}ms.`);
});

bot.command('add', 'Add an approved Yapmoji emoji by key.', async (msg) => {
  const key = normalizeKey(msg.argv[0]);
  if (!key) return msg.reply('Usage: /add <emoji-key>');

  const asset = resolveAsset(key);
  if (!asset) return msg.reply(`No approved Yapmoji asset found for “${key}”.`);

  const serverId = msg.server_id;
  if (!serverId) return msg.reply('This command is only available in a server.');

  const existing = state[serverId]?.[key];
  if (existing) return msg.reply(`“${key}” is already installed in this server.`);

  const name = toPlatformName(key);
  const result = await bot.createEmoji(serverId, name, asset);
  const emoji = result?.emoji;
  if (!emoji) return msg.reply('YapIn is reviewing this emoji before it becomes available.');

  state[serverId] = { ...(state[serverId] ?? {}), [key]: { id: emoji.id, name } };
  saveState(state);
  await msg.reply(`Added ${key} to this server.`);
});

bot.command('remove', 'Remove a Yapmoji emoji previously added here.', async (msg) => {
  const key = normalizeKey(msg.argv[0]);
  if (!key) return msg.reply('Usage: /remove <emoji-key>');

  const serverId = msg.server_id;
  if (!serverId) return msg.reply('This command is only available in a server.');

  const installed = state[serverId]?.[key];
  if (!installed) return msg.reply(`“${key}” is not installed through Yapmoji.`);

  await bot.deleteEmoji(serverId, installed.id);
  delete state[serverId][key];
  saveState(state);
  await msg.reply(`Removed ${key} from this server.`);
});

bot.on('error', (error) => console.error('[yapmoji] bot error', error));
bot.on('ready', (me) => console.log(`[yapmoji] online as ${me.username}`));

bot.start();

function normalizeKey(value) {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(value) ? value.toLowerCase() : null;
}

function toPlatformName(key) {
  return `yapmoji_${key}`.slice(0, 32);
}

function resolveAsset(key) {
  const extensions = ['png', 'gif', 'webp'];
  const extension = extensions.find((candidate) => existsSync(join(assetDir, `${key}.${candidate}`)));
  return extension ? join(assetDir, `${key}.${extension}`) : null;
}

function loadState() {
  if (!existsSync(statePath)) return {};
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    throw new Error(`Unable to parse ${statePath}.`);
  }
}

function saveState(nextState) {
  writeFileSync(statePath, `${JSON.stringify(nextState, null, 2)}\n`, { mode: 0o600 });
}
