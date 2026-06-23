CREATE TABLE public.assistant_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX assistant_messages_session_idx ON public.assistant_messages(session_id, created_at);

GRANT SELECT, INSERT ON public.assistant_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assistant_messages TO authenticated;
GRANT ALL ON public.assistant_messages TO service_role;

ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;

-- Open policies (no auth in app); messages keyed by client-side session UUID stored in localStorage.
CREATE POLICY "anyone can read messages by session" ON public.assistant_messages FOR SELECT USING (true);
CREATE POLICY "anyone can insert messages" ON public.assistant_messages FOR INSERT WITH CHECK (true);