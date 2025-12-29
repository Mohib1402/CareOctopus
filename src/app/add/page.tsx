"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import Webcam from "react-webcam";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Camera, Mic, Loader2, CheckCircle, AlertTriangle, FileText, StopCircle } from "lucide-react";
import { analyzeImage, analyzeText } from "@/lib/gemini"; 
import { addEntry } from "@/lib/storage";
import { toast } from "sonner";

function AddEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mode, setMode] = useState("camera");

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "voice") setMode("voice");
    else setMode("camera");
  }, [searchParams]);

  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [textInput, setTextInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTextInput((prev) => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      alert("Voice input is not supported in this browser. Please use Chrome/Edge or type manually.");
    }
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    setLoading(true);
    setResult(null);
    const data = await analyzeImage(imageSrc);
    setResult(data);
    setLoading(false);
  }, [webcamRef]);

  const handleTextAnalyze = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    setResult(null);
    const data = await analyzeText(textInput);
    setResult(data);
    setLoading(false);
  };

  const handleSave = () => {
    if (!result) return;
    
    addEntry({
      type: result.type?.toLowerCase() || "symptom",
      title: result.title,
      details: result.details,
      severity: result.severity || (result.warning ? "high" : "low")
    });

    toast.success("Entry Saved Successfully", {
      description: "It has been added to the dashboard.",
    });

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Entry</h1>
        <p className="text-slate-500">Log a new medication or symptom for the record.</p>
      </div>

      <Tabs value={mode} onValueChange={setMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera size={16} /> Scan Medication
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic size={16} /> Voice / Text
          </TabsTrigger>
        </TabsList>

        {/* CAMERA TAB */}
        <TabsContent value="camera" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Position Label in Frame</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {!result ? (
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-8 space-y-4">
                    <CheckCircle className="h-16 w-16 text-emerald-500" />
                    <p className="font-medium text-slate-900">Scan Analyzed Successfully</p>
                    <Button variant="outline" onClick={() => setResult(null)}>Scan Again</Button>
                </div>
              )}

              {!result && (
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={capture} disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</> : "Capture Photo"}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VOICE / TEXT TAB */}
        <TabsContent value="voice" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Describe Symptoms</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea 
                  placeholder="Type here or click the mic to speak..." 
                  className="h-40 text-lg p-4 resize-none pr-12"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <button 
                  onClick={startListening}
                  className={`absolute bottom-4 right-4 p-2 rounded-full transition-all shadow-md ${
                    isListening 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  title="Start Recording"
                >
                  {isListening ? <StopCircle size={24} /> : <Mic size={24} />}
                </button>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12" 
                onClick={handleTextAnalyze} 
                disabled={loading || !textInput}
              >
                 {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</> : "Analyze Log"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RESULT CARD (SHARED) */}
        {result && (
            <Card className="border-l-4 border-l-emerald-500 animate-in fade-in slide-in-from-bottom-4 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  {result.title || "New Entry"}
                  {result.severity === 'high' && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold uppercase">High Severity</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500 uppercase">Analysis</Label>
                    <div className="font-medium text-slate-900">{result.details}</div>
                  </div>
                </div>
                
                {result.warning && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <span className="font-bold block">Medical Note:</span>
                      {result.warning}
                    </div>
                  </div>
                )}

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-lg" onClick={handleSave}>
                  Save to Record
                </Button>
              </CardContent>
            </Card>
        )}
      </Tabs>
    </div>
  );
}

export default function AddEntryPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <AddEntryContent />
    </Suspense>
  );
}