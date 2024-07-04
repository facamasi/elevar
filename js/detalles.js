
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
    const productPrice = parseFloat(urlParams.get('price'));
    const productDescription = urlParams.get('description');
    const productImage = urlParams.get('image');
    const qrImage = urlParams.get('qr');

    // Actualizar los elementos HTML con la información del producto
    document.getElementById('productName').textContent = productName;
    document.getElementById('productPrice').textContent = `$${productPrice}`;
    document.getElementById('productDescription').textContent = productDescription;
    document.getElementById('productImage').src = productImage;

    // Actualizar el código QR con la URL correcta
    if (qrImage) {
      document.getElementById('qrImage').src = qrImage;
    }

    // Comprobar si la imagen se carga correctamente
    document.getElementById('qrImage').addEventListener('error', function () {
      console.error('Error cargando la imagen del código QR. Verifique la ruta de la imagen.');
    });

    // Cargar el carrito desde localStorage
    function loadCart() {
      const cartFromStorage = localStorage.getItem('cart');
      if (cartFromStorage) {
        return JSON.parse(cartFromStorage);
      }
      return [];
    }

    // Guardar el carrito en localStorage
    function saveCart(cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Actualizar la visualización del carrito
    function displayCart() {
      const cart = loadCart();
      const cartItems = document.querySelector('#cartItems tbody');
      if (cartItems) {
        cartItems.innerHTML = cart.map((product, index) => `
      <tr>
        <td>
          <img src="${product.image}" alt="${product.name}" class="img-fluid" style="max-width: 50px;">
          ${product.name} (${product.size})
        </td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
          <input type="number" class="form-control" value="${product.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
        </td>
        <td>$${(product.price * product.quantity).toFixed(2)}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Eliminar</button>
        </td>
      </tr>
    `).join('');
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
      <td colspan="3" class="text-right"><strong>Total:</strong></td>
      <td colspan="2"><strong>$${calculateTotal().toFixed(2)}</strong></td>
    `;
        cartItems.appendChild(totalRow);
        document.getElementById('resetCartBtn').classList.toggle('d-none', cart.length === 0);
      }
    }

    // Añadir al carrito
    function addToCart() {
      const cart = loadCart();
      const quantity = parseInt(document.getElementById('quantity').value);
      const size = document.getElementById('size').value;
      const existingItem = cart.find(item => item.name === productName && item.size === size);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ name: productName, price: productPrice, description: productDescription, image: productImage, quantity: quantity, size: size });
      }
      saveCart(cart);
      displayCart();
      alert(`Se añadió "${productName}" (${size}) al carrito.`);
    }

    // Actualizar cantidad de producto
    function updateQuantity(index, quantity) {
      const cart = loadCart();
      if (quantity < 1) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = parseInt(quantity);
      }
      saveCart(cart);
      displayCart();
    }

    // Eliminar del carrito
    function removeFromCart(index) {
      const cart = loadCart();
      cart.splice(index, 1);
      saveCart(cart);
      displayCart();
    }

    // Calcular total del carrito
    function calculateTotal() {
      const cart = loadCart();
      return cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    }

    // Reiniciar carrito
    function resetCart() {
      saveCart([]);
      displayCart();
    }

    // Inicializar
    document.addEventListener('DOMContentLoaded', displayCart);

    // Formatear el carrito para WhatsApp
    function formatCartForWhatsApp() {
      const cart = loadCart();
      return cart.map((product, index) => `${index + 1}. ${product.name} (${product.size}) - Cantidad: ${product.quantity}, Precio: $${product.price.toFixed(2)}, Subtotal: $${(product.price * product.quantity).toFixed(2)}`).join('\n');
    }

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