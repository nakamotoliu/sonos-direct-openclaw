#!/usr/bin/env node
import process from 'node:process';
import { PageAgent } from 'page-agent';

const query = process.argv[2];
const room = process.argv[3] || '客厅 play5';
const menuMode = process.argv[4] || 'replace-first'; // replace-first|append-first|immediate-only

if (!query) {
  console.error('Usage: page-agent-web-flow.mjs <query> [room] [menuMode]');
  process.exit(2);
}

const apiKey = process.env.PAGE_AGENT_API_KEY;
if (!apiKey) {
  console.error('Missing PAGE_AGENT_API_KEY');
  process.exit(2);
}

const model = process.env.PAGE_AGENT_MODEL || 'qwen3.5-plus';
const baseURL = process.env.PAGE_AGENT_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';

const agent = new PageAgent({ model, baseURL, apiKey, language: 'zh-CN' });

const menuInstruction = {
  'replace-first': '打开“更多选项”，优先点击“替换队列”；若没有则点击“添加到队列末尾”；若只有“立即播放”则点击“立即播放”。',
  'append-first': '打开“更多选项”，优先点击“添加到队列末尾”；若没有则点击“替换队列”；若只有“立即播放”则点击“立即播放”。',
  'immediate-only': '打开“更多选项”，若有“立即播放”则点击“立即播放”，否则停止并返回失败。',
}[menuMode] || '打开“更多选项”，点击“替换队列”。';

try {
  await agent.execute(`在 Sonos 页面将“${room}”设为有效输出。`);
  await agent.execute(`在搜索框搜索：${query}。`);
  await agent.execute('进入最匹配的网易云音乐或QQ音乐播放列表详情页。');
  await agent.execute(menuInstruction);
  console.log(JSON.stringify({ ok: true, query, room, menuMode }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, step: 'web-flow', error: String(err?.message || err) }, null, 2));
  process.exit(1);
}
