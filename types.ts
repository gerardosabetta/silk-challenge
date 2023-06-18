type Severity = "critical" | "high" | "medium" | "low";
type Color = "red" | "yellow" | "blue" | "green";

type GroupedFinding = {
  id: string;
  grouping_type: string;
  grouping_key: string;
  severity: Severity;
  grouped_finding_created: string;
  sla: string;
  description: string;
  security_analyst: string;
  owner: string;
  workflow: string;
  status: string;
  progress: number;
  _count: {
    raw_findings: number;
  };
};

type RawFinding = {
  id: string;
  source_security_tool_name: string;
  source_security_tool_id: string;
  source_collaboration_tool_name: string;
  source_collaboration_tool_id: string;
  severity: Severity;
  finding_created: string;
  ticket_created: string;
  description: string;
  asset: string;
  status: string;
  remediation_url: string;
  remediation_text: string;
  grouped_finding_id: number;
};

type PaginatedResponse<T> = {
  results: T[];
  total: number;
};
