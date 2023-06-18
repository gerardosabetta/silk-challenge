import Axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useGroupedFindings = ({
  page = 1,
  page_size = 10,
  sorting_field,
  sorting_direction,
}: {
  page: number;
  page_size: number;
  sorting_field?: string;
  sorting_direction?: "asc" | "desc";
}) =>
  useQuery<PaginatedResponse<GroupedFinding>>({
    queryKey: [
      "grouped_fidings",
      { page, page_size, sorting_field, sorting_direction },
    ],
    queryFn: async () => {
      const { data } = await Axios.get("/api/grouped_findings", {
        params: { page, page_size, sorting_field, sorting_direction },
      });
      return data;
    },
    keepPreviousData: true,
  });

export default useGroupedFindings;
