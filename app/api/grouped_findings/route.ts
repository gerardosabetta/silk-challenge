import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const queryParams = new URL(request.url).searchParams;

    const page = parseInt(queryParams.get("page") || "1");
    const page_size = parseInt(queryParams.get("page_size") || "10");
    const skip = (page - 1) * page_size;
    const take = page_size;
    const sortingField = queryParams.get("sorting_field") || "id";
    const sortingDirection = queryParams.get("sorting_direction") || "asc";

    const grouped_findings = await prisma.grouped_findings.findMany({
      skip,
      take,
      orderBy: {
        [sortingField]: sortingDirection,
      },
      include: {
        _count: true,
      },
    });

    const total = await prisma.grouped_findings.count();

    return new Response(
      JSON.stringify({
        results: grouped_findings,
        total,
      })
    );
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
