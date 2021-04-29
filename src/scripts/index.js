// Variables
const ProductListContainer = document.getElementById('product-list');
const CheckOut = document.getElementById('checkout');
let CheckOutItemsContainer = document.getElementById('checkout__container');
const Nothing = `
        <h2>Cart</h2>
        <h4>There are not items here</h4>
        `;
let carrito = {};
let TotalPrice = 0;
// Funciones

document.addEventListener('DOMContentLoaded', () => {
    FetchData();
});

const FetchData = async () => {
    try {
        const Response = await fetch('/src/scripts/json/productos.json');
        const Data = await Response.json();
        ShowProducts(Data);
    } catch (error) {
        console.log(error);
    }
};

const ShowProducts = (Data) => {
    CheckOut.innerHTML = '';

    if (CheckOut.hasChildNodes() == false) {
        CheckOut.innerHTML = Nothing;
    }

    Data.forEach((product) => {
        const ProductItem = `
            <div class="product-item">
                <h3 class="product-name">${product.name}</h3>
                <span>Price:</span>
                <span class="product-price">${product.price.toFixed(2)}$</span>
                <span>Available items: </span>
                <span class="product-maximum">${product.maximum}</span>
                <button class="product-item__button" data-id="${
                    product.id
                }">Add to Cart</button>
            </div>`;
        ProductListContainer.insertAdjacentHTML('beforeend', ProductItem);
    });

    ProductListContainer.addEventListener('click', (e) => {
        if (e.target.classList == 'product-item__button') {
            const Product = e.target.parentElement.cloneNode(true);
            SetCart(Product);
        }
    });
};

const SetCart = (Product) => {
    let letter = [];
    for (const chara of Product.querySelector('.product-price').textContent) {
        letter.push(chara);
    }
    // *En Price se une el array, despues elimino el signo de dolar y lo vuelvo a unir ya que con split los separa.
    price = letter.join('').split('$').join('');

    const Item = {
        id: Product.querySelector('.product-item__button').getAttribute(
            'data-id'
        ),
        name: Product.querySelector('.product-name').textContent,
        price: price,
        quantity: 1,
        maximun: Product.querySelector('.product-maximum').textContent,
    };

    if (carrito.hasOwnProperty(Item.id)) {
        Item.quantity = carrito[Item.id].quantity + 1;
    }

    carrito[Item.id] = { ...Item };

    AddToCart();
};

const AddToCart = () => {
    const CheckOutElements = `
    <h2 class="checkout__title">Cart</h2>
    <div class="checkout__container" id="checkout__container"></div>
            <span class="checkout__total" id="checkout__total"></span>
            <span class="checkout__quantity" id="checkout__quantity"></span>
            <button id="remove-items">Remove Cart</button>
    `;
    CheckOut.innerHTML = CheckOutElements;

    CheckOutItemsContainer = document.getElementById('checkout__container');
    CheckOutItemsContainer.innerHTML = '';

    Object.values(carrito).forEach((product) => {
        const price = product.price * product.quantity;
        const CheckOutItem = `
        <div class="checkout-item">
        <h3 class="checkout-item__title">${product.name}</h3>
        <span class="checkout-item__price">${price.toFixed(2)}$</span>
        <span class="checkout-item__quantity">${product.quantity} units</span>
        <button class="checkout-item__more" data-id="${product.id}">+</button>
        <button class="checkout-item__less" data-id="${product.id}">-</button>
        </div>
        `;

        CheckOutItemsContainer.insertAdjacentHTML('beforeend', CheckOutItem);
    });
    CalcTotal();

    const RemoveItemsButton = document.getElementById('remove-items');
    RemoveItemsButton.addEventListener('click', () => {
        carrito = {};
        CheckOut.innerHTML = Nothing;
    });

    CheckOutItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList == 'checkout-item__more') {
            const ButtonIdPlus = e.target.getAttribute('data-id');
            carrito[ButtonIdPlus].quantity = carrito[ButtonIdPlus].quantity + 1;
            AddToCart();
        } else if (e.target.classList == 'checkout-item__less') {
            const ButtonIdLess = e.target.getAttribute('data-id');
            carrito[ButtonIdLess].quantity = carrito[ButtonIdLess].quantity - 1;
            AddToCart();
        }
    });
};

const CalcTotal = () => {
    const Quantity = Object.values(carrito).reduce(
        (n, { quantity }) => n + quantity,
        0
    );

    const Price = Object.values(carrito).reduce(
        (n, { quantity, price }) => n + quantity * price,
        0
    );

    const CheckOutTotal = document.getElementById('checkout__total');
    const CheckOutQuantity = document.getElementById('checkout__quantity');

    CheckOutTotal.textContent = `Total: ${Price.toFixed(2)}$`;
    CheckOutQuantity.textContent =
        Quantity > 1 ? `${Quantity} items` : `${Quantity} item`;

    TotalPrice = Price.toFixed(2);
};
