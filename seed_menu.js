
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env manually
const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Frankie\'s Cloud Kitchen Menu...');

    try {
        // Clear existing data
        console.log('Clearing existing categories and items...');
        await supabase.from('menu_items').delete().neq('name', '___NON_EXISTENT___');
        await supabase.from('categories').delete().neq('name', '___NON_EXISTENT___');

        // 1. Categories
        const categories = [
            { name: 'Pasta Favorites', sort_order: 1 },
            { name: 'Snacks & Finger Foods', sort_order: 2 },
            { name: 'Plated Rice Meals', sort_order: 3 },
            { name: 'Sandwiches & Quesadillas', sort_order: 4 },
            { name: 'Cookies', sort_order: 5 },
            { name: 'Beverages', sort_order: 6 },
            { name: 'Bundles', sort_order: 7 }
        ];

        const { data: catData, error: catErr } = await supabase.from('categories').insert(categories).select();
        if (catErr) throw catErr;
        const catMap = Object.fromEntries(catData.map(c => [c.name, c.id]));

        // 2. Menu Items
        const items = [
            // Pasta
            {
                category_id: catMap['Pasta Favorites'],
                name: 'Frankie\'s Chicken Alfredo',
                description: 'Tender chicken pops toppings w/ al dente pasta in cream sauce, finished with herbs.',
                price: 169,
                variations: [{ name: 'Solo', price: 169 }, { name: 'Platter', price: 499 }],
                image: '/menu/pasta-alfredo.png'
            },
            {
                category_id: catMap['Pasta Favorites'],
                name: 'Beefy Pan-Baked Macaroni',
                description: 'Pan-tossed elbow macaroni in beefy & meaty tomato sauce w/ melted cheese.',
                price: 169,
                variations: [{ name: 'Solo', price: 169 }, { name: 'Platter', price: 499 }],
                image: '/menu/pasta-macaroni.png'
            },
            {
                category_id: catMap['Pasta Favorites'],
                name: 'Chicken Tenders w/ Fries',
                description: '6pcs crispy chicken tenders served with a side of fries.',
                price: 325,
                image: '/menu/pasta-tenders.png'
            },

            // Snacks
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Takoyaki',
                description: 'Japanese-style takoyaki with different quantities and flavors.',
                price: 70,
                variations: [
                    { name: '4pcs Classic', price: 70 }, { name: '4pcs Cheese', price: 80 }, { name: '4pcs Ham & Cheese', price: 85 },
                    { name: '10pcs Classic', price: 130 }, { name: '10pcs Cheese', price: 150 }, { name: '10pcs Ham & Cheese', price: 160 }
                ],
                image: '/menu/snacks-takoyaki.png'
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Churro Bites',
                description: 'Bite-sized churros with your choice of dip flavors.',
                price: 89,
                flavors: ['Chocolate', 'Caramel (+20)', 'Nutella (+20)', 'Sweet Milk (+20)'],
                image: '/menu/snacks-churros.png'
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Flavored Crispy Fries',
                description: 'Medium 89, Large 115. Flavors: Cheese, BBQ, Sour Cream, Overload.',
                price: 89,
                variations: [{ name: 'Medium', price: 89 }, { name: 'Large', price: 115 }],
                image: '/menu/snacks-fries.png'
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Corndog',
                description: 'Mozza (105), Overload (+10).',
                price: 105,
                variations: [{ name: 'Mozza', price: 105 }, { name: 'Overload', price: 115 }],
                image: '/menu/snacks-corndog.png'
            },

            // Rice Meals
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Garlic Mushroom Pepper Beef',
                description: 'Tender beef strips in garlicky black-pepper gravy - 179.',
                price: 179,
                image: '/menu/rice-beef.png'
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Signature Chicken BBQ',
                description: 'Tender BBQ chicken glazed in rich sauce.',
                price: 169,
                image: '/menu/rice-bbq.png'
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Spiced Pork Adobo w/ Egg',
                description: 'Filipino classic slow-simmered in soy & vinegar.',
                price: 169,
                image: '/menu/rice-adobo.png'
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Rice Meal Selection',
                description: 'Choose your favorite rice bowl: Parmigiano, Bicol Express, Katsu, Tenders.',
                price: 169,
                variations: [
                    { name: 'Chicken Nugget Parmigiano', price: 169 },
                    { name: 'Bicol Express', price: 169 },
                    { name: 'Chicken Katsu', price: 169 },
                    { name: '2pc Chicken Tenders w/ Side', price: 169 }
                ],
                image: '/menu/rice-meals.png'
            },

            // Sandwiches
            {
                category_id: catMap['Sandwiches & Quesadillas'],
                name: 'Quesadilla',
                description: 'Grilled tortilla. Beef (+30) / Chicken.',
                price: 189,
                variations: [{ name: 'Chicken', price: 189 }, { name: 'Beef', price: 219 }],
                image: '/menu/sand-quesadilla.png'
            },
            {
                category_id: catMap['Sandwiches & Quesadillas'],
                name: 'Sandwich Selection',
                description: 'Chicken Burger, Ham & Egg, Honey Grilled Cheese.',
                price: 169,
                variations: [
                    { name: 'Frankie\'s Chicken Burger', price: 169 },
                    { name: 'Ham & Egg Double Decker', price: 169 },
                    { name: 'Honey Grilled Cheese', price: 139 }
                ],
                image: '/menu/sandwiches.png'
            },

            // Cookies
            {
                category_id: catMap['Cookies'],
                name: 'Cookies',
                description: 'Choco Crinkles, Choco Chip, S\'mores.',
                price: 50,
                variations: [
                    { name: 'Choco Crinkles', price: 50 },
                    { name: 'Choco Chip', price: 50 },
                    { name: 'S\'mores', price: 55 }
                ],
                image: '/menu/cookies.png'
            },

            // Beverages
            {
                category_id: catMap['Beverages'],
                name: 'Healthy Lemonade & Milk',
                description: 'Kiwi, SB, BB, Lychee, Black Tea, Strawberry Milk.',
                price: 80,
                variations: [
                    { name: 'Lemonade 16oz', price: 80 }, { name: 'Lemonade 22oz', price: 80 },
                    { name: 'Strawberry Milk 16oz', price: 115 }, { name: 'Strawberry Milk 22oz', price: 125 }
                ],
                image: '/menu/bev-lemonade.png'
            },
            {
                category_id: catMap['Beverages'],
                name: 'Cheesecake Frappe',
                description: 'Blueberry, Strawberry (135/150), Oreo (145/160), Biscoff (155/165).',
                price: 135,
                variations: [
                    { name: 'Blueberry 16oz', price: 135 }, { name: 'Blueberry 22oz', price: 150 },
                    { name: 'Oreo 16oz', price: 145 }, { name: 'Oreo 22oz', price: 160 },
                    { name: 'Biscoff 16oz', price: 155 }, { name: 'Biscoff 22oz', price: 165 }
                ],
                image: '/menu/bev-cheesecake.png'
            },
            {
                category_id: catMap['Beverages'],
                name: 'Coffee & Lattes',
                description: 'Americano (85), Cafe Latte (120), Spanish Latte (130), Caramel Macchiato (140).',
                price: 85,
                variations: [
                    { name: 'Americano', price: 85 },
                    { name: 'Cafe Latte', price: 120 },
                    { name: 'Spanish Latte', price: 130 },
                    { name: 'Caramel Macchiato', price: 140 }
                ],
                image: '/menu/bev-espresso.png'
            },
            {
                category_id: catMap['Beverages'],
                name: 'Matcha & Yogurt',
                description: 'Yogurt Frappe (125/140), Matcha Latte (135/150), Matcha SB/CC (140/160).',
                price: 125,
                variations: [
                    { name: 'Yogurt Frappe 16oz', price: 125 }, { name: 'Yogurt Frappe 22oz', price: 140 },
                    { name: 'Matcha Latte 16oz', price: 135 }, { name: 'Matcha Latte 22oz', price: 150 },
                    { name: 'Matcha Specialty 16oz', price: 140 }, { name: 'Matcha Specialty 22oz', price: 160 }
                ],
                image: '/menu/bev-matcha.png'
            },

            // Bundles
            {
                category_id: catMap['Bundles'],
                name: 'Quick Bites',
                description: '1 Light Snack + 1 Drink/Side. Save 30!',
                price: 189,
                image: '/menu/bundle-quick.png'
            },
            {
                category_id: catMap['Bundles'],
                name: 'Full Meals',
                description: '1 Signature Main + 1 Drink/Side. Save 20!',
                price: 229,
                image: '/menu/bundle-full.png'
            },
            {
                category_id: catMap['Bundles'],
                name: 'Duo Meals',
                description: '2 Signature Main + 2 Drinks + 1 Side. Save 100+!',
                price: 459,
                image: '/menu/bundle-duo.png'
            }
        ];

        console.log('Inserting menu items...');
        const { error: itemErr } = await supabase.from('menu_items').insert(items);
        if (itemErr) throw itemErr;

        console.log('Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seed();
