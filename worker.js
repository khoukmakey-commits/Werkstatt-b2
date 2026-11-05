export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/teacher") {
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      if (!env.OPENAI_API_KEY) return json({ error: "OPENAI_API_KEY ist auf dem Server noch nicht eingerichtet." }, 503);
      let body;
      try { body = await request.json(); } catch { return json({ error: "Ungültige JSON-Anfrage." }, 400); }
      const prompt = typeof body.prompt === "string" ? body.prompt : "";
      if (!prompt.trim()) return json({ error: "Die Frage ist leer." }, 400);
      if (prompt.length > 120000) return json({ error: "Der Text ist zu lang. Bitte teile ihn in kleinere Abschnitte." }, 413);
      const payload = {
        model: env.OPENAI_MODEL || "gpt-5.5",
        instructions: "Du bist ein sorgfältiger Deutschlehrer für Goethe-Zertifikat B2 und das Lehrwerk Werkstatt B2. Arbeite vorrangig mit dem mitgelieferten Buchtext, Transkript und offiziellen Lösungsschlüsseln. Erfinde niemals Fragen, Zitate oder Lösungen. Wenn ein Beleg im Material fehlt, sage klar: nicht im bereitgestellten Material belegbar. Ändere offizielle Lösungsschlüssel nicht. Erkläre auf einfachem marokkanischem Darija (Arabisch), aber lasse deutsche Beispiele, Grammatikbegriffe und Zitate auf Deutsch. Sei konkret, strukturiert und didaktisch.",
        input: prompt,
        max_output_tokens: 5000
      };
      let upstream;
      try {
        upstream = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: { "Authorization": `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (e) { return json({ error: "تعذر الاتصال بخدمة الذكاء الاصطناعي. تحقق من الإنترنت." }, 502); }
      const raw = await upstream.json().catch(() => ({}));
      if (!upstream.ok) return json({ error: raw?.error?.message || `OpenAI API error (${upstream.status})` }, upstream.status);
      let text = raw.output_text || "";
      if (!text && Array.isArray(raw.output)) {
        text = raw.output.flatMap(item => Array.isArray(item.content) ? item.content : [])
          .filter(part => part.type === "output_text").map(part => part.text || "").join("\n");
      }
      return json({ text });
    }
    return env.ASSETS.fetch(request);
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
