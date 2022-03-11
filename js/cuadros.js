//Declaracion de variables generales
let arrayProductos = [];
let carrito = [];
const URLJSON = "data/productos.json";

//LLamada AJAX a JSON
$.getJSON(URLJSON, (respuesta, estado) => {

    arrayProductos = respuesta;     //Guardamos respuesta en un array

    arrayProductos = arrayProductos.filter((elemento) => elemento.tipo == "cuadro");

    for(let producto of arrayProductos) {   //Renderizamos los productos
        producto.cantidad = 0;
        producto.total = 0;

        producto.precio = producto.precio - (producto.precio * producto.descuento);
        
        $("#contenedorProductos").append(`
            <article class="tarjetaProducto">
                <img src="${producto.url}">
                <h3>${producto.nombre}</h3>
                <p>${producto.precio}</p>
                <button class="btn-agregar" idBoton="${producto.id}">Agregar al carrito</button>
            </article>
        `) 
    };

    $(".btn-agregar").click((event) => {  //Agregamos evento al boton agregar
        let idBoton = event.target.getAttribute("idBoton");
        agregarAlCarrito(idBoton);
    });

    let totalFinal = 0;
    renderizarTotalFinal();   //Renderizamos total final

    // Obtenemos valores del storage en caso de que tuvieran elementos en paginas anteriores
    let carritoJSON = JSON.parse(sessionStorage.getItem("carrito"));
    if(carritoJSON != null) {
        carrito = JSON.parse(sessionStorage.getItem("carrito"));
        renderizarCarrito();    
        totalFinal = JSON.parse(sessionStorage.getItem("total final"));
        renderizarTotalFinal();
        eventoDisminuir();
        eventoQuitar();
    }
    

    













    // Funciones

    function renderizarCarrito() {
        $("#contenedorCarrito").empty();
    
        for(let producto of carrito) {
            $("#contenedorCarrito").append(`
                <article class="tarjetaCarrito">
                    <div>
                        <img src="${producto.url}">
                    </div>
                    <div>
                        <h3>${producto.nombre}</h3>
                        <p>Precio unitario: $${producto.precio}</p>
                        <p idCant="${producto.id}">Cantidad: ${producto.cantidad}</p>
                        <p>Total: $${producto.total}</p>
                        <button btn-menos-id="${producto.id}" class="btn-menos" id="${producto.id}">Disminuir</button>
                        <button btn-quitar-id="${producto.id}" class="btn-quitar">Quitar</button>
                    </div> 
                </article>
            `);
        }
    }


    function renderizarTotalFinal() {
        $("#contenedorTotal").empty();
    
        $("#contenedorTotal").append(`
            <p>El total final es: $${totalFinal}</p>
        `);
    }


    function agregarAlCarrito(x) {

        let productoAAgregar = arrayProductos.find(producto => producto.id == x);  //Encontramos el producto a agregar en el array en base a su id
        let productoEnCarrito = carrito.some(producto => producto.id == x); //Verificamos si el producto ya se encuentra en el carrito o no
        let productoAgregado = {};

        if(productoEnCarrito) {

            productoAgregado = carrito.find(elemento => elemento.id == productoAAgregar.id);
            productoAgregado.cantidad++;
            productoAgregado.total = productoAgregado.precio * productoAgregado.cantidad;
            totalFinal += productoAgregado.precio;
            renderizarTotalFinal();
            renderizarCarrito();

            guardarCarritoStorage();
            guardarTotalFinalStorage();
        }
        else {

            carrito.push(productoAAgregar);

            productoAgregado = carrito.find(elemento => elemento.id == productoAAgregar.id);
            productoAgregado.cantidad++;
            productoAgregado.total = productoAgregado.precio * productoAgregado.cantidad;
            totalFinal += productoAgregado.precio;
            renderizarTotalFinal();
            renderizarCarrito();

            guardarCarritoStorage();
            guardarTotalFinalStorage();
        }
        
        eventoDisminuir();
        eventoQuitar();
    }

    function eventoDisminuir() {
        $(".btn-menos").click((event) => {
            let idProduct = event.target.getAttribute("btn-menos-id");
            productoADisminuir = carrito.find((elemento) => elemento.id == idProduct);
    
            if(productoADisminuir.cantidad > 0) {
                productoADisminuir.cantidad--;
                totalFinal -= productoADisminuir.precio;
                renderizarTotalFinal();   
            }
            productoADisminuir.total = productoADisminuir.precio * productoADisminuir.cantidad;
    
            renderizarCarrito();
            eventoDisminuir();
            eventoQuitar();

            guardarCarritoStorage();
            guardarTotalFinalStorage();
        })
    }

    function eventoQuitar() {
        $(".btn-quitar").click((event) => {
            let idProduct = event.target.getAttribute("btn-quitar-id");
            let productoAQuitar = carrito.find((elemento) => elemento.id == idProduct);
            carrito = carrito.filter((elemento) => elemento.id != productoAQuitar.id);

            totalFinal -= (productoAQuitar.precio * productoAQuitar.cantidad);
            productoAQuitar.cantidad = 0;
            renderizarTotalFinal();
            

            renderizarCarrito();
            eventoDisminuir();
            eventoQuitar();

            guardarCarritoStorage();
            guardarTotalFinalStorage();
        })
    }

    function guardarCarritoStorage() {
        let carritoJSON = JSON.stringify(carrito);
        sessionStorage.setItem("carrito", carritoJSON);
    }
    function guardarTotalFinalStorage() {
        let totalFinalJSON = JSON.stringify(totalFinal);
        sessionStorage.setItem("total final", totalFinalJSON);
    }
    
});