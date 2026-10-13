import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  updateProductContent,
} from "../PROJECTS/Wallet website/js/site-content.mjs";

test("mergeSiteContent keeps defaults when admin draft is partial", () => {
  const content = mergeSiteContent({
    brand: {
      heroTitle: "Edited title",
    },
  });

  assert.equal(content.brand.heroTitle, "Edited title");
  assert.equal(content.brand.name, DEFAULT_SITE_CONTENT.brand.name);
  assert.equal(content.about.title, DEFAULT_SITE_CONTENT.about.title);
});

test("updateProductContent edits text and image for one product only", () => {
  const content = updateProductContent(DEFAULT_SITE_CONTENT, "migem-wallet", {
    name: "Migem Signature",
    image: "data:image/jpeg;base64,abc",
  });

  assert.equal(content.products[1].name, "Migem Signature");
  assert.equal(content.products[1].image, "data:image/jpeg;base64,abc");
  assert.equal(content.products[0].name, "Topia Wallet");
});
