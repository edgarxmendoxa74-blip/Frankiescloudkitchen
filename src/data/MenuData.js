
export const categories = [
    { id: 'duo-meals', name: 'Duo Meals', sort_order: 1 },
    { id: 'full-meals', name: 'Full Meals', sort_order: 2 },
    { id: 'quick-bites', name: 'Quick Bites', sort_order: 3 },
    { id: 'your-cloud-menu', name: 'Your Cloud Menu', sort_order: 4 },
    { id: 'our-cloud-menu', name: 'Our Cloud Menu', sort_order: 5 },
];

export const menuItems = [
    // BUNDLES
    {
        id: 'duo-meals-promo',
        category_id: 'duo-meals',
        name: 'Duo Meals (Promo)',
        description: 'SAVE 100+! 2 Signature Main + 2 Drinks + 1 Side.',
        price: 459,
        image: '/menu/bundle-duo.png',
        sort_order: 1
    },
    {
        id: 'full-meals-promo',
        category_id: 'full-meals',
        name: 'Full Meals (Promo)',
        description: 'SAVE 20! 1 Signature Main + 1 Drink/Side/Dessert.',
        price: 229,
        image: '/menu/bundle-full.png',
        sort_order: 1
    },
    {
        id: 'quick-bites-promo',
        category_id: 'quick-bites',
        name: 'Quick Bites (Promo)',
        description: 'SAVE 30! 1 Light Snack + 1 Drink/Side.',
        price: 189,
        image: '/menu/bundle-quick.png',
        sort_order: 1
    },

    // YOUR CLOUD MENU (Sample Individual Items)
    {
        id: 'pasta-alfredo',
        category_id: 'your-cloud-menu',
        name: "Frankie's Chicken Alfredo",
        description: 'Tender chicken pops toppings w/ al dente pasta in cream sauce. Served w/ bread.',
        price: 169,
        variations: [
            { name: 'Solo', price: 169 },
            { name: 'Platter', price: 499 }
        ],
        image: '/menu/pasta-alfredo.png',
        sort_order: 10
    },
    {
        id: 'takoyaki-classic',
        category_id: 'your-cloud-menu',
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
        image: '/menu/snacks-takoyaki.png',
        sort_order: 20
    },
    {
        id: 'signature-bbq',
        category_id: 'your-cloud-menu',
        name: 'Signature Chicken BBQ',
        description: 'Tender BBQ chicken glazed in rich, savory sauce. Served with rice.',
        price: 169,
        addons: [
            { name: 'Extra Rice', price: 25 },
            { name: 'Fried Egg', price: 20 }
        ],
        image: '/menu/rice-bbq.png',
        sort_order: 30
    },

    // OUR CLOUD MENU (Sample Individual Items)
    {
        id: 'lemonade-fresh',
        category_id: 'our-cloud-menu',
        name: 'Healthy Lemonade',
        description: 'Freshly squeezed lemonade with natural flavors.',
        price: 80,
        variations: [
            { name: '16oz', price: 80 },
            { name: '22oz', price: 80 }
        ],
        flavors: ['Kiwi', 'Strawberry', 'Blueberry', 'Lychee', 'Black Tea'],
        image: '/menu/bev-lemonade.png',
        sort_order: 10
    }
];
