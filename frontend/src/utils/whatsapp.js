export function buildWhatsAppMessage(result, lang = "en") {
  const m = result.messages?.[lang] || result.messages?.en || {};
  const flags = lang === "te"
    ? (result.red_flags_te || result.red_flags || [])
    : (result.red_flags_en || result.red_flags || []);

  const title = result.label === "FAKE" ? m.fake_title : m.real_title;
  const advice = result.label === "FAKE" ? m.fake_advice : m.real_advice;

  let msg = "🛡️ *JobGuard Alert*\n\n";
  msg += result.label === "FAKE" ? `🚨 *${title}*\n` : `✅ *${title}*\n`;
  msg += `${result.confidence}% ${m.confidence}\n`;
  msg += `${advice}\n\n`;
  msg += `*${m.fake_label}:* ${result.fake_probability}% | *${m.real_label}:* ${result.real_probability}%`;

  if (flags.length > 0) {
    msg += `\n\n⚠️ *${m.red_flags_title} (${flags.length}):*\n`;
    flags.forEach((f) => { msg += `• ${f}\n`; });
  }

  msg += lang === "te"
    ? "\n_జాగ్రత్తగా ఉండండి! దరఖాస్తు చేసే ముందు జాబ్‌ను ధృవీకరించండి._"
    : "\n_Stay safe! Verify the job before applying or paying any fee._";

  return msg;
}

export function shareOnWhatsApp(result, lang = "en") {
  const text = buildWhatsAppMessage(result, lang);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}
