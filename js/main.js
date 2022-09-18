const Clickbutton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = [];
let productos = [];



function obtenerProductos() {
  fetch('http://127.0.0.1:5500/data/productos.json')
  .then((response)=> response.json())
  .then ((productosData)=>{
    agregarProductos(productosData);  
  })
}

function agregarProductos(productosData){
  for (let producto of productosData) {
    let objProducto = new Producto(producto.title, producto.precio, producto.img, producto.descripcion, producto.cantidad);
  
    productos.push(objProducto);
    crearProducto (objProducto);
  }
}

  

function addToCarritoItem(e){
  const button = e.target
  const item = button.closest('.card')
  const itemTitle = item.querySelector('.card-title').textContent;
  const itemPrice = item.querySelector('.precio').textContent;
  const itemImg = item.querySelector('.card-img-top').src;
  
  const newItem = {
    title: itemTitle,
    precio: itemPrice,
    img: itemImg,
    cantidad: 1
  }

  addItemCarrito(newItem)
}


function addItemCarrito(newItem){

  const alert = document.querySelector('.alert')

  setTimeout( function(){
    alert.classList.add('hide')
  }, 2000)
    alert.classList.remove('hide')

  const InputElemnto = tbody.getElementsByClassName('input__elemento')
  for(let i =0; i < carrito.length ; i++){
    if(carrito[i].title.trim() === newItem.title.trim()){
      carrito[i].cantidad ++;
      const inputValue = InputElemnto[i]
      inputValue.value++;
      CarritoTotal()
      return null;
    }
  }
  
  carrito.push(newItem)
  
  renderCarrito()
} 


function renderCarrito(){
  tbody.innerHTML = ''
  carrito.map(item => {
    const tr = document.createElement('tr')
    tr.classList.add('ItemCarrito')
    const Content = `
    
    <th scope="row">1</th>
            <td class="table__productos">
              <img src=${item.img}  alt="">
              <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${item.cantidad} class="input__elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
    
    `
    tr.innerHTML = Content;
    tbody.append(tr)

    tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
    tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
  })
  CarritoTotal()
}

function CarritoTotal(){
  let Total = 0;
  const itemCartTotal = document.querySelector('.itemCartTotal')
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ''))
    Total = Total + precio*item.cantidad
  })

  itemCartTotal.innerHTML = `Total $${Total}`
  addLocalStorage()
}

function removeItemCarrito(e){
  const buttonDelete = e.target
  const tr = buttonDelete.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  for(let i=0; i<carrito.length ; i++){

    if(carrito[i].title.trim() === title.trim()){
      carrito.splice(i, 1)
    }
  }

  const alert = document.querySelector('.remove')

  setTimeout( function(){
    alert.classList.add('remove')
  }, 2000)
    alert.classList.remove('remove')

  tr.remove()
  CarritoTotal()
}

function sumaCantidad(e){
  const sumaInput  = e.target
  const tr = sumaInput.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  carrito.forEach(item => {
    if(item.title.trim() === title){
      sumaInput.value < 1 ?  (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      CarritoTotal()
    }
  })
}

function addLocalStorage(){
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function(){
  const storage = JSON.parse(localStorage.getItem('carrito'));
  obtenerProductos(); 
  if(storage){
    carrito = storage;
    renderCarrito()
  }
}


function crearProducto(producto){
  let elemento = document.createElement("div");
  

  let divFlex = document.createElement("div");
  divFlex.className = 'col d-flex justify-content-center mb-4';
  elemento.appendChild(divFlex);
  let card = document.createElement("div");
  card.className = "card shadow mb-1";
  card.style = "width: 20rem;";

  divFlex.appendChild(card);


  let cardTitulo = document.createElement("h5");
  cardTitulo.className = "card-title pt-2 text-center";
  cardTitulo.innerText = producto.title;
  card.appendChild(cardTitulo);

  let cardImg = document.createElement ("img");
    cardImg.className = "card-img-top";
    cardImg.src = "./images/"+producto.img;

  card.appendChild(cardImg);

  let cardBody = document.createElement("div");
  cardBody.className = "card-body";
  card.appendChild(cardBody);

  let parrafo = document.createElement ("p");
  parrafo.className = "card-text description text-dark";
  parrafo.innerText = producto.descripcion;
  cardBody.appendChild(parrafo);

  let h5Precio = document.createElement ("h5");
  h5Precio.className = "text primary";
  h5Precio.innerText = "Precio:";
  cardBody.appendChild(h5Precio);

  let spancard = document.createElement ("span");
  spancard.className = "precio";
  spancard.innerText = producto.precio;
  cardBody.appendChild(spancard);

  let agregarprod = document.createElement ("div");
  agregarprod.className = "d-grid gap-2";
  cardBody.appendChild(agregarprod);

  let boton = document.createElement ("button");
  boton.className = "btn btn-primary button";
  boton.innerText = "Añadir al Carrito";
  boton.addEventListener('click', addToCarritoItem);
  agregarprod.appendChild(boton);


  let divproductos = document.getElementById("contenedorproduc");
  divproductos.appendChild(elemento);
}


