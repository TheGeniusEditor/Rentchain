const BASE_URL = "http://localhost:3000";

export async function getProperties() {
  const res = await fetch(`${BASE_URL}/properties`);
  return res.json();
}
export async function getProperty(id) {
  const res = await fetch(`${BASE_URL}/property/${id}`);
  return res.json();
}
export async function deployAgreement(data) {
  const res = await fetch(`${BASE_URL}/deploy`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }); return res.json();
}
export async function addProperty(data) {
  const res = await fetch(`${BASE_URL}/property`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }); return res.json();
}
export async function getAgreement(address) {
  const res = await fetch(`${BASE_URL}/agreement/${address}`);
  return res.json();
}
export async function activateAgreement(data) {
  const res = await fetch(`${BASE_URL}/activate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }); return res.json();
}
export async function terminateAgreement(data) {
  const res = await fetch(`${BASE_URL}/terminate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }); return res.json();
}
export async function getPropertiesByOwner(owner) {
  const res = await fetch(`${BASE_URL}/properties/by-owner/${owner}`);
  return res.json();
}
