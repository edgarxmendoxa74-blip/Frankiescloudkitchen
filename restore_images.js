
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function restorePlaceholders() {
    console.log('Restoring placeholder image paths to fix the menu display...');

    const paths = {
        'Pasta Favorites': '/menu/pasta-alfredo.png',
        'Snacks & Finger Foods': '/menu/snacks-takoyaki.png',
        'Plated Rice Meals': '/menu/rice-bbq.png',
        'Sandwiches & Quesadillas': '/menu/sandwiches.png',
        'Cookies': '/menu/cookies.png',
        'Healthy Lemonade & Milk': '/menu/bev-lemonade.png',
        'Cheesecake & Frappe Series': '/menu/bev-frappe.png',
        'Espresso & Lattes': '/menu/bev-espresso.png',
        'Matcha & Yogurt Series': '/menu/bev-matcha.png',
        'Quick Bites (Promo)': '/menu/bundle-quick.png',
        'Full Meals (Promo)': '/menu/bundle-full.png',
        'Duo Meals (Promo)': '/menu/bundle-duo.png'
    };

    for (const [name, path] of Object.entries(paths)) {
        await supabase.from('menu_items').update({ image: path }).eq('name', name);
    }

    console.log('Placeholders restored! You can now re-upload your specific images in the Admin Dashboard.');
}

restorePlaceholders();
