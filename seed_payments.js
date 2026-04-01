import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPayments() {
    console.log('Seeding Default Payment Methods...');
    try {
        // Clear old ones just in case there are duplicates
        await supabase.from('payment_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const defaultMethods = [
            {
                name: 'Cash on Delivery (COD)',
                account_number: '',
                account_name: '',
                qr_url: '',
                is_active: true
            },
            {
                name: 'Gcash / Maya',
                account_number: '09123456789',
                account_name: 'Frankie\'s Kitchen',
                qr_url: '',
                is_active: true
            },
            {
                name: 'QR PH',
                account_number: '09123456789',
                account_name: 'Frankie\'s Kitchen',
                qr_url: '',
                is_active: true
            }
        ];

        const { error } = await supabase.from('payment_settings').insert(defaultMethods);
        if (error) throw error;

        console.log('Payment configurations seeded successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seedPayments();
