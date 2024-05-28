const API_BASE_URL = "https://dummyjson.com"
const DATA_STORAGE = "allItemData"
const PER_PAGE = 12

let allCetagory = document.querySelector("#showCategories")
let allProduct = document.querySelector("#showAllItem")
let pagination = document.querySelector("#showPagination")
let counterMsg = document.querySelector("#show-cart-item-counter")
let counter = document.querySelector("#show-cart-item-counter")
let allItemData = JSON.parse(localStorage.getItem(DATA_STORAGE)) ?? {};
let cartProducts = [];
let currentPage = 1
let totalProduct = 0



function search() {
    let searchInput = document.getElementById('input-item').value
    url = ''
    if (searchInput.length >= 3) {
        url = `https://dummyjson.com/products/search?q=${searchInput}`
    } else if (searchInput.length == 0) {
        url = "https://dummyjson.com/products"
    }
    if (url) {
        showAllProduct(url)
    }
}

function showAllProduct(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            totalProduct = data.total;
            let alldataProduct = data.products;

            let allProductHTML = ""
            alldataProduct.forEach(function (element) {
                let regularPrice = element.price;
                let discountPrice = element.discountPercentage;
                let discountAblePrice = (regularPrice * (discountPrice / 100)).toPrecision(2);
                let totalPrice = regularPrice - discountAblePrice;

                let stockInfo = []
                if (element.stock > 20) {
                    stockInfo.msg = "In-Stock";
                    stockInfo.stockTxtColor = "text-success";
                } else if (element.stock > 0 && element.stock > 1) {
                    stockInfo.msg = "Low-Stock";
                    stockInfo.stockTxtColor = "text-warning";
                } else if (element.stock <= 0) {
                    stockInfo.msg = "Out-Of-Stock"
                    stockInfo.stockTxtColor = "text-danger"
                }
                let ratingValue = element.rating;
                let ratingDom = ""
                for (let i = 0; i < 5; i++) {
                    if (ratingValue >= 1) {
                        ratingDom += `<li><a> <i class="bi bi-star-fill checked"></i> </a></li>`
                    } else if (ratingValue > 0 && ratingValue < 1) {
                        ratingDom += `<li><a> <i class="bi bi-star-half checked"></i> </a></li>`
                    } else if (ratingValue >= 0) {
                        ratingDom += `<li><a> <i class="bi bi-star"></i> </a></li>`
                    }
                    ratingValue = ratingValue - 1
                }


                allProductHTML += `<div class="col-md-3 col-sm-6 mt-3">
                <div class="product-image">
                <div class="image">
                    <img src="${element.thumbnail}" alt="">
                </div>
                <p class="product-brand text-center">${element.brand}</p>
                <p class="product-name">${element.title}</p>
                <div class="price-section">
                    <span class="discount-price">$${totalPrice}</span>
                    <span class="regular-price">$${element.price}</span>
                </div>
                <p class="${stockInfo.stockTxtColor} text-center">${stockInfo.msg} <i class="bi bi-check-circle"></i></p>
                <div class="reting-section">
                    <ul class="star">
                    ${ratingDom}
                    </ul>
                </div>
                <div class="button-section">
                    <button type="button" class="cart-button" data-id="${element.id}" onclick="addnewItem(this)"><i class="bi bi-cart-check"></i></button>
                    </div>
                 </div>
                 </div>`
            })

            allProduct.innerHTML = allProductHTML;
            showPagination()

        })
}
showAllProduct(`${API_BASE_URL}/products?skip=0&limit=${PER_PAGE}`);



function showPagination() {
    let numberOfPagination = Math.ceil(totalProduct / PER_PAGE)
    let paginationHtml = ""
    for (let i = 1; i <= numberOfPagination; i++) {
        if (currentPage == i) {
            paginationHtml += `<li class="page-item disabled"><button  data-index="${i}" onclick="loadPaginationProduct(this)"class="page-link" >${i}</button></li>`
        } else {
            paginationHtml += `<li class="page-item"><button  data-index="${i}" onclick="loadPaginationProduct(this)" class="page-link">${i}</button></li>`
        }
    }
    pagination.innerHTML = paginationHtml;
}

function loadPaginationProduct(e) {
    let paginationIndex = e.getAttribute("data-index")
    currentPage = paginationIndex;

    let skip = PER_PAGE * (paginationIndex - 1)

    let url = `${API_BASE_URL}/products?skip=${skip}&limit=${PER_PAGE}`

    showAllProduct(url)
}

function showAllCatagories() {
    fetch(`${API_BASE_URL}/products/category-list`)
        .then((response) => response.json())
        .then((data) => {
            // console.log(categoryData, "hi");
            let allCetagoryHTML = ""
            data.forEach(function (element) {
                let categoryName = element.charAt(0).toUpperCase() + element.slice(1)
                allCetagoryHTML += `<button type="button" class="btn btn-outline-warning m-1"  data-id="${element}" onclick="loadCetagoryProduct(this)">${categoryName} </button>`
            })
            allCetagory.innerHTML = allCetagoryHTML
        })
}

showAllCatagories()

function loadCetagoryProduct(e) {
    let slug = e.getAttribute("data-id")
    url = `${API_BASE_URL}/products/category/${slug}`
    showAllProduct(url)

}

function addnewItem(e) {
    let ID = e.getAttribute("data-id")
    let newItem = {
        newID: ID,
        quantity: 1
    }
    allItemData[ID] = newItem
    localStorage.setItem(DATA_STORAGE, JSON.stringify(allItemData))
    countCart()
}

function countCart() {
    let allItemData = JSON.parse(localStorage.getItem(DATA_STORAGE))
    if (allItemData) {
        let length = Object.keys(allItemData).length
        counter.innerHTML = (length);
    }

}
countCart()
