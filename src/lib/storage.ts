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
  
  // FIX: Return empty array instead of demo data
  return [];
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