import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ybvdtvllauyulkjhszfv.supabase.co'
const supabaseKey = 'sb_publishable_is37ryQaTdPEZ_RIm7Ejkg_bLC1rwD0'

export const supabase = createClient(supabaseUrl, supabaseKey)