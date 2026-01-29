import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Plus,
  AlertTriangle,
  Shield,
  Clock,
  Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import VaccinationTracker from "@/components/health/VaccinationTracker";
import AppointmentScheduler from "@/components/health/AppointmentScheduler";
import HealthChatbot from "@/components/health/HealthChatbot";
import HealthReportGenerator from "@/components/health/HealthReportGenerator";

interface HealthRecord {
  id: string;
  cattle_id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  issued_date: string;
  expiry_date: string;
  issued_by: string;
  cattle_title?: string;
}

interface VaccinationSchedule {
  id: string;
  cattle_id: number;
  vaccine_name: string;
  next_due_date: string;
  last_given_date: string;
  frequency_months: number;
  cattle_title?: string;
}

interface Appointment {
  id: string;
  cattle_id: number;
  appointment_date: string;
  appointment_type: string;
  veterinarian_name: string;
  status: string;
  cattle_title?: string;
}

const HealthRecords = () => {
  const [user, setUser] = useState<User | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: 'sample-doc-1',
      cattle_id: 0,
      document_type: 'Vaccination Certificate',
      file_name: 'Sample FMD Certificate.pdf',
      file_path: '',
      issued_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiry_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issued_by: 'Dr. Patel Veterinary Clinic',
      cattle_title: 'Sample Dairy Cow'
    }
  ]);
  const [vaccinations, setVaccinations] = useState<VaccinationSchedule[]>([
    {
      id: 'sample-1',
      cattle_id: 0,
      vaccine_name: 'FMD (Foot and Mouth Disease)',
      next_due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      last_given_date: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      frequency_months: 12,
      cattle_title: 'Sample Dairy Cow'
    },
    {
      id: 'sample-2',
      cattle_id: 0,
      vaccine_name: 'Anthrax Vaccine',
      next_due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      last_given_date: new Date(Date.now() - 320 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      frequency_months: 12,
      cattle_title: 'Sample Dairy Cow'
    }
  ] as any);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'sample-apt-1',
      cattle_id: 0,
      appointment_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      appointment_type: 'Routine Checkup',
      veterinarian_name: 'Dr. Sharma',
      status: 'scheduled',
      cattle_title: 'Sample Dairy Cow'
    }
  ] as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchHealthData();
    }
  }, [user]);

  const fetchHealthData = async () => {
    try {
      // Fetch health documents with cattle info
      const { data: healthDocs } = await supabase
        .from('health_documents')
        .select(`
          *,
          cattle_listings!inner(title, user_id)
        `)
        .eq('cattle_listings.user_id', user?.id);

      // Fetch vaccination schedules
      const { data: vaccData } = await supabase
        .from('vaccination_schedules')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      // Fetch appointments
      const { data: appointData } = await supabase
        .from('veterinary_appointments')
        .select('*')
        .eq('user_id', user?.id)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date');

      // Use real data when available, otherwise keep the default placeholder data
      const records = healthDocs?.map(doc => ({
        ...doc,
        cattle_title: doc.cattle_listings?.title
      })) || [];

      const vaccinations = vaccData || [];
      const appointments = appointData || [];

      // Only update if there's real data
      if (records.length > 0 || vaccinations.length > 0 || appointments.length > 0) {
        setHealthRecords(records.length > 0 ? records : healthRecords);
        setVaccinations(vaccinations.length > 0 ? vaccinations : [...vaccinations]);
        setAppointments(appointments.length > 0 ? appointments : [...appointments]);
      }

    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error('Failed to load health records');
    } finally {
      setLoading(false);
    }
  };

  const upcomingVaccinations = vaccinations.filter(v => {
    const dueDate = new Date(v.next_due_date);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 30 && daysDiff >= 0;
  });

  const overdueVaccinations = vaccinations.filter(v => {
    const dueDate = new Date(v.next_due_date);
    return dueDate < new Date();
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="mr-3 h-8 w-8 text-primary" />
            Cattle Health Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your cattle's health status, track vaccinations, and manage veterinary appointments. 
            Regular health monitoring ensures optimal productivity and early detection of potential issues.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{healthRecords.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Vaccinations</p>
                <p className="text-2xl font-bold">{upcomingVaccinations.length}</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Vaccinations</p>
                <p className="text-2xl font-bold text-red-600">{overdueVaccinations.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Appointments</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Urgent Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  Urgent Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueVaccinations.length === 0 && upcomingVaccinations.length === 0 ? (
                  <p className="text-muted-foreground">All vaccinations are up to date!</p>
                ) : (
                  <>
                    {overdueVaccinations.map(vacc => (
                      <div key={vacc.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-800">{vacc.vaccine_name}</p>
                          <p className="text-sm text-red-600">{vacc.cattle_title} - Overdue</p>
                        </div>
                        <Badge variant="destructive">Overdue</Badge>
                      </div>
                    ))}
                    {upcomingVaccinations.map(vacc => (
                      <div key={vacc.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium text-yellow-800">{vacc.vaccine_name}</p>
                          <p className="text-sm text-yellow-600">{vacc.cattle_title} - Due {new Date(vacc.next_due_date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="secondary">Due Soon</Badge>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {appointments.length === 0 ? (
                  <p className="text-muted-foreground">No upcoming appointments</p>
                ) : (
                  appointments.slice(0, 3).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">{app.appointment_type}</p>
                        <p className="text-sm text-blue-600">{app.cattle_title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(app.appointment_date).toLocaleDateString()} at {new Date(app.appointment_date).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant="outline">{app.status}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Button className="h-20 flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  Add Vaccination
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  Ask AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccinations">
          <VaccinationTracker onUpdate={fetchHealthData} />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentScheduler onUpdate={fetchHealthData} />
        </TabsContent>

        <TabsContent value="documents">
          <HealthReportGenerator healthRecords={healthRecords} />
        </TabsContent>

        <TabsContent value="assistant">
          <HealthChatbot />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthRecords;