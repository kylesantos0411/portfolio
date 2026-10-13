import test from "node:test";
import assert from "node:assert/strict";

import {
  addCustomerFeedback,
  calculateCartTotals,
  clearStoredCart,
  createCartItem,
  createOrder,
  loadStoredCart,
  saveStoredCart,
  getShopAssistantReply,
  getOrderProcessSteps,
  getSellerPaymentInfo,
  getVisibleProducts,
  updateCartQuantity,
} from "../PROJECTS/Wallet website/js/wallet-store.mjs";

const products = [
  {
    id: "classic-bifold",
    name: "Classic Bifold",
    price: 5900,
    collection: "classic",
    color: "Brown",
    tags: ["brown", "gift"],
    rating: 4.8,
  },
  {
    id: "slim-card",
    name: "Slim Card Wallet",
    price: 4900,
    collection: "slim",
    tags: ["black"],
    rating: 4.6,
  },
  {
    id: "traveler",
    name: "Traveler Wallet",
    price: 7900,
    collection: "travel",
    tags: ["brown", "passport"],
    rating: 4.9,
  },
];

test("getVisibleProducts filters by collection and search text then sorts by price", () => {
  const visible = getVisibleProducts(products, {
    collection: "classic",
    query: "gift",
    sort: "price-asc",
  });

  assert.deepEqual(
    visible.map((product) => product.id),
    ["classic-bifold"],
  );
});

test("createCartItem adds the selected product at base price", () => {
  const item = createCartItem(products[0]);

  assert.equal(item.id, "classic-bifold");
  assert.equal(item.productId, "classic-bifold");
  assert.equal(item.name, "Classic Bifold");
  assert.equal(item.color, "Brown");
  assert.equal(item.price, 5900);
  assert.equal(item.quantity, 1);
});

test("updateCartQuantity removes items when quantity reaches zero", () => {
  const cart = [
    { id: "classic-bifold", quantity: 2, price: 5900 },
    { id: "slim-card", quantity: 1, price: 4900 },
  ];

  assert.deepEqual(updateCartQuantity(cart, "slim-card", -1), [
    { id: "classic-bifold", quantity: 2, price: 5900 },
  ]);
});

test("cart storage helpers persist and clear local cart data", () => {
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  };
  const cart = [{ id: "classic-bifold", quantity: 1, price: 5900 }];

  saveStoredCart(cart, storage);
  assert.deepEqual(loadStoredCart(storage), cart);

  clearStoredCart(storage);
  assert.deepEqual(loadStoredCart(storage), []);
});

test("loadStoredCart ignores broken storage data", () => {
  const storage = {
    getItem: () => "{not-json",
  };

  assert.deepEqual(loadStoredCart(storage), []);
});

test("calculateCartTotals applies free shipping threshold", () => {
  assert.deepEqual(
    calculateCartTotals([
      { id: "classic-bifold", quantity: 1, price: 300000 },
      { id: "slim-card", quantity: 1, price: 200000 },
    ]),
    {
      subtotal: 500000,
      shipping: 0,
      total: 500000,
    },
  );
});

test("createOrder records payment method and starts in processing", () => {
  const order = createOrder({
    cart: [{ id: "classic-bifold", quantity: 1, price: 5900 }],
    customer: {
      name: "Kyle Santos",
      email: "kyle@example.com",
      address: "Quezon City",
    },
    paymentMethod: "gcash",
  });

  assert.equal(order.paymentMethod, "GCash");
  assert.equal(order.status, "Processing");
  assert.equal(order.total, 20900);
  assert.match(order.id, /^ORD-/);
});

test("createOrder rejects unsupported payment options", () => {
  assert.throws(
    () =>
      createOrder({
        cart: [{ id: "classic-bifold", quantity: 1, price: 5900 }],
        customer: { name: "Kyle", email: "kyle@example.com", address: "QC" },
        paymentMethod: "crypto",
      }),
    /Unsupported payment method/,
  );
});

test("getSellerPaymentInfo returns seller account details for online payment", () => {
  assert.deepEqual(getSellerPaymentInfo("gcash"), {
    method: "GCash",
    accountName: "SIRE Leather Studio",
    accountNumber: "0917 555 0198",
    instructions: "Send your payment screenshot after checkout for confirmation.",
    requiresPopup: true,
  });
});

test("getSellerPaymentInfo does not require popup for cash on delivery", () => {
  assert.equal(getSellerPaymentInfo("cod").requiresPopup, false);
});

test("getOrderProcessSteps marks the active order stage", () => {
  const steps = getOrderProcessSteps("Shipped");

  assert.deepEqual(
    steps.map((step) => [step.label, step.state]),
    [
      ["Order Placed", "done"],
      ["Processing", "done"],
      ["Packed", "done"],
      ["Shipped", "active"],
      ["Delivered", "upcoming"],
    ],
  );
});

test("addCustomerFeedback trims comments and places newest first", () => {
  const feedback = addCustomerFeedback(
    [{ name: "Mara", rating: 5, comment: "Beautiful stitch work." }],
    { name: " Kyle ", rating: 4, comment: "  Smooth checkout.  " },
  );

  assert.deepEqual(feedback[0], {
    name: "Kyle",
    rating: 4,
    comment: "Smooth checkout.",
  });
});

test("getShopAssistantReply answers exact product questions with wallet details", () => {
  const reply = getShopAssistantReply(
    [
      {
        id: "chagos-wallet",
        name: "Chagos Wallet",
        price: 7900,
        collection: "snap",
        color: "Black / Silver",
        description:
          "Sleek, all-black authority with a signature silver buckle.",
      },
    ],
    "Tell me about Chagos Wallet",
  );

  assert.match(reply, /Chagos Wallet/);
  assert.match(reply, /Black \/ Silver/);
  assert.match(reply, /(?:₱|\$)\s*79(?:\.00)?/);
  assert.match(reply, /signature silver buckle/);
});

test("getShopAssistantReply answers delivery, proof, and cart questions", () => {
  assert.match(
    getShopAssistantReply(products, "how long is delivery?"),
    /3 to 5 business days/,
  );
  assert.match(
    getShopAssistantReply(products, "do I need proof of payment?"),
    /payment screenshot/i,
  );
  assert.match(
    getShopAssistantReply(products, "how do I checkout my cart?"),
    /Add to Cart/,
  );
});
