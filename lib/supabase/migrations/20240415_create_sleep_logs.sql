-- Create sleep_logs table
CREATE TABLE IF NOT EXISTS sleep_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep DECIMAL(4,1) NOT NULL,
    sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sleep logs"
    ON sleep_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep logs"
    ON sleep_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep logs"
    ON sleep_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep logs"
    ON sleep_logs FOR DELETE
    USING (auth.uid() = user_id); 