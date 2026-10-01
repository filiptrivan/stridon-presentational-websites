// A one-screen page for the requester (not a developer): the map image, which colour is which
// source, and buttons to look at each point on the real map. Opened in the default browser,
// because a terminal cannot show pictures and image viewers may open without a window.
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const LABEL = {
  google: { color: "#0050ff", title: "Plava tačka: Google mape" },
  osm: { color: "#dc0000", title: "Crvena tačka: OpenStreetMap" },
  manual: { color: "#ff8c00", title: "Narandžasta tačka: lokacija koju si poslao" },
};

export function writeChoicePage({ name, candidates, imageFile }) {
  const cards = Object.entries(candidates)
    .map(([key, c]) => {
      const l = LABEL[key];
      const what = [c.name, c.address].filter(Boolean).join(", ") || `${c.lat}, ${c.lng}`;
      return `<div class="card" style="border-color:${l.color}">
  <h2 style="color:${l.color}">${esc(l.title)}</h2>
  <p>${esc(what)}</p>
  <a href="${esc(c.links.google)}" target="_blank">Pogledaj na Google mapama</a>
</div>`;
    })
    .join("\n");
  const two = Object.keys(candidates).length > 1;
  const html = `<!doctype html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)}: koja tačka je tačna?</title>
<style>
  body { margin: 0; padding: 24px 16px; font: 18px/1.5 system-ui, sans-serif; background: #f6f6f4; color: #1d1d1b; }
  main { max-width: 820px; margin: 0 auto; }
  h1 { font-size: 26px; margin: 0 0 8px; }
  .lead { margin: 0 0 20px; }
  img { width: 100%; max-width: 768px; border-radius: 8px; border: 1px solid #ccc; display: block; }
  .cards { display: grid; gap: 12px; margin-top: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .card { background: #fff; border: 3px solid; border-radius: 8px; padding: 12px 16px; }
  .card h2 { font-size: 19px; margin: 0 0 4px; }
  .card p { margin: 0 0 8px; }
  .card a { color: #1d1d1b; }
  .back { margin-top: 20px; font-weight: 600; }
</style>
</head>
<body>
<main>
  <h1>${esc(name)}</h1>
  <p class="lead">${two ? "Našao sam dve tačke. Pogledaj sliku i reci Claude-u koja je dobra." : "Našao sam jednu tačku. Pogledaj sliku i reci Claude-u da li je dobra."}</p>
  <img src="${esc(path.basename(imageFile))}" alt="Mapa sa tačkama">
  <div class="cards">
${cards}
  </div>
  <p class="back">${two ? "Vrati se u Claude i izaberi plavu ili crvenu. Ako nisi siguran, izaberi bilo koju od dve." : "Vrati se u Claude i odgovori da ili ne."}</p>
</main>
</body>
</html>
`;
  const file = path.join(path.dirname(imageFile), "izbor.html");
  fs.writeFileSync(file, html);
  return file;
}

// Opens the page in a real browser. The ".html" association is not trusted: on many machines it
// points to a code editor. Windows: Chrome, else Edge (always installed); macOS: Safari.
const WINDOWS_BROWSERS = [
  [process.env.ProgramFiles, "Google/Chrome/Application/chrome.exe"],
  [process.env["ProgramFiles(x86)"], "Google/Chrome/Application/chrome.exe"],
  [process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"],
  [process.env["ProgramFiles(x86)"], "Microsoft/Edge/Application/msedge.exe"],
  [process.env.ProgramFiles, "Microsoft/Edge/Application/msedge.exe"],
];

export function openInBrowser(file) {
  let cmd;
  let args;
  if (process.platform === "win32") {
    const exe = WINDOWS_BROWSERS.filter(([base]) => base).map(([base, rel]) => path.join(base, rel)).find((p) => fs.existsSync(p));
    [cmd, args] = exe ? [exe, [file]] : ["cmd", ["/c", "start", "", file]];
  } else if (process.platform === "darwin") {
    [cmd, args] = ["open", ["-a", "Safari", file]];
  } else {
    [cmd, args] = ["xdg-open", [file]];
  }
  spawn(cmd, args, { detached: true, stdio: "ignore" }).unref();
}
