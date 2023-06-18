import useGroupedFindings from "@/queries/useGroupedFindings";
import { getColorForSeverity } from "@/utils";
import {
  PaginationState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import Chip from "./Chip";
import RawFindingsTable from "./RawFindingsTable";
import {
  Resizer,
  StyledTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TablePaginator,
} from "./Table";

const columnHelper = createColumnHelper<GroupedFinding>();

const GroupedFindingsTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading } = useGroupedFindings({
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    sorting_field: sorting[0]?.id,
    sorting_direction: sorting[0]?.desc ? "desc" : "asc",
  });

  const table = useReactTable({
    state: {
      sorting,
      pagination,
    },
    columns: [
      columnHelper.display({
        id: "id",
        header: () => null,
        size: 50,
        enableResizing: false,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <button
              onClick={row.getToggleExpandedHandler()}
              className="w text-gray-500 hover:text-gray-900"
            >
              {row.getIsExpanded() ? "👇" : "👉"}
            </button>
          ) : null,
      }),
      columnHelper.accessor("severity", {
        header: "Severity",
        size: 100,
        cell: ({ row }) => {
          const severity = row.getValue<Severity>("severity");
          const color = getColorForSeverity(severity);

          return <Chip color={color}>{severity}</Chip>;
        },
      }),
      columnHelper.accessor("grouped_finding_created", {
        header: "Time",
        cell: ({ row }) =>
          new Date(row.getValue("grouped_finding_created")).toLocaleString(),
      }),
      columnHelper.accessor("sla", {
        header: "SLA",
        cell: ({ row }) => new Date(row.getValue("sla")).toLocaleString(),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        size: 450,
      }),
      columnHelper.accessor("security_analyst", {
        header: "Security Analyst",
      }),
      columnHelper.accessor("owner", {
        header: "Owner",
        size: 75,
      }),
      columnHelper.accessor("workflow", {
        header: "Workflow",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => {
          const value = row.getValue<"in_progress">("status");
          const percentage = row.original.progress * 100;

          if (value === "in_progress") {
            return (
              <div className="flex flex-col items-center justify-center gap-2">
                <Chip color="blue">In progress</Chip>
                <div className="relative w-24 pt-1">
                  <div className="mb-4 flex h-2 overflow-hidden rounded bg-blue-200 text-xs">
                    <div
                      style={{ width: percentage }}
                      className="flex flex-col justify-center whitespace-nowrap bg-blue-500 text-center text-white shadow-none"
                    ></div>
                  </div>
                </div>
              </div>
            );
          }
        },
      }),
      columnHelper.accessor("_count.raw_findings", {
        header: "# of findings",
        enableSorting: false,
      }),
    ],
    data: data?.results || [],
    onSortingChange: (newSorting) => {
      table.resetExpanded();
      setSorting(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    columnResizeMode: "onChange",
    manualPagination: true,
    pageCount: Math.ceil((data?.total as number) / pagination.pageSize),
    onPaginationChange: (newPagination) => {
      table.resetExpanded();
      setPagination(newPagination);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid h-[500px] grid-rows-[1fr_50px] rounded-lg bg-gray-50  shadow ">
      <div className=" overflow-auto">
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
                      <div className="flex gap-1">
                        <div
                          {...{
                            className:
                              (header.column.getCanSort()
                                ? "cursor-pointer select-none "
                                : "") +
                              "overflow-hidden whitespace-nowrap text-ellipsis",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
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
              <React.Fragment key={row.id}>
                <tr className={idx % 2 ? "bg-white" : "bg-gray-50"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={table.getHeaderGroups()[0].headers.length}>
                      <RawFindingsTable groupedFindingsId={row.original.id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </StyledTable>
      </div>
      <TablePaginator table={table} />
    </div>
  );
};

export default GroupedFindingsTable;
