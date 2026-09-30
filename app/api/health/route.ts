export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "portfolio",
      commit: process.env.PORTFOLIO_COMMIT_SHA ?? "development",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
