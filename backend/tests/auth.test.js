import "dotenv/config";
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

process.env.JWT_SECRET ||= "test-only-secret-not-for-production";

const runId = randomUUID();
const testMongoUri =
  process.env.TEST_MONGODB_URI ||
  `mongodb://127.0.0.1:27017/shareloop_test_${runId.replaceAll("-", "")}`;
const testDatabaseName = decodeURIComponent(new URL(testMongoUri).pathname.replace(/^\/+/, "").split("/")[0] || "");
if (!/(^|[_-])test($|[_-])/i.test(testDatabaseName)) {
  throw new Error("TEST_MONGODB_URI must point to a database whose name clearly includes 'test'.");
}

const [
  { default: app },
  { default: User },
  { default: Listing },
  { default: Claim },
  { default: SearchAlert },
  { default: ItemRequest },
] = await Promise.all([
  import("../src/app.js"),
  import("../src/models/User.js"),
  import("../src/models/Listing.js"),
  import("../src/models/Claim.js"),
  import("../src/models/SearchAlert.js"),
  import("../src/models/ItemRequest.js"),
]);

let server;
let baseUrl;
const createdUserIds = [];
const createdListingIds = [];
const createdClaimIds = [];
const createdAlertIds = [];
const createdRequestIds = [];

before(async () => {
  await mongoose.connect(testMongoUri, { serverSelectionTimeoutMS: 5000 });
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  if (mongoose.connection.readyState === 1) {
    if (createdClaimIds.length) await Claim.deleteMany({ _id: { $in: createdClaimIds } });
    if (createdAlertIds.length) await SearchAlert.deleteMany({ _id: { $in: createdAlertIds } });
    if (createdRequestIds.length) await ItemRequest.deleteMany({ _id: { $in: createdRequestIds } });
    if (createdListingIds.length) await Listing.deleteMany({ _id: { $in: createdListingIds } });
    if (createdUserIds.length) await User.deleteMany({ _id: { $in: createdUserIds } });
    await mongoose.disconnect();
  }
});

const request = (path, options = {}) =>
  fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

const registration = {
  name: "ShareLoop Tester",
  email: `TEST.USER.${runId}@Example.com`,
  password: "reUseSecure123",
};

const listingInput = {
  title: "Community bookshelf",
  description: "A sturdy bookshelf available for pickup this week.",
  category: "Furniture",
  condition: "Gently Used",
  images: [],
  location: "North Park",
  pickupDetails: {
    handoverType: "Porch Pickup",
    instructions: "Message before arriving to arrange pickup.",
  },
};

test("registers a user and stores only a password hash", async () => {
  const response = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(registration),
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  createdUserIds.push(body.data.user.id);
  assert.equal(body.data.user.email, registration.email.toLowerCase());
  assert.equal("password" in body.data.user, false);
  assert.equal("passwordHash" in body.data.user, false);

  const savedUser = await User.findOne({ email: registration.email.toLowerCase() }).select(
    "+passwordHash",
  );
  assert.ok(savedUser.passwordHash);
  assert.notEqual(savedUser.passwordHash, registration.password);
});

test("rejects duplicate email addresses", async () => {
  const response = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...registration, email: ` ${registration.email.toLowerCase()} ` }),
  });

  assert.equal(response.status, 409);
  assert.equal((await response.json()).success, false);
});

test("rejects missing, malformed, and weak registration input", async () => {
  const cases = [
    {},
    { ...registration, email: "not-an-email" },
    { ...registration, password: "short" },
  ];

  for (const body of cases) {
    const response = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
  }
});

test("rejects invalid login input", async () => {
  for (const body of [
    {},
    { email: "not-an-email", password: registration.password },
    { email: registration.email, password: "short" },
  ]) {
    const response = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
  }
});

test("logs in with valid credentials and returns a JWT", async () => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: ` ${registration.email.toUpperCase()} `,
      password: registration.password,
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.ok(body.data.token);
  assert.equal(body.data.user.email, registration.email.toLowerCase());
  assert.equal("passwordHash" in body.data.user, false);
});

