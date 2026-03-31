
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Fully Expanded Frankie\'s Cloud Kitchen Menu...');

    try {
        // Clear existing data (categories will be recreated)
        console.log('Clearing existing categories and items...');
        await supabase.from('menu_items').delete().neq('name', '___NON_EXISTENT___');
        await supabase.from('categories').delete().neq('name', '___NON_EXISTENT___');

        // 1. Categories
        const categories = [
            { name: 'Duo Meals', sort_order: 1 },
            { name: 'Full Meals', sort_order: 2 },
            { name: 'Quick Bites', sort_order: 3 },
            { name: 'Your Cloud Menu', sort_order: 4 },
            { name: 'Our Cloud Menu', sort_order: 5 }
        ];

        const { data: catData, error: catErr } = await supabase.from('categories').insert(categories).select();
        if (catErr) throw catErr;
        const catMap = Object.fromEntries(catData.map(c => [c.name, c.id]));

        const commonAddons = [
            { name: 'Extra Rice', price: 25 },
            { name: 'Fried Egg', price: 20 },
            { name: 'Cheesy Melt', price: 35 }
        ];

        const sideOptions = ['Fries', 'Churro Bites', 'Coffee Jelly', 'Fresh Lemonade'];

        // 2. Menu Items
        const items = [
            // DUO MEALS (Expanded)
            {
                category_id: catMap['Duo Meals'],
                name: 'Pasta Duo (2 Mains)',
                description: '2 Signature Pasta + 2 Drinks + 1 Side. Save 100+!',
                price: 459,
                variations: [
                    { name: 'Classic (Alfredo + Mac)', price: 459 },
                    { name: 'Double Alfredo', price: 459 },
                    { name: 'Double Macaroni', price: 459 }
                ],
                flavors: sideOptions,
                image: '/menu/bundle-duo.png'
            },
            {
                category_id: catMap['Duo Meals'],
                name: 'BBQ & Burger Duo',
                description: '1 Signature Chicken BBQ + 1 Chicken Burger + 2 Drinks + 1 Side.',
                price: 459,
                flavors: sideOptions,
                image: '/menu/bundle-duo.png'
            },
            {
                category_id: catMap['Duo Meals'],
                name: 'Build Your Own Duo',
                description: 'Mix and match any 2 mains + 2 drinks + 1 side.',
                price: 459,
                variations: [
                    { name: 'Any 2 Mains Selection', price: 459 }
                ],
                addons: [
                    { name: 'Chicken Alfredo', price: 0 },
                    { name: 'Beefy Macaroni', price: 0 },
                    { name: 'Double Decker', price: 0 },
                    { name: 'Chicken Burger', price: 0 },
                    { name: 'Signature Chicken BBQ', price: 0 }
                ],
                image: '/menu/bundle-duo.png'
            },

            // FULL MEALS (Expanded)
            {
                category_id: catMap['Full Meals'],
                name: 'Full Meal: Chicken Alfredo',
                description: '1 Signature Chicken Alfredo + 1 Drink/Side/Dessert. Save 20!',
                price: 229,
                flavors: sideOptions,
                image: '/menu/bundle-full.png'
            },
            {
                category_id: catMap['Full Meals'],
                name: 'Full Meal: Beefy Macaroni',
                description: '1 Beefy Pan-Baked Macaroni + 1 Drink/Side/Dessert.',
                price: 229,
                flavors: sideOptions,
                image: '/menu/bundle-full.png'
            },
            {
                category_id: catMap['Full Meals'],
                name: 'Full Meal: Signature BBQ',
                description: '1 Signature Chicken BBQ Rice + 1 Drink/Side/Dessert.',
                price: 229,
                flavors: sideOptions,
                image: '/menu/bundle-full.png'
            },
            {
                category_id: catMap['Full Meals'],
                name: 'Full Meal: Chicken Burger',
                description: '1 Frankie\'s Chicken Burger + 1 Drink/Side/Dessert.',
                price: 229,
                flavors: sideOptions,
                image: '/menu/bundle-full.png'
            },
            {
                category_id: catMap['Full Meals'],
                name: 'Full Meal: Double Decker',
                description: '1 Ham & Egg Double Decker + 1 Drink/Side/Dessert.',
                price: 229,
                flavors: sideOptions,
                image: '/menu/bundle-full.png'
            },

            // QUICK BITES (Expanded)
            {
                category_id: catMap['Quick Bites'],
                name: 'Quick Bite: Takoyaki',
                description: '10pcs Takoyaki + 1 Fresh Drink/Side. Save 30!',
                price: 189,
                variations: [
                    { name: 'Classic', price: 189 },
                    { name: 'Cheese', price: 209 },
                    { name: 'Ham & Cheese', price: 219 }
                ],
                flavors: ['Fresh Lemonade', 'Coffee Jelly', 'Churros'],
                image: '/menu/bundle-quick.png'
            },
            {
                category_id: catMap['Quick Bites'],
                name: 'Quick Bite: Corndog',
                description: '1 Gourmet Corndog + 1 Fresh Drink/Side.',
                price: 189,
                variations: [
                    { name: 'Mozza', price: 189 },
                    { name: 'Overload', price: 199 }
                ],
                flavors: ['Fresh Lemonade', 'Coffee Jelly', 'Churros'],
                image: '/menu/bundle-quick.png'
            },
            {
                category_id: catMap['Quick Bites'],
                name: 'Quick Bite: Grilled Cheese',
                description: 'Honey Grilled Cheese + 1 Fresh Drink/Side.',
                price: 189,
                flavors: ['Fresh Lemonade', 'Coffee Jelly', 'Churros'],
                image: '/menu/bundle-quick.png'
            },

            // YOUR CLOUD MENU (FOOD) - Same as v4
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Frankie\'s Chicken Alfredo',
                description: 'Tender chicken pops toppings w/ al dente pasta in cream sauce. Served w/ bread.',
                price: 169,
                variations: [
                    { name: 'Solo', price: 169 },
                    { name: 'Platter (Good for 3-4)', price: 499 }
                ],
                addons: commonAddons,
                image: '/menu/pasta-alfredo.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Beefy Pan-Baked Macaroni',
                description: 'Pan-tossed elbow macaroni in beefy tomato sauce w/ melted cheese. Served w/ bread.',
                price: 169,
                variations: [
                    { name: 'Solo', price: 169 },
                    { name: 'Platter (Good for 3-4)', price: 499 }
                ],
                addons: commonAddons,
                image: '/menu/pasta-macaroni.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Takoyaki',
                description: 'Authentic Japanese-style takoyaki balls.',
                price: 70,
                variations: [
                    { name: '4pcs Classic', price: 70 },
                    { name: '4pcs Cheese', price: 80 },
                    { name: '4pcs Ham & Cheese', price: 85 },
                    { name: '10pcs Classic', price: 130 },
                    { name: '10pcs Cheese', price: 150 },
                    { name: '10pcs Ham & Cheese', price: 160 }
                ],
                image: '/menu/snacks-takoyaki.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Signature Chicken BBQ',
                description: 'Tender BBQ chicken glazed in rich, savory sauce. Served with rice.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-bbq.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Frankie\'s Chicken Burger',
                description: 'Signature crispy chicken patty with special sauce.',
                price: 169,
                image: '/menu/sandwiches.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Flavored Crispy Fries',
                description: 'Gourmet flavored fries.',
                price: 89,
                variations: [
                    { name: 'Medium', price: 89 },
                    { name: 'Large', price: 115 }
                ],
                flavors: ['Cheese', 'BBQ', 'Sour Cream', 'Overload'],
                image: '/menu/snacks-fries.png'
            },

            // OUR CLOUD MENU (BEVERAGES) - Same as v4
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Healthy Lemonade',
                description: 'Freshly squeezed lemonade with natural flavors.',
                price: 80,
                variations: [
                    { name: '16oz', price: 80 },
                    { name: '22oz', price: 80 }
                ],
                flavors: ['Kiwi', 'Strawberry', 'Blueberry', 'Lychee', 'Black Tea'],
                image: '/menu/bev-lemonade.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Cheesecake Frappe',
                description: 'Our signature blended cheesecake topped with whipped cream.',
                price: 135,
                variations: [
                    { name: '16oz', price: 135 },
                    { name: '22oz', price: 150 }
                ],
                flavors: [
                    { name: 'Blueberry', price: 0 },
                    { name: 'Strawberry', price: 0 },
                    { name: 'Oreo', price: 10 },
                    { name: 'Biscoff', price: 20 }
                ],
                image: '/menu/bev-cheesecake.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Americano',
                description: 'Double shot of our signature espresso.',
                price: 85,
                image: '/menu/bev-espresso.png'
            }
        ];

        console.log('Inserting fully expanded menu items...');
        const { error: itemErr } = await supabase.from('menu_items').insert(items);
        if (itemErr) throw itemErr;

        console.log('Full Expansion Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seed();
