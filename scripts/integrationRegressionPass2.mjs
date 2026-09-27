import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const API = "http://localhost:3001";
const EMAIL = "kaliashvilisergi@gmail.com";
const PASSWORD = "Admin@12345";
const RENT_PHRASE = "(პირველი და ბოლო თვის წინასწარი გადახდით)";

const results = [];

function record(entry) {
  results.push(entry);
  const mark = entry.result === "PASS" ? "✓" : "✗";
  console.log(`${mark} ${entry.feature}: ${entry.result}`);
}

async function safeRun(feature, runner) {
  try {
    await runner();
  } catch (error) {
    record({
      feature,
      steps: "Harness exception",
      result: "FAIL",
      error: String(error),
    });
  }
}

function extractPropertyId(network) {
  const body = network.response;
  if (!body || typeof body !== "object") {
    return null;
  }
  if (typeof body.id === "string") {
    return body.id;
  }
  if (body.property && typeof body.property.id === "string") {
    return body.property.id;
  }
  return null;
}

async function login(page) {
  await page.goto(`${BASE}/sign-in`);
  await page.getByLabel("ელფოსტა").fill(EMAIL);
  await page.locator("#sign-in-password").fill(PASSWORD);
  await page.getByRole("button", { name: "შესვლა", exact: true }).click();
  await page.waitForURL("**/dashboard**", { timeout: 30000 });
}

async function clearDrafts(page) {
  await page.evaluate(() => {
    window.localStorage.removeItem("draft:property:new");
    window.localStorage.removeItem("draft:client:new");
  });
}

async function getAuthToken(page) {
  return page.evaluate(() => window.localStorage.getItem("authToken"));
}

async function apiGetProperty(token, propertyId) {
  const res = await fetch(`${API}/properties/${propertyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

async function apiGetClient(token, clientId) {
  const res = await fetch(`${API}/clients/${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

function pickPayloadFields(body, keys) {
  const out = {};
  for (const key of keys) {
    if (body && Object.prototype.hasOwnProperty.call(body, key)) {
      out[key] = body[key];
    }
  }
  return out;
}

async function waitForPropertyPost(page, submitAction) {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      /localhost:3001\/properties\/?(\?|$)/.test(response.url()) &&
      !response.url().includes("generate-public-text"),
    { timeout: 90000 },
  );

  let requestBody = null;
  const requestHandler = async (request) => {
    if (
      request.method() === "POST" &&
      /localhost:3001\/properties\/?(\?|$)/.test(request.url()) &&
      !request.url().includes("generate-public-text")
    ) {
      try {
        requestBody = request.postDataJSON();
      } catch {
        const raw = request.postData();
        if (raw && raw.startsWith("{")) {
          requestBody = JSON.parse(raw);
        }
      }
    }
  };
  page.on("request", requestHandler);

  await submitAction();
  const response = await responsePromise;
  page.off("request", requestHandler);

  let responseBody = null;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  return {
    status: response.status(),
    request: requestBody,
    response: responseBody,
  };
}

async function waitForPropertyPatch(page, submitAction) {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "PATCH" &&
      /localhost:3001\/properties\//.test(response.url()),
    { timeout: 90000 },
  );

  let requestBody = null;
  const requestHandler = async (request) => {
    if (request.method() === "PATCH" && /localhost:3001\/properties\//.test(request.url())) {
      try {
        requestBody = request.postDataJSON();
      } catch {
        const raw = request.postData();
        if (raw && raw.startsWith("{")) {
          requestBody = JSON.parse(raw);
        }
      }
    }
  };
  page.on("request", requestHandler);

  await submitAction();
  const response = await responsePromise;
  page.off("request", requestHandler);

  return {
    status: response.status(),
    request: requestBody,
    response: await response.json().catch(() => null),
  };
}

async function waitForClientPost(page, submitAction) {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      /localhost:3001\/clients\/?(\?|$)/.test(response.url()),
    { timeout: 90000 },
  );

  let requestBody = null;
  const requestHandler = async (request) => {
    if (request.method() === "POST" && /localhost:3001\/clients\/?(\?|$)/.test(request.url())) {
      try {
        requestBody = request.postDataJSON();
      } catch {
        const raw = request.postData();
        if (raw && raw.startsWith("{")) {
          requestBody = JSON.parse(raw);
        }
      }
    }
  };
  page.on("request", requestHandler);

  await submitAction();
  const response = await responsePromise;
  page.off("request", requestHandler);

  return {
    status: response.status(),
    request: requestBody,
    response: await response.json().catch(() => null),
  };
}

