// API Endpoints that connect to the food API for security.

// Credentials needed to get the access token

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
  const now = Date.now();

  // Reuse token if still valid
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const token_url = "https://oauth.fatsecret.com/connect/token";
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const credentials = btoa(`${clientID}:${clientSecret}`);

  const token_response = await fetch(token_url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "basic",
    }),
  });
  const token_data = await token_response.json();

  cachedToken = token_data.access_token;

  // Subtract 1 minute buffer since the 'expires_in' is in seconds.
  tokenExpiry = Date.now() + token_data.expires_in * 1000 - 60_000;

  return cachedToken;
}

// app/api/food.js (or /food.ts)
export async function GET(request: Request) {
  // Token needed to gain access to the api.
  const token = await getAccessToken();

  const { searchParams } = new URL(request.url);

  // Grab the query which specifies the user input, otherwise it searches for apples.
  const query = searchParams.get("q") || "apple";

  const params = new URLSearchParams({
    method: "foods.search",
    search_expression: query,
    format: "json",
    max_results: "10",
  });

  const response = await fetch(
    `https://platform.fatsecret.com/rest/server.api?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  return Response.json(data);
}
