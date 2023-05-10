const API_BASE_URL = "https://dummyjson.com"
const DATA_STORAGE = "allItemData"

let allItemData = JSON.parse(localStorage.getItem(DATA_STORAGE)) ?? {}
let cartItem = document.querySelector("#showCartItem")
let counter = document.querySelector("#show-cart-item-counter")
let oderSummary = document.querySelector("#show-oder-summary")
let amount = document.querySelector("#show-price")
let cartProducts = [];

function renderCartUI() {
    let allCartItem = JSON.parse(localStorage.getItem(DATA_STORAGE)) ?? {};
    let cartItemHtml = ""
    cartProducts = [];
    if (Object.keys(allCartItem).length == 0) {
        document.querySelector('#cart-info').classList.add('d-none');
        document.querySelector('#empty-cart').classList.remove('d-none');
    }

    fetch(`${API_BASE_URL}/products?limit=100`)
        .then((response) => response.json())
        .then((data) => {
            let alldataProduct = data.products
            alldataProduct.forEach(function (element) {
                let productId = element.id
                if (allCartItem[productId] != undefined) {
                    cartProducts.push(element)
                }
            })
            cartProducts.forEach(function (element) {
                console.log(element.length);
                let regularPrice = element.price;
                let discountPrice = element.discountPercentage;
                let discountAblePrice = (regularPrice * (discountPrice / 100)).toPrecision(2);
                let totalPrice = regularPrice - discountAblePrice;
                cartItemHtml += `<div class="single-product-item">
               <div class="card mb-3">
                   <div class="row g-0">
                   <div class="col-md-2 d-flex align-items-center">
                       <div class="cart-item-image">
                           <img src="${element.thumbnail}" class="img-fluid" alt="...">
                       </div>
                   </div>
                   <div class="col-md-7">
                       <div class="card-body">
                           <h5 class="card-title">${element.title}</h5>
                           <p class="card-text">
                               <small class="text-body-secondary">${element.brand}</small>
                           </p>
                           <div class="">
                               <span class="discount-price">$${totalPrice}</span>
                               <span class="regular-price">$${element.price}</span>
                           </div>
                       </div>
                   </div>
                   <div class="col-md-3">
                       <div class="cart-action">
                           <div class="cart-item-quantity">
                               <button class="btn btn-outline-warning" data-id="${element.id}" onclick="dicriment(this)" ><i class="bi bi-dash"></i></button>
                               <input type="text" class="form-control cart-item-quantity-input" value="${allItemData[element.id]['quantity']}">
                               <button class="btn btn-outline-warning"data-id="${element.id}" onclick="incrimant(this)"  ><i class="bi bi-plus"></i></button>
                           </div>
                           <div class="cart-item-delete">
                               <button class="btn btn-danger" data-id="${element.id}" onclick="removeitem(this)"><i class="bi bi-trash3-fill"></i></button>
                            </div>
                         </div>
                     </div>
                    </div>
                </div>`
            })
            cartItem.innerHTML = cartItemHtml
            ShowsummaryUI()
        })
}

renderCartUI()

function ShowsummaryUI() {
    let allItemData = JSON.parse(localStorage.getItem(DATA_STORAGE)) ?? {};
    let odrderSummaryHtml = ""
    let sumHTML = ''
    let sum = 0
    cartProducts.forEach(function (element) {
        let subTotal = element.price * allItemData[element.id]['quantity']
        sum = sum + subTotal
        odrderSummaryHtml += `<div class="order-summry-info">
            <p>${element.title} X ${allItemData[element.id]['quantity']}</p>
            <p>$${subTotal}</p>
        </div>
       `
        sumHTML += `<p>$${sum}</p>`
    })
    oderSummary.innerHTML = odrderSummaryHtml
    amount.innerHTML = sumHTML

}

function incrimant(e) {
    let id = e.getAttribute("data-id")
    let setQuantity = e.parentNode
    console.log(setQuantity);
    let quantity = setQuantity.querySelector(".cart-item-quantity-input").value
    setQuantity.querySelector(".cart-item-quantity-input").value = (parseInt(quantity) + 1)
    let allItemData = JSON.parse(localStorage.getItem(DATA_STORAGE)) ?? {};
    allItemData[id]['quantity'] = allItemData[id]['quantity'] + 1
    localStorage.setItem(DATA_STORAGE, JSON.stringify(allItemData)) ?? {};
    ShowsummaryUI()

}
function dicriment(e) {
    let id = e.getAttribute("data-id")
    let deleteQuantity = e.parentNode
    let quantity = deleteQuantity.querySelector(".cart-item-quantity-input").value
    if (quantity > 1) {
        deleteQuantity.querySelector(".cart-item-quantity-input").value = (parseInt(quantity) - 1)
        let allItemData = JSON.parse(localStorage.getItem(DATA_STORAGE)) ?? {};
        allItemData[id]['quantity'] = allItemData[id]['quantity'] - 1
        localStorage.setItem(DATA_STORAGE, JSON.stringify(allItemData)) ?? {};
    }
    ShowsummaryUI()
}

function removeitem(e) {
    let ID = e.getAttribute("data-id")
    let allItemData = JSON.parse(localStorage.getItem(DATA_STORAGE)) ?? {};
    delete allItemData[ID]
    localStorage.setItem(DATA_STORAGE, JSON.stringify(allItemData)) ?? {};
    renderCartUI()
    countCart()
}

function countCart() {
    let allItemData = JSON.parse(localStorage.getItem(DATA_STORAGE)) ?? {};
    let length = Object.keys(allItemData).length
    counter.innerHTML = (length);
}
countCart()
