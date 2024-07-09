const menu=document.getElementById("menu")
const cartBtn=document.getElementById("cart-btn")
const cartModal=document.getElementById("cart-modal")
const cartItemsContainer=document.getElementById("cart-items")
const cartTotal=document.getElementById("cart-total")
const checkoutBtn=document.getElementById("checkout-btn")
const closeModalBtn=document.getElementById("close-modal-btn")
const cartCounter=document.getElementById("cart-count")
const addressInput=document.getElementById("address")
const addressWarn=document.getElementById("address-warn")
let cart=[]



cartBtn.addEventListener("click",(evt)=>{

    updateCart();
cartModal.style.display="flex" //isto serve para mostrar o modal escondido


})

//forma 1 de fechar o modal
closeModalBtn.addEventListener("click",(evt)=>{
   // alert("tem certeza que quer fechar")
    cartModal.style.display="none"  //isto serve para fechar o menu
})

//forma 2 de fechar o modal
cartModal.addEventListener("click", (evt)=>{
   if(evt.target==cartModal) {
    cartModal.style.display="none"
   }
})
menu.addEventListener("click", (evt)=>{
    /*
if(evt.target==button){
    console.log(evt.target)
    alert("pegou o botao")
}
*/
    //console.log(evt.target)

    let parentButton = evt.target.closest(".add-to-cart-btn")//aqui estamos procurando a classe
//console.log(parentButton)

//aqui estamos verificando se foi clicado o btn add e pegando o nome e preço do produto
if(parentButton){
    const name=parentButton.getAttribute("data-name")
    const price=parseFloat(parentButton.getAttribute("data-price"))
// console.log(nome)
     //console.log(price)

    //adicionar ao carrinho
    addToCart(name,price)
    
}
})

//function para add to cart

function addToCart(name,price){
    /* ao inves de usar isso
cart+=name
cart+=price
//console.log(cart)
usamos .push
*/
const existItem=cart.find(item =>item.name==name)


if(existItem){
//se o item ja existe aumenta a quantity para 1
existItem.quantity+=1;

}else{

   cart.push({
    name,
    price,
    quantity: 1, //começando com quantidade 1
}) 

}


updateCart()

}

//atualiza o carrinho
function updateCart(){
 cartItemsContainer.innerHTML=""
    let total=0

    cart.map((el)=>{
        const cartItemElement= document.createElement("div")
        cartItemElement.classList.add("flex","justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML=`
        <div class="flex items-center justify-between">
        <div>
    <p class="font-medium">${el.name}</p>
    <p>Qtd: ${el.quantity}</p>
    <p class="font-medium mt-2">${el.price.toFixed(2)} Kz</p>
        </div>
       
        <button class="remove-from-cart-btn" data-name="${el.name}">Remover</button>
      
        </div>
        `

        //calculando o total
total+=el.price * el.quantity;


        cartItemsContainer.appendChild(cartItemElement)
        //cartTotal.innerHTML=el.name
        
        
            //testando... funcionou
            /*
        console.log(el.name)
        console.log(el.price)
        console.log(el.quantity)
        */
        
        })

        cartTotal.textContent=total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "AOA"
        })

        cartCounter.innerHTML=cart.length

}


//para remover item do carrinho
cartItemsContainer.addEventListener("click",(evt)=>{
if(evt.target.classList.contains("remove-from-cart-btn")){
    const name=evt.target.getAttribute("data-name")

   removeItemCart(name)
}

})

function removeItemCart(name){
const index=cart.findIndex(el=> el.name==name)

if(index!=-1){
    const item=cart[index]

    if(item.quantity>1){
        item.quantity-=1
        updateCart()
        return;
    }
    cart.splice(index,1)
    updateCart()
   
}
}

addressInput.addEventListener("input",(evt)=>{
let inputValue=evt.target.value

if(inputValue!==""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
}

})
//finalizar pedido
checkoutBtn.addEventListener("click",()=>{
    
    const isOpen= restaurantOpen()
    if(!isOpen){
       Toastify({
        text: "ops restaurante fechado",
        duration: 3000,  
        close: true,
        gravity: "top",
        position: "rigth",
        stopOnFocus: true,
        style:{
            background: "#ef4444",
        },
       }).showToast();
    }

    
    if(cart.length==0) return;
    if(addressInput.value==""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
//enviar o pedido para api whats

const cartItems=cart.map((item)=>{
    return(
        `${item.name} Quantidade: (${item.quantity}) Preço: ${item.price} Kz| `
    )
}).join("")
const message= encodeURIComponent(cartItems)
const phone= "922553768"

window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank").setTimeout(3000)

console.log(cartItems)
cart=[]
updateCart();

})

//para verificar a hora

function restaurantOpen(){
    const data=new Date()
    const hora= data.getHours();
     return hora >=18 &&  hora <22; //true restaurante aberto

}
const spanItem=document.getElementById("date-span")
const isOpen= restaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500") 
}  