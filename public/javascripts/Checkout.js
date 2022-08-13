let onof = document.querySelector("#profile-cont-off");
let profile = document.querySelector(".profile-cont");
let totalprice = document.querySelector(".checkout-price").children;
let navcart = document.getElementById("navprice");
let checkout = document.getElementById("checkout");
let badge = document.querySelector(".badge");
const increment = async (action, id) => {
  let quantitycode = document.getElementById(id);
  let quantity = await axios.get(`/cart/quantity?val=${action}&id=${id}`);
  let res = quantity.data.quantities;
  if (res.ProductQuantity > 0) {
    quantitycode.innerHTML = `
              <img src="../images/uploads/${res.ProductImg}" alt="" />
              <h2>${res.ProductName}</h2>
              <div class="product-colors">
                <h2>color:</h2>
                <div
                  class="color"
                  style="background: ${res.ProductColor}"
                ></div>
              </div>
              <div class="product-size">
                <h2>SIZE:</h2>
                <div class="size">${res.ProductSize}</div>
              </div>
              <div class="product-quantity">
                <i
                  class="fa-solid fa-plus"
                  onclick="increment('inc','${res._id}')"
                ></i>
                <div class="size">${res.ProductQuantity}</div>
                <i
                  class="fa-solid fa-minus"
                  onclick="increment('dec','${res._id}')"
                ></i>
              </div>
              <div class="product-price">
                <i class="fa-solid fa-indian-rupee-sign"></i>
                <h2>${res.ProductPrice * res.ProductQuantity}</h2>
              </div>
            `;
  } else {
    quantitycode.parentElement.removeChild(quantitycode);
    badge.innerText -= 1;
  }

  let resquantity = quantity.data.totalprice;
  console.log(a);

  totalprice[1].children[1].innerHTML = ` <i class="fa-solid fa-indian-rupee-sign"></i>${resquantity.totalprice}`;
  totalprice[4].children[1].innerHTML = ` <i class="fa-solid fa-indian-rupee-sign"></i>${resquantity.totalprice}`;
  navcart.innerHTML = ` <i class="fa-solid fa-indian-rupee-sign"></i>${resquantity.totalprice}`;
};

profile.addEventListener("click", function () {
  profile.classList.toggle("profile-active");
});
onof.addEventListener("click", function () {
  profile.classList.toggle("profile-active");
});
