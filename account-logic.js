(function exposeMartAccountLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MartAccountLogic = api;
})(typeof globalThis === "object" ? globalThis : this, () => {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const TOKEN = /^[a-f0-9]{48}$/i;

  function parsePairingUrl(value) {
    const url = new URL(value);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
    const pairingId = hash.get("pair") || url.searchParams.get("pair") || "";
    const pairingToken = hash.get("pairToken") || url.searchParams.get("pairToken") || "";
    if (!pairingId && !pairingToken) return null;
    hash.delete("pair");
    hash.delete("pairToken");
    url.searchParams.delete("pair");
    url.searchParams.delete("pairToken");
    url.hash = hash.toString();
    return {
      invalid: !UUID.test(pairingId) || !TOKEN.test(pairingToken),
      pairingId,
      pairingToken,
      cleanUrl: url.href
    };
  }

  function nextActivationState(state, event) {
    if (event.type === "AUTHENTICATED") {
      return { phase: event.hasPairing ? "pairing" : "resolving", canRead: false, canWrite: false };
    }
    if (event.type === "PAIRING_APPROVED") return { phase: "resolving", canRead: false, canWrite: false };
    if (event.type === "ACCOUNT_RESOLVED") return { phase: "loading", canRead: false, canWrite: false };
    if (event.type === "REMOTE_LOADED") return { phase: "ready", canRead: true, canWrite: true };
    if (event.type === "FAILED") return { phase: "error", canRead: false, canWrite: false, error: event.error || "" };
    return state;
  }

  function accountStorageKey(base, accountId) {
    return `${base}:${accountId}`;
  }

  function removeForeignAccountCaches(storage, prefixes, keepAccountId) {
    const removed = [];
    Array.from({ length: storage.length }, (_, index) => storage.key(index))
      .filter(Boolean)
      .forEach((key) => {
        const prefix = prefixes.find((candidate) => key.startsWith(`${candidate}:`));
        if (!prefix || key === `${prefix}:${keepAccountId}`) return;
        storage.removeItem(key);
        removed.push(key);
      });
    return removed;
  }

  return { parsePairingUrl, nextActivationState, accountStorageKey, removeForeignAccountCaches };
});
