
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.trim().startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Expanded Frankie\'s Cloud Kitchen Menu...');

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

        const commonAddons = [
            { name: 'Extra Rice', price: 25 },
            { name: 'Fried Egg', price: 20 },
            { name: 'Cheesy Melt', price: 35 }
        ];

        // 2. Menu Items
        const items = [
            // Duo Meals (Promo)
            {
                category_id: catMap['Duo Meals'],
                name: 'Duo Meals (Promo)',
                description: '2 Signature Main + 2 Large Drinks + 1 Side Dish. Save 100+!',
                price: 459,
                image: '/menu/bundle-duo.png'
            },

            // Full Meals (Promo)
            {
                category_id: catMap['Full Meals'],
                name: 'Full Meals (Promo)',
                description: '1 Signature Main + 1 Drink/Side/Dessert. Save 20!',
                price: 229,
                image: '/menu/bundle-full.png'
            },

            // Quick Bites (Promo)
            {
                category_id: catMap['Quick Bites'],
                name: 'Quick Bites (Promo)',
                description: '1 Light Snack + 1 Drink/Side. Save 30!',
                price: 189,
                image: '/menu/bundle-quick.png'
            },

            // YOUR CLOUD MENU (FOOD)
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Frankie\'s Chicken Alfredo',
                description: 'Tender chicken pops toppings w/ al dente pasta in cream sauce, finished with herbs. Served w/ bread.',
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
                description: 'Pan-tossed elbow macaroni in beefy & meaty tomato sauce w/ melted cheese. Served w/ bread.',
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
                name: 'Chicken Tenders w/ fries (6pcs)',
                description: '6pcs crispy chicken tenders served with a side of crispy fries.',
                price: 325,
                addons: [{ name: 'Extra Dip', price: 20 }],
                image: '/menu/pasta-tenders.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Takoyaki',
                description: 'Authentic Japanese-style takoyaki balls with choices of fillings.',
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
                name: 'Churro Bites',
                description: 'Bite-sized crispy churros with your choice of premium dip.',
                price: 89,
                flavors: ['Chocolate', 'Caramel', 'Nutella', 'Sweet Milk'],
                image: '/menu/snacks-churros.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Flavored Crispy Fries',
                description: 'Gourmet flavored fries. Choose your size and flavor.',
                price: 89,
                variations: [
                    { name: 'Medium', price: 89 },
                    { name: 'Large', price: 115 }
                ],
                flavors: ['Cheese', 'BBQ', 'Sour Cream', 'Overload'],
                image: '/menu/snacks-fries.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Gourmet Corndog',
                description: 'Cheesy, crispy corndog available in Mozza or Overload options.',
                price: 105,
                variations: [
                    { name: 'Mozza', price: 105 },
                    { name: 'Overload', price: 115 }
                ],
                image: '/menu/snacks-corndog.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Beefy Nachos',
                description: 'Crispy corn chips topped with seasoned beef, cheese, and salsa.',
                price: 139,
                addons: [{ name: 'Extra Cheese Sauce', price: 20 }],
                image: '/menu/snacks-nachos.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Garlic Mushroom Pepper Beef',
                description: 'Tender beef strips in garlicky black-pepper gravy. Served with rice.',
                price: 179,
                addons: commonAddons,
                image: '/menu/rice-beef.png'
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
                name: 'Spiced Pork Adobo w/ Egg',
                description: 'Classic Filipino pork adobo, slow-simmered in soy and vinegar. Served with rice and egg.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-adobo.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Chicken Nugget Parmigiano',
                description: 'Crispy chicken nuggets topped with parmigiano cheese. Served with rice.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-meals.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Bicol Express',
                description: 'Spicy Filipino stew made from long chilies, coconut milk, shrimp paste, and pork.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-meals.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Chicken Katsu',
                description: 'Breaded, deep-fried chicken cutlet served with katsu sauce and rice.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-meals.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: '2pc Chicken Tenders w/ Side',
                description: 'Two pieces of crispy chicken tenders with your choice of side and rice.',
                price: 169,
                addons: commonAddons,
                image: '/menu/rice-meals.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Gourmet Quesadilla',
                description: 'Grilled tortilla filled with melted cheese and your choice of protein.',
                price: 189,
                variations: [
                    { name: 'Chicken', price: 189 },
                    { name: 'Beef', price: 219 }
                ],
                image: '/menu/sand-quesadilla.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Frankie\'s Chicken Burger',
                description: 'Signature crispy chicken patty with fresh lettuce and special sauce.',
                price: 169,
                image: '/menu/sandwiches.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Ham & Egg Double Decker',
                description: 'Double decker sandwich with ham, egg, and cheese.',
                price: 169,
                image: '/menu/sandwiches.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Honey Grilled Cheese',
                description: 'Sweet and savory grilled cheese sandwich with a touch of honey.',
                price: 139,
                image: '/menu/sandwiches.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Choco Crinkles',
                description: 'Soft, fudgy cookies coated in powdered sugar.',
                price: 50,
                image: '/menu/cookies.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'Choco Chip Cookie',
                description: 'Classic chewy cookie loaded with chocolate chips.',
                price: 50,
                image: '/menu/cookies.png'
            },
            {
                category_id: catMap['Your Cloud Menu'],
                name: 'S\'mores Cookie',
                description: 'Cookie with marshmallow, chocolate, and graham cracker bits.',
                price: 55,
                image: '/menu/cookies.png'
            },

            // OUR CLOUD MENU (BEVERAGES)
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
                name: 'Premium Strawberry Milk',
                description: 'Real strawberry bits in fresh, creamy milk.',
                price: 115,
                variations: [
                    { name: '16oz', price: 115 },
                    { name: '22oz', price: 125 }
                ],
                image: '/menu/bev-lemonade.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Cheesecake Frappe Series',
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
                name: 'Gourmet Frappe Series',
                description: 'Luxurious blended drinks for chocolate and fruit lovers.',
                price: 105,
                variations: [
                    { name: '16oz', price: 105 },
                    { name: '22oz', price: 125 }
                ],
                flavors: [
                    'Dark Chocolate', 
                    'Blueberries \'n Cream', 
                    'Strawberries \'n Cream',
                    'Biscoff Cream',
                    'Nutella Cream',
                    'Dark Mocha',
                    'Java Chip',
                    'Triple Mocha'
                ],
                image: '/menu/bev-frappe.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Energy Coffee Frappe',
                description: 'Blended coffee with premium biscoff or nutella flavors.',
                price: 155,
                variations: [
                    { name: '16oz', price: 155 },
                    { name: '22oz', price: 165 }
                ],
                flavors: ['Biscoff Coffee', 'Nutella Coffee'],
                image: '/menu/bev-frappe.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Matcha Latte Craze',
                description: 'Premium Japanese matcha whisked with fresh milk.',
                price: 135,
                variations: [
                    { name: '16oz', price: 135 },
                    { name: '22oz', price: 150 }
                ],
                image: '/menu/bev-matcha.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Matcha Specialty',
                description: 'Enhanced matcha with strawberries or chocolate.',
                price: 140,
                variations: [
                    { name: '16oz', price: 140 },
                    { name: '22oz', price: 160 }
                ],
                image: '/menu/bev-matcha.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Fruity Yogurt Frappe',
                description: 'Creamy and tangy yogurt blended with fruit flavors.',
                price: 125,
                variations: [
                    { name: '16oz', price: 125 },
                    { name: '22oz', price: 140 }
                ],
                flavors: ['Strawberry', 'Blueberry', 'Mango', 'Lychee'],
                image: '/menu/bev-matcha.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Americano',
                description: 'Double shot of our signature espresso with hot or cold water.',
                price: 85,
                image: '/menu/bev-espresso.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Cafe Latte',
                description: 'Espresso mixed with steamed milk and a light layer of foam.',
                price: 120,
                image: '/menu/bev-espresso.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Spanish Latte',
                description: 'Sweetened latte made with condensed milk and creamy espresso.',
                price: 130,
                image: '/menu/bev-espresso.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Caramel Macchiato',
                description: 'Vanilla-flavored milk with espresso and topped with caramel drizzle.',
                price: 140,
                image: '/menu/bev-espresso.png'
            },
            {
                category_id: catMap['Our Cloud Menu'],
                name: 'Premium Hot Choco',
                description: 'Rich, thick, and velvety chocolate (12oz).',
                price: 100,
                image: '/menu/bev-espresso.png'
            }
        ];

        console.log('Inserting expanded menu items...');
        const { error: itemErr } = await supabase.from('menu_items').insert(items);
        if (itemErr) throw itemErr;

        console.log('Expansion Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

seed();
