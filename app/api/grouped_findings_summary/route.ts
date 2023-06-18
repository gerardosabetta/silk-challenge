import { prisma } from "@/lib/prisma";

/**
 * Returns a summary of grouped findings by severity
 */
export async function GET(request: Request) {
  try {
    const grouped_findings_summary = (
      await prisma.grouped_findings.groupBy({
        by: ["severity"],
        _count: {
          severity: true,
        },
      })
    ).reduce((acc, severity) => {
      acc[severity.severity] = severity._count.severity;
      return acc;
    }, {} as { [key: string]: number });

    return new Response(JSON.stringify(grouped_findings_summary));
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
