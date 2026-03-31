
export const categories = [
    { id: 'duo-meals', name: 'Duo Meals', sort_order: 1 },
    { id: 'full-meals', name: 'Full Meals', sort_order: 2 },
    { id: 'quick-bites', name: 'Quick Bites', sort_order: 3 },
    { id: 'your-cloud-menu', name: 'Your Cloud Menu', sort_order: 4 },
    { id: 'our-cloud-menu', name: 'Our Cloud Menu', sort_order: 5 },
];

export const menuItems = [
    {
        id: 'duo-meals-promo',
        category_id: 'duo-meals',
        name: 'Duo Meals (Promo)',
        description: 'SAVE 100+! 2 Signature Main + 2 Drinks + 1 Side.',
        price: 459,
        allow_multiple: true,
        variations: [
            { name: 'Chicken Alfredo', price: 0 },
            { name: 'Beefy Macaroni', price: 0 },
            { name: 'Double Decker', price: 0 },
            { name: 'Chicken Burger', price: 0 },
            { name: 'Signature Chicken BBQ', price: 0 }
        ],
        addons: [
            { name: 'Fresh Lemonade', price: 0 },
            { name: 'Strawberry Milk (+20)', price: 20 },
            { name: 'Any Frappe (+55)', price: 55 },
            { name: 'Churro Bites', price: 0 },
            { name: 'Coffee Jelly', price: 0 }
        ],
        image: '/menu/bundle-duo.png',
        sort_order: 1
    },
    {
        id: 'full-meals-promo',
        category_id: 'full-meals',
        name: 'Full Meals (Promo)',
        description: 'SAVE 20! 1 Signature Main + 1 Drink/Side/Dessert.',
        price: 229,
        variations: [
            { name: 'Chicken Alfredo', price: 229 },
            { name: 'Double Decker', price: 229 },
            { name: 'Chicken BBQ Rice', price: 229 }
        ],
        addons: [
            { name: 'Churro Bites', price: 0 },
            { name: 'Fresh Lemonade', price: 0 },
            { name: 'Coffee Jelly', price: 0 }
        ],
        image: '/menu/bundle-full.png',
        sort_order: 1
    },
    {
        id: 'quick-bites-promo',
        category_id: 'quick-bites',
        name: 'Quick Bites (Promo)',
        description: 'SAVE 30! 1 Light Snack + 1 Drink/Side.',
        price: 189,
        variations: [
            { name: '10pc Classic Takoyaki', price: 189 },
            { name: '10pc Cheese Takoyaki (+20)', price: 209 },
            { name: 'Honey Grilled Cheese', price: 189 }
        ],
        addons: [
            { name: 'Fresh Lemonade', price: 0 },
            { name: 'Churros', price: 0 }
        ],
        image: '/menu/bundle-quick.png',
        sort_order: 1
    }
];