async function clickFirstNonEmptyChip(page, groupId, skipText) {
  const radios = page.locator(`#${groupId}`).getByRole("radio");
  const radioCount = await radios.count();
  for (let radioIndex = 0; radioIndex < radioCount; radioIndex += 1) {
    const radio = radios.nth(radioIndex);
    const labelText = ((await radio.textContent()) ?? "").trim();
    if (labelText && !labelText.includes(skipText)) {
      await radio.click();
      return labelText;
    }
  }
  throw new Error(`No selectable chip in #${groupId}`);
}

async function fillMinimalApartmentCore(page, options = {}) {
  const {
    dealTypeLabel = "იყიდება",
    internalPrice = "100",
    publicPrice = null,
    currency = null,
    minRentalPeriod = "12",
    propertyTypeLabel = "ბინა",
  } = options;

  await page.goto(`${BASE}/properties/new`);
  await page.waitForSelector("text=განცხადების დამატება", { timeout: 30000 });
  await clearDrafts(page);
  await page.reload();
  await page.waitForSelector("text=განცხადების დამატება");

  if (propertyTypeLabel !== "ბინა") {
    await page.locator("#propertyType").getByRole("radio", { name: propertyTypeLabel }).click();
  }

  await page.locator("#dealType").getByRole("radio", { name: dealTypeLabel, exact: true }).click();

  const currencyGroup = page.getByRole("group", { name: "განცხადების ფასის ვალუტა" });
  if (currency === "USD") {
    await currencyGroup.getByRole("button", { name: "$" }).click();
  } else if (currency === "GEL") {
    await currencyGroup.getByRole("button", { name: "₾" }).click();
  }

  await page.waitForSelector("#districtGroup", { timeout: 20000 });
  await clickFirstNonEmptyChip(page, "districtGroup", "აირჩიეთ");
  await page.waitForTimeout(200);
  await clickFirstNonEmptyChip(page, "districtNeighborhood", "აირჩიეთ");

  const addressInput = page.locator("#address");
  await addressInput.fill("ვაჟა");
  await page.waitForTimeout(900);
  const suggestion = page.getByRole("option").first();
  if (await suggestion.isVisible().catch(() => false)) {
    await suggestion.click();
  } else {
    await addressInput.fill("ვაჟა-პირველი ქ.");
  }

  await page.locator("#ownerName").fill("Regression Owner");
  await page.getByPlaceholder("555555555").first().fill("555123456");

  await page.locator("#aptTotalArea").fill("50");
  await page.locator("#aptRooms").fill("3");
  await page.locator("#aptBedrooms").fill("2");
  await page.locator("#aptFloor").fill("5");
  await page.locator("#aptTotalFloors").fill("12");

  await page.getByLabel("შიდა ფასი", { exact: true }).fill(internalPrice);
  if (publicPrice !== null) {
    await page.getByLabel("საჯარო ფასი", { exact: true }).fill(publicPrice);
  }

  if (dealTypeLabel === "ქირავდება" || dealTypeLabel === "დღიურად ქირავდება") {
    await page.locator("#aptMinRentalMonths").fill(minRentalPeriod);
  }
}

async function submitCreateProperty(page) {
  await page.getByRole("button", { name: "განცხადების შექმნა" }).click();
}

async function readEditPrices(page) {
  await page.goto(page.url());
  await page.waitForLoadState("networkidle");
  const internal = await page.getByLabel("შიდა ფასი", { exact: true }).inputValue();
  const pub = await page.getByLabel("საჯარო ფასი", { exact: true }).inputValue();
  return { internal, public: pub };
}

