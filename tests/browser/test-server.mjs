import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function uuid() {
  const value = crypto.randomUUID();
  return value;
}

function now() {
  return new Date().toISOString();
}

function json(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function readRequest(request) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", () => {
      try {
        resolveBody(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function createState() {
  return {
    accounts: new Map(),
    devices: new Map(),
    sessions: new Map(),
    lists: new Map(),
    members: new Map(),
    items: new Map(),
    avatarObjects: new Map(),
    avatarEvents: [],
    avatarFailures: {
      profileUpdate: [],
      profileUpdateResponse: [],
      storageRemove: [],
      storageRemoveResponse: [],
      accountFetch: []
    },
    tombstones: new Map(),
    pairingRequests: new Map(),
    version: 0
  };
}

function memberKey(listId, userId) {
  return `${listId}:${userId}`;
}

function itemKey(listId, itemId) {
  return `${listId}:${itemId}`;
}

function bump(state) {
  state.version += 1;
}

function sessionFor(state, token) {
  return token ? state.sessions.get(token) ?? null : null;
}

function accountFor(state, token) {
  const session = sessionFor(state, token);
  return session?.accountId ? state.accounts.get(session.accountId) ?? null : null;
}

function avatarObjectKey(bucket, path) {
  return `${bucket}:${path}`;
}

const avatarFilenamePattern = /^avatar-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})-([ab])\.webp$/i;

function avatarPathDetails(path, accountId) {
  if (typeof path !== "string" || !path.startsWith(`${accountId}/`)) return null;
  const filename = path.slice(accountId.length + 1);
  const match = filename.match(avatarFilenamePattern);
  return match ? { authUserId: match[1], slot: match[2] } : null;
}

function isAllowedAvatarUploadPath(path, accountId, authUserId) {
  const details = avatarPathDetails(path, accountId);
  return Boolean(details && details.authUserId.toLowerCase() === authUserId.toLowerCase());
}

function apiError(message, code = "server_error") {
  return { data: null, error: { message, code } };
}

function rejectCommittedResponse() {
  return { __rejectCommittedResponse: true };
}

function accountPayload(account) {
  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName,
    avatarUrl: account.avatarUrl,
    deviceId: "",
    deviceLabel: "Web",
    recoveryReady: false,
    createdAt: account.createdAt,
    display_name: account.displayName,
    avatar_url: account.avatarUrl,
    recovery_ready: false,
    created_at: account.createdAt
  };
}

function accessibleListIds(state, accountId) {
  return [...state.lists.values()]
    .filter((list) => !list.deleted_at)
    .filter((list) => {
      const member = state.members.get(memberKey(list.id, accountId));
      return list.owner_user_id === accountId || Boolean(member && !member.removed_at);
    })
    .map((list) => list.id);
}

function tableRows(state, accountId, table, filters = {}) {
  const accessible = new Set(accessibleListIds(state, accountId));
  let rows;
  if (table === "shopping_lists") {
    rows = [...state.lists.values()].filter((row) => accessible.has(row.id));
  } else if (table === "list_members") {
    rows = [...state.members.values()].filter((row) => accessible.has(row.list_id));
  } else if (table === "list_items") {
    rows = [...state.items.values()].filter((row) => accessible.has(row.list_id));
  } else {
    return apiError(`Unsupported table: ${table}`, "unsupported_table");
  }

  if (filters.is) {
    rows = rows.filter((row) => row[filters.is.column] === filters.is.value);
  }
  if (filters.in) {
    rows = rows.filter((row) => filters.in.values.includes(row[filters.in.column]));
  }
  if (filters.eq) {
    rows = rows.filter((row) => row[filters.eq.column] === filters.eq.value);
  }
  if (filters.order) {
    const { column, ascending } = filters.order;
    rows.sort((left, right) => String(left[column] ?? "").localeCompare(String(right[column] ?? "")) * (ascending ? 1 : -1));
  }
  if (filters.limit) rows = rows.slice(0, filters.limit);
  return { data: rows, error: null };
}

