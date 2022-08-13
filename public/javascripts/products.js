let profile = document.querySelector(".profile-cont");
let productCont = document.querySelector(".product-card-cont");
let GenderSort = document.getElementById("Gender");
let CategorySort = document.getElementById("category");
let priceSort = document.getElementById("PriceSort");
let profileOnOff = document.querySelector("#profile-cont-off");
let GenderSortValue = null;
let CategorySortVlue = null;
var searchValue;
var sortedArray;

// page location
let pagelocation = location.pathname.toUpperCase();
document.getElementById("pagelocation").innerText += pagelocation;

profile.addEventListener("click", function () {
  profile.classList.toggle("profile-active");
});

profileOnOff.addEventListener("click", function () {
  profile.classList.toggle("profile-active");
});

let temp = debouncing();

document.getElementById("navsearch").addEventListener("keyup", function (e) {
  if (window.location.pathname !== "/product") {
    window.location.replace("http://localhost:3000/product");
  }
  temp(this.value);
});
function debouncing() {
  let debounce;
  return function (value) {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      let search = await axios.get(`/product/search?search=${value}`);
      searchValue = search.data.product;
      ResultInjector(search.data.product);
    }, 1000);
  };
}

function ResultInjector(data) {
  let clustor;
  data.forEach((product) => {
    clustor += `
        <div class="product-card">
        <div class="nav">
          <a
            class="icon"
            href="/user/like/<%=product._id%>"
          >
            <i class="fa-solid fa-heart"></i>
          </a>
          <div class="icon">
            <i class="fa-solid nav-ic fa-bag-shopping"></i>
          </div>
        </div>
        <div class="product">
          <div class="product-background" style="background: rgb(${Math.round(
            250 * Math.random()
          )},${Math.round(250 * Math.random())},${Math.round(
      250 * Math.random()
    )})">
            <div class="product-background-circle"></div>
          </div>
          <div class="product-image">
            <img src="../images/uploads/${product.PngImg}" alt="" />
          </div>
        </div>
        <div class="product-info">
          <h3>${product.title}</h3>
          <h4><i class="fa-solid fa-indian-rupee-sign"></i>${product.price}</h4>
          <a href="/product/singleproduct?id=${product._id}"
            ><button>view <i class="fa-solid fa-expand"></i></button
          ></a>
        </div>
      </div>`;
  });
  clustor !== undefined
    ? (clustor = clustor.replace("undefined", ""))
    : (clustor = `<b style="font-family: 'BlankaReg';letter-spacing: 2px;">Sorry cant find what you looking for</b>`);

  productCont.innerHTML = clustor;
}

GenderSort.addEventListener("change", function () {
  GenderSortValue = GenderSort.value;
  sortedArray = sorting(searchValue, GenderSortValue, CategorySortVlue);
  ResultInjector(sortedArray);
});
CategorySort.addEventListener("change", function () {
  CategorySortVlue = CategorySort.value;
  sortedArray = sorting(searchValue, GenderSortValue, CategorySortVlue);
  ResultInjector(sortedArray);
});
priceSort.addEventListener("change", function () {
  if (priceSort.value === "inc") {
    sortedArray = sortedArray.sort(
      (productA, productB) => productA.price - productB.price
    );
  } else if (priceSort.value === "dec") {
    sortedArray = sortedArray.sort(
      (productA, productB) => productB.price - productA.price
    );
  } else if (priceSort.value === "Newest") {
    sortedArray = sortedArray.sort((productA, productB) => {
      return new Date(productA.createdAt) - new Date(productB.createdAt);
    });
  }
  ResultInjector(sortedArray);
});

function sorting(Array, GenderSortValue, CategorySortVlue) {
  let NewArray;
  NewArray = Array.filter((product) => {
    if (GenderSortValue == "null" || GenderSortValue == null) {
      return product;
    } else if (product.category.indexOf(GenderSortValue) !== -1) {
      return product;
    }
  });
  NewArray = NewArray.filter((product) => {
    if (CategorySortVlue === "null" || CategorySortVlue === null) {
      return product;
    } else if (product.category.indexOf(CategorySortVlue) !== -1) {
      return product;
    }
  });
  return NewArray;
}
async function apii(url) {
  let search = await axios.get(url);
  searchValue = search.data.products;
  sortedArray = search.data.products;
}
apii("/product/sort");
