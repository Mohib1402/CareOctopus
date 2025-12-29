"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getEntries, CareEntry } from "@/lib/storage";

export default function ProfilePage() {
  const [medications, setMedications] = useState<CareEntry[]>([]);

  useEffect(() => {
    const allEntries = getEntries();
    
    const meds = allEntries.filter(e => e.type === 'medication');
    
    const uniqueMeds = Array.from(new Map(
      meds.map(item => [item.title.toLowerCase(), item])
    ).values());
    
    setMedications(uniqueMeds);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patient Profile</h1>
      
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center gap-6 pt-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>GP</AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold">Grandpa Smith</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Age: 78</span>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Condition: Hypertension</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">Blood Type: O+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Emergency Contacts</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Dr. Sarah Johnson (Primary)</p>
              <p className="text-sm text-slate-500">(555) 123-4567</p>
            </div>
            <div>
              <p className="font-medium">Alex Smith (Son)</p>
              <p className="text-sm text-slate-500">(555) 987-6543</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Current Medications</CardTitle></CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No medications recorded yet.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                {medications.map((med) => (
                  <li key={med.id}>
                    <span className="font-medium text-slate-900">{med.title}</span>
                    <br/>
                    <span className="text-xs text-slate-500">{med.details.substring(0, 60)}...</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}