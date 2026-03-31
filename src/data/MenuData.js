
export const categories = [
    { id: 'bundles-favorites', name: 'Bundles & Favorites', sort_order: 1 },
    { id: 'snacks-sandwiches', name: 'Snacks & Sandwiches', sort_order: 2 },
    { id: 'pasta-rice', name: 'Pasta & Rice', sort_order: 3 },
    { id: 'drinks', name: 'Drinks', sort_order: 4 },
];

export const menuItems = [
    // BUNDLES & FAVORITES
    {
        id: 'fav-alfredo',
        category_id: 'bundles-favorites',
        name: "Chicken Alfredo",
        description: '[FAV] Tender chicken pops toppings w/ al dente pasta in cream sauce. Served w/ bread.',
        price: 169,
        variations: [
            { name: 'Solo', price: 169 },
            { name: 'Platter', price: 499 }
        ],
        image: '/menu/pasta-alfredo.png',
        sort_order: 1
    },
    {
        id: 'fav-macaroni',
        category_id: 'bundles-favorites',
        name: 'Beefy Macaroni',
        description: '[FAV] Pan-tossed elbow macaroni in beefy tomato sauce w/ melted cheese. Served w/ bread.',
        price: 169,
        variations: [
            { name: 'Solo', price: 169 },
            { name: 'Platter', price: 499 }
        ],
        image: '/menu/pasta-macaroni.png',
        sort_order: 2
    },
    {
        id: 'fav-burger',
        category_id: 'bundles-favorites',
        name: "Frankie's Chicken Burger",
        description: '[FAV] Signature crispy chicken patty with special sauce.',
        price: 169,
        image: '/menu/sandwiches.png',
        sort_order: 3
    },
    {
        id: 'fav-double-decker',
        category_id: 'bundles-favorites',
        name: 'Double Decker Sandwich',
        description: '[FAV][SHARING] Ham & Egg Double Decker. Great for sharing!',
        price: 169,
        image: '/menu/sandwiches.png',
        sort_order: 4
    },
    {
        id: 'fav-takoyaki',
        category_id: 'bundles-favorites',
        name: 'Cheese Takoyaki',
        description: '[FAV] 4pcs Takoyaki with extra cheese melt.',
        price: 80,
        flavors: [
            { name: 'Non-spicy', price: 0 },
            { name: 'Mild-spicy', price: 0 },
            { name: 'Extra spicy', price: 5 }
        ],
        image: '/menu/snacks-takoyaki.png',
        sort_order: 8
    },

    // SNACKS & SANDWICHES
    {
        id: 'snack-takoyaki',
        category_id: 'snacks-sandwiches',
        name: 'Classic Takoyaki',
        description: 'Authentic octopus balls.',
        price: 70,
        variations: [
            { name: '4pcs', price: 70 },
            { name: '10pcs', price: 130 }
        ],
        flavors: [
            { name: 'Non-spicy', price: 0 },
            { name: 'Mild-spicy', price: 0 },
            { name: 'Extra spicy', price: 5 }
        ],
        image: '/menu/snacks-takoyaki.png',
        sort_order: 1
    },
    {
        id: 'snack-quesadilla',
        category_id: 'snacks-sandwiches',
        name: 'Gourmet Quesadilla',
        description: '[SHARING] Cheesy quesadilla with choice of protein.',
        price: 165,
        variations: [
            { name: 'Chicken', price: 165 },
            { name: 'Beef', price: 185 }
        ],
        image: '/menu/snacks-quesadilla.png',
        sort_order: 3
    },

    // PASTA & RICE
    {
        id: 'rice-bbq',
        category_id: 'pasta-rice',
        name: 'Signature Chicken BBQ (Rice)',
        description: 'Glazed BBQ chicken with plain rice.',
        price: 169,
        image: '/menu/rice-bbq.png',
        sort_order: 2
    },

    // DRINKS
    {
        id: 'bev-lemonade',
        category_id: 'drinks',
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
    }
];
