import { webkit } from "@playwright/test";

const productionUrl = process.env.PRODUCTION_URL || "https://kenni1116-a11y.github.io/mart-/";
const browser = await webkit.launch();
const context = await browser.newContext({ serviceWorkers: "block" });
const page = await context.newPage();
const failures = [];
let intentionalOutages = 0;

page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  const expectedOutage = message.text().includes("status of 503 (Service Unavailable)");
  if (message.type() === "error" && !expectedOutage) failures.push(`console: ${message.text()}`);
});
const offlineResponse = {
  status: 503,
  contentType: "application/json",
  body: JSON.stringify({ message: "Intentional production smoke outage" })
};
await page.route("**/auth/v1/**", (route) => {
  intentionalOutages += 1;
  return route.fulfill(offlineResponse);
});
await page.route("**/rest/v1/**", (route) => {
  intentionalOutages += 1;
  return route.fulfill(offlineResponse);
});

try {
  await page.goto(productionUrl, { waitUntil: "domcontentloaded" });
  if (await page.title() !== "Zettel") throw new Error("Seitentitel ist nicht Zettel");
  await page.locator("#authRetryButton").waitFor({ state: "visible", timeout: 15000 });
  if (!intentionalOutages) throw new Error("Der simulierte Account-Ausfall wurde nicht erreicht");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`Production-Smoke erfolgreich: ${productionUrl}`);
} finally {
  await context.close();
  await browser.close();
}
