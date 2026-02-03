-- Create Settings Table
CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- Insert Default Rest Window
INSERT INTO app_settings (key, value) VALUES ('rest_window', '3');

-- Enable Realtime for Settings (so Admin/Captain UI updates instantly)
alter publication supabase_realtime add table app_settings;
