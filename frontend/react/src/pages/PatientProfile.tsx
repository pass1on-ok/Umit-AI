import React from 'react';
import { User, ClipboardList, ActivitySquare, Save, VenusAndMars } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { MapPin } from 'lucide-react';
const PatientProfile = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    address: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');

      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const data = await response.json();

        if (data) {
          setProfile({
            id: data.id || '',
            name: data.name || '',
            gender: data.profile?.gender || '',
            dateOfBirth: data.profile?.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : '',
            address: data.profile?.address || ''
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');

    if (!userId || !token) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    const updateData = {
      gender: profile.gender || null,
      address: profile.address || '',
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString() : null,
    };

    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const error = await response.json();
        alert(`Update failed: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-96 items-center justify-center w-full">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 pt-4">
      <div className="flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and contact details.</p>
      </div>

      <Card className="shadow-lg border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Personal Details
          </CardTitle>
          <CardDescription>This information helps us personalize your wellness plan.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Full Name
            </label>
            <Input value={profile.name} disabled className="font-medium" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <VenusAndMars className="w-4 h-4 text-muted-foreground" /> Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Choose gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" /> Date of Birth
              </label>
              <Input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" /> Residential Address
            </label>
            <Input
              placeholder="e.g. 123 Health Way, Apartment 4B"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
        </CardContent>

        {/* Footer with Action Button */}
        <div className="p-6 border-t border-border flex justify-end bg-muted/30 rounded-b-lg">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="min-w-[140px] gap-2 shadow-md"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </Card>

    </div>
  );
};

export default PatientProfile;