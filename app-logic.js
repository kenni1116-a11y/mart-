(function exposeMartLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MartLogic = api;
})(typeof globalThis === "object" ? globalThis : this, () => {
  function normalizedSearchValue(value) {
    return String(value ?? "")
      .trim()
      .toLocaleLowerCase("de")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll("ß", "ss");
  }

  function estimateListValue(items = [], prices = []) {
    const cheapestByProduct = new Map();
    prices.forEach((entry) => {
      const amount = Number(entry?.price);
      if (!entry?.productId || !Number.isFinite(amount) || amount < 0) return;
      const current = cheapestByProduct.get(entry.productId);
      if (!current || amount < current.price) {
        cheapestByProduct.set(entry.productId, {
          price: amount,
          currency: typeof entry.currency === "string" && entry.currency ? entry.currency : "EUR"
        });
      }
    });

    let total = 0;
    let pricedItemCount = 0;
    let missingItemCount = 0;
    let currency = "EUR";
    items.forEach((item) => {
      const price = cheapestByProduct.get(item?.id);
      if (!price) {
        missingItemCount += 1;
        return;
      }
      total += price.price * Math.max(1, Number(item.quantity) || 1);
      pricedItemCount += 1;
      currency = price.currency;
    });

    return {
      total: Number(total.toFixed(2)),
      pricedItemCount,
      missingItemCount,
      currency
    };
  }

  function buildManualSuggestions(query, catalogItems = [], historyItems = [], limit = 5) {
    const needle = normalizedSearchValue(query);
    if (!needle) return [];
    const byName = new Map();
    [[catalogItems, "catalog"], [historyItems, "history"]].forEach(([items, source]) => {
      items.forEach((item) => {
        const nameKey = normalizedSearchValue(item?.name);
        if (!nameKey || byName.has(nameKey)) return;
        byName.set(nameKey, { ...item, source, nameKey });
      });
    });

    return Array.from(byName.values())
      .filter((item) => item.nameKey.includes(needle))
      .sort((first, second) => {
        const prefixDifference = Number(!first.nameKey.startsWith(needle)) - Number(!second.nameKey.startsWith(needle));
        if (prefixDifference) return prefixDifference;
        const sourceDifference = Number(first.source !== "catalog") - Number(second.source !== "catalog");
        return sourceDifference || first.name.localeCompare(second.name, "de");
      })
      .slice(0, Math.max(0, Number(limit) || 0))
      .map(({ nameKey, ...item }) => item);
  }

  async function mapWithConcurrency(items = [], limit = 1, worker) {
    const source = Array.isArray(items) ? items : [];
    if (!source.length) return [];
    const results = new Array(source.length);
    let cursor = 0;

    async function runNext() {
      while (cursor < source.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(source[index], index);
      }
    }

    const runnerCount = Math.min(source.length, Math.max(1, Math.floor(Number(limit) || 1)));
    await Promise.all(Array.from({ length: runnerCount }, () => runNext()));
    return results;
  }

  async function rotateInviteWithRollback({ target, nextCode, mutate, persist, rollback }) {
    const snapshot = {
      inviteCode: target.inviteCode,
      updatedAt: target.updatedAt,
      updatedByUserId: target.updatedByUserId,
      revision: target.revision
    };

    try {
      mutate(target, nextCode);
      if (await persist(target)) return true;
    } catch {
      // The caller presents the connection error after state is restored.
    }

    Object.assign(target, snapshot);
    await rollback?.(target);
    return false;
  }

  function chooseActiveListId(currentId, availableIds = [], preferredId = "") {
    const ids = availableIds.filter((id) => typeof id === "string" && id);
    if (ids.includes(currentId)) return currentId;
    if (ids.includes(preferredId)) return preferredId;
    return ids[0] ?? "";
  }

  return {
    estimateListValue,
    buildManualSuggestions,
    mapWithConcurrency,
    rotateInviteWithRollback,
    chooseActiveListId
  };
});
