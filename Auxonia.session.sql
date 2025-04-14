-- First, make sure you have valid IDs for your channel and a sender
-- Replace these values with actual UUIDs from your database
DO $$
DECLARE
    channel_id UUID := '92aa198d-10f5-49fd-abba-088f7c0b9d5b'; -- replace with real channel_id
    sender_id UUID := '3f315d76-0fae-457e-a088-e1bf1ad6e9ea';  -- replace with real user_id
    i INTEGER;
BEGIN
    -- Insert 100,000 messages
    FOR i IN 1..100000 LOOP
        INSERT INTO app.messages (
            channel_id,
            sender_id,
            content,
            created_at
        )
        VALUES (
            channel_id,
            sender_id,
            'Test message #' || i,
            -- Create messages with timestamps spreading over the last 30 days
            NOW() - (random() * INTERVAL '30 days')
        );
        
        -- Optional: Commit every 1000 records to avoid transaction bloat
        IF i % 1000 = 0 THEN
            COMMIT;
            RAISE NOTICE 'Inserted % messages', i;
        END IF;
    END LOOP;
END $$;