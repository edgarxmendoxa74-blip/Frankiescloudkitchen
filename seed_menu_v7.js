
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

async function seed() {
    console.log('Seeding Frankie\'s Cloud Kitchen Menu v7 (Strict Image Match)...');

    try {
        console.log('Clearing existing categories and items...');
        await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // 1. Categories from Image
        const categories = [
            { name: 'Pasta Favorites', sort_order: 1 },
            { name: 'Snacks & Finger Foods', sort_order: 2 },
            { name: 'Plated Rice Meals', sort_order: 3 },
            { name: 'Sandwiches & Quesadillas', sort_order: 4 },
            { name: 'Cookies', sort_order: 5 },
            { name: 'Bundles', sort_order: 6 },
            { name: 'Drinks', sort_order: 7 }
        ];

        const { data: catData, error: catErr } = await supabase.from('categories').insert(categories).select();
        if (catErr) throw catErr;
        const catMap = Object.fromEntries(catData.map(c => [c.name, c.id]));

        const commonAddons = [
            { name: 'Extra Rice', price: 25 },
            { name: 'Fried Egg', price: 20 },
            { name: 'Cheesy Melt', price: 35 }
        ];

        const items = [
            // PASTA FAVORITES
            {
                category_id: catMap['Pasta Favorites'],
                name: "Frankie's Chicken Alfredo",
                description: '[FAV] Tender chicken pops toppings w/ al dente pasta in cream sauce, finished with herbs. Served w/ bread.',
                price: 169,
                variations: [
                    { name: 'Solo', price: 169 },
                    { name: 'Platter', price: 499 }
                ],
                image: '/menu/pasta-alfredo.png',
                sort_order: 1
            },
            {
                category_id: catMap['Pasta Favorites'],
                name: 'Beefy Pan-Baked Macaroni',
                description: 'Pan-tossed elbow macaroni pasta in beefy & meaty tomato sauce w/ melted cheese sauce. Served w/ bread.',
                price: 169,
                variations: [
                    { name: 'Solo', price: 169 },
                    { name: 'Platter', price: 499 }
                ],
                image: '/menu/pasta-macaroni.png',
                sort_order: 2
            },
            {
                category_id: catMap['Pasta Favorites'],
                name: 'Chicken Tenders w/ fries',
                description: 'Crispy chicken tenders served with a side of fries.',
                price: 325,
                variations: [
                    { name: '6pcs', price: 325 }
                ],
                image: '/menu/pasta-tenders.png',
                sort_order: 3
            },

            // SNACKS & FINGER FOODS
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Takoyaki',
                description: '[FAV] Authentic octopus balls with various toppings.',
                price: 70,
                variations: [
                    { name: '4pcs', price: 70 },
                    { name: '10pcs', price: 130 }
                ],
                flavors: [
                    { name: 'Classic', price: 0 },
                    { name: 'Cheese', price: 10 },
                    { name: 'Ham & Cheese', price: 15 }
                ],
                image: '/menu/snacks-takoyaki.png',
                sort_order: 1
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Churro Bites',
                description: '[FAV] Bite-sized crispy churros with choice of dip.',
                price: 89,
                flavors: [
                    { name: 'Chocolate', price: 0 },
                    { name: 'Caramel', price: 20 },
                    { name: 'Nutella', price: 20 },
                    { name: 'Sweet Milk', price: 20 }
                ],
                image: '/menu/snacks-churros.png',
                sort_order: 2
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Flavored Crispy Fries',
                description: 'Golden crispy fries with your choice of flavor.',
                price: 89,
                variations: [
                    { name: 'Medium', price: 89 },
                    { name: 'Large', price: 115 },
                    { name: 'Overload', price: 115 }
                ],
                flavors: ['Cheese / BBQ', 'Sour Cream'],
                image: '/menu/snacks-fries.png',
                sort_order: 3
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Corndog',
                description: '[FAV] Crispy corndog with mozzarella or overload options.',
                price: 105,
                flavors: [
                    { name: 'Mozza', price: 0 },
                    { name: 'Overload', price: 10 }
                ],
                image: '/menu/snacks-corndog.png',
                sort_order: 4
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Beefy Nachos',
                description: '[FAV] Seasoned tacos with beef, cheese, & veggie toppings.',
                price: 139,
                image: '/menu/snacks-nachos.png',
                sort_order: 5
            },

            // PLATED RICE MEALS
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Garlic Mushroom Pepper Beef',
                description: '[FAV][SHARING] Tender beef strips in garlicky black-pepper gravy with onions — perfect over rice.',
                price: 179,
                addons: commonAddons,
                image: '/menu/rice-beef.png',
                sort_order: 1
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Signature Chicken BBQ',
                description: '[FAV][SHARING] Tender BBQ chicken glazed in a rich sauce, served over rice fried in the same savory-sweet marinade.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-bbq.png',
                sort_order: 2
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Spiced Pork Adobo w/ Egg',
                description: '[FAV][SHARING] The Filipino classic: slow-simmered in soy, vinegar, and garlic, turned up with a chili kick.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-adobo.png',
                sort_order: 3
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Chicken Nugget Parmigiano',
                description: '[SHARING] Crispy chicken nuggets topped with tomato and beef sauce and melted cheese.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-nuggets.png',
                sort_order: 4
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Bicol Express',
                description: '[SHARING] Tender savory pork simmered in coconut sauce with a spicy kick you\'ll love.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-bicol.png',
                sort_order: 5
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Chicken Katsu',
                description: '[FAV][SHARING] Panko-crusted chicken cutlet, crisp outside and juicy inside, served with rice, coleslaw and tonkatsu sauce.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-katsu.png',
                sort_order: 6
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: '2pc Chicken Tenders w/ Side',
                description: '[FAV][SHARING] Crispy chicken tenders with a side of corn, white rice, and choice dip (mayo/ketchup).',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-tenders.png',
                sort_order: 7
            },

            // SANDWICHES & QUESADILLAS
            {
                category_id: catMap['Sandwiches & Quesadillas'],
                name: 'Quesadilla',
                description: '[FAV][SHARING] Grilled tortilla filled with savory beef/chicken and melted cheese.',
                price: 189,
                flavors: [
                    { name: 'Chicken', price: 0 },
                    { name: 'Beef', price: 30 }
                ],
                image: '/menu/sandwiches-quesadilla.png',
                sort_order: 1
            },
            {
                category_id: catMap['Sandwiches & Quesadillas'],
                name: "Frankie's Chicken Burger",
                description: '[FAV][SHARING] Juicy chicken fillet stacked in a soft bun, topped w/ homemade coleslaw. Served w/ fries.',
                price: 169,
                image: '/menu/sandwiches-burger.png',
                sort_order: 2
            },
            {
                category_id: catMap['Sandwiches & Quesadillas'],
                name: 'Ham & Egg Double Decker',
                description: '[FAV][SHARING] Grilled wheat toast packed w/ sweet ham and a gooey fried egg. Served w/ fries.',
                price: 169,
                image: '/menu/sandwiches-double.png',
                sort_order: 3
            },
            {
                category_id: catMap['Sandwiches & Quesadillas'],
                name: 'Honey Grilled Cheese',
                description: '[SHARING] Buttery grilled cheese with a hint of honey, served with crispy fries.',
                price: 139,
                image: '/menu/sandwiches-cheese.png',
                sort_order: 4
            },

            // COOKIES
            {
                category_id: catMap['Cookies'],
                name: 'Choco Crinkles',
                description: 'Soft and fudgy chocolate crinkle cookies.',
                price: 50,
                image: '/menu/cookies-crinkles.png',
                sort_order: 1
            },
            {
                category_id: catMap['Cookies'],
                name: 'Choco Chip',
                description: 'Classic chocolate chip cookies.',
                price: 55,
                image: '/menu/cookies-chip.png',
                sort_order: 2
            },
            {
                category_id: catMap['Cookies'],
                name: "S'mores",
                description: "Delightful s'mores cookies with marshmallows and chocolate.",
                price: 55,
                image: '/menu/cookies-smores.png',
                sort_order: 3
            },

            // BUNDLES
            {
                category_id: catMap['Bundles'],
                name: 'Quick Bites',
                description: 'Perfect for a quick and satisfying snack.',
                price: 189,
                image: '/menu/bundles-quick.png',
                sort_order: 1
            },
            {
                category_id: catMap['Bundles'],
                name: 'Full Meals',
                description: 'Complete and filling meals for one.',
                price: 229,
                image: '/menu/bundles-full.png',
                sort_order: 2
            },
            {
                category_id: catMap['Bundles'],
                name: 'Duo Meals',
                description: '[SHARING] Great value meals for two people.',
                price: 459,
                image: '/menu/bundles-duo.png',
                sort_order: 3
            },

            // DRINKS (Maintaining some items from v6)
            {
                category_id: catMap['Drinks'],
                name: 'Lemonades',
                description: '[FAV] Freshly squeezed lemonade variety.',
                price: 80,
                variations: [
                    { name: '16oz', price: 80 },
                    { name: '22oz', price: 95 }
                ],
                flavors: ['Classic', 'Kiwi', 'Strawberry', 'Blueberry', 'Lychee'],
                image: '/menu/bev-lemonade.png',
                sort_order: 1
            },
            {
                category_id: catMap['Drinks'],
                name: 'Spanish Latte',
                description: '[FAV] Signature sweet and creamy espresso latte.',
                price: 95,
                variations: [
                    { name: 'Hot', price: 85 },
                    { name: 'Iced (16oz)', price: 95 },
                    { name: 'Iced (22oz)', price: 110 }
                ],
                image: '/menu/bev-espresso.png',
                sort_order: 2
            }
        ];

        console.log('Inserting menu items...');
        const { error: itemErr } = await supabase.from('menu_items').insert(items);
        if (itemErr) throw itemErr;

        console.log('Menu v7 Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seed();
