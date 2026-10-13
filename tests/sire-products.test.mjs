import test from "node:test";
import assert from "node:assert/strict";

import { products } from "../PROJECTS/Wallet website/js/sire-products.mjs";

test("SIRE catalog uses the uploaded wallet products", () => {
  assert.equal(products.length, 5);
  assert.deepEqual(
    products.map((product) => product.name),
    [
      "Topia Wallet",
      "Migem Wallet",
      "Chagos Wallet",
      "Capalot Long Wallet",
      "Bards Cardholder",
    ],
  );
  assert.ok(products.every((product) => product.image.startsWith("products images/")));
});

test("SIRE catalog stores wallet color as product information", () => {
  assert.deepEqual(
    products.map((product) => [product.id, product.color]),
    [
      ["topia-wallet", "Brown"],
      ["migem-wallet", "Brown"],
      ["chagos-wallet", "Black / Silver"],
      ["capalot-long-wallet", "Brown"],
      ["bards-cardholder", "Black"],
    ],
  );
});
