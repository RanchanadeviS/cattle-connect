import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Clock, UserIcon, Phone, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Appointment {
  id: string;
  cattle_id: number;
  cattle_title: string;
  appointment_date: string;
  appointment_type: string;
  veterinarian_name: string;
  veterinarian_contact: string;
  notes: string;
  status: string;
}

interface CattleListing {
  id: number;
  title: string;
}

interface AppointmentSchedulerProps {
  onUpdate: () => void;
}

const AppointmentScheduler = ({ onUpdate }: AppointmentSchedulerProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cattleListings, setCattleListings] = useState<CattleListing[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    cattle_id: "",
    appointment_date: "",
    appointment_time: "",
    appointment_type: "",
    veterinarian_name: "",
    veterinarian_contact: "",
    notes: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch appointments
      const { data: appointData } = await supabase
        .from('veterinary_appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date');

      // Fetch user's cattle listings
      const { data: cattleData } = await supabase
        .from('cattle_listings')
        .select('id, title')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      // Create a map of cattle IDs to titles
      const cattleMap = cattleData?.reduce((acc, cattle) => {
        acc[cattle.id] = cattle.title;
        return acc;
      }, {} as Record<number, string>) || {};

      setAppointments(appointData?.map(app => ({
        ...app,
        cattle_title: cattleMap[app.cattle_id] || 'Unknown Cattle'
      })) || []);

      setCattleListings(cattleData || []);
    } catch (error) {
      console.error('Error fetching appointment data:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`;
      
      const { error } = await supabase
        .from('veterinary_appointments')
        .insert({
          cattle_id: parseInt(formData.cattle_id),
          user_id: user?.id,
          appointment_date: appointmentDateTime,
          appointment_type: formData.appointment_type,
          veterinarian_name: formData.veterinarian_name,
          veterinarian_contact: formData.veterinarian_contact,
          notes: formData.notes
        });

      if (error) throw error;

      toast.success('Appointment scheduled successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
      onUpdate();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Failed to schedule appointment');
    }
  };

  const resetForm = () => {
    setFormData({
      cattle_id: "",
      appointment_date: "",
      appointment_time: "",
      appointment_type: "",
      veterinarian_name: "",
      veterinarian_contact: "",
      notes: ""
    });
  };

  const handleEdit = (appointment: Appointment) => {
    const date = new Date(appointment.appointment_date);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().slice(0, 5);

    setEditingAppointment(appointment);
    setFormData({
      cattle_id: appointment.cattle_id.toString(),
      appointment_date: dateStr,
      appointment_time: timeStr,
      appointment_type: appointment.appointment_type,
      veterinarian_name: appointment.veterinarian_name || "",
      veterinarian_contact: appointment.veterinarian_contact || "",
      notes: appointment.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAppointment) return;

    try {
      const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`;
      
      const { error } = await supabase
        .from('veterinary_appointments')
        .update({
          appointment_date: appointmentDateTime,
          appointment_type: formData.appointment_type,
          veterinarian_name: formData.veterinarian_name,
          veterinarian_contact: formData.veterinarian_contact,
          notes: formData.notes
        })
        .eq('id', editingAppointment.id);

      if (error) throw error;

      toast.success('Appointment updated successfully');
      setIsEditDialogOpen(false);
      setEditingAppointment(null);
      resetForm();
      fetchData();
      onUpdate();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const { error } = await supabase
        .from('veterinary_appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Appointment deleted successfully');
      fetchData();
      onUpdate();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    }
  };

  const updateStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('veterinary_appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Appointment status updated');
      fetchData();
      onUpdate();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'rescheduled':
        return <Badge variant="secondary">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const appointmentTypes = [
    "Routine Checkup",
    "Vaccination",
    "Treatment",
    "Pregnancy Check",
    "Breeding Consultation",
    "Emergency Visit",
    "Health Certificate",
    "Other"
  ];

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-primary" />
            Appointment Scheduler
          </h2>
          <p className="text-muted-foreground">
            Schedule and manage veterinary appointments for your cattle
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cattle_id">Select Cattle</Label>
                <Select value={formData.cattle_id} onValueChange={(value) => setFormData({...formData, cattle_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cattle" />
                  </SelectTrigger>
                  <SelectContent>
                    {cattleListings.map(cattle => (
                      <SelectItem key={cattle.id} value={cattle.id.toString()}>
                        {cattle.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointment_date">Date</Label>
                  <Input
                    id="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="appointment_time">Time</Label>
                  <Input
                    id="appointment_time"
                    type="time"
                    value={formData.appointment_time}
                    onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="appointment_type">Appointment Type</Label>
                <Select value={formData.appointment_type} onValueChange={(value) => setFormData({...formData, appointment_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="veterinarian_name">Veterinarian Name</Label>
                <Input
                  id="veterinarian_name"
                  value={formData.veterinarian_name}
                  onChange={(e) => setFormData({...formData, veterinarian_name: e.target.value})}
                  placeholder="Dr. John Smith"
                />
              </div>

              <div>
                <Label htmlFor="veterinarian_contact">Veterinarian Contact</Label>
                <Input
                  id="veterinarian_contact"
                  value={formData.veterinarian_contact}
                  onChange={(e) => setFormData({...formData, veterinarian_contact: e.target.value})}
                  placeholder="Phone number or clinic"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this appointment"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Schedule Appointment</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Schedule veterinary appointments to keep your cattle healthy
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule First Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map(appointment => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{appointment.appointment_type}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Cattle:</strong> {appointment.cattle_title}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {new Date(appointment.appointment_date).toLocaleTimeString()}
                      </span>
                    </div>
                    {appointment.veterinarian_name && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                         <span className="flex items-center">
                           <UserIcon className="mr-1 h-4 w-4" />
                           {appointment.veterinarian_name}
                         </span>
                        {appointment.veterinarian_contact && (
                          <span className="flex items-center">
                            <Phone className="mr-1 h-4 w-4" />
                            {appointment.veterinarian_contact}
                          </span>
                        )}
                      </div>
                    )}
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={appointment.status}
                      onValueChange={(value) => updateStatus(appointment.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_appointment_date">Date</Label>
                <Input
                  id="edit_appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_appointment_time">Time</Label>
                <Input
                  id="edit_appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit_appointment_type">Appointment Type</Label>
              <Select value={formData.appointment_type} onValueChange={(value) => setFormData({...formData, appointment_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit_veterinarian_name">Veterinarian Name</Label>
              <Input
                id="edit_veterinarian_name"
                value={formData.veterinarian_name}
                onChange={(e) => setFormData({...formData, veterinarian_name: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="edit_veterinarian_contact">Veterinarian Contact</Label>
              <Input
                id="edit_veterinarian_contact"
                value={formData.veterinarian_contact}
                onChange={(e) => setFormData({...formData, veterinarian_contact: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="edit_notes">Notes</Label>
              <Textarea
                id="edit_notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Update Appointment</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentScheduler;