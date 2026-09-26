// PRODUCT CLASS


class Product {

    constructor(id, name, price, stockQuantity, image) {

        this.id = id;
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.image = image;

    }

    decreaseStock(quantity) {

        if (this.stockQuantity >= quantity) {

            this.stockQuantity -= quantity;

        }

    }

    increaseStock(quantity) {

        this.stockQuantity += quantity;

    }

    isAvailable() {

        return this.stockQuantity > 0;

    }

}

// BOX CLASS

class Box {

    constructor(boxNumber, row, column) {

        this.boxNumber = boxNumber;
        this.row = row;
        this.column = column;
        this.product = null;

    }

    assignProduct(product) {

        this.product = product;

    }

    getProduct() {

        return this.product;

    }

    isEmpty() {

        return this.product === null;

    }

}

// CART CLASS

class Cart {

    constructor() {

        this.items = [];

    }

    addProduct(product) {

        const existing = this.items.find(

            item => item.product.id === product.id

        );

        if (existing) {

            if (
                existing.quantity <
                product.stockQuantity
            ) {

                existing.quantity++;

            } else {

                alert("Maximum available stock reached!");

            }

        } else {

            this.items.push({

                product: product,

                quantity: 1

            });

        }

    }

    removeProduct(productId) {

        this.items = this.items.filter(

            item => item.product.id !== productId

        );

    }

    getTotalAmount() {

        return this.items.reduce(

            (total, item) =>

                total +
                item.product.price *
                item.quantity,

            0

        );

    }

    clearCart() {

        this.items = [];

    }

}

// VENDING MACHINE CLASS

class VendingMachine {

    constructor(rows, columns) {

        this.rows = rows;

        this.columns = columns;

        this.boxes = [];

        this.cart = new Cart();

    }


    // CREATE BOXES

    initializeMachine() {

        let number = 1;

        for (
            let row = 0;
            row < this.rows;
            row++
        ) {

            for (
                let column = 0;
                column < this.columns;
                column++
            ) {

                this.boxes.push(

                    new Box(

                        number,
                        row + 1,
                        column + 1

                    )

                );

                number++;

            }

        }

    }


    // LOAD PRODUCTS

    loadProducts(products) {

        for (
            let i = 0;
            i < products.length;
            i++
        ) {

            if (i < this.boxes.length) {

                this.boxes[i].assignProduct(

                    products[i]

                );

            }

        }

    }

    // PRODUCT GRID

    generateProductGrid() {

        const grid =
            document.getElementById(
                "productGrid"
            );

        grid.innerHTML = "";


        this.boxes.forEach(box => {

            if (box.isEmpty()) return;


            const product =
                box.getProduct();


            const card =
                document.createElement("div");


            card.className =
                "product-card";


            card.innerHTML = `

                <span class="product-number">
                    ${box.boxNumber}
                </span>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.style.display='none'"
                >

                <h3>
                    ${product.name}
                </h3>

                <p class="price">
                    ₹${product.price}
                </p>

                <p class="stock">
                    Stock: ${product.stockQuantity}
                </p>

            `;


            grid.appendChild(card);

        });

    }

    // SELECTION MATRIX

    generateSelectionMatrix() {

        const matrix =
            document.getElementById(
                "selectionMatrix"
            );

        matrix.innerHTML = "";


        this.boxes.forEach(box => {

            const button =
                document.createElement("button");


            button.textContent =
                box.boxNumber;


            if (
                box.isEmpty() ||
                !box.getProduct().isAvailable()
            ) {

                button.disabled = true;

            }


            button.addEventListener(
                "click",
                () => {

                    this.selectProduct(
                        box.boxNumber
                    );

                }
            );


            matrix.appendChild(button);

        });

    }

    // SELECT PRODUCT
    

    selectProduct(boxNumber) {

        const box =
            this.boxes.find(

                b =>
                    b.boxNumber ===
                    boxNumber

            );


        if (!box || box.isEmpty()) {

            alert("Empty Box!");

            return;

        }


        const product =
            box.getProduct();


        if (!product.isAvailable()) {

            alert("Out Of Stock!");

            return;

        }


        this.cart.addProduct(product);

        this.displayCart();

    }

  
    // DISPLAY CART
  

    displayCart() {

        const cartItems =
            document.getElementById(
                "cartItems"
            );


        const total =
            document.getElementById(
                "totalAmount"
            );


        cartItems.innerHTML = "";


        if (
            this.cart.items.length === 0
        ) {

            cartItems.innerHTML = `

                <p class="empty-cart">
                    No products selected.
                </p>

            `;

            total.textContent = "0";

            return;

        }


        this.cart.items.forEach(item => {

            const div =
                document.createElement("div");


            div.className =
                "cart-item";


            div.innerHTML = `

                <span>
                    ${item.product.name}
                </span>

                <span>
                    ₹${item.product.price}
                </span>

                <span>
                    ${item.quantity}
                </span>

                <span>
                    ₹${item.product.price *
                    item.quantity}
                </span>

                <button
                    class="remove-item"
                    onclick="
                        machine.removeFromCart(
                            ${item.product.id}
                        )
                    "
                >
                    ×
                </button>

            `;


            cartItems.appendChild(div);

        });


        total.textContent =
            this.cart.getTotalAmount();

    }


    // REMOVE ITEM

    removeFromCart(productId) {

        this.cart.removeProduct(productId);

        this.displayCart();

    }


    // PURCHASE / BUY NOW
    

    purchaseProducts() {

        if (
            this.cart.items.length === 0
        ) {

            alert("Cart is Empty!");

            return;

        }


        this.cart.items.forEach(item => {

            item.product.decreaseStock(
                item.quantity
            );

        });


        this.cart.clearCart();


        this.generateProductGrid();

        this.generateSelectionMatrix();

        this.displayCart();

        updateInventory();

        saveInventory();


        alert("Purchase Successful!");

    }


