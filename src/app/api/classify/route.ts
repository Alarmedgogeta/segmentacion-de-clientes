import { classifyClient, validateClassifierInput } from "@/lib/classifier";

const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return Response.json(
      { error: "Usa Content-Type: application/json." },
      { status: 415, headers },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "El cuerpo de la solicitud no contiene JSON válido." },
      { status: 400, headers },
    );
  }

  const validation = validateClassifierInput(body);
  if (!validation.valid) {
    return Response.json(validation.error, { status: 400, headers });
  }

  return Response.json(classifyClient(validation.input), { headers });
}
