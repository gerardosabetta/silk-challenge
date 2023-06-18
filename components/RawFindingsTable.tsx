import useRawFindingsByGroupedFindingsId from "@/queries/useRawFindingsByGroupedFindingsId";
import { getColorForSeverity } from "@/utils";
import {
  PaginationState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import Chip from "./Chip";
import {
  Resizer,
  StyledTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TablePaginator,
} from "./Table";

const RawFindingsTable = ({
  groupedFindingsId,
}: {
  groupedFindingsId: string;
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useRawFindingsByGroupedFindingsId({
    groupedFindingsId,
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    sorting_direction: sorting[0]?.desc ? "desc" : "asc",
    sorting_field: sorting[0]?.id,
  });

  const columnHelper = createColumnHelper<RawFinding>();

  const table = useReactTable({
    state: {
      sorting,
      pagination,
    },
    columns: [
      columnHelper.accessor("severity", {
        header: "Severity",
        cell: ({ row }) => {
          const severity = row.getValue<Severity>("severity");
          const color = getColorForSeverity(severity);

          return <Chip color={color}>{severity}</Chip>;
        },
      }),
      columnHelper.accessor("finding_created", {
        header: "Finding Created",
        cell: ({ row }) =>
          new Date(row.getValue("finding_created")).toLocaleString(),
      }),
      columnHelper.accessor("source_security_tool_name", {
        header: "Source",
      }),
      columnHelper.accessor("description", {
        header: "Description",
        size: 500,
      }),
      columnHelper.accessor("asset", {
        header: "Asset",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => {
          const value = row.getValue<"in_progress" | "fixed" | "open">(
            "status"
          );

          let color: Color = "blue";

          if (value === "fixed") {
            color = "green";
          } else if (value === "open") {
            color = "red";
          }

          return (
            <div className="flex flex-col items-center justify-center gap-2">
              <Chip color={color}>
                {value === "in_progress" ? "In Progress" : value}
              </Chip>
            </div>
          );
        },
      }),
    ],
    data: data?.results || [],
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.total as number) / pagination.pageSize),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return <div>loading...</div>;
  }
  return (
    <div className="m-5 grid  w-fit grid-rows-[1fr_50px] rounded-lg bg-gray-100 shadow ">
      <div className="overflow-auto">
        <StyledTable
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeadCell
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                    }}
                    key={header.id}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                    {header.column.getCanResize() && (
                      <Resizer header={header} />
                    )}
                  </TableHeadCell>
                ))}
              </tr>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr className={idx % 2 ? "bg-white" : "bg-gray-50"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </tr>
            ))}
          </TableBody>
        </StyledTable>
        <TablePaginator table={table} />
      </div>
    </div>
  );
};

export default RawFindingsTable;
