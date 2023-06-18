import { useQuery } from "@tanstack/react-query";
import Axios from "axios";
import Chart from "react-apexcharts";
import tailwindColors from "tailwindcss/colors";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const SummaryBySeverityWidget = ({}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["summary_by_severity"],
    queryFn: async () => {
      const { data } = await Axios.get("/api/grouped_findings_summary");
      return data;
    },
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  const series: ApexNonAxisChartSeries = Object.values(data);
  const labels: string[] = Object.keys(data).map(capitalize);
  const colors = [
    tailwindColors.red[500],
    tailwindColors.yellow[500],
    tailwindColors.green[500],
    tailwindColors.blue[500],
  ];

  return (
    <div className="my-2 h-fit w-min rounded-lg p-4 shadow">
      <div className="text-2xl font-bold">Summary by Severity</div>
      <Chart
        options={{
          labels,
          colors,
        }}
        series={series}
        type="donut"
        width="300px"
      />
    </div>
  );
};

export default SummaryBySeverityWidget;
