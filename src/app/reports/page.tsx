"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, History } from "lucide-react"; 
import { generatePDF } from "@/lib/pdf";
import { getEntries, CareEntry } from "@/lib/storage";
import { toast } from "sonner"; 
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [entries, setEntries] = useState<CareEntry[]>([]);

  useEffect(() => {
    const data = getEntries();
    setEntries(data);

    const months = new Set<string>();
    data.forEach(entry => {
      const date = new Date(entry.timestamp);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      months.add(monthYear);
    });
    setAvailableMonths(Array.from(months));
  }, []);

  const handleDownloadMonth = (monthYear: string) => {
    const monthlyData = entries.filter(entry => {
      const entryMonth = new Date(entry.timestamp).toLocaleString('default', { month: 'long', year: 'numeric' });
      return entryMonth === monthYear;
    });

    if (monthlyData.length === 0) return;

    generatePDF(monthlyData);
    toast.success(`Downloaded Report: ${monthYear}`);
  };

  const handleDownloadRecent = () => {
     const thirtyDaysAgo = new Date();
     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
     const recent = entries.filter(e => new Date(e.timestamp) > thirtyDaysAgo);
     
     if(recent.length === 0) {
        toast.error("No data found."); 
        return;
     }
     generatePDF(recent);
     toast.success("Downloaded Monthly Summary");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Medical Reports</h1>
        <p className="text-slate-500">Generate and share summaries for doctor visits.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Summary */}
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Current Summary (30 Days)
            </CardTitle>
            <CardDescription>
              Compiles all recent activity into a doctor-ready PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleDownloadRecent}>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </CardContent>
        </Card>

        {/* Dynamic History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-600">
              <History className="h-5 w-5" /> Report History
            </CardTitle>
            <CardDescription>
              Generate reports from previous months based on your logs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableMonths.length === 0 ? (
               <p className="text-sm text-slate-400 italic">No history available yet.</p>
            ) : (
                availableMonths.map((month) => (
                    <div 
                        key={month}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 cursor-pointer transition-colors"
                        onClick={() => handleDownloadMonth(month)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium">{month} Report</span>
                      </div>
                      <Download className="h-4 w-4 text-slate-400" />
                    </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}