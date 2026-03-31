
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDatabase() {
    console.log('Cleaning up oversized database entries to prevent timeouts...');

    // 1. Check menu_items
    const { data: menuItems } = await supabase.from('menu_items').select('id, name, image');
    for (const item of (menuItems || [])) {
        if (item.image && item.image.startsWith('data:') && item.image.length > 500000) {
            console.log(`Truncating oversized image for ${item.name} (${(item.image.length / 1024 / 1024).toFixed(2)} MB)...`);
            // Set to null or a small placeholder to allow DB to recover
            await supabase.from('menu_items').update({ image: null }).eq('id', item.id);
        }
    }

    // 2. Check store_settings (banner_images can be huge)
    const { data: storeSettings } = await supabase.from('store_settings').select('*').limit(1).single();
    if (storeSettings && storeSettings.banner_images) {
        const newBanners = storeSettings.banner_images.filter(img => {
            if (img.startsWith('data:') && img.length > 1000000) {
                console.log(`Removing oversized banner image ( ${(img.length / 1024 / 1024).toFixed(2)} MB)...`);
                return false;
            }
            return true;
        });
        if (newBanners.length !== storeSettings.banner_images.length) {
            await supabase.from('store_settings').update({ banner_images: newBanners }).eq('id', storeSettings.id);
        }
    }

    console.log('Database cleanup complete!');
}

cleanDatabase();
