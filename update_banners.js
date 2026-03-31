
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBanners() {
    console.log('Updating store logo and banner images...');
    
    const settings = {
        logo_url: "/frankies-logo.jpg",
        banner_images: [
            "/hero-banner.png",
            "/hero.jpg"
        ],
        store_name: "Frankie's Cloud Kitchen"
    };

    const { data: stores, error: fetchErr } = await supabase.from('store_settings').select('id').limit(1);
    
    if (fetchErr) {
        console.error('Error fetching store settings:', fetchErr);
        return;
    }

    if (stores && stores.length > 0) {
        const { error } = await supabase.from('store_settings').update(settings).eq('id', stores[0].id);
        if (error) console.error('Error updating banners:', error);
        else console.log('Successfully updated logo and banners!');
    } else {
        const { error } = await supabase.from('store_settings').insert(settings);
        if (error) console.error('Error inserting settings:', error);
        else console.log('Successfully created store settings with logo and banners!');
    }
}

updateBanners().catch(err => console.error('Caught error:', err));