function updateList(state, list, accountId) {
  list.updated_at = now();
  list.updated_by_user_id = accountId;
  list.revision += 1;
  bump(state);
}

function applyMutation(state, account, args) {
  const list = state.lists.get(args.target_list_id);
  const mutation = args.mutation_type;
  const payload = args.payload ?? {};
  const member = list ? state.members.get(memberKey(list.id, account.id)) : null;
  const activeMember = list && (list.owner_user_id === account.id || Boolean(member && !member.removed_at));

  if (mutation === "create_list") {
    if (list) return { data: { ok: true, duplicate: true }, error: null };
    const createdAt = now();
    const created = {
      id: args.target_list_id,
      name: payload.name ?? "Dein Zettel",
      owner_user_id: account.id,
      invite_code: uuid().replaceAll("-", "").slice(0, 18),
      created_at: createdAt,
      updated_at: createdAt,
      updated_by_user_id: account.id,
      deleted_at: null,
      deleted_by_user_id: null,
      revision: 1
    };
    state.lists.set(created.id, created);
    state.members.set(memberKey(created.id, account.id), {
      list_id: created.id,
      user_id: account.id,
      display_name: account.displayName,
      avatar_url: account.avatarUrl,
      role: "owner",
      invited_by_user_id: account.id,
      joined_at: createdAt,
      removed_at: null,
      removed_by_user_id: null
    });
    bump(state);
    return { data: { ok: true }, error: null };
  }

  if (!list || list.deleted_at) return { data: { ok: false, error: "list_deleted" }, error: null };
  if (!activeMember) return { data: { ok: false, error: "membership_removed" }, error: null };

  if (mutation === "rename_list") {
    const name = String(payload.name ?? "").trim().slice(0, 24);
    if (!name) return { data: { ok: false, error: "invalid_mutation" }, error: null };
    list.name = name;
    updateList(state, list, account.id);
    return { data: { ok: true }, error: null };
  }

  if (mutation === "delete_list") {
    if (list.owner_user_id !== account.id) return { data: { ok: false, error: "forbidden" }, error: null };
    list.deleted_at = now();
    list.deleted_by_user_id = account.id;
    updateList(state, list, account.id);
    state.tombstones.set(list.id, { listId: list.id, deletedAt: list.deleted_at, deletedByUserId: account.id });
    return { data: { ok: true }, error: null };
  }

  if (mutation === "leave_list") {
    if (list.owner_user_id === account.id) return { data: { ok: false, error: "forbidden" }, error: null };
    const member = state.members.get(memberKey(list.id, account.id));
    member.removed_at = now();
    member.removed_by_user_id = account.id;
    updateList(state, list, account.id);
    return { data: { ok: true }, error: null };
  }

  if (mutation === "upsert_item") {
    const itemId = payload.itemId;
    if (!itemId) return { data: { ok: false, error: "invalid_mutation" }, error: null };
    const timestamp = now();
    const prior = state.items.get(itemKey(list.id, itemId));
    state.items.set(itemKey(list.id, itemId), {
      list_id: list.id,
      item_id: itemId,
      product_id: payload.productId || null,
      name: payload.name ?? "",
      shelf_id: payload.shelfId ?? "",
      shelf_title: payload.shelfTitle ?? "",
      shelf_icon: payload.shelfIcon ?? "",
      quantity: Number(payload.quantity ?? 1),
      done: Boolean(payload.done),
      note: payload.note ?? "",
      added_by_user_id: prior?.added_by_user_id ?? account.id,
      added_by_display_name: prior?.added_by_display_name ?? account.displayName,
      added_by_avatar_url: prior?.added_by_avatar_url ?? account.avatarUrl,
      checked_by_user_id: payload.done ? account.id : null,
      checked_at: payload.done ? timestamp : null,
      updated_by_user_id: account.id,
      updated_at: timestamp,
      deleted_at: null,
      deleted_by_user_id: null,
      revision: Number(prior?.revision ?? 0) + 1
    });
    updateList(state, list, account.id);
    return { data: { ok: true }, error: null };
  }

  if (mutation === "delete_item") {
    const itemId = payload.itemId;
    const prior = state.items.get(itemKey(list.id, itemId));
    if (!prior) return { data: { ok: true }, error: null };
    prior.deleted_at = now();
    prior.deleted_by_user_id = account.id;
    prior.updated_at = prior.deleted_at;
    prior.revision += 1;
    updateList(state, list, account.id);
    return { data: { ok: true }, error: null };
  }

  return { data: { ok: false, error: "invalid_mutation" }, error: null };
}

