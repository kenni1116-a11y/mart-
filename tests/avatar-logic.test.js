const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadAvatarLogic() {
  const source = fs.readFileSync(path.join(__dirname, "..", "avatar-logic.js"), "utf8");
  const context = { Blob, console };
  context.window = context;
  vm.runInNewContext(source, context, { filename: "avatar-logic.js" });
  return context.MartAvatarLogic;
}

test("avatar logic exposes stable initials and six color choices", () => {
  const MartAvatarLogic = loadAvatarLogic();

  assert.equal(MartAvatarLogic.initialsFor("Ken Beispiel"), "KB");
  assert.equal(MartAvatarLogic.initialsFor("  Ken  "), "K");
  assert.equal(MartAvatarLogic.avatarColorChoices.length, 6);
  assert.ok(Object.isFrozen(MartAvatarLogic));
  assert.ok(MartAvatarLogic.avatarColorChoices.every((choice) => (
    typeof choice.id === "string"
    && /^#[0-9a-f]{6}$/i.test(choice.color)
  )));
});

test("resizeAvatarFile scales wide images and requests compact WebP output", async () => {
  const MartAvatarLogic = loadAvatarLogic();
  const encodeCalls = [];
  const canvas = {
    width: 0,
    height: 0,
    getContext() {
      return { drawImage() {} };
    }
  };

  const result = await MartAvatarLogic.resizeAvatarFile({ type: "image/jpeg" }, {
    decodeImage: async () => ({ width: 1200, height: 800, close() {} }),
    createCanvas: () => canvas,
    encodeCanvas: async (_canvas, type, quality) => {
      encodeCalls.push({ width: _canvas.width, height: _canvas.height, type, quality });
      return new Blob([new Uint8Array(150 * 1024)], { type });
    }
  });

  assert.equal(canvas.width, 512);
  assert.equal(canvas.height, 341);
  assert.equal(result.type, "image/webp");
  assert.equal(result.size, 150 * 1024);
  assert.ok(encodeCalls.every((call) => call.type === "image/webp"));
  assert.ok(encodeCalls.every((call) => call.quality <= 0.86));
  assert.ok(encodeCalls.every((call) => call.quality >= 0.58));
  assert.ok(encodeCalls.every((call) => call.width === 512 && call.height === 341));
});
