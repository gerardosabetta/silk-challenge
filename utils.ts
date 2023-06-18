const colorSeverityMap: Map<Severity, Color> = new Map([
  ["critical", "red"],
  ["high", "yellow"],
  ["medium", "blue"],
  ["low", "green"],
]);

export const getColorForSeverity = (severity: Severity): Color => {
  return colorSeverityMap.get(severity) || "blue";
};
