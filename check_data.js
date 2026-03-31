
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('Checking categories...');
    const { data: cats, error: catError } = await supabase.from('categories').select('*');
    if (catError) console.error(catError);
    else console.log('Categories count:', cats?.length || 0);

    console.log('\nChecking menu items...');
    const { data: items, error: itemError } = await supabase.from('menu_items').select('*');
    if (itemError) console.error(itemError);
    else console.log('Items Count:', items?.length || 0);

    console.log('\nChecking store settings...');
    const { data: store, error: storeError } = await supabase.from('store_settings').select('*');
    if (storeError) console.error(storeError);
    else console.log('Store Settings:', JSON.stringify(store, null, 2));
}

checkData();
