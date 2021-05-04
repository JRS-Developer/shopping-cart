// Variables
const PaypalContainer = document.getElementById('paypal-button-container');
const ProductListContainer = document.getElementById('product-list');
const CheckOut = document.getElementById('checkout');
const CheckOutOtherInfo = document.getElementById('checkout__other-info');
let CheckOutItemsContainer = document.getElementById('checkout__container');
const Nothing = `
        <h4>There are not items here</h4>
        `;
let carrito = {};
let TotalPrice = 0;
const Buy = document.getElementById('buy');
const ShoppingCartAmount = document.getElementById('shopping-cart__amount');
// Funciones

document.addEventListener('DOMContentLoaded', () => {
    FetchData();
    MobileCart();
});

window.addEventListener('resize', () => {
    MobileCart();
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
        CheckOutOtherInfo.innerHTML = '';
        CheckOut.classList.add('checkout--no-items');
        PaypalContainer.className = 'paypal-button-container--none';
    }

    Data.forEach((product) => {
        const ProductItem = `
            <div class="product-item">
                <img class="product-img" src=${product.image} alt=${
            product.name
        }>
                <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price__container">
                <span>Price:</span>
                <span class="product-price"><strong>${product.price.toFixed(
                    2
                )}</strong>$</span>
                </div>
                <button class="product-item__button" data-id="${
                    product.id
                }">Add to Cart</button>
                </div>
            </div>`;
        ProductListContainer.insertAdjacentHTML('beforeend', ProductItem);
    });

    ProductListContainer.addEventListener('click', (e) => {
        if (e.target.classList == 'product-item__button') {
            const Product = e.target.parentElement.parentElement.cloneNode(
                true
            );
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
        image: Product.querySelector('.product-img').getAttribute('src'),
        price: price,
        quantity: 1,
    };

    if (carrito.hasOwnProperty(Item.id)) {
        Item.quantity = carrito[Item.id].quantity + 1;
    }

    carrito[Item.id] = { ...Item };

    AddToCart();
};

const AddToCart = () => {
    const CheckOutElements = `
    <div class="checkout__container" id="checkout__container"></div>
    `;
    const OtherInfo = `
    <span class="checkout__total" id="checkout__total"></span>
            <span class="checkout__quantity" id="checkout__quantity"></span>
            <button id="remove-items" class="remove-items-button">Remove Cart</button>
    `;
    CheckOut.innerHTML = CheckOutElements;
    CheckOutOtherInfo.innerHTML = OtherInfo;

    CheckOutItemsContainer = document.getElementById('checkout__container');
    CheckOutItemsContainer.innerHTML = '';

    if (CheckOut.hasChildNodes() == false) {
        CheckOut.innerHTML = Nothing;
        CheckOut.classList.add('checkout--no-items');
        PaypalContainer.className = 'paypal-button-container--none';
    } else {
        CheckOut.classList.remove('checkout--no-items');
        PaypalContainer.className = 'paypal-button-container';
    }

    Object.values(carrito).forEach((product) => {
        const price = product.price * product.quantity;
        if (product.quantity == 0) {
            return;
        }
        const quantity =
            product.quantity > 1
                ? product.quantity + ' ' + 'units'
                : product.quantity + ' ' + 'unit';
        const CheckOutItem = `
        <div class="checkout-item" data-id={${product.id}}>
            <img class="checkout-item__img" src=${product.image} alt=${
            product.name
        }>
            <div class="checkout-item__info">
            <h3 class="checkout-item__title">${product.name}</h3>
            <span class="checkout-item__price"> <strong>${price.toFixed(
                2
            )}</strong>$ - ${quantity}</span>
            <div class="checkout-item__buttons">
            <button class="checkout-item__more" data-id="${
                product.id
            }">+</button>
            <button class="checkout-item__less" data-id="${
                product.id
            }">-</button>
            </div>
            </div>
        </div>
        `;

        CheckOutItemsContainer.insertAdjacentHTML('beforeend', CheckOutItem);
    });
    CalcTotal();

    if (CheckOutItemsContainer.hasChildNodes() == false) {
        RemoveCart();
        return;
    }

    const RemoveItemsButton = document.getElementById('remove-items');
    RemoveItemsButton.addEventListener('click', () => {
        RemoveCart();
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
    CheckOutQuantity.textContent = `Items: ${Quantity}`;

    ShowaAmountOfItems(Quantity);

    TotalPrice = Price.toFixed(2);
};

const RemoveCart = () => {
    TotalPrice = 0;
    carrito = {};
    CheckOut.innerHTML = Nothing;
    CheckOutOtherInfo.innerHTML = '';
    CheckOut.classList.add('checkout--no-items');
    PaypalContainer.className = 'paypal-button-container--none';
};

const MobileCart = () => {
    if (window.innerWidth < 640) {
        OpenCart();
    } else {
        Buy.className = 'buy';
    }
};

const OpenCart = () => {
    Buy.classList.replace('buy', 'buy-mobile');
    const BuyMobile = document.querySelector('.buy-mobile');
    BuyMobile.addEventListener('click', (e) => {
        if (
            e.target.classList == 'shopping-cart__container' ||
            e.target.classList == 'shopping-cart__icon'
        ) {
            Buy.classList.replace('buy-mobile', 'buy-mobile--open');
            CloseCart();
        }
    });
};

const CloseCart = () => {
    const CloseIcon = document.querySelector('.close-icon');
    CloseIcon.addEventListener('click', () => {
        Buy.classList.replace('buy-mobile--open', 'buy-mobile');
    });
};

const ShowaAmountOfItems = (Quantity) => {
    ShoppingCartAmount.textContent = Quantity;
};
