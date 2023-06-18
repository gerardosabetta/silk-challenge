"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import GroupedFindingsTable from "./GroupedFindingsTable";
import SummaryBySeverityWidget from "./SummaryBySeverityWidget";

const queryClient = new QueryClient();

const Dashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="
        grid justify-items-center gap-2
        max-h-full w-full
        container mx-auto
        rounded-lg
        bg-gray-50 p-4
        shadow
        md:grid-cols-2 md:p-8
        lg:grid-cols-3
      "
      >
        <SummaryBySeverityWidget />
        <SummaryBySeverityWidget />
        <SummaryBySeverityWidget />
        <div className="md:col-span-2 lg:col-span-3 w-full">
          <GroupedFindingsTable />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Dashboard;
