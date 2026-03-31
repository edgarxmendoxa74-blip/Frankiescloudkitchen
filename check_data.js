
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('Checking categories...');
    const { data: cats, error: catError } = await supabase.from('categories').select('*');
    if (catError) console.error(catError);
    else console.log('Categories:', cats);

    console.log('\nChecking menu items...');
    const { data: items, error: itemError } = await supabase.from('menu_items').select('*');
    if (itemError) console.error(itemError);
    else console.log('Items Count:', items?.length || 0);
}

checkData();
