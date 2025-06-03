let cart = JSON.parse(localStorage.getItem("cart")) || {};

const buttons = document.querySelectorAll("section#products button");

buttons.forEach((btn) => {
  btn.addEventListener("click", function () {
    const card = btn.closest("div");
    const name = card.querySelector("p.font-semibold").innerText;
    const price = parseFloat(card.querySelector("p.text-rose-700").innerText.replace("$", ""));

    if (!cart[name]) {
      cart[name] = { price, qty: 1 };
    }

    updateProductCard(card, name);
    saveCart();
    updateCart();
  });
});

function updateProductCard(card, name) {
  let controls = card.querySelector(".controls");
  if (!controls) {
    controls = document.createElement("div");
    controls.className = "controls flex items-center justify-between px-3 py-1 rounded-full bg-rose-700 text-white text-sm w-3/4 mx-auto absolute bottom-28 left-8";
   
      controls.innerHTML = `
  <button class="decrease p-3 cursor-pointer">
    <img src="/assets/images/icon-decrement-quantity.svg" alt="Decrease"/>
  </button>
  <span class="qty">${cart[name].qty}</span>
  <button class="increase px-2 cursor-pointer">
    <img src="/assets/images/icon-increment-quantity.svg" alt="Increase"/>
  </button>

    `;
    card.appendChild(controls);
    const addBtn = card.querySelector("button");
    addBtn.style.display = "none";
  }

  controls.querySelector(".qty").innerText = cart[name].qty;

  controls.querySelector(".increase").onclick = () => {
    cart[name].qty++;
    controls.querySelector(".qty").innerText = cart[name].qty;
    saveCart();
    updateCart();
  };

  controls.querySelector(".decrease").onclick = () => {
    cart[name].qty--;
    if (cart[name].qty === 0) {
      delete cart[name];
      controls.remove();
      const addBtn = card.querySelector("button");
      addBtn.style.display = "flex";
    } else {
      controls.querySelector(".qty").innerText = cart[name].qty;
    }
    saveCart();
    updateCart();
  };
}

function updateCart() {
  const cartBox = document.querySelector("aside");
  const cartTitle = cartBox.querySelector("h2");
  const cartContent = cartBox.querySelector("p");
  const cartImage = cartBox.querySelector("img");

  let itemCount = 0;
  let total = 0;
  let html = "";

  for (const name in cart) {
    const { qty, price } = cart[name];
    const subtotal = qty * price;
    itemCount += qty;
    total += subtotal;

    html += `
    <div class="py-4 border-b border-gray-200 text-sm w-full">
      <div class="flex justify-between items-center">
        <!-- Item and Quantity -->
        <div>
          <strong class="block text-base text-rose-900">${name}</strong>
          <span class="text-xs text-gray-600 flex items-center gap-1">
          <span class="font-extrabold text-xl text-rose-700">${qty}x</span>
  <span class="text-gray-500 relative -right-1">@ $${price.toFixed(2)}</span>
</span>
   </div>
  
        <!-- Subtotal and Remove Button -->
        <div class="flex items-center gap-2">
          <span class="text-sm mt-5 relative -left-20 text-gray-600">$${subtotal.toFixed(2)}</span>
          <button class="remove-item shrink-0" data-name="${name}">
            <img src="/assets/images/icon-remove-item.svg" alt="Remove" class="w-4 h-4">
          </button>
        </div>
      </div>
    </div>
  `;
  }

  if (itemCount > 0) {
    cartTitle.innerText = `Your Cart (${itemCount})`;
    cartContent.innerHTML = html +
      `<div class="text-xs text-gray-600">
        <span class="text-xs text-gray-600">Order Total:</span>
         <span class="font-extrabold text-rose-700  text-2xl ml-10">$${total.toFixed(2)}</span>
      </div>
       <div class='text-xs text-center mt-2 text-gray-500'>  <img src="/assets/images/icon-carbon-neutral.svg" alt="Remove" class="relative top-4 right-2">This is a <strong>carbon-neutral</strong> delivery</div>
       <button class='mt-4 w-full bg-rose-700 text-white py-2 rounded' id="confirmOrderBtn">Confirm Order</button>`;
       // Attaching my remove button listeners
cartBox.querySelectorAll(".remove-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.getAttribute("data-name");
    removeItem(name);
  });
});
    cartImage.style.display = "none";
  } else {
    cartTitle.innerText = "Your Cart (0)";
    cartContent.innerText = "Your added items will appear here";
    cartImage.style.display = "block";
  }

  // Reattach confirm button listener if cart is not empty
  const confirmBtn = document.getElementById("confirmOrderBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", showOrderModal);
  }
}

function removeItem(name) {
  delete cart[name];
  saveCart();
  updateCart();
  updateAllCards();
}

function updateAllCards() {
  document.querySelectorAll("section#products > div").forEach((card) => {
    const name = card.querySelector("p.font-semibold")?.innerText;
    const controls = card.querySelector(".controls");
    const addBtn = card.querySelector("button");

    if (name && controls) {
      if (cart[name]) {
        controls.querySelector(".qty").innerText = cart[name].qty;
      } else {
        controls.remove();
        if (addBtn) addBtn.style.display = "flex";
      }
    }
  });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load everything on page start
updateCart();
updateAllCards();

// Show modal with summary
function showOrderModal() {
  const modal = document.getElementById("orderModal");
  const summary = document.getElementById("orderSummary");
  const totalText = document.getElementById("orderTotal");

  let html = "";
  let total = 0;

  for (let item in cart) {
    const { qty, price } = cart[item];
    const subtotal = qty * price;
    total += subtotal;

    const imageMap = {
      "Waffle with Berries": "image-waffle-desktop.jpg",
      "Vanilla Bean Crème Brûlée": "image-creme-brulee-desktop.jpg",
      "Macaron Mix of Five": "image-macaron-desktop.jpg",
      "Classic Tiramisu": "image-tiramisu-desktop.jpg",
      "Pistachio Baklava": "image-baklava-desktop.jpg",
      "Lemon Meringue Pie": "image-meringue-desktop.jpg",
      "Red Velvet Cake": "image-cake-desktop.jpg",
      "Salted Caramel Brownie": "image-brownie-desktop.jpg",
      "Vanilla Panna Cotta": "image-panna-cotta-desktop.jpg"
    };

    const imageName = imageMap[item] || "default.jpg";

    html += `
      <div class="flex items-center justify-between gap-4 mb-3">
        <div class="flex items-center gap-4">
          <img src="/assets/images/${imageName}" alt="${item}" class="w-12 h-12 rounded-md object-cover" />
          <div>
            <p class="font-semibold text-sm">${item}</p>
            <p class="text-xs text-gray-500">${qty}x @ $${price.toFixed(2)}</p>
          </div>
        </div>
        <div class="text-sm font-semibold">$${subtotal.toFixed(2)}</div>
      </div>
    `;
  }

  summary.innerHTML = html;
  totalText.innerText = `Order Total: $${total.toFixed(2)}`;
  modal.classList.remove("hidden");
}

// Reset everything
document.getElementById("newOrderBtn").addEventListener("click", function () {
  cart = {};
  saveCart();
  updateCart();
  updateAllCards();
  document.getElementById("orderModal").classList.add("hidden");
});