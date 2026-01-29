import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Shield, Plus, AlertTriangle, Clock, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface VaccinationSchedule {
  id: string;
  cattle_id: number;
  cattle_title: string;
  vaccine_name: string;
  next_due_date: string;
  last_given_date: string;
  frequency_months: number;
  notes: string;
}

interface CattleListing {
  id: number;
  title: string;
}

interface VaccinationTrackerProps {
  onUpdate: () => void;
}

const VaccinationTracker = ({ onUpdate }: VaccinationTrackerProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [vaccinations, setVaccinations] = useState<VaccinationSchedule[]>([]);
  const [cattleListings, setCattleListings] = useState<CattleListing[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState<VaccinationSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    cattle_id: "",
    vaccine_name: "",
    next_due_date: "",
    last_given_date: "",
    frequency_months: "12",
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
      // Fetch vaccination schedules
      const { data: vaccData } = await supabase
        .from('vaccination_schedules')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('next_due_date');

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

      setVaccinations(vaccData?.map(vacc => ({
        ...vacc,
        cattle_title: cattleMap[vacc.cattle_id] || 'Unknown Cattle'
      })) || []);

      setCattleListings(cattleData || []);
    } catch (error) {
      console.error('Error fetching vaccination data:', error);
      toast.error('Failed to load vaccination schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('vaccination_schedules')
        .insert({
          cattle_id: parseInt(formData.cattle_id),
          user_id: user?.id,
          vaccine_name: formData.vaccine_name,
          next_due_date: formData.next_due_date,
          last_given_date: formData.last_given_date || null,
          frequency_months: parseInt(formData.frequency_months),
          notes: formData.notes
        });

      if (error) throw error;

      toast.success('Vaccination schedule added successfully');
      setIsAddDialogOpen(false);
      setFormData({
        cattle_id: "",
        vaccine_name: "",
        next_due_date: "",
        last_given_date: "",
        frequency_months: "12",
        notes: ""
      });
      fetchData();
      onUpdate();
    } catch (error) {
      console.error('Error adding vaccination schedule:', error);
      toast.error('Failed to add vaccination schedule');
    }
  };

  const handleEdit = (vaccination: VaccinationSchedule) => {
    setEditingVaccination(vaccination);
    setFormData({
      cattle_id: vaccination.cattle_id.toString(),
      vaccine_name: vaccination.vaccine_name,
      next_due_date: vaccination.next_due_date,
      last_given_date: vaccination.last_given_date || "",
      frequency_months: vaccination.frequency_months.toString(),
      notes: vaccination.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingVaccination) return;

    try {
      const { error } = await supabase
        .from('vaccination_schedules')
        .update({
          vaccine_name: formData.vaccine_name,
          next_due_date: formData.next_due_date,
          last_given_date: formData.last_given_date || null,
          frequency_months: parseInt(formData.frequency_months),
          notes: formData.notes
        })
        .eq('id', editingVaccination.id);

      if (error) throw error;

      toast.success('Vaccination schedule updated successfully');
      setIsEditDialogOpen(false);
      setEditingVaccination(null);
      fetchData();
      onUpdate();
    } catch (error) {
      console.error('Error updating vaccination schedule:', error);
      toast.error('Failed to update vaccination schedule');
    }
  };

  const markAsCompleted = async (vaccinationId: string) => {
    try {
      const vaccination = vaccinations.find(v => v.id === vaccinationId);
      if (!vaccination) return;

      const today = new Date().toISOString().split('T')[0];
      const nextDueDate = new Date();
      nextDueDate.setMonth(nextDueDate.getMonth() + vaccination.frequency_months);

      const { error } = await supabase
        .from('vaccination_schedules')
        .update({
          last_given_date: today,
          next_due_date: nextDueDate.toISOString().split('T')[0]
        })
        .eq('id', vaccinationId);

      if (error) throw error;

      toast.success('Vaccination marked as completed');
      fetchData();
      onUpdate();
    } catch (error) {
      console.error('Error marking vaccination as completed:', error);
      toast.error('Failed to update vaccination');
    }
  };

  const getStatusBadge = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysDiff <= 7) {
      return <Badge variant="secondary">Due This Week</Badge>;
    } else if (daysDiff <= 30) {
      return <Badge variant="outline">Due Soon</Badge>;
    } else {
      return <Badge variant="secondary">Scheduled</Badge>;
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading vaccination schedules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            Vaccination Tracker
          </h2>
          <p className="text-muted-foreground">
            Track and manage vaccination schedules for your cattle
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vaccination Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Vaccination Schedule</DialogTitle>
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

              <div>
                <Label htmlFor="vaccine_name">Vaccine Name</Label>
                <Input
                  id="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={(e) => setFormData({...formData, vaccine_name: e.target.value})}
                  placeholder="e.g., FMD Vaccine, Anthrax Vaccine"
                  required
                />
              </div>

              <div>
                <Label htmlFor="next_due_date">Next Due Date</Label>
                <Input
                  id="next_due_date"
                  type="date"
                  value={formData.next_due_date}
                  onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="last_given_date">Last Given Date (Optional)</Label>
                <Input
                  id="last_given_date"
                  type="date"
                  value={formData.last_given_date}
                  onChange={(e) => setFormData({...formData, last_given_date: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="frequency_months">Frequency (Months)</Label>
                <Select value={formData.frequency_months} onValueChange={(value) => setFormData({...formData, frequency_months: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Every 3 months</SelectItem>
                    <SelectItem value="6">Every 6 months</SelectItem>
                    <SelectItem value="12">Every 12 months</SelectItem>
                    <SelectItem value="24">Every 2 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this vaccination"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Add Schedule</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {vaccinations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No vaccination schedules yet</h3>
            <p className="text-muted-foreground mb-4">
              Add vaccination schedules to track your cattle's health
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Schedule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {vaccinations.map(vaccination => (
            <Card key={vaccination.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{vaccination.vaccine_name}</h3>
                      {getStatusBadge(vaccination.next_due_date)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Cattle:</strong> {vaccination.cattle_title}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        Due: {new Date(vaccination.next_due_date).toLocaleDateString()}
                      </span>
                      {vaccination.last_given_date && (
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Last: {new Date(vaccination.last_given_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {vaccination.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Notes:</strong> {vaccination.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(vaccination)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => markAsCompleted(vaccination.id)}
                    >
                      Mark as Done
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
            <DialogTitle>Edit Vaccination Schedule</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit_vaccine_name">Vaccine Name</Label>
              <Input
                id="edit_vaccine_name"
                value={formData.vaccine_name}
                onChange={(e) => setFormData({...formData, vaccine_name: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit_next_due_date">Next Due Date</Label>
              <Input
                id="edit_next_due_date"
                type="date"
                value={formData.next_due_date}
                onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit_last_given_date">Last Given Date</Label>
              <Input
                id="edit_last_given_date"
                type="date"
                value={formData.last_given_date}
                onChange={(e) => setFormData({...formData, last_given_date: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="edit_frequency_months">Frequency (Months)</Label>
              <Select value={formData.frequency_months} onValueChange={(value) => setFormData({...formData, frequency_months: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Every 3 months</SelectItem>
                  <SelectItem value="6">Every 6 months</SelectItem>
                  <SelectItem value="12">Every 12 months</SelectItem>
                  <SelectItem value="24">Every 2 years</SelectItem>
                </SelectContent>
              </Select>
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
              <Button type="submit" className="flex-1">Update Schedule</Button>
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

export default VaccinationTracker;