   // RESET CART
   

    resetMachine() {

        this.cart.clearCart();

        this.displayCart();

    }

}


// PRODUCT DATA


const products = [

    new Product(1,"Kurkure",10,20, "images/kurkure.png"),

    new Product(2,"Lays Classic",20,20,"images/Lays Classic.png"),

    new Product(3,"Coke",20,20,"images/Coke.png"),

    new Product(4,"Pepsi",20,20,"images/pepsi.png"),

    new Product(5,"Parle-G",10,20,"images/Parlee- G.png"),

    new Product(6,"Maggi",15,20,"images/Maggie.png"),

    new Product(7,"Dairy Milk",30,20,"images/Dairy Milk.png" ),

    new Product(8,"KitKat",25,20,"images/kitkat.png"),

    new Product(9,"5 Star",20,20,"images/5Star.png"),

    new Product(10,"Sprite",20,20,"images/sprite.png"),

    new Product(11,"Cheetos",10,20,"images/cheetos.png"),

    new Product(12,"Bingo Mad Angles",10,20,"images/Bingo Mad Angles.png"),

    new Product(13,"Tropicana Juice",30,20,"images/Tropicana Juice.png"),

    new Product(14,"Fanta",20,20,"images/fanta.png"),

    new Product(15,"Water Bottle",10,20,"images/Water Bottle.png"),

    new Product(16,"Boost",20,20,"images/boost.png"),

    new Product(17,"Munch",10,20,"images/munch.png"),

    new Product(18,"Nescafe",20,20,"images/nescafe.png"),

    new Product(19,"Uncle Chips",20,20,"images/Uncle Chips.png"),

    new Product(20,"Cornitos Nacho Crisps",30,20,"images/Cornitos Nacho Crisps.png")

];


// CREATE MACHINE
// 4 ROWS × 5 COLUMNS = 20 PRODUCTS


const machine =
    new VendingMachine(4, 5);


machine.initializeMachine();

machine.loadProducts(products);

loadInventory();

machine.generateProductGrid();

machine.generateSelectionMatrix();

machine.displayCart();

updateInventory();


// BUY NOW

document
    .getElementById("purchaseBtn")
    .addEventListener(
        "click",
        () => {

            machine.purchaseProducts();

        }
    );



// PAY NOW


document
    .getElementById("payNowBtn")
    .addEventListener(
        "click",
        () => {

            if (
                machine.cart.items.length === 0
            ) {

                alert("Cart is Empty!");

                return;

            }


            alert(
                "Payment Successful!"
            );


            machine.purchaseProducts();

        }
    );


// =====================================================
// CLEAR CART
// =====================================================

document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        () => {

            machine.resetMachine();

        }
    );


// =====================================================
// SEARCH
// =====================================================

document
    .getElementById("searchBox")
    .addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(
                    ".product-card"
                )
                .forEach(card => {

                    const name =
                        card
                            .querySelector("h3")
                            .textContent
                            .toLowerCase();


                    if (
                        name.includes(value)
                    ) {

                        card.style.display =
                            "block";

                    } else {

                        card.style.display =
                            "none";

                    }

                });

        }
    );


// =====================================================
// THEME
// =====================================================

document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );

        }
    );


// =====================================================
// INVENTORY DASHBOARD
// =====================================================

function updateInventory() {

    const dashboard =
        document.getElementById(
            "inventoryDashboard"
        );


    dashboard.innerHTML = "";


    machine.boxes.forEach(box => {

        if (box.isEmpty()) return;


        const product =
            box.getProduct();


        const div =
            document.createElement("div");


        div.className =
            "inventory-item";


        div.innerHTML = `

            <span>
                ${box.boxNumber}
                -
                ${product.name}
            </span>

            <strong>
                ${product.stockQuantity}
            </strong>

        `;


        dashboard.appendChild(div);

    });

}


// =====================================================
// RESTOCK
// =====================================================

document
    .getElementById("restockBtn")
    .addEventListener(
        "click",
        () => {

            machine.boxes.forEach(box => {

                if (box.isEmpty()) return;


                box.getProduct()
                    .stockQuantity = 20;

            });


            machine.generateProductGrid();

            machine.generateSelectionMatrix();

            updateInventory();

            saveInventory();


            alert(
                "All products restocked!"
            );

        }
    );


// =====================================================
// CLEAR LOCAL STORAGE
// =====================================================

document
    .getElementById("clearStorageBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "inventory"
            );


            alert(
                "Storage Cleared!"
            );

        }
    );


// =====================================================
// SAVE INVENTORY
// =====================================================

function saveInventory() {

    const stock =
        machine.boxes.map(box => {

            if (box.isEmpty()) {

                return null;

            }


            return {

                id:
                    box.getProduct().id,

                stock:
                    box.getProduct()
                        .stockQuantity

            };

        });


    localStorage.setItem(

        "inventory",

        JSON.stringify(stock)

    );

}


// =====================================================
// LOAD INVENTORY
// =====================================================

function loadInventory() {

    const data =
        localStorage.getItem(
            "inventory"
        );


    if (!data) return;


    try {

        const stock =
            JSON.parse(data);


        stock.forEach(
            (item, index) => {

                if (
                    item &&
                    machine.boxes[index] &&
                    !machine.boxes[index].isEmpty()
                ) {

                    machine
                        .boxes[index]
                        .getProduct()
                        .stockQuantity =
                            item.stock;

                }

            }
        );

    } catch (error) {

        console.log(
            "Inventory loading error"
        );

    }

}