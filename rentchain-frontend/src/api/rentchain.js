const BASE_URL = "http://localhost:3000";

export async function getAgreement(address) {
  const res = await fetch(`${BASE_URL}/agreement/${address}`);
  return res.json();
}

export async function getStatus(address) {
  const res = await fetch(`${BASE_URL}/status/${address}`);
  return res.json();
}

export async function activateAgreement({ contractAddress, rentEth, depositEth }) {
  const res = await fetch(`${BASE_URL}/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contractAddress, rentEth, depositEth })
  });
  return res.json();
}

export async function terminateAgreement(contractAddress) {
  const res = await fetch(`${BASE_URL}/terminate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contractAddress })
  });
  return res.json();
}

// deployAgreement stays unchanged
export async function deployAgreement({ renter, ipfsHash, rentEth, depositEth, duration }) {
  const res = await fetch(`${BASE_URL}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ renter, ipfsHash, rentEth, depositEth, duration })
  });
  return res.json();
}
