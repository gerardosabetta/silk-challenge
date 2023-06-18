import Axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useRawFindingsByGroupedFindingsId = ({
  groupedFindingsId,
  page = 1,
  page_size = 10,
  sorting_field,
  sorting_direction,
}: {
  groupedFindingsId: string;
  page: number;
  page_size: number;
  sorting_field?: string;
  sorting_direction?: "asc" | "desc";
}) =>
  useQuery<PaginatedResponse<RawFinding>>({
    queryKey: [
      "raw_findings",
      {
        grouped_findings_id: groupedFindingsId,
        page,
        page_size,
        sorting_field,
        sorting_direction,
      },
    ],
    queryFn: async () => {
      const { data } = await Axios.get(
        "/api/get_raw_findings_by_grouped_finding_id",
        {
          params: {
            grouped_findings_id: groupedFindingsId,
            page,
            page_size,
            sorting_field,
            sorting_direction,
          },
        }
      );
      return data;
    },
    keepPreviousData: true,
  });

export default useRawFindingsByGroupedFindingsId;
