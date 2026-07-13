(function exposeMartAccountLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MartAccountLogic = api;
})(typeof globalThis === "object" ? globalThis : this, () => {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const TOKEN = /^[a-f0-9]{48}$/i;
  const pendingDevicePairingStorageKey = "shopping-list-app.pending-device-pairing";

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
        const prefix = prefixes.find((candidate) => key === candidate || key.startsWith(`${candidate}:`));
        if (!prefix || key === `${prefix}:${keepAccountId}`) return;
        storage.removeItem(key);
        removed.push(key);
      });
    return removed;
  }

  function prepareAccountActivationStorage(storage, options) {
    if (!options?.discardStaleQueues) return [];
    const removed = new Set(removeForeignAccountCaches(
      storage,
      options.prefixes ?? [],
      options.accountId ?? ""
    ));
    (options.queueKeys ?? []).forEach((baseKey) => {
      [baseKey, accountStorageKey(baseKey, options.accountId)].forEach((key) => {
        if (!key || storage.getItem(key) === null) return;
        storage.removeItem(key);
        removed.add(key);
      });
    });
    return [...removed];
  }

  function routeAuthEvent({ event, hasAuthUser, isDeviceUser, hasPendingPairing, accountReady }) {
    if (hasPendingPairing) return "connect";
    if (event === "SIGNED_OUT" || !hasAuthUser) return "reconnect";
    if (!isDeviceUser) return "ignore";
    return accountReady ? "activate" : "connect";
  }

  function pairingRetentionAction(value) {
    const status = typeof value === "string" ? value : (value?.error ?? value?.status ?? "");
    if (status === "account_in_use") return "open-account";
    if (["invalid_pairing", "expired", "cancelled", "pairing_cancelled"].includes(status)) return "clear";
    return "retain";
  }

  function pairingFromValue(value) {
    if (!value || typeof value !== "object") return null;
    const pairingId = typeof value.pairingId === "string" ? value.pairingId : "";
    const pairingToken = typeof value.pairingToken === "string" ? value.pairingToken : "";
    if (!UUID.test(pairingId) || !TOKEN.test(pairingToken)) return null;
    return { pairingId, pairingToken };
  }

  function restorePendingDevicePairing(storage) {
    const stored = storage.getItem(pendingDevicePairingStorageKey);
    if (!stored) return null;
    try {
      const pairing = pairingFromValue(JSON.parse(stored));
      if (pairing) return pairing;
    } catch {
      // Invalid persisted data is terminal and must not start activation.
    }
    storage.removeItem(pendingDevicePairingStorageKey);
    return { invalid: true };
  }

  function capturePendingDevicePairing(url, storage, cleanUrl) {
    const parsed = parsePairingUrl(url);
    if (!parsed) return restorePendingDevicePairing(storage);
    if (parsed.invalid) return { invalid: true };
    const pairing = pairingFromValue(parsed);
    storage.setItem(pendingDevicePairingStorageKey, JSON.stringify(pairing));
    cleanUrl(parsed.cleanUrl);
    return pairing;
  }

  function clearPendingDevicePairing(storage) {
    storage.removeItem(pendingDevicePairingStorageKey);
  }

  function isInvalidRefreshTokenError(error) {
    const message = typeof error === "string" ? error : (error?.message ?? "");
    return /invalid refresh token|refresh token not found|refresh_token_not_found/i.test(message);
  }

  async function authenticateDeviceIdentity(options) {
    const session = await options.getSession();
    const sessionError = session?.error ?? null;
    let authUser = session && Object.prototype.hasOwnProperty.call(session, "user") ? session.user : (session ?? null);
    let invalidSession = false;

    if (sessionError) {
      if (!isInvalidRefreshTokenError(sessionError)) throw sessionError;
      await options.signOutLocal();
      options.clearInvalidSessionData?.();
      authUser = null;
      invalidSession = true;
    }

    if (authUser) {
      const verification = await options.getUser();
      if (!verification?.error && verification?.user?.id === authUser.id) {
        authUser = verification.user;
      } else if (isInvalidRefreshTokenError(verification?.error)) {
        await options.signOutLocal();
        options.clearInvalidSessionData?.();
        authUser = null;
        invalidSession = true;
      } else if (verification?.error) {
        throw verification.error;
      } else {
        await options.signOutLocal();
        authUser = null;
      }
    }

    if (authUser && !options.isDeviceAuthUser(authUser)) {
      await options.signOutLocal();
      authUser = null;
    }
    if (!authUser) authUser = await options.signInAnonymously();
    if (!options.isDeviceAuthUser(authUser)) throw new Error("Keine Gerätekennung erhalten");
    return { user: authUser, invalidSession };
  }

  async function runActivationSequence({
    authenticate,
    pairing = null,
    requestPairing,
    waitForApproval,
    bootstrap,
    pull,
    enableWrites
  }) {
    const authUser = await authenticate();
    if (pairing) {
      let pairingResult;
      try {
        pairingResult = await requestPairing(pairing, authUser);
      } catch (error) {
        return { ok: false, status: error?.message || "pairing_failed", authUser, error };
      }
      if (!pairingResult?.ok) {
        return {
          ok: false,
          status: pairingResult?.error || pairingResult?.status || "pairing_failed",
          pairingResult,
          authUser
        };
      }
      let approvalResult;
      try {
        approvalResult = await waitForApproval(pairing, authUser);
      } catch (error) {
        return { ok: false, status: error?.message || "pairing_failed", authUser, error };
      }
      if (!approvalResult?.ok || approvalResult.status !== "approved") {
        return {
          ok: false,
          status: approvalResult?.error || approvalResult?.status || "pairing_failed",
          pairingResult: approvalResult,
          authUser
        };
      }
    }

    let account;
    try {
      account = await bootstrap(authUser);
    } catch (error) {
      return { ok: false, status: error?.message || "account_unavailable", authUser, error };
    }
    if (!account?.id) return { ok: false, status: "account_unavailable", authUser };

    let pullResult;
    try {
      pullResult = await pull(account, authUser);
    } catch (error) {
      return { ok: false, status: error?.message || "initial_load_failed", account, authUser, error };
    }
    if (pullResult === false) return { ok: false, status: "initial_load_failed", account, authUser };

    try {
      await enableWrites(account, authUser);
    } catch (error) {
      return { ok: false, status: error?.message || "enable_writes_failed", account, authUser, error };
    }
    return { ok: true, status: "ready", account, authUser };
  }

  function createAccountDeletionFlow({ deleteAccount, completeDeletion }) {
    let inProgress = false;
    let committedResult = null;
    return {
      async choose(action) {
        if (action !== "confirm") {
          return committedResult
            ? { ok: false, status: "deletion_committed", committed: true, deletionCommitted: true }
            : { ok: false, status: "cancelled" };
        }
        if (inProgress) return { ok: false, status: "in_progress" };
        inProgress = true;
        try {
          if (!committedResult) {
            const result = await deleteAccount();
            if (!result?.ok) return { ok: false, error: result?.error || "account_deletion_failed" };
            committedResult = result;
          }
          await completeDeletion(committedResult);
          return { ...committedResult, committed: true, deletionCommitted: true };
        } catch (error) {
          return {
            ok: false,
            error: error?.message || "account_deletion_failed",
            ...(committedResult ? { committed: true, deletionCommitted: true } : {})
          };
        } finally {
          inProgress = false;
        }
      }
    };
  }

  return {
    parsePairingUrl,
    nextActivationState,
    accountStorageKey,
    removeForeignAccountCaches,
    prepareAccountActivationStorage,
    routeAuthEvent,
    pairingRetentionAction,
    pendingDevicePairingStorageKey,
    restorePendingDevicePairing,
    capturePendingDevicePairing,
    clearPendingDevicePairing,
    isInvalidRefreshTokenError,
    authenticateDeviceIdentity,
    runActivationSequence,
    createAccountDeletionFlow
  };
});
