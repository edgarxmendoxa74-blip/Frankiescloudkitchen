
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Final Verbatim Frankie\'s Cloud Kitchen Menu...');

    try {
        // Clear existing data
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

        // 2. Menu Items
        const items = [
            // Duo Meals
            {
                category_id: catMap['Duo Meals'],
                name: 'Duo Meals (Promo)',
                description: '2 Signature Main + 2 Large Drinks + 1 Side Dish. Save 100+!',
                price: 459,
                image: '/menu/bundle-duo.png'
            },

            // Full Meals
            {
                category_id: catMap['Full Meals'],
                name: 'Full Meals (Promo)',
                description: '1 Signature Main + 1 Drink/Side/Dessert. Save 20!',
                price: 229,
                image: '/menu/bundle-full.png'
            },

            // Quick Bites
            {
                category_id: catMap['Quick Bites'],
                name: 'Quick Bites (Promo)',
                description: '1 Light Snack + 1 Drink/Side. Save 30!',
                price: 189,
                image: '/menu/bundle-quick.png'
            },

            // Your Cloud Menu (Highly Curated)
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Pasta Favorites',
                description: 'Tender chicken alfredo or beefy macaroni. Served w/ bread.',
                price: 169,
                variations: [
                    { name: 'Frankie\'s Chicken Alfredo (Solo)', price: 169 },
                    { name: 'Frankie\'s Chicken Alfredo (Platter)', price: 499 },
                    { name: 'Beefy Pan-Baked Macaroni (Solo)', price: 169 },
                    { name: 'Beefy Pan-Baked Macaroni (Platter)', price: 499 },
                    { name: 'Chicken Tenders w/ fries (6pcs)', price: 325 }
                ],
                image: '/menu/pasta-alfredo.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Snacks & Finger Foods',
                description: 'Takoyaki, Churro Bites, Flavored Fries, Corndog, or Beefy Nachos.',
                price: 70,
                variations: [
                    { name: 'Takoyaki 4pcs (Classic)', price: 70 },
                    { name: 'Takoyaki 4pcs (Cheese)', price: 80 },
                    { name: 'Takoyaki 4pcs (Ham & Cheese)', price: 85 },
                    { name: 'Takoyaki 10pcs (Classic)', price: 130 },
                    { name: 'Takoyaki 10pcs (Cheese)', price: 150 },
                    { name: 'Takoyaki 10pcs (Ham & Cheese)', price: 160 },
                    { name: 'Churro Bites (with choice of dip)', price: 89 },
                    { name: 'Flavored Crispy Fries (Medium)', price: 89 },
                    { name: 'Flavored Crispy Fries (Large)', price: 115 },
                    { name: 'Corndog (Mozza)', price: 105 },
                    { name: 'Corndog (Overload)', price: 115 },
                    { name: 'Beefy Nachos', price: 139 }
                ],
                image: '/menu/snacks-takoyaki.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Plated Rice Meals',
                description: 'Signature BBQ, Adobo, Beef, Parmigiano, Bicol, Katsu, or Tenders.',
                price: 169,
                variations: [
                    { name: 'Garlic Mushroom Pepper Beef', price: 179 },
                    { name: 'Signature Chicken BBQ', price: 169 },
                    { name: 'Spiced Pork Adobo w/ Egg', price: 169 },
                    { name: 'Chicken Nugget Parmigiano', price: 169 },
                    { name: 'Bicol Express', price: 169 },
                    { name: 'Chicken Katsu', price: 169 },
                    { name: '2pc Chicken Tenders w/ Side', price: 169 }
                ],
                image: '/menu/rice-bbq.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Sandwiches & Quesadillas',
                description: 'Quesadilla, Chicken Burger, Ham & Egg, or Grilled Cheese.',
                price: 139,
                variations: [
                    { name: 'Quesadilla (Chicken)', price: 189 },
                    { name: 'Quesadilla (Beef)', price: 219 },
                    { name: 'Frankie\'s Chicken Burger', price: 169 },
                    { name: 'Ham & Egg Double Decker', price: 169 },
                    { name: 'Honey Grilled Cheese', price: 139 }
                ],
                image: '/menu/sandwiches.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Cookies',
                description: 'Chewy cookies perfect for sharing.',
                price: 50,
                variations: [
                    { name: 'Choco Crinkles', price: 50 },
                    { name: 'Choco Chip', price: 50 },
                    { name: 'S\'mores', price: 55 }
                ],
                image: '/menu/cookies.png'
            },

            // Our Cloud Menu (Highly Curated Beverages)
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Healthy Lemonade & Milk',
                description: 'Refreshing citrus and milk drinks (16oz/22oz).',
                price: 80,
                variations: [
                    { name: 'Lemonades (All Flavors) 16oz', price: 80 },
                    { name: 'Lemonades (All Flavors) 22oz', price: 80 },
                    { name: 'Black Tea Lemonade 16oz', price: 80 },
                    { name: 'Black Tea Lemonade 22oz', price: 80 },
                    { name: 'Strawberry Milk 16oz', price: 115 },
                    { name: 'Strawberry Milk 22oz', price: 125 }
                ],
                image: '/menu/bev-lemonade.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Cheesecake & Frappe Series',
                description: 'Blended masterpieces topped with whipped cream.',
                price: 105,
                variations: [
                    { name: 'Blueberry Cheesecake 16oz', price: 135 }, { name: 'Blueberry Cheesecake 22oz', price: 150 },
                    { name: 'Strawberry Cheesecake 16oz', price: 135 }, { name: 'Strawberry Cheesecake 22oz', price: 150 },
                    { name: 'Oreo Cheesecake 16oz', price: 145 }, { name: 'Oreo Cheesecake 22oz', price: 160 },
                    { name: 'Biscoff Cheesecake 16oz', price: 155 }, { name: 'Biscoff Cheesecake 22oz', price: 165 },
                    { name: 'Dark Chocolate Frappe 16oz', price: 105 }, { name: 'Dark Chocolate Frappe 22oz', price: 125 },
                    { name: 'Blueberries \'n Cream 16oz', price: 105 }, { name: 'Blueberries \'n Cream 22oz', price: 125 },
                    { name: 'Strawberries \'n Cream 16oz', price: 115 }, { name: 'Strawberries \'n Cream 22oz', price: 135 },
                    { name: 'Biscoff/Nutella Cream 16oz', price: 145 }, { name: 'Biscoff/Nutella Cream 22oz', price: 155 },
                    { name: 'Biscoff/Nutella Coffee 16oz', price: 155 }, { name: 'Biscoff/Nutella Coffee 22oz', price: 165 },
                    { name: 'Dark Mocha/Java Chip 16oz', price: 130 }, { name: 'Dark Mocha/Java Chip 22oz', price: 145 },
                    { name: 'Triple Mocha 16oz', price: 145 }, { name: 'Triple Mocha 22oz', price: 160 }
                ],
                image: '/menu/bev-frappe.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Espresso & Lattes',
                description: 'Coffee classics for every mood.',
                price: 85,
                variations: [
                    { name: 'Americano', price: 85 },
                    { name: 'Cafe Latte', price: 120 },
                    { name: 'Spanish Latte', price: 130 },
                    { name: 'Caramel Macchiato', price: 140 },
                    { name: 'Hot Choco (12oz)', price: 100 }
                ],
                image: '/menu/bev-espresso.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Matcha & Yogurt Series',
                description: 'Yogurt frappes and matcha craze.',
                price: 125,
                variations: [
                    { name: 'Yogurt Frappe (All Flavors) 16oz', price: 125 },
                    { name: 'Yogurt Frappe (All Flavors) 22oz', price: 140 },
                    { name: 'Matcha Latte 16oz', price: 135 },
                    { name: 'Matcha Latte 22oz', price: 150 },
                    { name: 'Matcha Specialty 16oz', price: 140 },
                    { name: 'Matcha Specialty 22oz', price: 160 }
                ],
                image: '/menu/bev-matcha.png'
            }
        ];

        console.log('Inserting verbatim menu items...');
        const { error: itemErr } = await supabase.from('menu_items').insert(items);
        if (itemErr) throw itemErr;

        console.log('Final Verbatim Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seed();
