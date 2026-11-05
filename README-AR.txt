Werkstatt B2 – KI-Lehrer (iPhone)

WAS DIESE VERSION MACHT
- Deine vorhandene Werkstatt-B2-Seite bleibt erhalten.
- Die KI-Fragen und Korrekturen laufen über einen eigenen API-Endpunkt statt Claude.
- Das Buchmaterial und die offiziellen Lösungsschlüssel, soweit sie im HTML enthalten sind, bleiben eingebaut.
- Die Website kann auf dem iPhone als eigenständige Web-App zum Home-Bildschirm hinzugefügt werden.
- Für KI-Antworten ist eine Internetverbindung nötig. Die Oberfläche kann gecacht werden; der KI-Lehrer arbeitet nicht offline.

WICHTIG
Der API-Schlüssel wird ausschließlich als Cloudflare Worker Secret gespeichert. Trage ihn NICHT in index.html ein und teile ihn nicht im Chat. Ein ChatGPT-Abo beinhaltet nicht automatisch API-Guthaben; die API-Abrechnung wird separat über die OpenAI API Platform verwaltet.

EINFACHER DEPLOY-WEG (mit Computer)
1. Erstelle ein Konto bei Cloudflare und installiere Node.js.
2. Entpacke diesen ZIP-Ordner.
3. Öffne Terminal im Ordner und führe aus:
   npm install -g wrangler
   npx wrangler login
   npx wrangler secret put OPENAI_API_KEY
   (füge deinen API-Key in das Terminal ein, nicht in die Website)
   npx wrangler deploy
4. Optional kannst du vor dem Deploy ein Modell setzen:
   npx wrangler secret put OPENAI_MODEL
   Standardmodell ist gpt-5.5; falls es nicht in deinem API-Konto verfügbar ist, setze ein verfügbares Modell.
5. Öffne die HTTPS-Adresse, die Cloudflare nach dem Deploy anzeigt.
6. Auf iPhone: Safari → Teilen → Zum Home-Bildschirm hinzufügen → Hinzufügen.

DATEI-STRUKTUR
- public/index.html : تطبيق Werkstatt B2
- public/sw.js : Cache der Oberfläche
- public/manifest.webmanifest : إعدادات التثبيت
- worker.js : خادم API، المفتاح يبقى هنا كسِرّ
- wrangler.json : إعدادات Cloudflare

ملاحظة: هاد الحزمة واجدة للنشر، ولكن ما نقدرش نفعّلها فحساب Cloudflare ديالك بلا تسجيل الدخول والموافقة ديالك. النسخة الحالية كتدعم النصوص والترانسكريبت؛ تحليل صور الكتاب مازال ما مفعّلش.