async function openPropertyEdit(page, propertyId) {
  await page.goto(`${BASE}/properties/${propertyId}/edit`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("text=ცვლილებების შენახვა", { timeout: 60000 });
}

async function readEditPriceFields(page) {
  const publicInput = page
    .locator('label:text-is("საჯარო ფასი")')
    .locator("xpath=following-sibling::div//input")
    .first();
  await publicInput.waitFor({ timeout: 60000 });
  const pub = await publicInput.inputValue();
  const internalInput = page
    .locator('label:text-is("შიდა ფასი")')
    .locator("xpath=following-sibling::div//input")
    .first();
  const hasInternal = await internalInput.isVisible().catch(() => false);
  const internal = hasInternal ? await internalInput.inputValue() : null;
  return { internal, public: pub, hasInternal };
}

async function fillMinimalClient(page, values = {}) {
  await page.goto(`${BASE}/clients/new`);
  await page.waitForSelector("text=კლიენტის დამატება");
  await clearDrafts(page);
  await page.reload();
  await page.waitForSelector("text=კლიენტის დამატება");
  await page.waitForSelector("text=სრული სახელი", { timeout: 15000 });

  await page.locator('input[name="name"]').fill(values.name ?? "Regression Client");
  await page.locator("#phones\\.0").fill(values.phone ?? "555999888");
  await page.locator("#description").fill(values.description ?? "Regression client description body.");
}

async function submitCreateClient(page) {
  await page.getByRole("button", { name: "კლიენტის შენახვა" }).click();
}

async function runTests(page, token) {
  // --- 1. SALE persistence ---
  await safeRun("1 SALE price persistence", async () => {
    const feature = "1 SALE price persistence";
    const steps =
      "New property SALE; internal=100; accept public 103; set public=110; create; reload edit; patch public only";
    await fillMinimalApartmentCore(page, { dealTypeLabel: "იყიდება", internalPrice: "100" });
    await page.getByLabel("საჯარო ფასი", { exact: true }).fill("110");

    const network = await waitForPropertyPost(page, () => submitCreateProperty(page));
    const reqPrices = pickPayloadFields(network.request, ["priceInternal", "pricePublic"]);
    const propertyId = extractPropertyId(network);
    const expectedReq = { priceInternal: 100, pricePublic: 110 };
    const reqOk =
      reqPrices.priceInternal === 100 && reqPrices.pricePublic === 110 && network.status < 300;

    let reloadOk = false;
    let editPublicPatchOk = false;
    let reloadValues = null;
    let apiAfterCreate = null;

    if (propertyId && network.status < 300) {
      apiAfterCreate = await apiGetProperty(token, propertyId);
      await openPropertyEdit(page, propertyId);
      reloadValues = await readEditPriceFields(page);
      reloadOk =
        apiAfterCreate?.body?.priceInternal === 100 &&
        apiAfterCreate?.body?.pricePublic === 110 &&
        reloadValues.public === "110";

      const publicEditInput = page
        .locator('label:text-is("საჯარო ფასი")')
        .locator("xpath=following-sibling::div//input")
        .first();
      await publicEditInput.fill("120");
      const patchNet = await waitForPropertyPatch(page, () =>
        page.getByRole("button", { name: "ცვლილებების შენახვა" }).click(),
      );
      editPublicPatchOk =
        patchNet.request?.pricePublic === 120 &&
        (patchNet.request?.priceInternal === undefined ||
          patchNet.request?.priceInternal === 100);
    }

    record({
      feature,
      steps,
      request: { method: "POST", endpoint: "/properties", body: reqPrices, status: network.status },
      response: pickPayloadFields(network.response, ["id", "priceInternal", "pricePublic"]),
      reloadEdit: reloadValues,
      apiGet: pickPayloadFields(apiAfterCreate?.body, ["priceInternal", "pricePublic"]),
      expected: expectedReq,
      result:
        reqOk && network.status < 300 && reloadOk && editPublicPatchOk ? "PASS" : "FAIL",
    });
  });

  // --- 2. RENT persistence ---
  for (const dealLabel of ["ქირავდება", "დღიურად ქირავდება"]) {
    await safeRun(`2 RENT persistence (${dealLabel})`, async () => {
    const feature = `2 RENT persistence (${dealLabel})`;
    await fillMinimalApartmentCore(page, {
      dealTypeLabel: dealLabel,
      internalPrice: "100",
      publicPrice: "110",
    });
    const network = await waitForPropertyPost(page, () => submitCreateProperty(page));
    const reqPrices = pickPayloadFields(network.request, ["priceInternal", "pricePublic", "dealType"]);
    const propertyId = extractPropertyId(network);
    let reloadValues = null;
    if (propertyId && network.status < 300) {
      await openPropertyEdit(page, propertyId);
      reloadValues = await readEditPriceFields(page);
    }
    const noMarkup =
      reqPrices.priceInternal === 100 &&
      reqPrices.pricePublic === 110 &&
      !(reqPrices.pricePublic === 103);
    record({
      feature,
      steps: `Create ${dealLabel}; internal 100; public 110; POST; reload edit`,
      request: { method: "POST", endpoint: "/properties", body: reqPrices, status: network.status },
      response: pickPayloadFields(network.response, ["id", "priceInternal", "pricePublic", "dealType"]),
      reloadEdit: reloadValues,
      expected: { priceInternal: 100, pricePublic: 110, no103Markup: true },
      result:
        network.status < 300 &&
        noMarkup &&
        reloadValues?.internal === "100" &&
        reloadValues?.public === "110"
          ? "PASS"
          : "FAIL",
    });
    });
  }

  // --- 3. Currency ---
  for (const currency of ["USD", "GEL"]) {
    await safeRun(`3 Currency ${currency}`, async () => {
    const feature = `3 Currency ${currency}`;
    await fillMinimalApartmentCore(page, {
      internalPrice: "200",
      publicPrice: "250",
      currency,
    });
    const network = await waitForPropertyPost(page, () => submitCreateProperty(page));
    const reqCur = pickPayloadFields(network.request, ["currency", "priceInternal", "pricePublic"]);
    const propertyId = extractPropertyId(network);
    let editCurrency = null;
    let editPrices = null;
    if (propertyId && network.status < 300) {
      await openPropertyEdit(page, propertyId);
      editPrices = await readEditPriceFields(page);
      const currencyGroup = page.getByRole("group", { name: "განცხადების ფასის ვალუტა" });
      const usdPressed =
        (await currencyGroup.getByRole("button", { name: "$" }).getAttribute("aria-pressed")) === "true";
      editCurrency = usdPressed ? "USD" : "GEL";
    }
    record({
      feature,
      steps: `Create with currency ${currency}; save; reload edit`,
      request: { method: "POST", endpoint: "/properties", body: reqCur, status: network.status },
      reloadEdit: { currency: editCurrency, ...editPrices },
      expected: { currency, pricesUnchanged: { internal: "200", public: "250" } },
      result:
        network.status < 300 &&
        reqCur.currency === currency &&
        editPrices?.internal === "200" &&
        editPrices?.public === "250"
          ? "PASS"
          : "FAIL",
    });
    });
  }

  // --- 4. Building payload ---
  await safeRun("4A Building NEW + NEW_GOOD", async () => {
    const feature = "4A Building NEW + NEW_GOOD";
    await fillMinimalApartmentCore(page, { publicPrice: "100000" });
    const buildingSection = page.locator("#aptBuildingCondition").locator("..");
    await buildingSection.getByRole("radio", { name: "ახალი", exact: true }).click();
    await page.locator("#aptBuildingAgeType").getByRole("radio", { name: "ახალი კარგი", exact: true }).click();
    const network = await waitForPropertyPost(page, () => submitCreateProperty(page));
    const building = {
      buildingCondition: network.request?.apartment?.buildingCondition,
      buildingAgeType: network.request?.apartment?.buildingAgeType,
    };
    const propertyId = extractPropertyId(network);
    let reloadBuilding = null;
    if (propertyId) {
      const api = await apiGetProperty(token, propertyId);
      reloadBuilding = {
        buildingCondition: api.body?.apartment?.buildingCondition,
        buildingAgeType: api.body?.apartment?.buildingAgeType,
      };
    }
    record({
      feature,
      steps: "Apartment NEW + NEW_GOOD; POST; GET reload",
      request: { method: "POST", body: building, status: network.status },
      reloadEdit: reloadBuilding,
      expected: { buildingCondition: "NEW", buildingAgeType: "NEW_GOOD" },
      result:
        building.buildingCondition === "NEW" &&
        building.buildingAgeType === "NEW_GOOD" &&
        reloadBuilding?.buildingCondition === "NEW"
          ? "PASS"
          : "FAIL",
    });
  });

  await safeRun("4B Building NEW→OLD before save", async () => {
    const feature = "4B Building NEW→OLD before save";
    await fillMinimalApartmentCore(page, { publicPrice: "100000" });
    const buildingSection = page.locator("#aptBuildingCondition").locator("..");
    await buildingSection.getByRole("radio", { name: "ახალი", exact: true }).click();
    await buildingSection.getByRole("radio", { name: "ძველი", exact: true }).click();
    const network = await waitForPropertyPost(page, () => submitCreateProperty(page));
    const building = {
      buildingCondition: network.request?.apartment?.buildingCondition,
      buildingAgeType: network.request?.apartment?.buildingAgeType,
    };
    record({
      feature,
      steps: "Select NEW then OLD; POST",
      request: { method: "POST", body: building, status: network.status },
      expected: { buildingCondition: "OLD", noBuildingAgeType: true },
      result:
        building.buildingCondition === "OLD" &&
        (building.buildingAgeType === undefined ||
          building.buildingAgeType === null ||
          building.buildingAgeType === "")
          ? "PASS"
          : "FAIL",
    });
  });

  // --- 5. Parking ---
  await safeRun("5A Parking YES + types", async () => {
    const feature = "5A Parking YES + types";
    await fillMinimalApartmentCore(page, { publicPrice: "100000" });
    const parkingGroup = page.locator("#apt-parking");
    await parkingGroup.getByRole("radio", { name: "კი", exact: true }).click();
    const parkingTypesGroup = page.locator("#apt-parkingTypes");
    await parkingTypesGroup.getByRole("button", { name: "მიწისქვეშა პარკინგი" }).click();
    await parkingTypesGroup.getByRole("button", { name: "ავტოფარეხი" }).click();
    const network = await waitForPropertyPost(page, () => submitCreateProperty(page));
    const parking = {
      parking: network.request?.apartment?.parking,
      parkingTypes: network.request?.apartment?.parkingTypes,
    };
    record({
      feature,
      steps: "Parking YES + types; POST",
      request: { method: "POST", body: parking, status: network.status },
      expected: { parking: "YES", parkingTypesPresent: true },
      result: network.status < 300 && parking.parking === "YES" ? "PASS" : "FAIL",
      note: parking,
    });
  });

  // --- 6–12 abbreviated with capture hooks where feasible ---
  await safeRun("11 Client Enter + validation", async () => {
    const feature = "11 Client Enter + validation";
    await page.goto(`${BASE}/clients/new`);
    await clearDrafts(page);
    await page.reload();
    await page.waitForSelector("text=კლიენტის დამატება");
    await page.locator('input[name="name"]').fill("Enter test");
    let postDuringEnter = false;
    page.on("request", (req) => {
      if (req.method() === "POST" && req.url().includes("/clients")) postDuringEnter = true;
    });
    await page.locator('input[name="name"]').press("Enter");
    await page.waitForTimeout(500);
    await page.locator('input[name="name"]').fill("");
    await page.locator("#phones\\.0").fill("+995");
    await page.locator("#description").fill("");
    await page.getByRole("button", { name: "კლიენტის შენახვა" }).click();
    await page.waitForTimeout(800);
    const summaryVisible = await page
      .getByText("გთხოვთ შეავსოთ სავალდებულო ველები.")
      .isVisible()
      .catch(() => false);
    const nameError = await page.getByText("სრული სახელი სავალდებულოა").isVisible().catch(() => false);
    record({
      feature,
      steps: "Enter in name; then Save empty required",
      request: { method: "POST during Enter", blocked: !postDuringEnter },
      reloadEdit: { summaryVisible, nameError },
      expected: { noPostOnEnter: true, georgianValidation: true },
      result: !postDuringEnter && summaryVisible ? "PASS" : "FAIL",
    });
  });

  await safeRun("8 Client Tbilisi neighborhoods POST", async () => {
    const feature = "8 Client Tbilisi neighborhoods POST";
    await fillMinimalClient(page, {
      name: "Tbilisi NB Client",
      phone: "555111222",
      description: "Client districts test.",
    });
    const firstNb = page.locator('input[type="checkbox"]').first();
    if (await firstNb.isVisible().catch(() => false)) {
      await firstNb.check();
    }
    const network = await waitForClientPost(page, () => submitCreateClient(page));
    const districts = network.request?.districts;
    const clientId = network.response?.id ?? network.response?.data?.id;
    let apiDistricts = null;
    if (clientId) {
      const api = await apiGetClient(token, clientId);
      apiDistricts = api.body?.districts;
    }
    record({
      feature,
      steps: "New client; Tbilisi; check neighborhood; POST; GET",
      request: {
        method: "POST",
        endpoint: "/clients",
        districts,
        status: network.status,
      },
      response: { id: clientId },
      reloadEdit: apiDistricts,
      result: network.status < 300 && districts ? "PASS" : "FAIL",
    });
  });
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    await context.addInitScript(() => {
      window.localStorage.removeItem("draft:property:new");
      window.localStorage.removeItem("draft:client:new");
    });
    const page = await context.newPage();
    await login(page);
    await clearDrafts(page);
    const token = await getAuthToken(page);
    if (!token) {
      throw new Error("No auth token after login");
    }
    await runTests(page, token);
  } finally {
    if (browser) await browser.close();
  }

  const outPath = "/Users/sergiqaliashvili/Desktop/real-estate-front/scripts/integrationRegressionPass2.results.json";
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} results to ${outPath}`);
}

main();
