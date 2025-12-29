export type CareEntry = {
  id: string;
  type: "medication" | "symptom";
  title: string;
  details: string;
  timestamp: string;
  severity?: "low" | "medium" | "high";
};

export function getEntries(): CareEntry[] {
  if (typeof window === "undefined") return [];
  
  const data = localStorage.getItem("care_entries");
  
  if (data) {
    return JSON.parse(data);
  }
  
  return [
    {
      id: "demo-1",
      type: "medication",
      title: "Morning Meds Taken",
      details: "Lisinopril 10mg taken with water.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "demo-2",
      type: "symptom",
      title: "Headache",
      details: "Mild headache in the morning, no fever.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      severity: "low"
    }
  ];
}

export function addEntry(entry: Omit<CareEntry, "id" | "timestamp">) {
  const entries = getEntries();
  const newEntry: CareEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  
  const updated = [newEntry, ...entries];
  localStorage.setItem("care_entries", JSON.stringify(updated));
  return newEntry;
}