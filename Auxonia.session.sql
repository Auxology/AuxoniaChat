-- First, make sure you have valid IDs for your channel and a sender
-- Replace these values with actual UUIDs from your database
DO $$
DECLARE
    channel_id UUID := '1c96a6b4-c8c4-4e7f-ab39-848b4273ade3'; -- replace with real channel_id
    sender_id UUID := 'f59cd0dc-129f-482b-88e7-61059a63f752';  -- replace with real user_id
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