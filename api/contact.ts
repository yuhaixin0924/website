const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

const json = (message: string, status = 200) =>
  new Response(JSON.stringify({ message }), {
    status,
    headers: JSON_HEADERS,
  });

const readText = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] || character
  );

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return json('只接受 POST 请求。', 405);
    }

    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host && new URL(origin).host !== host) {
      return json('请求来源无效。', 403);
    }

    let payload: ContactPayload;
    try {
      payload = (await request.json()) as ContactPayload;
    } catch {
      return json('提交内容格式无效。', 400);
    }

    // 隐藏字段被填写时视为机器人，但返回成功以免暴露过滤规则。
    if (readText(payload.website, 200)) {
      return json('邮件已经发送，谢谢你的来信。');
    }

    const name = readText(payload.name, 80);
    const email = readText(payload.email, 254);
    const subject = readText(payload.subject, 120);
    const message = readText(payload.message, 5000);

    if (!name || !isEmail(email) || subject.length < 2 || message.length < 5) {
      return json('请完整填写称呼、有效邮箱、主题和内容。', 400);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      return json('邮件服务尚未完成配置，请稍后再试。', 503);
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[博客联系] ${subject}`,
        text: `称呼：${name}\n邮箱：${email}\n\n${message}`,
        html: `<p><strong>称呼：</strong>${escapeHtml(name)}</p><p><strong>邮箱：</strong>${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!response.ok) {
      console.error('Resend request failed:', response.status, await response.text());
      return json('邮件发送失败，请稍后重试。', 502);
    }

    return json('邮件已经发送，谢谢你的来信。');
  },
};
