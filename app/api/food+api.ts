// API Endpoints that connect to the food API for security.

// GET Request for food data
export async function GET(request: Request) {
  const data = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/list?api_key=${process.env.FOOD_API_KEY}`)
  const json = await data.json();
  return Response.json(json);
}