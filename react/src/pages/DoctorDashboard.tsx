import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileBarChart2, Search, ArrowRight, Loader2, AlertCircle, HeartPulse } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getDoctorPatients, DoctorPatient } from "@/services/api";

const statusClasses = (status: DoctorPatient['status']) => {
  if (status === 'critical') return 'bg-destructive/10 text-destructive border border-destructive/20';
  if (status === 'warning') return 'bg-amber-100 text-amber-700 border border-amber-300';
  return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
};

const DoctorDashboard = () => {
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDoctorPatients();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load patient roster.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((patient) => {
      return (
        patient.fullName.toLowerCase().includes(term) ||
        patient.patientId.toLowerCase().includes(term) ||
        patient.diagnosis.toLowerCase().includes(term)
      );
    });
  }, [patients, searchTerm]);

  const criticalCount = patients.filter((patient) => patient.status === 'critical').length;
  const warningCount = patients.filter((patient) => patient.status === 'warning').length;
  const stableCount = patients.filter((patient) => patient.status === 'stable').length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Psychologist / Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor patient risk, manage alerts, and prioritize follow-up care.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="inline-flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">
            <AlertCircle className="w-4 h-4" />
            {criticalCount} critical alert{criticalCount === 1 ? '' : 's'}
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            <HeartPulse className="w-4 h-4" />
            {warningCount} warning{warningCount === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {error ? (
        <Alert>
          <AlertTitle>Unable to load patients</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-custom border-border bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{patients.length}</p>
              <p className="text-sm text-muted-foreground">Total patients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-destructive/10 p-3 rounded-full text-destructive"><AlertCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">High-risk patients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-700"><HeartPulse className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stableCount}</p>
              <p className="text-sm text-muted-foreground">Stable patients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-custom border-border bg-card">
        <CardHeader className="border-b border-border/50 flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
          <div>
            <CardTitle>Patient Roster</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Search patients by name, ID, or diagnosis.</p>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="text"
              placeholder="Search by name, patient ID, or diagnosis"
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded text-sm outline-none focus:border-primary"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
              Loading patient roster...
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-3">Patient Name</th>
                  <th className="px-6 py-3">Patient ID</th>
                  <th className="px-6 py-3">Diagnosis</th>
                  <th className="px-6 py-3">Status / Alerts</th>
                  <th className="px-6 py-3">Last HADS Test</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      {patients.length === 0 ? 'No patients found yet.' : 'No matching patients for that search.'}
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{patient.fullName}</td>
                      <td className="px-6 py-4 text-muted-foreground">{patient.patientId}</td>
                      <td className="px-6 py-4 text-muted-foreground">{patient.diagnosis}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold ${statusClasses(patient.status)}`}>
                          {patient.status !== 'stable' ? <AlertCircle className="w-3 h-3" /> : null}
                          {patient.status === 'critical'
                            ? patient.alert ?? 'Critical'
                            : patient.status === 'warning'
                            ? patient.alert ?? 'Warning'
                            : 'Stable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{patient.lastTest || 'Unknown'}</td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/doctor/analytics/${patient.patientId}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-2">
                            Analyze
                            <ArrowRight className="w-4 h-4" />
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
};

export default DoctorDashboard;
