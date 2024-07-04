
    // Variable global para almacenar el carrito de compras
    let cart = [];

    // Función para inicializar el Slider con Swiper
    var TrandingSlider = new Swiper('.tranding-slider', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    // Función para añadir productos al carrito
    function addToCart(productName, productPrice, productDescription, productImage, productSize) {
      const existingItem = cart.find(item => item.name === productName && item.size === productSize);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const product = {
          name: productName,
          price: productPrice,
          description: productDescription,
          image: productImage,
          quantity: 1,
          size: productSize
        };
        cart.push(product);
      }
      saveCart(); // Guardar el carrito en localStorage
      displayCart(); // Mostrar el carrito actualizado en la página
      alert(`Se añadió "${productName}" (${productSize}) al carrito.`);
    }

    // Función para mostrar el carrito en la página
    function displayCart() {
      const cartItems = document.querySelector('#cartItems tbody');
      if (!cartItems) return; // Si no existe el elemento, salir de la función

      cartItems.innerHTML = cart.map((product, index) => `
    <tr>
      <td>
        <img src="${product.image}" alt="${product.name}" class="img-fluid" style="max-width: 50px;">
        ${product.name} (${product.size}) <!-- Mostrar el nombre y la talla del producto -->
      </td>
      <td>${product.price ? '$' + product.price.toFixed(2) : ''}</td>
      <td>
        <input type="number" value="${product.quantity}" min="1" class="form-control" style="width: 70px;" onchange="updateQuantity(${index}, this.value)">
      </td>
      <td>${product.price ? '$' + (product.price * product.quantity).toFixed(2) : ''}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Eliminar</button>
      </td>
    </tr>
  `).join('') + `
    <tr>
      <td colspan="3" class="text-right"><strong>Total:</strong></td>
      <td colspan="2"><strong>$${calculateTotal().toFixed(2)}</strong></td>
    </tr>
  `;

      const resetCartBtn = document.querySelector('#resetCartBtn');
      if (resetCartBtn) {
        resetCartBtn.classList.toggle('d-none', cart.length === 0);
      }
    }

    // Función para actualizar la cantidad de un producto en el carrito
    function updateQuantity(index, quantity) {
      if (quantity < 1) {
        removeFromCart(index); // Eliminar producto si la cantidad es menor que 1
      } else {
        cart[index].quantity = parseInt(quantity);
        saveCart(); // Guardar el carrito en localStorage
        displayCart(); // Actualizar la visualización del carrito
      }
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(index) {
      cart.splice(index, 1); // Eliminar producto del arreglo cart
      saveCart(); // Guardar el carrito en localStorage
      displayCart(); // Actualizar la visualización del carrito
    }

    // Función para calcular el total del carrito
    function calculateTotal() {
      return cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    }

    // Función para reiniciar el carrito
    function resetCart() {
      cart = []; // Vaciar el arreglo cart
      saveCart(); // Guardar el carrito vacío en localStorage
      displayCart(); // Actualizar la visualización del carrito
    }

    // Función para guardar el carrito en localStorage
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Función para cargar el carrito desde localStorage al cargar la página
    function loadCart() {
      const cartFromStorage = localStorage.getItem('cart');
      if (cartFromStorage) {
        cart = JSON.parse(cartFromStorage); // Cargar el carrito desde localStorage
        displayCart(); // Mostrar el carrito en la página
      }
    }

    // Evento de carga del DOM
    document.addEventListener('DOMContentLoaded', function () {
      loadCart(); // Cargar el carrito desde localStorage al cargar la página

      const productsContainer = document.getElementById('products');
      if (productsContainer) {
        // Event listener para añadir productos al carrito en index.html
        productsContainer.addEventListener('click', function (event) {
          if (event.target && event.target.classList.contains('addToCartBtn')) {
            const productName = event.target.dataset.name;
            const productPrice = parseFloat(event.target.dataset.price);
            const productDescription = event.target.dataset.description;
            const productImage = event.target.dataset.image;
            const sizeSelector = event.target.parentElement.querySelector('.size-selector');
            const productSize = sizeSelector ? sizeSelector.value : 'M'; // Obtener la talla seleccionada

            addToCart(productName, productPrice, productDescription, productImage, productSize); // Llamar a addToCart con los datos del producto y la talla
          }
        });
      }

      const resetCartBtn = document.getElementById('resetCartBtn');
      if (resetCartBtn) {
        // Event listener para reiniciar el carrito en index.html
        resetCartBtn.addEventListener('click', function () {
          resetCart(); // Llamar a resetCart al hacer clic en el botón "Reiniciar Carrito"
        });
      }

      // Mostrar el carrito en detalles.html
      displayCart();
    });

    //ENVIAR POR WHATSAPP

    // Función para enviar el carrito por WhatsApp
    function sendCartViaWhatsApp() {
      const total = calculateTotal().toFixed(2);
      const message = `¡Hola! Aquí tienes mi lista de compras:\n\n${formatCartForWhatsApp()}\nTotal: $${total}\n\n¡Gracias!`;

      // Crear un elemento temporal de textarea para copiar el mensaje al portapapeles
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = message;
      tempTextArea.style.position = 'fixed';  // Evitar que se desplace la página
      tempTextArea.style.opacity = 0;         // Hacer invisible el textarea
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');            // Copiar el contenido al portapapeles
      document.body.removeChild(tempTextArea); // Eliminar el textarea temporal

      // Alerta después de copiar al portapapeles
      alert(`¡MENSAJE COPIADO AL PORTAPAPELES! Por favor, si el pedido no carga en el chat, pega este mensaje:\n\n${message}`);

      // Reemplaza '1234567890' con el número de WhatsApp al que deseas enviar el mensaje
      const phoneNumber = '573155540282';
      const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

      // Abrir en una nueva ventana o redireccionar a la URL de WhatsApp
      window.open(url, '_blank');
      resetCart();
    }

    // Función para formatear el carrito para WhatsApp
    function formatCartForWhatsApp() {
      return cart.map(product => `${product.name} (${product.size}): ${product.quantity} x $${(product.price * product.quantity).toFixed(2)}`).join('\n');
    }
  