
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Frankie\'s Cloud Kitchen Menu v9 (Full Bundles and New Desserts)...');

    try {
        console.log('Clearing existing categories and items...');
        await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const categories = [
            { name: 'Pasta Favorites', sort_order: 1 },
            { name: 'Snacks & Finger Foods', sort_order: 2 },
            { name: 'Plated Rice Meals', sort_order: 3 },
            { name: 'Sandwiches & Quesadillas', sort_order: 4 },
            { name: 'Cookies', sort_order: 5 },
            { name: 'Bundles', sort_order: 6 }, // Moving Bundles up? No, keeping order
            { name: 'Desserts', sort_order: 7 }, // NEW
            { name: 'Healthy Lemonade & Milk', sort_order: 8 },
            { name: 'Cheesecake Frappe', sort_order: 9 },
            { name: 'Frappe', sort_order: 10 },
            { name: 'Espresso/Lattes (H/C)', sort_order: 11 },
            { name: 'Yogurt Frappe', sort_order: 12 },
            { name: 'Matcha Craze', sort_order: 13 }
        ];

        const { data: catData, error: catErr } = await supabase.from('categories').insert(categories).select();
        if (catErr) throw catErr;
        const catMap = Object.fromEntries(catData.map(c => [c.name, c.id]));

        const foodAddons = [
            { name: 'Extra Rice', price: 25 },
            { name: 'Fried Egg', price: 20 },
            { name: 'Cheesy Melt', price: 35 }
        ];

        const drinkAddons = [
            { name: 'Whip Cream', price: 20 },
            { name: 'Crushed Graham/Cookies', price: 20 },
            { name: 'Espresso Shot', price: 30 }
        ];

        const items = [
            // --- FOOD ---
            { category_id: catMap['Pasta Favorites'], name: "Frankie's Chicken Alfredo", description: '[FAV] Tender chicken pops toppings w/ al dente pasta in cream sauce. Served w/ bread.', price: 169, variations: [{ name: 'Solo', price: 169 }, { name: 'Platter', price: 499 }], image: '/menu/pasta-alfredo.png' },
            { category_id: catMap['Pasta Favorites'], name: 'Beefy Pan-Baked Macaroni', description: 'Pan-tossed elbow macaroni in beefy tomato sauce w/ melted cheese. Served w/ bread.', price: 169, variations: [{ name: 'Solo', price: 169 }, { name: 'Platter', price: 499 }], image: '/menu/pasta-macaroni.png' },
            { category_id: catMap['Pasta Favorites'], name: 'Chicken Tenders w/ fries', description: 'Crispy chicken tenders served with a side of fries.', price: 325, variations: [{ name: '6pcs', price: 325 }], image: '/menu/pasta-tenders.png' },
            
            { category_id: catMap['Snacks & Finger Foods'], name: 'Takoyaki', description: '[FAV] Authentic octopus balls.', price: 70, variations: [{ name: '4pcs', price: 70 }, { name: '10pcs', price: 130 }], flavors: [{ name: 'Classic', price: 0 }, { name: 'Cheese', price: 10 }, { name: 'Ham & Cheese', price: 15 }], image: '/menu/snacks-takoyaki.png' },
            { category_id: catMap['Snacks & Finger Foods'], name: 'Churro Bites', description: '[FAV] Crunchy churro bites with choice of dip.', price: 89, flavors: [{ name: 'Chocolate', price: 0 }, { name: 'Caramel', price: 20 }, { name: 'Nutella', price: 20 }, { name: 'Sweet Milk', price: 20 }], image: '/menu/snacks-churros.png' },
            { category_id: catMap['Snacks & Finger Foods'], name: 'Flavored Crispy Fries', description: 'Fries with your choice of flavor.', price: 89, variations: [{ name: 'Medium', price: 89 }, { name: 'Large', price: 115 }, { name: 'Overload', price: 115 }], flavors: ['Cheese / BBQ', 'Sour Cream'], image: '/menu/snacks-fries.png' },
            { category_id: catMap['Snacks & Finger Foods'], name: 'Corndog', description: '[FAV] Mozzarella filled corndog.', price: 105, flavors: [{ name: 'Mozza', price: 0 }, { name: 'Overload', price: 10 }], image: '/menu/snacks-corndog.png' },
            { category_id: catMap['Snacks & Finger Foods'], name: 'Beefy Nachos', description: '[FAV] Seasoned tacos with beef, cheese, & veggie toppings.', price: 139, image: '/menu/snacks-nachos.png' },
            
            { category_id: catMap['Plated Rice Meals'], name: 'Garlic Mushroom Pepper Beef', description: '[FAV][SHARING] Beef strips in black-pepper gravy.', price: 179, addons: foodAddons, image: '/menu/rice-beef.png' },
            { category_id: catMap['Plated Rice Meals'], name: 'Signature Chicken BBQ', description: '[FAV][SHARING] Glazed BBQ chicken served over rice.', price: 169, addons: foodAddons, image: '/menu/rice-bbq.png' },
            { category_id: catMap['Plated Rice Meals'], name: 'Spiced Pork Adobo w/ Egg', description: '[FAV][SHARING] Slow-simmered pork adobo.', price: 169, addons: foodAddons, image: '/menu/rice-adobo.png' },
            { category_id: catMap['Plated Rice Meals'], name: 'Chicken Nugget Parmigiano', description: '[SHARING] Chicken nuggets with tomato and beef sauce.', price: 169, addons: foodAddons, image: '/menu/rice-nuggets.png' },
            { category_id: catMap['Plated Rice Meals'], name: 'Bicol Express', description: '[SHARING] Savory pork in coconut sauce.', price: 169, addons: foodAddons, image: '/menu/rice-bicol.png' },
            { category_id: catMap['Plated Rice Meals'], name: 'Chicken Katsu', description: '[FAV][SHARING] Crispy chicken cutlet with katsu sauce.', price: 169, addons: foodAddons, image: '/menu/rice-katsu.png' },
            { category_id: catMap['Plated Rice Meals'], name: '2pc Chicken Tenders w/ Side', description: '[FAV][SHARING] Crispy chicken tenders with side.', price: 169, addons: foodAddons, image: '/menu/rice-tenders.png' },
            
            { category_id: catMap['Sandwiches & Quesadillas'], name: 'Quesadilla', description: '[FAV][SHARING] Cheesy grilled tortilla.', price: 189, flavors: [{ name: 'Chicken', price: 0 }, { name: 'Beef', price: 30 }], image: '/menu/sandwiches-quesadilla.png' },
            { category_id: catMap['Sandwiches & Quesadillas'], name: "Frankie's Chicken Burger", description: '[FAV][SHARING] Juicy chicken fillet in a soft bun.', price: 169, image: '/menu/sandwiches-burger.png' },
            { category_id: catMap['Sandwiches & Quesadillas'], name: 'Ham & Egg Double Decker', description: '[FAV][SHARING] Ham and egg grilled toast.', price: 169, image: '/menu/sandwiches-double.png' },
            { category_id: catMap['Sandwiches & Quesadillas'], name: 'Honey Grilled Cheese', description: '[SHARING] Sweet and savory melted cheese sandwich.', price: 139, image: '/menu/sandwiches-cheese.png' },
            
            { category_id: catMap['Cookies'], name: 'Choco Crinkles', description: 'Soft and fudgy chocolate crinkles.', price: 50, image: '/menu/cookies-crinkles.png' },
            { category_id: catMap['Cookies'], name: 'Choco Chip', description: 'Classic chocolate chip cookies.', price: 55, image: '/menu/cookies-chip.png' },
            { category_id: catMap['Cookies'], name: "S'mores", description: "Marshmallow and chocolate cookies.", price: 55, image: '/menu/cookies-smores.png' },

            // --- BUNDLES (ENHANCED) ---
            {
                category_id: catMap['Bundles'],
                name: 'Quick Bites Bundle',
                description: '[FAV] Choose 1 Light Snack + 1 Drink/Side. Step 1: Main | Step 2: Side/Drink. Save 30!',
                price: 189,
                allow_multiple: true,
                flavors: [
                    { name: 'Step 1: 10pc Classic Takoyaki', price: 0 },
                    { name: 'Step 1: 10pc Cheese Takoyaki', price: 20 },
                    { name: 'Step 1: Honey Grilled Cheese', price: 0 },
                    { name: 'Step 1: Ham & Cheese Sandwich', price: 0 },
                    { name: 'Step 1: Egg Sandwich', price: 0 },
                    { name: 'Step 2: Fresh Lemonade (Large)', price: 0 },
                    { name: 'Step 2: Strawberry Milk (Large)', price: 20 },
                    { name: 'Step 2: Churros', price: 0 },
                    { name: 'Step 2: Solo Fries', price: 0 },
                    { name: 'Drink Upgrade: Any Frappe (16oz)', price: 55 },
                    { name: 'Drink Upgrade: Any Frappe (22oz)', price: 75 }
                ],
                image: '/menu/bundles-quick.png'
            },
            {
                category_id: catMap['Bundles'],
                name: 'Full Meals Bundle',
                description: '[FAV] Choose 1 Signature Main + 1 Drink/Side. Save 20!',
                price: 229,
                allow_multiple: true,
                flavors: [
                    { name: 'Step 1: Chicken Alfredo', price: 0 },
                    { name: 'Step 1: Beefy Macaroni', price: 0 },
                    { name: 'Step 1: Double Decker', price: 0 },
                    { name: 'Step 1: Chicken Burger', price: 0 },
                    { name: 'Step 1: Signature Chicken BBQ', price: 0 },
                    { name: 'Step 1: Bicol Express', price: 0 },
                    { name: 'Step 1: Chicken Parmigiano', price: 0 },
                    { name: 'Step 2: Churro Bites', price: 0 },
                    { name: 'Step 2: Crispy Fries (Solo)', price: 0 },
                    { name: 'Step 2: Fresh Lemonade (Large)', price: 0 },
                    { name: 'Step 2: Strawberry Milk (Large)', price: 20 },
                    { name: 'Step 2: Coffee Jelly', price: 0 },
                    { name: 'Step 2: Buko Pandan', price: 0 },
                    { name: 'Drink Upgrade: Any Frappe (16oz)', price: 55 },
                    { name: 'Drink Upgrade: Any Frappe (22oz)', price: 75 }
                ],
                image: '/menu/bundles-full.png'
            },
            {
                category_id: catMap['Bundles'],
                name: 'Duo Meals Bundle',
                description: '[FAV][SHARING] 2 Signature Mains + 2 Drinks + 1 Side. Save 100+!',
                price: 459,
                allow_multiple: true,
                flavors: [
                    { name: 'Step 1 (Main #1): Chicken Alfredo', price: 0 },
                    { name: 'Step 1 (Main #1): Beefy Macaroni', price: 0 },
                    { name: 'Step 1 (Main #1): Double Decker', price: 0 },
                    { name: 'Step 1 (Main #1): Chicken Burger', price: 0 },
                    { name: 'Step 1 (Main #1): Sign. Chicken BBQ', price: 0 },
                    { name: 'Step 1 (Main #2): Chicken Alfredo', price: 0 },
                    { name: 'Step 1 (Main #2): Beefy Macaroni', price: 0 },
                    { name: 'Step 1 (Main #2): Double Decker', price: 0 },
                    { name: 'Step 1 (Main #2): Chicken Burger', price: 0 },
                    { name: 'Step 1 (Main #2): Sign. Chicken BBQ', price: 0 },
                    { name: 'Step 2 (Drink #1): Fresh Lemonade', price: 0 },
                    { name: 'Step 2 (Drink #1): Strawberry Milk', price: 20 },
                    { name: 'Step 2 (Drink #2): Fresh Lemonade', price: 0 },
                    { name: 'Step 2 (Drink #2): Strawberry Milk', price: 20 },
                    { name: 'Step 3: Churro Bites', price: 0 },
                    { name: 'Step 3: Crispy Fries (Solo)', price: 0 },
                    { name: 'Step 3: Coffee Jelly', price: 0 },
                    { name: 'Step 3: Buko Pandan', price: 0 }
                ],
                image: '/menu/bundles-duo.png'
            },

            // --- DESSERTS ---
            { category_id: catMap['Desserts'], name: 'Coffee Jelly', description: 'Creamy cold dessert with coffee gelatin cubes.', price: 65, image: '/menu/dessert-coffee.png' },
            { category_id: catMap['Desserts'], name: 'Buko Pandan', description: 'Traditional Filipino dessert with young coconut and pandan.', price: 65, image: '/menu/dessert-buko.png' },

            // --- DRINKS ---
            { category_id: catMap['Healthy Lemonade & Milk'], name: 'Lemonades', description: 'Kiwi, SB, BB, Lychee flavors.', price: 80, flavors: ['Classic', 'Kiwi', 'Strawberry', 'Blueberry', 'Lychee'], image: '/menu/bev-lemonade.png' },
            { category_id: catMap['Healthy Lemonade & Milk'], name: 'Black Tea Lemonade', description: 'Refreshing tea lemon blend.', price: 80, image: '/menu/bev-tea.png' },
            { category_id: catMap['Healthy Lemonade & Milk'], name: 'Strawberry Milk', description: 'Creamy strawberry milk.', price: 115, variations: [{ name: '16oz', price: 115 }, { name: '22oz', price: 125 }], image: '/menu/bev-strawberry.png' },
            
            { category_id: catMap['Cheesecake Frappe'], name: 'Blueberry Cheesecake', description: '[FAV] Cheesecake frappe with blueberry.', price: 135, variations: [{ name: '16oz', price: 135 }, { name: '22oz', price: 150 }], addons: drinkAddons, image: '/menu/bev-cheesecake.png' },
            { category_id: catMap['Cheesecake Frappe'], name: 'Strawberry Cheesecake', description: '[FAV] Cheesecake frappe with strawberry.', price: 135, variations: [{ name: '16oz', price: 135 }, { name: '22oz', price: 150 }], addons: drinkAddons, image: '/menu/bev-cheesecake.png' },
            { category_id: catMap['Cheesecake Frappe'], name: 'Oreo Cheesecake', description: '[FAV] Cheesecake frappe with Oreo.', price: 145, variations: [{ name: '16oz', price: 145 }, { name: '22oz', price: 160 }], addons: drinkAddons, image: '/menu/bev-cheesecake.png' },
            { category_id: catMap['Cheesecake Frappe'], name: 'Biscoff Cheesecake', description: '[FAV] Cheesecake frappe with Biscoff.', price: 155, variations: [{ name: '16oz', price: 155 }, { name: '22oz', price: 165 }], addons: drinkAddons, image: '/menu/bev-cheesecake.png' },
            
            { category_id: catMap['Frappe'], name: 'Dark Chocolate Frappe', description: '[FAV] Rich chocolate blend.', price: 105, variations: [{ name: '16oz', price: 105 }, { name: '22oz', price: 125 }], addons: drinkAddons, image: '/menu/bev-frappe.png' },
            { category_id: catMap['Frappe'], name: 'Blueberries \'n Cream', description: '[FAV] Berry cream blend.', price: 105, variations: [{ name: '16oz', price: 105 }, { name: '22oz', price: 125 }], addons: drinkAddons, image: '/menu/bev-cream.png' },
            { category_id: catMap['Frappe'], name: 'Strawberries \'n Cream', description: '[FAV] Strawberry cream blend.', price: 115, variations: [{ name: '16oz', price: 115 }, { name: '22oz', price: 135 }], addons: drinkAddons, image: '/menu/bev-cream.png' },
            { category_id: catMap['Frappe'], name: 'Biscoff/Nutella Cream', description: '[FAV] Choice of Biscoff or Nutella Cream.', price: 145, variations: [{ name: '16oz', price: 145 }, { name: '22oz', price: 155 }], flavors: ['Biscoff', 'Nutella'], addons: drinkAddons, image: '/menu/bev-cream.png' },
            { category_id: catMap['Frappe'], name: 'Biscoff/Nutella Coffee', description: '[FAV] Choice of Biscoff or Nutella Coffee.', price: 155, variations: [{ name: '16oz', price: 155 }, { name: '22oz', price: 165 }], flavors: ['Biscoff', 'Nutella'], addons: drinkAddons, image: '/menu/bev-frappe.png' },
            { category_id: catMap['Frappe'], name: 'Other Frappes', description: 'Dark Mocha, Java Chip, Triple Mocha.', price: 130, variations: [{ name: '16oz', price: 130 }, { name: '22oz', price: 145 }], flavors: ['Dark Mocha', 'Java Chip', 'Triple Mocha'], addons: drinkAddons, image: '/menu/bev-frappe.png' },
            
            { category_id: catMap['Espresso/Lattes (H/C)'], name: 'Hot Choco', description: '[FAV] Warm chocolate (12oz).', price: 100, image: '/menu/bev-hot.png' },
            { category_id: catMap['Espresso/Lattes (H/C)'], name: 'Coffee Favorites', description: '[FAV] Americano, Latte, Spanish, Macchiato (22oz).', price: 85, flavors: [{ name: 'Americano', price: 0 }, { name: 'Cafe Latte', price: 35 }, { name: 'Spanish Latte', price: 45 }, { name: 'Caramel Macchiato', price: 55 }], image: '/menu/bev-espresso.png' },
            
            { category_id: catMap['Yogurt Frappe'], name: 'Yogurt Frappe', description: 'Tangy yogurt base colors.', price: 125, variations: [{ name: '16oz', price: 125 }, { name: '22oz', price: 140 }], flavors: ['Kiwi', 'Mixed Berries', 'Blueberry', 'Strawberry'], addons: drinkAddons, image: '/menu/bev-yogurt.png' },
            
            { category_id: catMap['Matcha Craze'], name: 'Matcha Selections', description: 'Premium matcha blends.', price: 135, variations: [{ name: '16oz', price: 135 }, { name: '22oz', price: 150 }], flavors: [{ name: 'Matcha Latte', price: 0 }, { name: 'Matcha Strawberry', price: 5 }, { name: 'Matcha Cream Cheese', price: 10 }], addons: drinkAddons, image: '/menu/bev-matcha.png' }
        ];

        console.log(`Inserting ${items.length} items...`);
        const { error: itemErr } = await supabase.from('menu_items').insert(items);
        if (itemErr) throw itemErr;

        console.log('Menu v9 (Full Bundles) Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seed();
