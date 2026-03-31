
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Frankie\'s Cloud Kitchen Menu v6 (New Categories)...');

    try {
        console.log('Clearing existing categories and items...');
        await supabase.from('menu_items').delete().neq('name', '___NON_EXISTENT___');
        await supabase.from('categories').delete().neq('name', '___NON_EXISTENT___');

        // 1. New Categories
        const categories = [
            { name: 'Bundles & Favorites', sort_order: 1 },
            { name: 'Snacks & Sandwiches', sort_order: 2 },
            { name: 'Pasta & Rice', sort_order: 3 },
            { name: 'Drinks', sort_order: 4 }
        ];

        const { data: catData, error: catErr } = await supabase.from('categories').insert(categories).select();
        if (catErr) throw catErr;
        const catMap = Object.fromEntries(catData.map(c => [c.name, c.id]));

        const commonAddons = [
            { name: 'Extra Rice', price: 25 },
            { name: 'Fried Egg', price: 20 },
            { name: 'Cheesy Melt', price: 35 }
        ];

        const drinkSizes = [
            { name: '16oz', price: 0 },
            { name: '22oz', price: 15 }
        ];

        // Takoyaki Spicy Levels
        const spicyLevels = [
            { name: 'Non-spicy', price: 0 },
            { name: 'Mild-spicy', price: 0 },
            { name: 'Extra spicy', price: 5 }
        ];

        const items = [
            // CATEGORY: Bundles & Favorites
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Chicken Alfredo',
                description: '[FAV] Tender chicken pops toppings w/ al dente pasta in cream sauce. Served w/ bread.',
                price: 169,
                variations: [
                    { name: 'Solo', price: 169 },
                    { name: 'Platter (Good for 3-4)', price: 499 }
                ],
                addons: commonAddons,
                image: '/menu/pasta-alfredo.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Beefy Macaroni',
                description: '[FAV] Pan-tossed elbow macaroni in beefy tomato sauce w/ melted cheese. Served w/ bread.',
                price: 169,
                variations: [
                    { name: 'Solo', price: 169 },
                    { name: 'Platter (Good for 3-4)', price: 499 }
                ],
                addons: commonAddons,
                image: '/menu/pasta-macaroni.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Frankie\'s Chicken Burger',
                description: '[FAV] Signature crispy chicken patty with special sauce.',
                price: 169,
                variations: [
                    { name: 'Classic', price: 169 },
                    { name: 'With Cheese', price: 185 },
                    { name: 'With Egg', price: 185 }
                ],
                image: '/menu/sandwiches.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Double Decker Sandwich',
                description: '[FAV][SHARING] Ham & Egg Double Decker. Great for sharing!',
                price: 169,
                image: '/menu/sandwiches.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Garlic Mushroom Beef',
                description: '[FAV] Savory beef strips with garlic and mushrooms.',
                price: 185,
                addons: commonAddons,
                image: '/menu/rice-main.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Chicken Katsu',
                description: '[FAV] Crispy golden chicken fillet with katsu sauce.',
                price: 175,
                addons: commonAddons,
                image: '/menu/rice-main.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Mozza Corndog',
                description: '[FAV] Mozzarella filled corndog.',
                price: 89,
                image: '/menu/snacks-corndog.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Cheese Takoyaki',
                description: '[FAV] 4pcs Takoyaki with extra cheese melt.',
                price: 80,
                flavors: spicyLevels,
                image: '/menu/snacks-takoyaki.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Strawberry Milk',
                description: '[FAV] Premium strawberry milk beverage.',
                price: 95,
                variations: drinkSizes,
                image: '/menu/bev-strawberry.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Spanish Latte',
                description: '[FAV] Signature sweet and creamy espresso latte.',
                price: 95,
                variations: [
                    { name: 'Hot', price: 85 },
                    { name: 'Iced (16oz)', price: 95 },
                    { name: 'Iced (22oz)', price: 110 }
                ],
                image: '/menu/bev-espresso.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Oreo Cheesecake Frappe',
                description: '[FAV] Blended cheesecake with crushed Oreo cookies.',
                price: 135,
                variations: drinkSizes,
                image: '/menu/bev-cheesecake.png'
            },
            {
                category_id: catMap['Bundles & Favorites'],
                name: 'Lemonades',
                description: '[FAV] Freshly squeezed lemonade variety.',
                price: 80,
                variations: drinkSizes,
                flavors: ['Classic', 'Kiwi', 'Strawberry', 'Blueberry', 'Lychee'],
                image: '/menu/bev-lemonade.png'
            },

            // CATEGORY: Snacks & Sandwiches
            {
                category_id: catMap['Snacks & Sandwiches'],
                name: 'Classic Takoyaki',
                description: 'Authentic octopus balls.',
                price: 70,
                variations: [
                    { name: '4pcs', price: 70 },
                    { name: '10pcs', price: 130 }
                ],
                flavors: spicyLevels,
                image: '/menu/snacks-takoyaki.png'
            },
            {
                category_id: catMap['Snacks & Sandwiches'],
                name: 'Honey Grilled Cheese',
                description: '[SHARING] Sweet and savory melted cheese sandwich.',
                price: 115,
                image: '/menu/sandwiches.png'
            },
            {
                category_id: catMap['Snacks & Sandwiches'],
                name: 'Gourmet Quesadilla',
                description: '[SHARING] Cheesy quesadilla with choice of protein.',
                price: 165,
                variations: [
                    { name: 'Chicken', price: 165 },
                    { name: 'Beef', price: 185 }
                ],
                image: '/menu/snacks-quesadilla.png'
            },
            {
                category_id: catMap['Snacks & Sandwiches'],
                name: 'Flavored Fries',
                description: 'Golden crispy fries.',
                price: 89,
                variations: [
                    { name: 'Medium', price: 89 },
                    { name: 'Large', price: 115 }
                ],
                flavors: ['Cheese', 'BBQ', 'Sour Cream'],
                image: '/menu/snacks-fries.png'
            },

            // CATEGORY: Pasta & Rice
            {
                category_id: catMap['Pasta & Rice'],
                name: 'Spiced Pork Adobo w/ Egg',
                description: 'Traditional adobo with a spicy kick.',
                price: 165,
                addons: commonAddons,
                image: '/menu/rice-main.png'
            },
            {
                category_id: catMap['Pasta & Rice'],
                name: 'Signature Chicken BBQ (Rice)',
                description: 'Glazed BBQ chicken with plain rice.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-bbq.png'
            },

            // CATEGORY: Drinks
            {
                category_id: catMap['Drinks'],
                name: 'Signature Coffee Frappe',
                description: 'Strong blended coffee with cream.',
                price: 125,
                variations: drinkSizes,
                image: '/menu/bev-frappe.png'
            },
            {
                category_id: catMap['Drinks'],
                name: 'Matcha Latte',
                description: 'Premium Uji matcha with fresh milk.',
                price: 95,
                variations: drinkSizes,
                image: '/menu/bev-matcha.png'
            }
        ];

        console.log('Inserting expanded menu items...');
        const { error: itemErr } = await supabase.from('menu_items').insert(items);
        if (itemErr) throw itemErr;

        console.log('Menu v6 Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seed();
