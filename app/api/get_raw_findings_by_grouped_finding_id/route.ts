import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const queryParams = new URL(request.url).searchParams;

    const _grouped_finding_id = queryParams.get("grouped_findings_id");

    if (_grouped_finding_id === null) {
      throw new Error("grouped_findings_id is required");
    }

    const grouped_finding_id = parseInt(_grouped_finding_id);

    const page = parseInt(queryParams.get("page") || "1");
    const page_size = parseInt(queryParams.get("page_size") || "10");
    const skip = (page - 1) * page_size;
    const take = page_size;
    const sortingField = queryParams.get("sorting_field") || "id";
    const sortingDirection = queryParams.get("sorting_direction") || "asc";

    const rawFindings = await prisma.raw_findings.findMany({
      skip,
      take,
      orderBy: {
        [sortingField]: sortingDirection,
      },
      where: {
        grouped_finding_id: grouped_finding_id,
      },
    });

    const total = await prisma.raw_findings.count({
      where: {
        grouped_finding_id: grouped_finding_id,
      },
    });

    return new Response(
      JSON.stringify({
        results: rawFindings,
        total,
      })
    );
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
