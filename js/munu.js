const API = "http://localhost:8000/product";
//? Сохранение тегов в переменную
// инпуты и кнопки для создания новых данных
let inpDetails = document.querySelector(".section_add_details");
let inpPrice = document.querySelector(".section_add_price");
let inpName = document.querySelector(".section_add_quantity");
let inpSales = document.querySelector(".section_add_sales");
let inpCategory = document.querySelector(".section_add_category");
let inpUrl = document.querySelector(".section_add_url");
let btnAdd = document.querySelector(".section_add_btn-add");

// тег для отображения данных в браузере
let sectionRead = document.getElementById("section_read");

// инпуты и кнопки для редактирования
let inpEditDetails = document.querySelector(".window_edit_details");
let inpEditPrice = document.querySelector(".window_edit_price");
let inpEditQuantity = document.querySelector(".window_edit_quantity");
let inpEditSales = document.querySelector(".window_edit_sales");
let inpEditCategory = document.querySelector(".window_edit_category");
let inpEditUrl = document.querySelector(".window_edit_url");
let btnEditSave = document.querySelector(".window_edit_btn-save");
let mainModal = document.querySelector(".main_modal");
let btnEditClose = document.querySelector(".window_edit_close");

// инпут и переменная для поиска
let search_txt = document.querySelector(".search-txt");
let searchValue = search_txt.value;

// кнопки для пагинации
let prevBtn = document.getElementById("prev-btn");
let nextBtn = document.getElementById("next-btn");
let currentPage = 1;

let admin_open = document.getElementById("open_admin");
admin_open.addEventListener("click", () => {
  // ! ============= Кодовое слово ===============
  let pinCode = prompt("Введите кодовое слово");
  let sectionAdd = document.querySelector(".section_add");
  let admin_panel_arr = document.getElementsByClassName("admin-panel");
  let userIcon = document.getElementById("user-panel");

  if (pinCode !== "123") {
    setTimeout(() => {
      console.log(1);
      for (i of admin_panel_arr) {
        i.style.display = "none";
      }
      sectionAdd.style.display = "none";
    }, 500);
  } else {
    setTimeout(() => {
      console.log(2);
      for (i of admin_panel_arr) {
        i.style.display = "block";
      }
      sectionAdd.style.display = "block";
    }, 1000);
  }
});

// ? ============== Code ============
//! =========== Create Start ============

function createProduct(obj) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  }).then(() => {
    readProducts();
  });
}

btnAdd.addEventListener("click", () => {
  // проверка на заполненность полей
  if (
    !inpDetails.value.trim() ||
    !inpPrice.value.trim() ||
    !inpCategory.value.trim() ||
    !inpName.value.trim() ||
    !inpSales.value.trim() ||
    !inpUrl.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  let obj = {
    details: inpDetails.value,
    price: inpPrice.value,
    nameProduct: inpName.value,
    category: inpCategory.value,
    sales: inpSales.value,
    urlImg: inpUrl.value,
  };
  createProduct(obj);

  inpDetails.value = "";
  inpPrice.value = "";
  inpName.value = "";
  inpCategory.value = "";
  inpSales.value = "";
  inpUrl.value = "";
});

//? =========== Create End ============

//! ======== Accordion Start ==========
let accordion = document.getElementsByClassName("accordion_header")[0];

accordion.addEventListener("click", event => {
  accordion.classList.toggle("active");
  let accordionBody = document.getElementById("accordion_body");
  if (accordion.classList.contains("active")) {
    accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
  } else {
    accordionBody.style.maxHeight = 0;
  }
});
//? ======== Accordion End ============
// ! ========== Read Start ===========
function readProducts() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      sectionRead.innerHTML = "";
      data.forEach(product => {
        sectionRead.innerHTML += `<div class="card">
        <div class="card2">
            <div class="front2" style="background-image: url(${product.urlImg});"></div>  
           <div class="back2">
            <div id="card_details2"><p>${product.details}</p></div>
           </div>  
          </div>
          <div class= "text">
          <h2>${product.nameProduct}</h2>
        <span class="card_price">Цена :${product.price} сом</span>
        <br>
        <span class="card_sales">Cкидка : ${product.sales} %</span>
            </div>
            <div class= "userIcon" id="user-panel">
            <img src="../img/сердце.png" alt="">
            <button class= "btnBuy">Выбрать<button>
            </div>
        <div class="admin-panel" id="admin">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1799/1799391.png"
            alt=""
            width="30"
            id=${product.id}
            class="read_del"
            onclick="deleteProduct(${product.id})"
          />
          <img src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" alt="" width="30" onclick="handleEditBtn(${product.id})"/>
        </div>
      </div>`;
      });
    });
  pageTotal();
}
readProducts();
// ? ========== Read End ===========

// ! ======== Delete Start =========
//Вариант 1 для удаления
// document.addEventListener("click", event => {
//   let dell_class = [...event.target.classList];
//   if (dell_class[0] === "read_del") {
//     // console.log(event.target.id);
//     fetch(`${API}/${event.target.id}`, {
//       method: "DELETE",
//     }).then(() => {
//       readProducts();
//     });
//   }
// });

//вариант 2 для удаления
function deleteProduct(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => {
    return readProducts();
  });
}

// ? ============= Delete End =======

// ! ============ Edit Start ==========
function editProduct(id, editedObj) {
  if (
    !inpEditDetails.value.trim() ||
    !inpEditPrice.value.trim() ||
    !inpEditCategory.value.trim() ||
    !inpEditQuantity.value.trim() ||
    !inpEditSales.value.trim() ||
    !inpEditUrl.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  fetch(`${API}/${id}`, {
    method: "PATCH", //PUT - меняет объект целиком / PATCH - меняет только те ключи которые нужны
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedObj),
  }).then(() => readProducts());
}
let editId = "";
function handleEditBtn(id) {
  mainModal.style.display = "block";
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(productObj => {
      // console.log(productObj);
      inpEditDetails.value = productObj.details;
      inpEditPrice.value = productObj.price;
      inpEditQuantity.value = productObj.nameProduct;
      inpEditCategory.value = productObj.category;
      inpEditSales.value = productObj.sales;
      inpEditUrl.value = productObj.urlImg;
      editId = productObj.id;
    });
}
btnEditClose.addEventListener("click", () => {
  mainModal.style.display = "none";
});
btnEditSave.addEventListener("click", () => {
  let editedObj = {
    details: inpEditDetails.value,
    price: inpEditPrice.value,
    nameProduct: inpEditQuantity.value,
    category: inpEditCategory.value,
    sales: inpEditSales.value,
    urlImg: inpEditUrl.value,
  };

  editProduct(editId, editedObj);
  mainModal.style.display = "none";
});
// ? ============ Edit End ============
//! ============ Search Start ===========
search_txt.addEventListener("input", e => {
  searchValue = e.target.value;
  readProducts();
});
//? ============ Search End =============

//! ============= Paginate Start =============
let countPage = 1;
function pageTotal() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      countPage = Math.ceil(data.length / 6);
    });
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProducts();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});
//? ============= Paginate Start =============