function rpc(state, token, name, args) {
  const session = sessionFor(state, token);
  if (!session) return apiError("Authentication required", "authentication_required");

  if (name === "bootstrap_account") {
    if (!session.accountId) {
      const account = {
        id: uuid(),
        username: `test-${state.accounts.size + 1}`,
        displayName: `Test ${state.accounts.size + 1}`,
        avatarUrl: "",
        createdAt: now()
      };
      state.accounts.set(account.id, account);
      session.accountId = account.id;
      const deviceId = uuid();
      state.devices.set(deviceId, { id: deviceId, accountId: account.id, authUserId: session.user.id, label: args.device_label ?? "Web", platform: args.device_platform ?? "Web" });
      bump(state);
    }
    return { data: accountPayload(state.accounts.get(session.accountId)), error: null };
  }

  const account = accountFor(state, token);
  if (!account) return apiError("Account unavailable", "account_unavailable");

  if (name === "get_current_account") {
    const queuedFailure = state.avatarFailures.accountFetch.length
      ? state.avatarFailures.accountFetch.shift()
      : null;
    if (queuedFailure) return apiError(queuedFailure, "account_fetch_failed");
    state.avatarEvents.push({ type: "profile-fetch", avatarUrl: account.avatarUrl, ok: true });
    return {
      data: { ...accountPayload(account), authUserId: session.user.id },
      error: null
    };
  }
  if (name === "apply_list_mutation_v3") return applyMutation(state, account, args);
  if (name === "transfer_list_ownership_v3") {
    const list = state.lists.get(args.target_list_id);
    const target = list ? state.members.get(memberKey(list.id, args.target_user_id)) : null;
    if (!list || list.deleted_at) return { data: { ok: false, error: "list_deleted" }, error: null };
    if (list.owner_user_id !== account.id) return { data: { ok: false, error: "forbidden" }, error: null };
    if (!target || target.removed_at || target.user_id === account.id) return { data: { ok: false, error: "invalid_member" }, error: null };
    const priorOwner = state.members.get(memberKey(list.id, account.id));
    target.role = "owner";
    if (priorOwner) priorOwner.role = "editor";
    list.owner_user_id = target.user_id;
    updateList(state, list, account.id);
    return { data: { ok: true, listId: list.id, ownerId: target.user_id, previousOwnerId: account.id }, error: null };
  }
  if (name === "update_account_avatar" || name === "update_account_display_name") {
    const queuedFailure = state.avatarFailures.profileUpdate.length
      ? state.avatarFailures.profileUpdate.shift()
      : null;
    if (queuedFailure) {
      state.avatarEvents.push({ type: "profile-update", avatarUrl: args.avatar_url ?? account.avatarUrl, ok: false });
      return apiError(queuedFailure, "profile_sync_failed");
    }
    if (name === "update_account_display_name") account.displayName = args.display_name || account.displayName;
    if (name === "update_account_avatar") account.avatarUrl = args.avatar_url || "";
    state.avatarEvents.push({ type: "profile-update", avatarUrl: account.avatarUrl, ok: true });
    bump(state);
    const rejectResponse = state.avatarFailures.profileUpdateResponse.length
      ? state.avatarFailures.profileUpdateResponse.shift()
      : null;
    if (rejectResponse) return rejectCommittedResponse();
    return { data: { ok: true }, error: null };
  }
  if (name === "touch_current_device") return { data: { ok: true }, error: null };
  if (name === "join_shopping_list") {
    const list = state.lists.get(args.target_list_id);
    if (!list || list.deleted_at || list.invite_code !== args.target_invite_code) return apiError("Invalid invite", "invalid_invite");
    state.members.set(memberKey(list.id, account.id), {
      list_id: list.id,
      user_id: account.id,
      display_name: args.display_name || account.displayName,
      avatar_url: args.avatar_url || "",
      role: "editor",
      invited_by_user_id: list.owner_user_id,
      joined_at: now(),
      removed_at: null,
      removed_by_user_id: null
    });
    updateList(state, list, account.id);
    return { data: { ok: true }, error: null };
  }
  if (name === "list_account_devices") return { data: [...state.devices.values()].filter((device) => device.accountId === account.id), error: null };
  if (name === "create_device_pairing") {
    const pairing = { id: uuid(), token: uuid().replaceAll("-", "").slice(0, 48), accountId: account.id, status: "pending", requestedAuthUserId: "" };
    state.pairingRequests.set(pairing.id, pairing);
    bump(state);
    return { data: { ok: true, pairingId: pairing.id, pairingToken: pairing.token, expiresAt: now() }, error: null };
  }
  if (name === "request_device_pairing_v3") {
    const pairing = state.pairingRequests.get(args.target_pairing_id);
    if (!pairing || pairing.token !== args.pairing_token) return { data: { ok: false, error: "invalid_pairing" }, error: null };
    pairing.requestedAuthUserId = session.user.id;
    pairing.status = "pending";
    bump(state);
    return { data: { ok: true, status: "pending" }, error: null };
  }
  if (name === "get_device_pairing_status_v3") {
    const pairing = state.pairingRequests.get(args.target_pairing_id);
    return { data: pairing ? { ok: true, status: pairing.status } : { ok: false, error: "invalid_pairing" }, error: null };
  }
  return apiError(`Unsupported RPC: ${name}`, "unsupported_rpc");
}

