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
    if(Object.keys(allCartItem).length == 0){
        document.querySelector('#cart-info').classList.add('d-none');
        document.querySelector('#empty-cart').classList.remove('d-none');
    } 
    

    fetch(`${API_BASE_URL}/products?limit=100`)
        .then((response) => response.json())
        .then((data) => {
            let alldataProduct = data.products
            for (let i = 0; i < alldataProduct.length; i++) {
                let productId = alldataProduct[i].id
                if (allCartItem[productId] != undefined) {
                    cartProducts.push(alldataProduct[i])
                }
            }
            for (let i = 0; i < cartProducts.length; i++) {                 
                    let regularPrice = cartProducts[i].price;
                    let discountPrice = cartProducts[i].discountPercentage;
                    let discountAblePrice = (regularPrice * (discountPrice / 100)).toPrecision(2);
                    let totalPrice = regularPrice - discountAblePrice;
                    cartItemHtml += `<div class="single-product-item">
               <div class="card mb-3">
                   <div class="row g-0">
                   <div class="col-md-2 d-flex align-items-center">
                       <div class="cart-item-image">
                           <img src="${cartProducts[i].thumbnail}" class="img-fluid" alt="...">
                       </div>
                   </div>
                   <div class="col-md-7">
                       <div class="card-body">
                           <h5 class="card-title">${cartProducts[i].title}</h5>
                           <p class="card-text">
                               <small class="text-body-secondary">${cartProducts[i].brand}</small>
                           </p>
                           <div class="">
                               <span class="discount-price">$${totalPrice}</span>
                               <span class="regular-price">$${cartProducts[i].price}</span>
                           </div>
                       </div>
                   </div>
                   <div class="col-md-3">
                       <div class="cart-action">
                           <div class="cart-item-quantity">
                               <button class="btn btn-outline-warning" data-id="${cartProducts[i].id}" onclick="dicriment(this)" ><i class="bi bi-dash"></i></button>
                               <input type="text" class="form-control cart-item-quantity-input" value="${allItemData[cartProducts[i].id]['quantity']}">
                               <button class="btn btn-outline-warning"data-id="${cartProducts[i].id}" onclick="incrimant(this)"  ><i class="bi bi-plus"></i></button>
                           </div>
                           <div class="cart-item-delete">
                               <button class="btn btn-danger" data-id="${cartProducts[i].id}" onclick="removeitem(this)"><i class="bi bi-trash3-fill"></i></button>
                           </div>
                       </div>
                       
                   </div>
                   </div>
               </div>
           </div>`
            
        }
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
    for (let i = 0; i < cartProducts.length; i++) {
        let subTotal = cartProducts[i].price * allItemData[cartProducts[i].id]['quantity']
        sum = sum + subTotal
        odrderSummaryHtml += `<div class="order-summry-info">
            <p>${cartProducts[i].title} X ${allItemData[cartProducts[i].id]['quantity']}</p>
            <p>$${subTotal}</p>
        </div>
       `
        sumHTML += `<p>$${sum}</p>`
    }
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
