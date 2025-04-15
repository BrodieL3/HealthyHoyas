-- Create weight_entries table
CREATE TABLE IF NOT EXISTS weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Add RLS policies
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own weight entries
CREATE POLICY "Users can view their own weight entries"
  ON weight_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own weight entries
CREATE POLICY "Users can insert their own weight entries"
  ON weight_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own weight entries
CREATE POLICY "Users can update their own weight entries"
  ON weight_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own weight entries
CREATE POLICY "Users can delete their own weight entries"
  ON weight_entries
  FOR DELETE
  USING (auth.uid() = user_id); 