const adapterSource = String.raw`(function () {
  const storageKey = "__mart_test_session";
  const api = async (action, args = {}) => {
    const response = await fetch("/__test__/collaboration-api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: localStorage.getItem(storageKey) || "", action, args })
    });
    return response.json();
  };
  const userFrom = (session) => session ? session.user : null;
  const toBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let index = 0; index < bytes.length; index += 8192) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
    }
    return btoa(binary);
  };
  const makeQuery = (table) => {
    const filters = {};
    const query = {
      select() { return query; },
      is(column, value) { filters.is = { column, value }; return query; },
      in(column, values) { filters.in = { column, values }; return query; },
      eq(column, value) { filters.eq = { column, value }; return query; },
      order(column, options = {}) { filters.order = { column, ascending: options.ascending !== false }; return query; },
      limit(value) { filters.limit = value; return query; },
      maybeSingle() { filters.single = true; return query; },
      then(resolve, reject) {
        return api("table", { table, filters }).then((result) => {
          if (filters.single && !result.error) result.data = result.data[0] || null;
          return result;
        }).then(resolve, reject);
      }
    };
    return query;
  };
  const createClient = () => {
    const listeners = new Set();
    const auth = {
      async getSession() { const result = await api("auth-get"); return { data: { session: result.session || null }, error: result.error || null }; },
      async getUser() { const result = await api("auth-get"); return { data: { user: userFrom(result.session) }, error: result.error || null }; },
      async signInAnonymously() {
        const result = await api("auth-sign-in");
        localStorage.setItem(storageKey, result.token);
        listeners.forEach((listener) => listener("SIGNED_IN", result.session));
        return { data: { user: result.session.user, session: result.session }, error: result.error || null };
      },
      async signOut() {
        await api("auth-sign-out");
        localStorage.removeItem(storageKey);
        listeners.forEach((listener) => listener("SIGNED_OUT", null));
        return { error: null };
      },
      onAuthStateChange(listener) { listeners.add(listener); return { data: { subscription: { unsubscribe: () => listeners.delete(listener) } } }; }
    };
    return {
      auth,
      rpc: (name, args) => api("rpc", { name, args }),
      from: (table) => makeQuery(table),
      storage: {
        from(bucket) {
          return {
            async upload(path, file, options = {}) {
              const base64 = toBase64(await file.arrayBuffer());
              const result = await api("storage-upload", {
                bucket,
                path,
                contentType: options.contentType || file.type || "application/octet-stream",
                base64
              });
              return { data: result.data ?? null, error: result.error ?? null };
            },
            async remove(paths) {
              const result = await api("storage-remove", { bucket, paths });
              return { data: result.data ?? null, error: result.error ?? null };
            },
            async list(path, options = {}) {
              const result = await api("storage-list", { bucket, path, options });
              return { data: result.data ?? null, error: result.error ?? null };
            },
            getPublicUrl(path) {
              return { data: { publicUrl: location.origin + "/__test__/avatar/" + path } };
            }
          };
        }
      },
      channel() {
        const handlers = [];
        let timer = 0;
        let version = -1;
        const channel = {
          on(_type, _filter, handler) { handlers.push(handler); return channel; },
          subscribe(callback) {
            callback && setTimeout(() => callback("SUBSCRIBED"), 0);
            timer = setInterval(async () => {
              const result = await api("version", { version });
              if (result.version !== version) {
                version = result.version;
                handlers.forEach((handler) => handler({ new: {}, old: {} }));
              }
            }, 100);
            return channel;
          },
          track() { return Promise.resolve("ok"); },
          presenceState() { return {}; },
          unsubscribe() { clearInterval(timer); }
        };
        return channel;
      },
      removeChannel(channel) { channel && channel.unsubscribe(); }
    };
  };
  window.supabase = { createClient };
})();`;

