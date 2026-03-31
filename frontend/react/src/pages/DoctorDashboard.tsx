import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle, FileBarChart2, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('accessToken');
      setIsLoading(true); // Ensure it starts as true
      try {
        const response = await fetch('http://localhost:3000/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        
        const onlyPatients = data.filter((u: any) => 
          u.role?.toUpperCase() === 'PATIENT'
        );

        setPatients(onlyPatients);
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 py-8 px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Clinical Dashboard</h1>
          <p className="text-muted-foreground">Monitoring {patients.length} active patients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary"><Users /></div>
            <div>
              <p className="text-2xl font-bold">{patients.length}</p>
              <p className="text-sm text-muted-foreground">Assigned Patients</p>
            </div>
          </CardContent>
        </Card>
        {/* Add more stats cards as needed */}
      </div>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Patient Roster</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-md text-sm outline-none focus:ring-2 ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-muted/30 text-xs uppercase text-muted-foreground font-bold border-b">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Log</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p: any) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {/* Logic to determine status based on symptoms */}
                      <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase border border-green-500/20">
                        Stable
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {p.symptomEntries?.[0] ? new Date(p.symptomEntries[0].createdAt).toLocaleDateString() : 'No logs'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/doctor/analytics/${p.id}`}>
                        <Button variant="outline" size="sm">View History</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;