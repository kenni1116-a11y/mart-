const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

test("the private schema exists before the first private database function", () => {
  const sql = fs.readFileSync(path.join(root, "supabase", "device_accounts_v2.sql"), "utf8");
  const dropIndex = sql.indexOf("drop schema if exists private cascade;");
  const createIndex = sql.indexOf("create schema private;");
  const firstPrivateFunctionIndex = sql.search(/create(?: or replace)? function private\./);

  assert.notEqual(dropIndex, -1, "the reset must explicitly drop the private schema");
  assert.notEqual(createIndex, -1, "the reset must recreate the private schema");
  assert.notEqual(firstPrivateFunctionIndex, -1, "the schema must contain private functions");
  assert.ok(createIndex > dropIndex, "the schema must be recreated after the reset");
  assert.ok(createIndex < firstPrivateFunctionIndex, "the schema must exist before private functions are created");
});
