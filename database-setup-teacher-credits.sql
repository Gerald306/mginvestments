-- Database setup for Teacher Credit System
-- Run this in your Firebase/Supabase console or database management tool

-- Create teacher_credits table
CREATE TABLE IF NOT EXISTS teacher_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    credits_purchased INTEGER NOT NULL DEFAULT 0,
    credits_used INTEGER NOT NULL DEFAULT 0,
    credits_remaining INTEGER NOT NULL DEFAULT 0,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE NULL, -- NULL means credits never expire
    transaction_id TEXT NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'used')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teacher_contacts table
CREATE TABLE IF NOT EXISTS teacher_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    contact_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    credit_used BOOLEAN NOT NULL DEFAULT false,
    subscription_type TEXT NOT NULL DEFAULT 'credit' CHECK (subscription_type IN ('credit', 'monthly', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a school can only contact a teacher once
    UNIQUE(school_id, teacher_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_credits_school_id ON teacher_credits(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_credits_status ON teacher_credits(status);
CREATE INDEX IF NOT EXISTS idx_teacher_credits_purchase_date ON teacher_credits(purchase_date);

CREATE INDEX IF NOT EXISTS idx_teacher_contacts_school_id ON teacher_contacts(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_contacts_teacher_id ON teacher_contacts(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_contacts_contact_date ON teacher_contacts(contact_date);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for teacher_credits table
CREATE TRIGGER update_teacher_credits_updated_at 
    BEFORE UPDATE ON teacher_credits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies for teacher_credits
ALTER TABLE teacher_credits ENABLE ROW LEVEL SECURITY;

-- Schools can only see their own credits
CREATE POLICY "Schools can view own credits" ON teacher_credits
    FOR SELECT USING (school_id = auth.uid());

-- Schools can insert their own credit records
CREATE POLICY "Schools can insert own credits" ON teacher_credits
    FOR INSERT WITH CHECK (school_id = auth.uid());

-- Schools can update their own credit records
CREATE POLICY "Schools can update own credits" ON teacher_credits
    FOR UPDATE USING (school_id = auth.uid());

-- Admins can see all credits
CREATE POLICY "Admins can view all credits" ON teacher_credits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add RLS policies for teacher_contacts
ALTER TABLE teacher_contacts ENABLE ROW LEVEL SECURITY;

-- Schools can see their own contacts
CREATE POLICY "Schools can view own contacts" ON teacher_contacts
    FOR SELECT USING (school_id = auth.uid());

-- Teachers can see who contacted them
CREATE POLICY "Teachers can view contacts to them" ON teacher_contacts
    FOR SELECT USING (teacher_id = auth.uid());

-- Schools can insert their own contact records
CREATE POLICY "Schools can insert own contacts" ON teacher_contacts
    FOR INSERT WITH CHECK (school_id = auth.uid());

-- Admins can see all contacts
CREATE POLICY "Admins can view all contacts" ON teacher_contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert sample data for testing (optional)
-- Uncomment the following lines if you want to add test data

/*
-- Sample credit purchases for testing
INSERT INTO teacher_credits (school_id, credits_purchased, credits_used, credits_remaining, amount_paid, status) 
SELECT 
    id as school_id,
    10 as credits_purchased,
    2 as credits_used,
    8 as credits_remaining,
    250000 as amount_paid,
    'active' as status
FROM profiles 
WHERE role = 'school' 
LIMIT 3;

-- Sample teacher contacts for testing
INSERT INTO teacher_contacts (school_id, teacher_id, credit_used, subscription_type)
SELECT 
    s.id as school_id,
    t.id as teacher_id,
    true as credit_used,
    'credit' as subscription_type
FROM profiles s
CROSS JOIN profiles t
WHERE s.role = 'school' AND t.role = 'teacher'
LIMIT 5;
*/

-- Create a view for easy credit balance checking
CREATE OR REPLACE VIEW school_credit_balances AS
SELECT 
    school_id,
    SUM(credits_remaining) as total_credits,
    COUNT(*) as total_purchases,
    SUM(amount_paid) as total_spent,
    MAX(purchase_date) as last_purchase_date
FROM teacher_credits 
WHERE status = 'active'
GROUP BY school_id;

-- Grant permissions on the view
GRANT SELECT ON school_credit_balances TO authenticated;

-- Create a function to get credit balance for a school
CREATE OR REPLACE FUNCTION get_school_credit_balance(school_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    balance INTEGER;
BEGIN
    SELECT COALESCE(SUM(credits_remaining), 0) 
    INTO balance
    FROM teacher_credits 
    WHERE school_id = school_uuid AND status = 'active';
    
    RETURN balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_school_credit_balance(UUID) TO authenticated;

-- Create a function to use a credit
CREATE OR REPLACE FUNCTION use_teacher_credit(school_uuid UUID, teacher_uuid UUID)
RETURNS JSON AS $$
DECLARE
    credit_record RECORD;
    remaining_credits INTEGER;
    result JSON;
BEGIN
    -- Check if already contacted
    IF EXISTS (
        SELECT 1 FROM teacher_contacts 
        WHERE school_id = school_uuid AND teacher_id = teacher_uuid
    ) THEN
        SELECT get_school_credit_balance(school_uuid) INTO remaining_credits;
        RETURN json_build_object(
            'success', true,
            'message', 'Already contacted this teacher',
            'remaining_credits', remaining_credits
        );
    END IF;
    
    -- Get the oldest available credit
    SELECT * INTO credit_record
    FROM teacher_credits 
    WHERE school_id = school_uuid 
        AND status = 'active' 
        AND credits_remaining > 0
    ORDER BY purchase_date ASC
    LIMIT 1;
    
    -- Check if credits available
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'No credits available',
            'remaining_credits', 0
        );
    END IF;
    
    -- Use the credit
    UPDATE teacher_credits 
    SET 
        credits_used = credits_used + 1,
        credits_remaining = credits_remaining - 1,
        status = CASE WHEN credits_remaining - 1 = 0 THEN 'used' ELSE 'active' END,
        updated_at = NOW()
    WHERE id = credit_record.id;
    
    -- Record the contact
    INSERT INTO teacher_contacts (school_id, teacher_id, credit_used, subscription_type)
    VALUES (school_uuid, teacher_uuid, true, 'credit');
    
    -- Get remaining credits
    SELECT get_school_credit_balance(school_uuid) INTO remaining_credits;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Credit used successfully',
        'remaining_credits', remaining_credits
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION use_teacher_credit(UUID, UUID) TO authenticated;

-- Success message
SELECT 'Teacher Credit System database setup completed successfully!' as message;
