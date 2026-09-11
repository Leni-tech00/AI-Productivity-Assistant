/*
# Create AideFlow AI core tables (single-tenant, no auth)

1. New Tables
- `email_drafts`: Stores generated email drafts with subject, body, tone, recipient persona, and reference attachments metadata.
- `notes_summaries`: Stores meeting notes summaries — raw transcript input and the structured AI output (executive summary, action items, decisions, sentiment).
- `tasks`: Stores tasks for the task planner — title, description, status (todo/in_progress/review/done), priority, due date, assignee, subtasks (JSONB), attachments (JSONB), position for Kanban ordering.
- `chat_messages`: Stores AI chatbot conversation messages — role (user/assistant), content, timestamp.
- `research_briefs`: Stores AI research assistant outputs — topic, depth, key takeaways, insights, comparison table data.

2. Security
- This is a single-tenant app with no sign-in screen.
- RLS enabled on all tables.
- Policies allow anon + authenticated full CRUD because data is intentionally shared/public within the workspace.
- USING (true) is acceptable here because there is no user-scoped data isolation requirement.

3. Notes
- All tables use uuid primary keys with gen_random_uuid().
- created_at and updated_at timestamps on all tables.
- JSONB columns for flexible structured data (action items, subtasks, attachments, etc.).
*/

CREATE TABLE IF NOT EXISTS email_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT 'formal',
  recipient_persona text NOT NULL DEFAULT '',
  reference_files jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_email_drafts" ON email_drafts;
CREATE POLICY "anon_select_email_drafts" ON email_drafts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_email_drafts" ON email_drafts;
CREATE POLICY "anon_insert_email_drafts" ON email_drafts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_email_drafts" ON email_drafts;
CREATE POLICY "anon_update_email_drafts" ON email_drafts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_email_drafts" ON email_drafts;
CREATE POLICY "anon_delete_email_drafts" ON email_drafts FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS notes_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_input text NOT NULL DEFAULT '',
  executive_summary text NOT NULL DEFAULT '',
  action_items jsonb DEFAULT '[]'::jsonb,
  decisions jsonb DEFAULT '[]'::jsonb,
  agenda_table jsonb DEFAULT '[]'::jsonb,
  sentiment text NOT NULL DEFAULT 'Neutral',
  bias_flags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notes_summaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_notes_summaries" ON notes_summaries;
CREATE POLICY "anon_select_notes_summaries" ON notes_summaries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_notes_summaries" ON notes_summaries;
CREATE POLICY "anon_insert_notes_summaries" ON notes_summaries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_notes_summaries" ON notes_summaries;
CREATE POLICY "anon_update_notes_summaries" ON notes_summaries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_notes_summaries" ON notes_summaries;
CREATE POLICY "anon_delete_notes_summaries" ON notes_summaries FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  assignee text NOT NULL DEFAULT '',
  due_date date,
  recurring text NOT NULL DEFAULT '',
  subtasks jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tasks" ON tasks;
CREATE POLICY "anon_select_tasks" ON tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tasks" ON tasks;
CREATE POLICY "anon_insert_tasks" ON tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tasks" ON tasks;
CREATE POLICY "anon_update_tasks" ON tasks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tasks" ON tasks;
CREATE POLICY "anon_delete_tasks" ON tasks FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL DEFAULT 'user',
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
CREATE POLICY "anon_select_chat_messages" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chat_messages" ON chat_messages;
CREATE POLICY "anon_update_chat_messages" ON chat_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;
CREATE POLICY "anon_delete_chat_messages" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS research_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL DEFAULT '',
  depth text NOT NULL DEFAULT 'quick',
  key_takeaways text NOT NULL DEFAULT '',
  insights text NOT NULL DEFAULT '',
  comparison_table jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE research_briefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_research_briefs" ON research_briefs;
CREATE POLICY "anon_select_research_briefs" ON research_briefs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_research_briefs" ON research_briefs;
CREATE POLICY "anon_insert_research_briefs" ON research_briefs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_research_briefs" ON research_briefs;
CREATE POLICY "anon_update_research_briefs" ON research_briefs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_research_briefs" ON research_briefs;
CREATE POLICY "anon_delete_research_briefs" ON research_briefs FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_email_drafts_created ON email_drafts(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_summaries_created ON notes_summaries(created_at);
CREATE INDEX IF NOT EXISTS idx_research_briefs_created ON research_briefs(created_at);