async function handleApi(state, payload) {
  const { token, action, args = {} } = payload;
  if (action === "auth-get") {
    const session = sessionFor(state, token);
    return { session: session ? { user: session.user } : null, error: null };
  }
  if (action === "auth-sign-in") {
    const nextToken = uuid();
    const user = { id: uuid(), is_anonymous: true, user_metadata: {} };
    state.sessions.set(nextToken, { user, accountId: "" });
    return { token: nextToken, session: { user }, error: null };
  }
  if (action === "auth-sign-out") {
    state.sessions.delete(token);
    return { ok: true };
  }
  if (action === "rpc") return rpc(state, token, args.name, args.args ?? {});
  if (action === "table") {
    const account = accountFor(state, token);
    return account ? tableRows(state, account.id, args.table, args.filters) : apiError("Account unavailable", "account_unavailable");
  }
  if (action === "storage-upload") {
    const session = sessionFor(state, token);
    const account = accountFor(state, token);
    const bucket = args.bucket;
    const path = args.path;
    const contentType = args.contentType;
    if (!account) return apiError("Account unavailable", "account_unavailable");
    if (bucket !== "avatars" || !session || !isAllowedAvatarUploadPath(path, account.id, session.user.id)) {
      return apiError("Forbidden", "forbidden");
    }
    if (!/^image\/(webp|jpeg|png)$/.test(contentType ?? "")) return apiError("Unsupported avatar type", "unsupported_media_type");
    const bytes = Buffer.from(String(args.base64 ?? ""), "base64");
    if (!bytes.length || bytes.length > 204800) return apiError("Invalid avatar size", "invalid_avatar_size");
    state.avatarObjects.set(avatarObjectKey(bucket, path), { bytes, contentType });
    state.avatarEvents.push({ type: "storage-upload", path, ok: true });
    return { data: { path }, error: null };
  }
  if (action === "storage-list") {
    const account = accountFor(state, token);
    if (!account || args.bucket !== "avatars" || args.path !== account.id) {
      return apiError("Forbidden", "forbidden");
    }
    const prefix = `avatars:${account.id}/`;
    const data = [...state.avatarObjects.keys()]
      .filter((key) => key.startsWith(prefix))
      .map((key) => ({ name: key.slice(prefix.length) }))
      .filter((entry) => !entry.name.includes("/"));
    return { data, error: null };
  }
  if (action === "storage-remove") {
    const account = accountFor(state, token);
    const bucket = args.bucket;
    const paths = Array.isArray(args.paths) ? args.paths : [];
    if (!account) return apiError("Account unavailable", "account_unavailable");
    if (bucket !== "avatars" || paths.some((path) => !avatarPathDetails(path, account.id))) return apiError("Forbidden", "forbidden");
    const queuedFailure = state.avatarFailures.storageRemove.length
      ? state.avatarFailures.storageRemove.shift()
      : null;
    if (queuedFailure) {
      paths.forEach((path) => state.avatarEvents.push({ type: "storage-remove", path, ok: false }));
      return apiError(queuedFailure, "storage_remove_failed");
    }
    paths.forEach((path) => state.avatarObjects.delete(avatarObjectKey(bucket, path)));
    paths.forEach((path) => state.avatarEvents.push({ type: "storage-remove", path, ok: true }));
    const rejectResponse = state.avatarFailures.storageRemoveResponse.length
      ? state.avatarFailures.storageRemoveResponse.shift()
      : null;
    if (rejectResponse) return rejectCommittedResponse();
    return { data: paths.map((path) => ({ name: path })), error: null };
  }
  if (action === "version") return { version: state.version };
  return apiError(`Unsupported action: ${action}`, "unsupported_action");
}

