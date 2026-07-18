(function exposeMartRelease(root, factory) {
  const release = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = release;
  root.MartRelease = release;
}(typeof globalThis !== "undefined" ? globalThis : self, () => {
  const version = "0.7.7";
  const build = 77;

  function text(value, fallback = "Nicht verfügbar") {
    const normalized = String(value ?? "").trim();
    return normalized || fallback;
  }

  function bugReportLines(environment = {}) {
    const width = Number(environment.viewport?.width);
    const height = Number(environment.viewport?.height);
    const viewport = Number.isFinite(width) && Number.isFinite(height)
      ? `${Math.round(width)} × ${Math.round(height)}`
      : "Nicht verfügbar";

    return [
      `App-Version: ${version}`,
      `Build: ${build}`,
      `Adresse: ${text(environment.href)}`,
      `Gerät/Browser: ${text(environment.userAgent)}`,
      `Ansicht: ${environment.standalone ? "Installierte Web-App" : "Browser"}`,
      `Bildschirm: ${viewport}`,
      `Sprache: ${text(environment.language)}`,
      `Verbindung: ${environment.online === false ? "Offline" : "Online"}`
    ];
  }

  return Object.freeze({
    version,
    build,
    label: `Version ${version} · Build ${build}`,
    bugReportLines
  });
}));
