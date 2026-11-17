import { Lead } from "@/types";

export function exportLeadsToCSV(leads: Lead[], filename = "leads-export.csv") {
  const headers = [
    "Lead ID",
    "Customer Name",
    "Mobile",
    "Email",
    "Interested Property",
    "Preferred Location",
    "Budget (INR)",
    "Property Type",
    "Lead Source",
    "Lead Status",
    "Priority",
    "Assigned Agent",
    "Follow Up Date",
    "Remarks",
    "Created Date"
  ];

  const rows = leads.map(l => [
    l.id,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.mobile}"`,
    `"${l.email}"`,
    `"${(l.interestedPropertyName || "").replace(/"/g, '""')}"`,
    `"${(l.preferredLocation || "").replace(/"/g, '""')}"`,
    l.budget,
    l.propertyType,
    l.leadSource,
    l.status,
    l.priority,
    `"${(l.assignedAgentName || "Unassigned").replace(/"/g, '""')}"`,
    l.followUpDate || "",
    `"${(l.remarks || "").replace(/"/g, '""')}"`,
    l.createdAt
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseLeadsCSV(csvText: string): Partial<Lead>[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parsedLeads: Partial<Lead>[] = [];

  // Simple CSV line parser respecting quotes
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"' && (charIdx === 0 || line[charIdx - 1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));

    if (values.length >= 2 && values[1]) {
      parsedLeads.push({
        name: values[1] || "Sample Lead",
        mobile: values[2] || "+91 98000 00000",
        email: values[3] || "lead@example.com",
        interestedPropertyName: values[4] || "",
        preferredLocation: values[5] || "Bangalore",
        budget: Number(values[6]) || 5000000,
        propertyType: (values[7] as any) || "Apartment",
        leadSource: (values[8] as any) || "Website",
        status: (values[9] as any) || "New",
        priority: (values[10] as any) || "Medium",
        remarks: values[13] || "Imported via CSV",
      });
    }
  }

  return parsedLeads;
}

export function exportDataToCSV(headers: string[], rows: (string | number)[][], filename: string) {
  const csvContent = "data:text/csv;charset=utf-8," + [
    headers.join(","),
    ...rows.map(row => row.map(cell => typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : cell).join(","))
  ].join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
