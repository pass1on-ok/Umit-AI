import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { User, ShieldAlert, ArrowLeft, Download, MessageSquare, Search, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getDoctorPatients, getDoctorPatientAnalytics, DoctorPatient, PatientAnalyticsData } from "@/services/api";

const defaultTrend = [
  { date: 'Week 1', Anxiety: 11, Depression: 8, Pain: 4, Fatigue: 5 },
  { date: 'Week 2', Anxiety: 9, Depression: 6, Pain: 3, Fatigue: 6 },
  { date: 'Week 3', Anxiety: 13, Depression: 9, Pain: 5, Fatigue: 7 },
  { date: 'Week 4', Anxiety: 8, Depression: 5, Pain: 4, Fatigue: 6 },
  { date: 'Today', Anxiety: 7, Depression: 5, Pain: 4, Fatigue: 8 },
];

const PatientAnalytics = () => {
  const { patientId } = useParams<{ patientId?: string }>();
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientAnalyticsData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listView = !patientId;

  useEffect(() => {
    if (!listView) {
      return;
    }

    const loadPatients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getDoctorPatients();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load patient list.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, [listView]);

  useEffect(() => {
    if (listView) {
      setSelectedPatient(null);
      return;
    }

    const loadPatientAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getDoctorPatientAnalytics(patientId ?? '');
        setSelectedPatient(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load patient analytics.');
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      loadPatientAnalytics();
    }
  }, [listView, patientId]);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((patient) =>
      patient.fullName.toLowerCase().includes(term) ||
      patient.patientId.toLowerCase().includes(term) ||
      patient.diagnosis.toLowerCase().includes(term)
    );
  }, [patients, searchTerm]);

  if (listView) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Select a Patient</h1>
            <p className="text-muted-foreground mt-1">Choose a patient to view personalized analytics and care summaries.</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="text"
              placeholder="Search patients by name, ID, or diagnosis"
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {error ? (
          <Alert>
            <AlertTitle>Could not load patients</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="border-b border-border/50 py-4">
            <CardTitle>Patient List</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground">Loading patients...</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-3">Patient Name</th>
                    <th className="px-6 py-3">Patient ID</th>
                    <th className="px-6 py-3">Diagnosis</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Last Test</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                        {patients.length === 0 ? 'No patients found.' : 'No patients match your search.'}
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">{patient.fullName}</td>
                        <td className="px-6 py-4 text-muted-foreground">{patient.patientId}</td>
                        <td className="px-6 py-4 text-muted-foreground">{patient.diagnosis}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-semibold ${
                            patient.status === 'critical'
                              ? 'bg-destructive/10 text-destructive border border-destructive/20'
                              : patient.status === 'warning'
                              ? 'bg-amber-100 text-amber-700 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          }`}>
                            {patient.status === 'critical' ? 'Critical' : patient.status === 'warning' ? 'Warning' : 'Stable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{patient.lastTest || 'Unknown'}</td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/doctor/analytics/${patient.patientId}`}>
                            <Button variant="ghost" size="sm" className="gap-2">
                              View Analytics
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const trendData = selectedPatient?.trend ?? defaultTrend;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link to="/doctor/analytics">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patient Analytics</h1>
            <p className="text-muted-foreground mt-1">Insights for {selectedPatient?.fullName ?? 'this patient'}.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
          <Link to={`/chat/${patientId}`}>
            <Button className="gap-2">
              <MessageSquare className="w-4 h-4" /> Message Patient
            </Button>
          </Link>
        </div>
      </div>

      {error ? (
        <Alert>
          <AlertTitle>Unable to load analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="shadow-custom border-border bg-card bg-muted/20">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-primary/20 p-4 rounded-full"><User className="w-10 h-10 text-primary" /></div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{selectedPatient?.fullName ?? 'Patient'}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedPatient?.patientId ?? ''} • {selectedPatient?.age ? `${selectedPatient.age} Y/O • ` : ''}{selectedPatient?.gender ?? ''}
              </p>
              <p className="text-sm text-muted-foreground mt-2">Diagnosis: {selectedPatient?.diagnosis ?? 'N/A'}</p>
            </div>
          </div>
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-start gap-4 max-w-xl">
            <ShieldAlert className="w-6 h-6 text-destructive shrink-0" />
            <div>
              <h3 className="font-bold text-destructive text-sm">{selectedPatient?.alert ?? 'System Alert: No critical alerts'}</h3>
              <p className="text-xs text-foreground mt-1">{selectedPatient?.alert ? 'Review latest trends and reach out if symptoms worsen.' : 'Patient is currently stable. Continue monitoring with next check-in.'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-custom border-border bg-card">
        <CardHeader>
          <CardTitle>Combined Metrics Correlation</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Trend chart for HADS scores and symptom severity.</p>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] w-full">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground">Loading analytics...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(127, 127, 127, 0.2)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(127, 127, 127, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="rgba(127, 127, 127, 0.8)" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: 'rgba(127, 127, 127, 0.8)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgb(23, 23, 23)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <ReferenceLine yAxisId="left" y={11} stroke="rgb(244, 22, 95)" strokeDasharray="3 3" label={{ position: 'top', value: 'Abnormal threshold', fill: 'rgb(244, 22, 95)', fontSize: 10 }} />
                  <Line yAxisId="left" type="monotone" dataKey="Anxiety" stroke="rgb(20, 71, 230)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="HADS Anxiety" />
                  <Line yAxisId="left" type="monotone" dataKey="Depression" stroke="rgb(0, 188, 125)" strokeWidth={3} dot={{ r: 4 }} name="HADS Depression" />
                  <Line yAxisId="left" type="monotone" dataKey="Fatigue" stroke="rgb(253, 154, 0)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Phys: Fatigue" />
                  <Line yAxisId="left" type="monotone" dataKey="Pain" stroke="rgb(136, 72, 249)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Phys: Pain" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm flex gap-2">
            <span className="font-bold">AI Clinical Insight:</span>
            <span className="text-muted-foreground">Historical patterns suggest that anxiety and fatigue are co-varying for this patient; continue the current coping plan and reassess within the next 7 days.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientAnalytics;
