// Firebase client replacing Supabase
// Import the firebase client like this:
// import { supabase } from "@/integrations/supabase/client";

import { firebase } from '@/integrations/firebase/client';

// Export firebase client as supabase for backward compatibility
export const supabase = firebase;