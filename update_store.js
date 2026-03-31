
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateStore() {
    console.log('Updating Store Settings to Frankie\'s Cloud Kitchen...');
    
    const settings = {
        store_name: "Frankie's Cloud Kitchen",
        contact: "0917 300 5972",
        address: "Calamba, Laguna (Free Delivery: Punta - Barandal)",
        open_time: "10:00",
        close_time: "23:00",
        manual_status: "auto"
    };

    const { error } = await supabase.from('store_settings').upsert(settings, { onConflict: 'id' });
    if (error) {
        // If upsert fails due to missing ID, try update first one
        const { data: first } = await supabase.from('store_settings').select('id').limit(1).single();
        if (first) {
            await supabase.from('store_settings').update(settings).eq('id', first.id);
        } else {
            await supabase.from('store_settings').insert(settings);
        }
    }

    console.log('Store settings updated!');
}

updateStore();
