const API_URL = "https://randomuser.me/api/";
const SERVER_URL = "http://localhost:3000/teachers";

const NATIONALITIES = "au,ca,ch,de,dk,es,fi,fr,ie,ir,nl,no,nz,tr,us";

async function getUsersFromApi(count, page) {
  const url = API_URL + "?results=" + count + "&page=" + page + "&seed=teachfinder&nat=" + NATIONALITIES;

  const response = await fetch(url);
  if (response.ok === false) {
    throw new Error("Server error " + response.status);
  }

  const data = await response.json();

  const result = [];
  for (let i = 0; i < data.results.length; i++) {
    result.push(formatRandomUser(data.results[i]));
  }
  return result;
}

async function sendToServer(user) {
  const response = await fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.ok === false) {
    throw new Error("Server error " + response.status);
  }
}
