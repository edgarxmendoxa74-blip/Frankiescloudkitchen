
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Frankie\'s Cloud Kitchen Menu v8 (Combined Menu)...');

    try {
        console.log('Clearing existing categories and items...');
        await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // Categories from BOTH images
        const categories = [
            // Image 1 Categories
            { name: 'Pasta Favorites', sort_order: 1 },
            { name: 'Snacks & Finger Foods', sort_order: 2 },
            { name: 'Plated Rice Meals', sort_order: 3 },
            { name: 'Sandwiches & Quesadillas', sort_order: 4 },
            { name: 'Cookies', sort_order: 5 },
            { name: 'Bundles', sort_order: 6 },
            // Image 2 Categories (Drinks)
            { name: 'Healthy Lemonade & Milk', sort_order: 7 },
            { name: 'Cheesecake Frappe', sort_order: 8 },
            { name: 'Frappe', sort_order: 9 },
            { name: 'Espresso/Lattes (H/C)', sort_order: 10 },
            { name: 'Yogurt Frappe', sort_order: 11 },
            { name: 'Matcha Craze', sort_order: 12 }
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
            // --- IMAGE 1 ITEMS ---
            {
                category_id: catMap['Pasta Favorites'],
                name: "Frankie's Chicken Alfredo",
                description: '[FAV] Tender chicken pops toppings w/ al dente pasta in cream sauce, finished with herbs. Served w/ bread.',
                price: 169,
                variations: [{ name: 'Solo', price: 169 }, { name: 'Platter', price: 499 }],
                image: '/menu/pasta-alfredo.png',
                sort_order: 1
            },
            {
                category_id: catMap['Pasta Favorites'],
                name: 'Beefy Pan-Baked Macaroni',
                description: 'Pan-tossed elbow macaroni pasta in beefy & meaty tomato sauce w/ melted cheese sauce. Served w/ bread.',
                price: 169,
                variations: [{ name: 'Solo', price: 169 }, { name: 'Platter', price: 499 }],
                image: '/menu/pasta-macaroni.png',
                sort_order: 2
            },
            {
                category_id: catMap['Pasta Favorites'],
                name: 'Chicken Tenders w/ fries',
                description: 'Crispy chicken tenders served with a side of fries.',
                price: 325,
                variations: [{ name: '6pcs', price: 325 }],
                image: '/menu/pasta-tenders.png',
                sort_order: 3
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Takoyaki',
                description: '[FAV] Authentic octopus balls with various toppings.',
                price: 70,
                variations: [{ name: '4pcs', price: 70 }, { name: '10pcs', price: 130 }],
                flavors: [{ name: 'Classic', price: 0 }, { name: 'Cheese', price: 10 }, { name: 'Ham & Cheese', price: 15 }],
                image: '/menu/snacks-takoyaki.png',
                sort_order: 1
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Churro Bites',
                description: '[FAV] Bite-sized crispy churros with choice of dip.',
                price: 89,
                flavors: [{ name: 'Chocolate', price: 0 }, { name: 'Caramel', price: 20 }, { name: 'Nutella', price: 20 }, { name: 'Sweet Milk', price: 20 }],
                image: '/menu/snacks-churros.png',
                sort_order: 2
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Flavored Crispy Fries',
                description: 'Golden crispy fries with your choice of flavor.',
                price: 89,
                variations: [{ name: 'Medium', price: 89 }, { name: 'Large', price: 115 }, { name: 'Overload', price: 115 }],
                flavors: ['Cheese / BBQ', 'Sour Cream'],
                image: '/menu/snacks-fries.png',
                sort_order: 3
            },
            {
                category_id: catMap['Snacks & Finger Foods'],
                name: 'Corndog',
                description: '[FAV] Crispy corndog with mozzarella or overload options.',
                price: 105,
                flavors: [{ name: 'Mozza', price: 0 }, { name: 'Overload', price: 10 }],
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
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Garlic Mushroom Pepper Beef',
                description: '[FAV][SHARING] Tender beef strips in garlicky black-pepper gravy with onions — perfect over rice.',
                price: 179,
                addons: foodAddons,
                image: '/menu/rice-beef.png',
                sort_order: 1
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Signature Chicken BBQ',
                description: '[FAV][SHARING] Tender BBQ chicken glazed in a rich sauce, served over rice fried in the same savory-sweet marinade.',
                price: 169,
                addons: foodAddons,
                image: '/menu/rice-bbq.png',
                sort_order: 2
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Spiced Pork Adobo w/ Egg',
                description: '[FAV][SHARING] The Filipino classic: slow-simmered in soy, vinegar, and garlic, turned up with a chili kick.',
                price: 169,
                addons: foodAddons,
                image: '/menu/rice-adobo.png',
                sort_order: 3
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Chicken Nugget Parmigiano',
                description: '[SHARING] Crispy chicken nuggets topped with tomato and beef sauce and melted cheese.',
                price: 169,
                addons: foodAddons,
                image: '/menu/rice-nuggets.png',
                sort_order: 4
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Bicol Express',
                description: '[SHARING] Tender savory pork simmered in coconut sauce with a spicy kick you\'ll love.',
                price: 169,
                addons: foodAddons,
                image: '/menu/rice-bicol.png',
                sort_order: 5
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: 'Chicken Katsu',
                description: '[FAV][SHARING] Panko-crusted chicken cutlet, crisp outside and juicy inside, served with rice, coleslaw and tonkatsu sauce.',
                price: 169,
                addons: foodAddons,
                image: '/menu/rice-katsu.png',
                sort_order: 6
            },
            {
                category_id: catMap['Plated Rice Meals'],
                name: '2pc Chicken Tenders w/ Side',
                description: '[FAV][SHARING] Crispy chicken tenders with a side of corn, white rice, and choice dip (mayo/ketchup).',
                price: 169,
                addons: foodAddons,
                image: '/menu/rice-tenders.png',
                sort_order: 7
            },
            {
                category_id: catMap['Sandwiches & Quesadillas'],
                name: 'Quesadilla',
                description: '[FAV][SHARING] Grilled tortilla filled with savory beef/chicken and melted cheese.',
                price: 189,
                flavors: [{ name: 'Chicken', price: 0 }, { name: 'Beef', price: 30 }],
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

            // --- IMAGE 2 ITEMS (DRINKS) ---
            {
                category_id: catMap['Healthy Lemonade & Milk'],
                name: 'Lemonades',
                description: 'Freshly squeezed lemonade flavors: Kiwi, SB, BB, Lychee.',
                price: 80,
                flavors: ['Kiwi', 'Strawberry', 'Blueberry', 'Lychee'],
                image: '/menu/bev-lemonade.png',
                sort_order: 1
            },
            {
                category_id: catMap['Healthy Lemonade & Milk'],
                name: 'Black Tea Lemonade',
                description: 'Refreshing black tea with a twist of lemon.',
                price: 80,
                image: '/menu/bev-tea.png',
                sort_order: 2
            },
            {
                category_id: catMap['Healthy Lemonade & Milk'],
                name: 'Strawberry Milk',
                description: 'Creamy strawberry infused milk.',
                price: 115,
                variations: [{ name: '16oz', price: 115 }, { name: '22oz', price: 125 }],
                image: '/menu/bev-strawberry.png',
                sort_order: 3
            },
            {
                category_id: catMap['Cheesecake Frappe'],
                name: 'Blueberry Cheesecake',
                description: '[FAV] Cheesecake frappe with blueberry swirl.',
                price: 135,
                variations: [{ name: '16oz', price: 135 }, { name: '22oz', price: 150 }],
                addons: drinkAddons,
                image: '/menu/bev-cheesecake.png',
                sort_order: 1
            },
            {
                category_id: catMap['Cheesecake Frappe'],
                name: 'Strawberry Cheesecake',
                description: '[FAV] Cheesecake frappe with strawberry swirl.',
                price: 135,
                variations: [{ name: '16oz', price: 135 }, { name: '22oz', price: 150 }],
                addons: drinkAddons,
                image: '/menu/bev-cheesecake.png',
                sort_order: 2
            },
            {
                category_id: catMap['Cheesecake Frappe'],
                name: 'Oreo Cheesecake',
                description: '[FAV] Cheesecake frappe with crushed Oreos.',
                price: 145,
                variations: [{ name: '16oz', price: 145 }, { name: '22oz', price: 160 }],
                addons: drinkAddons,
                image: '/menu/bev-cheesecake.png',
                sort_order: 3
            },
            {
                category_id: catMap['Cheesecake Frappe'],
                name: 'Biscoff Cheesecake',
                description: '[FAV] Cheesecake frappe with Biscoff cookies.',
                price: 155,
                variations: [{ name: '16oz', price: 155 }, { name: '22oz', price: 165 }],
                addons: drinkAddons,
                image: '/menu/bev-cheesecake.png',
                sort_order: 4
            },
            {
                category_id: catMap['Frappe'],
                name: 'Dark Chocolate Frappe',
                description: '[FAV] Rich dark chocolate blended ice.',
                price: 105,
                variations: [{ name: '16oz', price: 105 }, { name: '22oz', price: 125 }],
                addons: drinkAddons,
                image: '/menu/bev-frappe.png',
                sort_order: 1
            },
            {
                category_id: catMap['Frappe'],
                name: 'Blueberries \'n Cream',
                description: '[FAV] Blended blueberry with creamy finish.',
                price: 105,
                variations: [{ name: '16oz', price: 105 }, { name: '22oz', price: 125 }],
                addons: drinkAddons,
                image: '/menu/bev-cream.png',
                sort_order: 2
            },
            {
                category_id: catMap['Frappe'],
                name: 'Strawberries \'n Cream',
                description: '[FAV] Blended strawberry with creamy finish.',
                price: 115,
                variations: [{ name: '16oz', price: 115 }, { name: '22oz', price: 135 }],
                addons: drinkAddons,
                image: '/menu/bev-cream.png',
                sort_order: 3
            },
            {
                category_id: catMap['Frappe'],
                name: 'Biscoff or Nutella Cream',
                description: '[FAV] Choice of Biscoff or Nutella in a creamy base.',
                price: 145,
                variations: [{ name: '16oz', price: 145 }, { name: '22oz', price: 155 }],
                flavors: ['Biscoff', 'Nutella'],
                addons: drinkAddons,
                image: '/menu/bev-cream.png',
                sort_order: 4
            },
            {
                category_id: catMap['Frappe'],
                name: 'Biscoff or Nutella Coffee',
                description: '[FAV] Choice of Biscoff or Nutella with coffee base.',
                price: 155,
                variations: [{ name: '16oz', price: 155 }, { name: '22oz', price: 165 }],
                flavors: ['Biscoff', 'Nutella'],
                addons: drinkAddons,
                image: '/menu/bev-frappe.png',
                sort_order: 5
            },
            {
                category_id: catMap['Frappe'],
                name: 'Dark Mocha',
                description: 'Rich dark mocha frappe.',
                price: 130,
                variations: [{ name: '16oz', price: 130 }, { name: '22oz', price: 145 }],
                addons: drinkAddons,
                image: '/menu/bev-frappe.png',
                sort_order: 6
            },
            {
                category_id: catMap['Frappe'],
                name: 'Java Chip',
                description: 'Coffee frappe with chocolate chips.',
                price: 130,
                variations: [{ name: '16oz', price: 130 }, { name: '22oz', price: 145 }],
                addons: drinkAddons,
                image: '/menu/bev-frappe.png',
                sort_order: 7
            },
            {
                category_id: catMap['Frappe'],
                name: 'Triple Mocha',
                description: 'Extra rich mocha experience.',
                price: 145,
                variations: [{ name: '16oz', price: 145 }, { name: '22oz', price: 160 }],
                addons: drinkAddons,
                image: '/menu/bev-frappe.png',
                sort_order: 8
            },
            {
                category_id: catMap['Espresso/Lattes (H/C)'],
                name: 'Hot Choco',
                description: '[FAV] Warm and cozy chocolate (12oz).',
                price: 100,
                image: '/menu/bev-hot.png',
                sort_order: 1
            },
            {
                category_id: catMap['Espresso/Lattes (H/C)'],
                name: 'Americano',
                description: '[FAV] Classic espresso with hot water (22oz).',
                price: 85,
                image: '/menu/bev-espresso.png',
                sort_order: 2
            },
            {
                category_id: catMap['Espresso/Lattes (H/C)'],
                name: 'Cafe Latte',
                description: '[FAV] Espresso with steamed milk (22oz).',
                price: 120,
                image: '/menu/bev-espresso.png',
                sort_order: 3
            },
            {
                category_id: catMap['Espresso/Lattes (H/C)'],
                name: 'Spanish Latte',
                description: '[FAV] Sweet and creamy signature latte (22oz).',
                price: 130,
                image: '/menu/bev-espresso.png',
                sort_order: 4
            },
            {
                category_id: catMap['Espresso/Lattes (H/C)'],
                name: 'Caramel Macchiato',
                description: '[FAV] Espresso with vanilla and caramel (22oz).',
                price: 140,
                image: '/menu/bev-espresso.png',
                sort_order: 5
            },
            {
                category_id: catMap['Yogurt Frappe'],
                name: 'Yogurt Frappe',
                description: 'Tangy and refreshing yogurt base.',
                price: 125,
                variations: [{ name: '16oz', price: 125 }, { name: '22oz', price: 140 }],
                flavors: ['Kiwi', 'Mixed Berries', 'Blueberry', 'Strawberry'],
                addons: drinkAddons,
                image: '/menu/bev-yogurt.png',
                sort_order: 1
            },
            {
                category_id: catMap['Matcha Craze'],
                name: 'Matcha Latte',
                description: 'Premium matcha with milk.',
                price: 135,
                variations: [{ name: '16oz', price: 135 }, { name: '22oz', price: 150 }],
                addons: drinkAddons,
                image: '/menu/bev-matcha.png',
                sort_order: 1
            },
            {
                category_id: catMap['Matcha Craze'],
                name: 'Matcha Strawberry',
                description: 'Matcha latte with strawberry layer.',
                price: 140,
                variations: [{ name: '16oz', price: 140 }, { name: '22oz', price: 155 }],
                addons: drinkAddons,
                image: '/menu/bev-matcha.png',
                sort_order: 2
            },
            {
                category_id: catMap['Matcha Craze'],
                name: 'Matcha Cream Cheese',
                description: 'Matcha latte with savory cream cheese top.',
                price: 140,
                variations: [{ name: '16oz', price: 140 }, { name: '22oz', price: 160 }],
                addons: drinkAddons,
                image: '/menu/bev-matcha.png',
                sort_order: 3
            }
        ];

        console.log(`Inserting ${items.length} menu items...`);
        const { error: itemErr } = await supabase.from('menu_items').insert(items);
        if (itemErr) throw itemErr;

        console.log('Menu v8 (Combined) Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seed();
