-- Create veterinary appointments table
CREATE TABLE public.veterinary_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_type TEXT NOT NULL,
  veterinarian_name TEXT,
  veterinarian_contact TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.veterinary_appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their cattle appointments"
ON public.veterinary_appointments
FOR ALL
USING (auth.uid() = user_id);

-- Create vaccination schedules table
CREATE TABLE public.vaccination_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  vaccine_name TEXT NOT NULL,
  next_due_date DATE NOT NULL,
  frequency_months INTEGER NOT NULL DEFAULT 12,
  last_given_date DATE,
  notes TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vaccination_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their cattle vaccination schedules"
ON public.vaccination_schedules
FOR ALL
USING (auth.uid() = user_id);

-- Create health chat conversations table
CREATE TABLE public.health_chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cattle_id INTEGER,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own health chat conversations"
ON public.health_chat_conversations
FOR ALL
USING (auth.uid() = user_id);

-- Create health chat messages table
CREATE TABLE public.health_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage messages in their conversations"
ON public.health_chat_messages
FOR ALL
USING (EXISTS (
  SELECT 1 FROM health_chat_conversations 
  WHERE health_chat_conversations.id = health_chat_messages.conversation_id 
  AND health_chat_conversations.user_id = auth.uid()
));

-- Create triggers for updating updated_at columns
CREATE TRIGGER update_veterinary_appointments_updated_at
BEFORE UPDATE ON public.veterinary_appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vaccination_schedules_updated_at
BEFORE UPDATE ON public.vaccination_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_chat_conversations_updated_at
BEFORE UPDATE ON public.health_chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();