export async function startTestServer({ root = rootDirectory } = {}) {
  const state = createState();
  const rootPath = resolve(root);
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (url.pathname === "/__test__/collaboration.js") {
      response.writeHead(200, { "content-type": "application/javascript; charset=utf-8" });
      response.end(adapterSource);
      return;
    }
    if (url.pathname === "/__test__/collaboration-api" && request.method === "POST") {
      try {
        const result = await handleApi(state, await readRequest(request));
        if (result?.__rejectCommittedResponse) {
          response.destroy();
          return;
        }
        json(response, 200, result);
      } catch (error) {
        json(response, 400, apiError(error instanceof Error ? error.message : "Invalid request", "invalid_request"));
      }
      return;
    }
    if (url.pathname.startsWith("/__test__/avatar/") && request.method === "GET") {
      const path = decodeURIComponent(url.pathname.slice("/__test__/avatar/".length));
      const avatar = state.avatarObjects.get(avatarObjectKey("avatars", path));
      if (!avatar) {
        response.writeHead(404).end();
        return;
      }
      response.writeHead(200, {
        "content-type": avatar.contentType,
        "cache-control": "no-store"
      });
      response.end(avatar.bytes);
      return;
    }

    const relativePath = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
    const filePath = normalize(join(rootPath, relativePath));
    if (!filePath.startsWith(`${rootPath}/`) && filePath !== rootPath) {
      response.writeHead(403).end();
      return;
    }
    try {
      const content = await readFile(filePath);
      response.writeHead(200, { "content-type": mimeTypes[extname(filePath)] ?? "application/octet-stream" });
      response.end(content);
    } catch {
      response.writeHead(404).end();
    }
  });

  await new Promise((resolveListening) => server.listen(0, "127.0.0.1", resolveListening));
  const address = server.address();
  return {
    origin: `http://127.0.0.1:${address.port}`,
    state,
    adapterSource,
    close: () => new Promise((resolveClosing, rejectClosing) => server.close((error) => error ? rejectClosing(error) : resolveClosing()))
  };
}
