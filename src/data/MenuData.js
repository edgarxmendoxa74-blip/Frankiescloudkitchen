
export const categories = [
    { id: 'pasta-favorites', name: 'Pasta Favorites', sort_order: 1 },
    { id: 'snacks-finger-foods', name: 'Snacks & Finger Foods', sort_order: 2 },
    { id: 'plated-rice-meals', name: 'Plated Rice Meals', sort_order: 3 },
    { id: 'sandwiches-quesadillas', name: 'Sandwiches & Quesadillas', sort_order: 4 },
    { id: 'cookies', name: 'Cookies', sort_order: 5 },
    { id: 'bundles', name: 'Bundles', sort_order: 6 },
    { id: 'drinks', name: 'Drinks', sort_order: 7 },
];

export const menuItems = [
    // PASTA FAVORITES
    {
        id: 'pasta-alfredo',
        category_id: 'pasta-favorites',
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
        id: 'pasta-macaroni',
        category_id: 'pasta-favorites',
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
        id: 'pasta-tenders',
        category_id: 'pasta-favorites',
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
        id: 'snack-takoyaki',
        category_id: 'snacks-finger-foods',
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
        id: 'snack-churros',
        category_id: 'snacks-finger-foods',
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
        id: 'snack-fries',
        category_id: 'snacks-finger-foods',
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
        id: 'snack-corndog',
        category_id: 'snacks-finger-foods',
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
        id: 'snack-nachos',
        category_id: 'snacks-finger-foods',
        name: 'Beefy Nachos',
        description: '[FAV] Seasoned tacos with beef, cheese, & veggie toppings.',
        price: 139,
        image: '/menu/snacks-nachos.png',
        sort_order: 5
    },

    // PLATED RICE MEALS
    {
        id: 'rice-beef',
        category_id: 'plated-rice-meals',
        name: 'Garlic Mushroom Pepper Beef',
        description: '[FAV][SHARING] Tender beef strips in garlicky black-pepper gravy with onions — perfect over rice.',
        price: 179,
        image: '/menu/rice-beef.png',
        sort_order: 1
    },
    {
        id: 'rice-bbq',
        category_id: 'plated-rice-meals',
        name: 'Signature Chicken BBQ',
        description: '[FAV][SHARING] Tender BBQ chicken glazed in a rich sauce, served over rice fried in the same savory-sweet marinade.',
        price: 169,
        image: '/menu/rice-bbq.png',
        sort_order: 2
    },

    // COOKIES
    {
        id: 'cookie-crinkles',
        category_id: 'cookies',
        name: 'Choco Crinkles',
        description: 'Soft and fudgy chocolate crinkle cookies.',
        price: 50,
        image: '/menu/cookies-crinkles.png',
        sort_order: 1
    },

    // BUNDLES
    {
        id: 'bundle-quick',
        category_id: 'bundles',
        name: 'Quick Bites',
        description: 'Perfect for a quick and satisfying snack.',
        price: 189,
        image: '/menu/bundles-quick.png',
        sort_order: 1
    }
];
