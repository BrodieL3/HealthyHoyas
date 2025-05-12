-- Create steps_logs table
CREATE TABLE IF NOT EXISTS steps_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    steps INTEGER NOT NULL,
    steps_quality INTEGER NOT NULL CHECK (steps_quality >= 1 AND steps_quality <= 10),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE steps_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own steps logs"
    ON steps_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own steps logs"
    ON steps_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own steps logs"
    ON steps_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own steps logs"
    ON steps_logs FOR DELETE
    USING (auth.uid() = user_id); 