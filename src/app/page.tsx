"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Mic, Activity, Pill, FileText, ArrowRight, Trash2 } from "lucide-react"; 
import Link from "next/link";
import { useEffect, useState } from "react";
import { getEntries, CareEntry } from "@/lib/storage";
import { generatePDF } from "@/lib/pdf";
import { toast } from "sonner";

export default function Home() {
  const [entries, setEntries] = useState<CareEntry[]>([]);
  const [healthScore, setHealthScore] = useState(100);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getEntries();
    setEntries(data);
    calculateSmartScore(data);
  };

  const calculateSmartScore = (data: CareEntry[]) => {
    const symptomLogs = data.filter(entry => entry.type === 'symptom');

    if (symptomLogs.length === 0) {
      setHealthScore(100);
      return;
    }

    const now = new Date().getTime();
    
    const sortedData = [...symptomLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const latest = sortedData[0];
    const latestTime = new Date(latest.timestamp).getTime();
    const hoursSinceLastLog = (now - latestTime) / (1000 * 60 * 60);

    let baseScore = 100;
    
    const isLatestCritical = latest.title.toLowerCase().match(/heart attack|stroke|emergency|collapse|unconscious/);

    if (isLatestCritical) baseScore = 30;       // Critical
    else if (latest.severity === 'high') baseScore = 60;   // Poor
    else if (latest.severity === 'medium') baseScore = 80; // Okay
    else if (latest.severity === 'low') baseScore = 95;    // Good

    let penalty = 0;
    const recentHistory = sortedData.slice(1, 5);

    recentHistory.forEach(entry => {
        const entryTime = new Date(entry.timestamp).getTime();
        const hoursAgo = (now - entryTime) / (1000 * 60 * 60);
        
        if (hoursAgo < 12) {
             const isCritical = entry.title.toLowerCase().match(/heart attack|stroke|emergency/);
             if (isCritical) penalty += 15;
             else if (entry.severity === 'high') penalty += 10;
             else if (entry.severity === 'medium') penalty += 5;
        }
    });

    let timeHeal = 0;
    if (hoursSinceLastLog > 24) timeHeal = 20;
    if (hoursSinceLastLog > 48) timeHeal = 50;

    let finalScore = baseScore - penalty + timeHeal;
    
    setHealthScore(Math.round(Math.min(100, Math.max(0, finalScore))));
  };

  const handleReset = () => {
    if (confirm("Clear all data?")) {
        localStorage.removeItem("care_entries");
        setEntries([]);
        setHealthScore(100);
        toast.success("Timeline Cleared");
    }
  };

  const getStatusColor = (score: number) => {
    if (score > 80) return "text-emerald-600 bg-emerald-100 border-emerald-500";
    if (score > 50) return "text-amber-600 bg-amber-100 border-amber-500";
    return "text-red-600 bg-red-100 border-red-500";
  };

  const statusColorClasses = getStatusColor(healthScore);
  const ringColorClass = healthScore > 80 ? "border-emerald-500" : healthScore > 50 ? "border-amber-500" : "border-red-500";
  const statusLabel = healthScore > 80 ? "Stable" : healthScore > 50 ? "Attention Needed" : "Critical";

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Good Morning, Alex</h2>
          <p className="text-slate-500">Here is what's happening with Grandpa today.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" onClick={handleReset} className="text-red-400 hover:text-red-600 hover:bg-red-50" title="Reset Data">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => generatePDF(entries)}>
            <FileText className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/add?mode=camera">
          <Card className="hover:border-blue-500 transition-all cursor-pointer border-l-4 border-l-blue-500 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">New Medication</CardTitle>
              <Camera className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Scan Label</div>
              <p className="text-xs text-slate-500 mt-1">Take a photo of a pill bottle.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/add?mode=voice">
          <Card className="hover:border-emerald-500 transition-all cursor-pointer border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Log Symptom</CardTitle>
              <Mic className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Voice Entry</div>
              <p className="text-xs text-slate-500 mt-1">Record a voice note.</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Today's Timeline</CardTitle>
            <CardDescription>{entries.length} events recorded.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {entries.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No events recorded today.</p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="flex items-center">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border ${
                      entry.type === 'medication' ? 'bg-blue-100 border-blue-200' : 'bg-red-100 border-red-200'
                    }`}>
                      {entry.type === 'medication' ? <Pill className="h-5 w-5 text-blue-600" /> : <Activity className="h-5 w-5 text-red-600" />}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-800">{entry.title}</p>
                      <p className="text-sm text-slate-500 line-clamp-1">{entry.details}</p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-slate-400">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Care Status</CardTitle>
            <CardDescription>Real-time health score.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="relative flex items-center justify-center w-32 h-32">
              <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
              <div className={`absolute inset-0 border-8 ${ringColorClass} border-t-transparent rounded-full animate-spin [animation-duration:3s]`}></div>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{healthScore}%</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${statusColorClasses.split(' ').filter(c => c.includes('text') || c.includes('bg')).join(' ')}`}>
                  {statusLabel}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center w-full">
                <Link href="/reports">
                    <Button variant="outline" className="w-full text-blue-600 hover:text-blue-800 border-slate-200">
                        View Full Report <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}