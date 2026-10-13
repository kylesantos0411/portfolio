import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("storefront uses a classic browser script so cart works when opened locally", async () => {
  const html = await readFile(
    new URL("../PROJECTS/Wallet website/index.html", import.meta.url),
    "utf8",
  );
  const script = await readFile(
    new URL("../PROJECTS/Wallet website/js/app.js", import.meta.url),
    "utf8",
  );

  assert.match(html, /<script defer src="js\/app\.js"><\/script>/);
  assert.doesNotMatch(html, /type="module" src="js\/app\.mjs"/);
  assert.doesNotMatch(script, /^\s*import\s/m);
  assert.match(script, /Topia Wallet/);
  assert.match(script, /addProductToCart/);
  assert.match(script, /sire-cart/);
  assert.match(script, /paymentProof/);
  assert.match(script, /menuToggle/);
  assert.match(html, /shopAssistant/);
  assert.match(html, /assistantForm/);
  assert.match(script, /getShopAssistantReply/);
  assert.match(script, /assistantToggle/);
});
