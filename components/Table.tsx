import { Table } from "@tanstack/react-table";
import React, { PropsWithChildren, TableHTMLAttributes } from "react";

export const StyledTable: React.FC<
  PropsWithChildren &
    React.DetailedHTMLProps<
      TableHTMLAttributes<HTMLTableElement>,
      HTMLTableElement
    >
> = ({ children, ...props }) => (
  <table className="table-fixed" {...props}>
    {children}
  </table>
);

export const TableHead: React.FC<
  PropsWithChildren &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLTableSectionElement>,
      HTMLTableSectionElement
    >
> = ({ children, ...props }) => (
  <thead className="border-b-2 border-gray-200 bg-gray-50" {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<
  PropsWithChildren &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLTableSectionElement>,
      HTMLTableSectionElement
    >
> = ({ children, ...props }) => (
  <tbody className="divide-y divide-gray-100" {...props}>
    {children}
  </tbody>
);

export const TableHeadCell: React.FC<
  PropsWithChildren &
    React.DetailedHTMLProps<
      React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
      HTMLTableHeaderCellElement
    >
> = ({ children, ...props }) => (
  <th
    className="relative p-3 text-left text-sm font-semibold tracking-wide"
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<
  PropsWithChildren &
    React.DetailedHTMLProps<
      React.TdHTMLAttributes<HTMLTableDataCellElement>,
      HTMLTableDataCellElement
    >
> = ({ children, ...props }) => (
  <td
    className="overflow-hidden overflow-ellipsis whitespace-nowrap p-3 text-sm text-gray-700"
    {...props}
  >
    {children}
  </td>
);

export const TablePaginator: React.FC<{ table: Table<any> }> = ({ table }) => {
  return (
    <div className="flex items-center justify-end gap-2 whitespace-nowrap bg-gray-50 p-1 text-xs md:p-2 md:text-base">
      <button
        className="rounded border p-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <select
          value={table.getState().pagination.pageIndex}
          onChange={(e) => {
            table.setPageIndex(Number(e.target.value));
          }}
        >
          {Array.from(Array(table.getPageCount()).keys()).map((i) => (
            <option key={i} value={i}>
              {i + 1}
            </option>
          ))}
        </select>
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Resizer = ({ header }: any) => {
  return (
    <div
      {...{
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `resizer ${
          header.column.getIsResizing() ? "isResizing" : ""
        }`,
      }}
    />
  );
};
