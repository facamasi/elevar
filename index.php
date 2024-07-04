<?php
$servername = "localhost"; // Cambia esto si tu servidor es diferente
$username = "tu_usuario";  // Tu usuario de la base de datos
$password = "tu_contraseña"; // Tu contraseña de la base de datos
$dbname = "tienda_camisetas"; // El nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Aquí puedes comenzar a realizar consultas o acciones con la base de datos
// Por ejemplo, seleccionar datos de la tabla de productos
$sql = "SELECT * FROM productos";
$result = $conn->query($sql);

// Verificar si hay resultados y mostrarlos en la página
if ($result->num_rows > 0) {
    // Iterar sobre cada fila de resultados
    while($row = $result->fetch_assoc()) {
        echo "<div class='col-6 col-md-3 mt-5 text-center Products'>";
        echo "<div class='card'>";
        echo "<a href='detalles.html?name=" . $row['nombre'] . "&price=" . $row['precio'] . "&description=" . $row['descripcion'] . "&image=" . $row['imagen'] . "&qr=" . $row['qr'] . "'>";
        echo "<img src='" . $row['imagen'] . "' class='card-img-top' alt='Camiseta'>";
        echo "</a>";
        echo "<div class='card-body'>";
        echo "<a href='detalles.html?name=" . $row['nombre'] . "&price=" . $row['precio'] . "&description=" . $row['descripcion'] . "&image=" . $row['imagen'] . "&qr=" . $row['qr'] . "'>";
        echo "<h4 class='card-title'>" . $row['nombre'] . "</h4>";
        echo "</a>";
        echo "<div class='d-flex align-items-center justify-content-between'>";
        echo "<p class='card-text mb-0'>$" . $row['precio'] . "</p>";
        echo "<select class='form-control size-selector' data-name='" . $row['nombre'] . "'>";
        echo "<option value='S'>S</option>";
        echo "<option value='M'>M</option>";
        echo "<option value='L'>L</option>";
        echo "<option value='XL'>XL</option>";
        echo "</select>";
        echo "</div>";
        echo "<br>";
        echo "<button class='btn btn-primary addToCartBtn' data-name='" . $row['nombre'] . "' data-price='" . $row['precio'] . "' data-description='" . $row['descripcion'] . "' data-image='" . $row['imagen'] . "'>Añadir al Carrito</button>";
        echo "</div>";
        echo "</div>";
        echo "</div>";
    }
} else {
    echo "No se encontraron productos.";
}

// Cerrar la conexión a la base de datos al finalizar las operaciones
$conn->close();