test("rejects an incorrect password", async () => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: registration.email,
      password: "incorrectPassword",
    }),
  });

  assert.equal(response.status, 401);
  assert.equal((await response.json()).success, false);
});

test("protects the profile route and returns a safe profile with a JWT", async () => {
  const unauthorizedResponse = await request("/api/auth/me");
  assert.equal(unauthorizedResponse.status, 401);

  const loginResponse = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: registration.email,
      password: registration.password,
    }),
  });
  const { data } = await loginResponse.json();

  const profileResponse = await request("/api/auth/me", {
    headers: { Authorization: `bEaReR   ${data.token}` },
  });
  const body = await profileResponse.json();
  assert.equal(profileResponse.status, 200);
  assert.equal(body.data.user.email, registration.email.toLowerCase());
  assert.equal("passwordHash" in body.data.user, false);
});

test("rejects invalid and expired JWTs", async () => {
  const user = await User.findOne({ email: registration.email.toLowerCase() });
  const expiredToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: -1,
  });

  for (const token of ["not-a-valid-jwt", expiredToken]) {
    const response = await request("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.message, "Invalid or expired token");
  }
});

test("health endpoint reports the connected database", async () => {
  const response = await request("/api/health");
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.services.api, "up");
  assert.equal(body.services.database, "connected");
});

test("persists alerts and item requests per authenticated user with validation", async () => {
  const email = `community.${runId}@example.com`;
  const register = await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Community Tester', email, password: 'communityTester123' }) });
  assert.equal(register.status, 201);
  const communityUser = (await register.json()).data.user;
  createdUserIds.push(communityUser.id);
  const login = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password: 'communityTester123' }) });
  const communityToken = (await login.json()).data.token;
  const auth = { Authorization: `Bearer ${communityToken}` };
  assert.equal((await request('/api/community/alerts', { method: 'POST', body: JSON.stringify({ term: 'desk', radius: 5 }) })).status, 401);
  const alertResponse = await request('/api/community/alerts', { method: 'POST', headers: auth, body: JSON.stringify({ term: 'desk', radius: 5, notifyByEmail: true }) });
  const alertBody = await alertResponse.json();
  assert.equal(alertResponse.status, 201);
  createdAlertIds.push(alertBody.data.alert._id);
  assert.equal(alertBody.data.alert.user, communityUser.id);
  assert.equal((await request('/api/community/alerts', { method: 'POST', headers: auth, body: JSON.stringify({ term: 'x', radius: 80 }) })).status, 400);
  const alertsMine = await request('/api/community/alerts/mine', { headers: auth });
  assert.equal((await alertsMine.json()).data.alerts.length, 1);

  const requestResponse = await request('/api/community/requests', { method: 'POST', headers: auth, body: JSON.stringify({ category: 'Furniture', description: 'Looking for a small writing desk for my apartment.', locality: 'North Park' }) });
  const requestBody = await requestResponse.json();
  assert.equal(requestResponse.status, 201);
  createdRequestIds.push(requestBody.data.request._id);
  assert.equal(requestBody.data.request.status, 'active');
  assert.equal((await request('/api/community/requests', { method: 'POST', headers: auth, body: JSON.stringify({ category: 'Furniture', description: 'short' }) })).status, 400);
  const requestsMine = await request('/api/community/requests/mine', { headers: auth });
  assert.equal((await requestsMine.json()).data.requests.length, 1);
});

let listingId;
let ownerToken;
let otherUserToken;

test("creates listings only for authenticated users and validates listing input", async () => {
  const unauthorizedResponse = await request("/api/listings", {
    method: "POST",
    body: JSON.stringify(listingInput),
  });
  assert.equal(unauthorizedResponse.status, 401);

  const loginResponse = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: registration.email,
      password: registration.password,
    }),
  });
  const loginBody = await loginResponse.json();
  ownerToken = loginBody.data.token;

  for (const body of [
    {},
    { ...listingInput, category: "Unlisted category" },
    { ...listingInput, owner: new mongoose.Types.ObjectId().toString() },
  ]) {
    const response = await request("/api/listings", {
      method: "POST",
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: JSON.stringify(body),
    });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
  }

  const missingLocationDetailsResponse = await request("/api/listings", {
    method: "POST",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({
      title: listingInput.title,
      description: listingInput.description,
      category: listingInput.category,
      condition: listingInput.condition,
    }),
  });
  const missingLocationDetailsBody = await missingLocationDetailsResponse.json();
  assert.equal(missingLocationDetailsResponse.status, 400);
  assert.match(missingLocationDetailsBody.message, /locality/);
  assert.match(missingLocationDetailsBody.message, /pickupDetails\.handoverType/);
  assert.match(missingLocationDetailsBody.message, /pickupDetails\.instructions/);

  const response = await request("/api/listings", {
    method: "POST",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify(listingInput),
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  listingId = body.data.listing._id;
  createdListingIds.push(listingId);
  assert.equal(body.data.listing.title, listingInput.title);
  assert.equal(body.data.listing.locality, listingInput.location);
  assert.equal(body.data.listing.owner, loginBody.data.user.id);
  const mineUnauthorized = await request("/api/listings/mine");
  assert.equal(mineUnauthorized.status, 401);
  const myListings = await request("/api/listings/mine", { headers: { Authorization: `Bearer ${ownerToken}` } });
  assert.equal((await myListings.json()).data.listings.some((listing) => listing._id === listingId), true);
});

test("lists available listings with pagination and retrieves a listing by ID", async () => {
  const listResponse = await request("/api/listings?page=1&limit=1");
  const listBody = await listResponse.json();
  assert.equal(listResponse.status, 200);
  assert.equal(listBody.success, true);
  assert.equal(listBody.data.pagination.page, 1);
  assert.equal(listBody.data.pagination.limit, 1);
  assert.equal(
    listBody.data.listings.some((listing) => listing._id === listingId),
    true,
  );
  const searched = await request('/api/listings?search=bookshelf');
  assert.equal((await searched.json()).data.listings.some((listing) => listing._id === listingId), true);
  const categorized = await request('/api/listings?category=Furniture');
  assert.equal((await categorized.json()).data.listings.some((listing) => listing._id === listingId), true);

  for (const query of ["?page=0", "?limit=101", "?page=1.5"]) {
    const response = await request(`/api/listings${query}`);
    assert.equal(response.status, 400);
  }

  const response = await request(`/api/listings/${listingId}`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.listing._id, listingId);

  assert.equal((await request("/api/listings/not-an-id")).status, 400);
  assert.equal(
    (await request("/api/listings/000000000000000000000000")).status,
    404,
  );
});

test("claims reserve an available listing and cancellation releases it", async () => {
  const claimEmail = `claim.tester.${runId}@example.com`;
  const registerResponse = await request("/api/auth/register", { method: "POST", body: JSON.stringify({ name: "Claim Tester", email: claimEmail, password: "claimTester123" }) });
  assert.equal(registerResponse.status, 201);
  createdUserIds.push((await registerResponse.clone().json()).data.user.id);
  const loginResponse = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: claimEmail, password: "claimTester123" }) });
  const claimantToken = (await loginResponse.json()).data.token;
  const pickupWindow = { start: new Date(Date.now() + 3600000).toISOString(), end: new Date(Date.now() + 7200000).toISOString() };
  const ownClaim = await request("/api/claims", { method: "POST", headers: { Authorization: `Bearer ${ownerToken}` }, body: JSON.stringify({ listingId, pickupWindow }) });
  assert.equal(ownClaim.status, 409);
  const response = await request("/api/claims", { method: "POST", headers: { Authorization: `Bearer ${claimantToken}` }, body: JSON.stringify({ listingId, pickupWindow, note: "I can collect promptly." }) });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.match(body.data.claim.passCode, /^PIN-PASS #\d{6}$/);
  createdClaimIds.push(body.data.claim._id);
  assert.equal((await Listing.findById(listingId)).status, "claimed");
  assert.equal((await request(`/api/listings/${listingId}`, { method: "DELETE", headers: { Authorization: `Bearer ${ownerToken}` } })).status, 409);
  assert.equal((await request(`/api/listings/${listingId}`, { method: "PATCH", headers: { Authorization: `Bearer ${ownerToken}` }, body: JSON.stringify({ status: "withdrawn" }) })).status, 409);
  assert.equal((await request("/api/claims", { method: "POST", headers: { Authorization: `Bearer ${claimantToken}` }, body: JSON.stringify({ listingId, pickupWindow }) })).status, 409);
  const mine = await request("/api/claims/mine", { headers: { Authorization: `Bearer ${claimantToken}` } });
  const mineBody = await mine.json();
  assert.equal(mineBody.data.claims.length, 1);
  assert.equal(mineBody.data.claims[0].status, "pending");
  assert.equal(mineBody.data.claims[0].listing.pickupDetails.instructions, undefined);
  const received = await request("/api/claims/received", { headers: { Authorization: `Bearer ${ownerToken}` } });
  const receivedBody = await received.json();
  assert.equal(receivedBody.data.claims.length, 1);
  assert.equal(receivedBody.data.claims[0].claimant.name, "Claim Tester");
  const claimantReceived = await request("/api/claims/received", { headers: { Authorization: `Bearer ${claimantToken}` } });
  assert.equal(claimantReceived.status, 200);
  assert.equal((await claimantReceived.json()).data.claims.length, 0);
  const accepted = await request(`/api/claims/${body.data.claim._id}/status`, { method: "PATCH", headers: { Authorization: `Bearer ${ownerToken}` }, body: JSON.stringify({ status: "accepted" }) });
  assert.equal(accepted.status, 200);
  const acceptedMine = await request("/api/claims/mine", { headers: { Authorization: `Bearer ${claimantToken}` } });
  const acceptedClaim = (await acceptedMine.json()).data.claims[0];
  assert.equal(acceptedClaim.status, "accepted");
  assert.equal(acceptedClaim.listing.pickupDetails.instructions, listingInput.pickupDetails.instructions);
  assert.equal((await request(`/api/claims/${body.data.claim._id}/status`, { method: "PATCH", headers: { Authorization: `Bearer ${ownerToken}` }, body: JSON.stringify({ status: "cancelled" }) })).status, 403);
  const cancelled = await request(`/api/claims/${body.data.claim._id}/status`, { method: "PATCH", headers: { Authorization: `Bearer ${claimantToken}` }, body: JSON.stringify({ status: "cancelled" }) });
  assert.equal(cancelled.status, 200);
  assert.equal((await Listing.findById(listingId)).status, "available");
});

test("only the listing owner can update or delete a listing", async () => {
  const registrationResponse = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: "Another Member",
      email: `another.member.${runId}@example.com`,
      password: "anotherSecure123",
    }),
  });
  assert.equal(registrationResponse.status, 201);
  createdUserIds.push((await registrationResponse.clone().json()).data.user.id);

  const loginResponse = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: `another.member.${runId}@example.com`,
      password: "anotherSecure123",
    }),
  });
  otherUserToken = (await loginResponse.json()).data.token;

  const forbiddenUpdate = await request(`/api/listings/${listingId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${otherUserToken}` },
    body: JSON.stringify({ title: "Unauthorized title change" }),
  });
  assert.equal(forbiddenUpdate.status, 403);

  const invalidUpdate = await request(`/api/listings/${listingId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ owner: new mongoose.Types.ObjectId().toString() }),
  });
  assert.equal(invalidUpdate.status, 400);

  const updateResponse = await request(`/api/listings/${listingId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ status: "withdrawn", locality: "South Park" }),
  });
  const updateBody = await updateResponse.json();
  assert.equal(updateResponse.status, 200);
  assert.equal(updateBody.data.listing.status, "withdrawn");
  assert.equal(updateBody.data.listing.locality, "South Park");

  const listResponse = await request("/api/listings");
  const listBody = await listResponse.json();
  assert.equal(
    listBody.data.listings.some((listing) => listing._id === listingId),
    false,
  );

  const forbiddenDelete = await request(`/api/listings/${listingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${otherUserToken}` },
  });
  assert.equal(forbiddenDelete.status, 403);

  const deleteResponse = await request(`/api/listings/${listingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  assert.equal(deleteResponse.status, 200);
  assert.equal((await deleteResponse.json()).success, true);
  assert.equal((await request(`/api/listings/${listingId}`)).status, 404);
});
