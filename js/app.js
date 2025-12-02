// ==============================
// VALIDAR SI YA ESTÁ LOGUEADO
// ==============================
if (location.pathname.includes("inicio.html")) {
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!user) location.href = "index.html";
    document.getElementById("saludo").textContent = "Bienvenido, " + user.nombre;
}

// ==============================
// LOGIN
// ==============================
function login() {
    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPass").value;
    let error = document.getElementById("loginError");

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let user = usuarios.find(u => u.email === email && u.password === pass);

    if (user) {
        localStorage.setItem("usuarioActivo", JSON.stringify(user));
        location.href = "inicio.html";
    } else {
        error.textContent = "Usuario o contraseña incorrectos";
    }
}

// ==============================
// CERRAR SESIÓN
// ==============================
function cerrarSesion() {
    if (confirm("¿Seguro deseas salir?")) {
        localStorage.removeItem("usuarioActivo");
        location.href = "index.html";
    }
}

// ==============================
// VALIDACIONES EN TIEMPO REAL
// ==============================

function validarNombre() {
    let nombre = document.getElementById("nombre").value;
    let error = document.getElementById("errorNombre");

    if (nombre.length < 3) {
        error.textContent = "El nombre debe tener al menos 3 caracteres";
        return false;
    }
    error.textContent = "";
    return true;
}

function validarEmail() {
    let email = document.getElementById("email").value;
    let error = document.getElementById("errorEmail");

    let regex = /\S+@\S+\.\S+/;

    if (!regex.test(email)) {
        error.textContent = "Correo no válido";
        return false;
    }
    error.textContent = "";
    return true;
}

function validarPass() {
    let pass = document.getElementById("password").value;
    let error = document.getElementById("errorPass");

    if (pass.length < 5) {
        error.textContent = "La contraseña debe tener mínimo 5 caracteres";
        return false;
    }
    error.textContent = "";
    return true;
}

// Eventos de validación
document.getElementById("nombre")?.addEventListener("input", validarNombre);
document.getElementById("email")?.addEventListener("input", validarEmail);
document.getElementById("password")?.addEventListener("input", validarPass);


// ==============================
// CRUD DE USUARIOS
// ==============================

function registrarUsuario() {
    let nombres = document.getElementById("nombres").value.trim();
    let apellidos = document.getElementById("apellidos").value.trim();
    let email = document.getElementById("email").value.trim();
    let fecha = document.getElementById("fecha").value;
    let pass = document.getElementById("password").value;
    let pass2 = document.getElementById("password2").value;

    let valido = true;

    // Validaciones básicas
    if (nombres.length < 2) {
        document.getElementById("errorNombres").textContent = "Ingresa tus nombres";
        valido = false;
    } else document.getElementById("errorNombres").textContent = "";

    if (apellidos.length < 2) {
        document.getElementById("errorApellidos").textContent = "Ingresa tus apellidos";
        valido = false;
    } else document.getElementById("errorApellidos").textContent = "";

    if (!email.includes("@") || !email.includes(".")) {
        document.getElementById("errorEmail").textContent = "Correo inválido";
        valido = false;
    } else document.getElementById("errorEmail").textContent = "";

    if (!fecha) {
        document.getElementById("errorFecha").textContent = "Elige tu fecha de nacimiento";
        valido = false;
    } else document.getElementById("errorFecha").textContent = "";

    if (pass.length < 6) {
        document.getElementById("errorPass").textContent = "Mínimo 6 caracteres";
        valido = false;
    } else document.getElementById("errorPass").textContent = "";

    if (pass !== pass2) {
        document.getElementById("errorPass2").textContent = "Las contraseñas no coinciden";
        valido = false;
    } else document.getElementById("errorPass2").textContent = "";

    if (!valido) return;

    // Guardar usuario
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push({
        nombres,
        apellidos,
        email,
        fecha,
        pass
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Registro exitoso");

    location.href = "index.html";
}

document.getElementById("tablaUsuarios") && mostrarUsuarios();

// ==============================
// EDITAR USUARIO
// ==============================
function editarUsuario(i) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));

    let nuevoNombre = prompt("Nuevo nombre:", usuarios[i].nombre);
    let nuevoEmail = prompt("Nuevo correo:", usuarios[i].email);

    if (nuevoNombre && nuevoEmail) {
        usuarios[i].nombre = nuevoNombre;
        usuarios[i].email = nuevoEmail;

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        mostrarUsuarios();
    }
}

// ==============================
// ELIMINAR USUARIO
// ==============================
function eliminarUsuario(i) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        let usuarios = JSON.parse(localStorage.getItem("usuarios"));
        usuarios.splice(i, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        mostrarUsuarios();
    }
}

// ==============================
// BÚSQUEDA DE USUARIOS
// ==============================
function buscarUsuario() {
    let texto = document.getElementById("buscar").value.toLowerCase();
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let tabla = document.getElementById("tablaUsuarios");

    tabla.innerHTML = "";

    usuarios
        .filter(u => u.nombre.toLowerCase().includes(texto))
        .forEach((u, i) => {
            tabla.innerHTML += `
                <tr>
                    <td>${u.nombre}</td>
                    <td>${u.email}</td>
                    <td>
                        <button onclick="editarUsuario(${i})">Editar</button>
                        <button onclick="eliminarUsuario(${i})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
}

// =============================
// CARGAR SALUDO DEL USUARIO
// =============================
let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
if (!usuarioActivo) {
    location.href = "index.html";
} else {
    document.getElementById("saludo").textContent =
        "Bienvenido, " + usuarioActivo.nombres + " " + usuarioActivo.apellidos;
}

// =============================
// CRUD CLIENTES
// =============================

let editIndex = null;

// Cargar lista al entrar
mostrarClientes();

// GUARDAR O EDITAR CLIENTE
function guardarCliente() {
    let nombre = document.getElementById("cNombre").value.trim();
    let edad = document.getElementById("cEdad").value;
    let altura = document.getElementById("cAltura").value;
    let peso = document.getElementById("cPeso").value;

    if (!nombre || !edad || !altura || !peso) {
        alert("Todos los campos son obligatorios");
        return;
    }

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    let cliente = { nombre, edad, altura, peso };

    if (editIndex === null) {
        clientes.push(cliente);
    } else {
        clientes[editIndex] = cliente;
        editIndex = null;
        document.getElementById("btnGuardar").textContent = "Guardar Cliente";
    }

    localStorage.setItem("clientes", JSON.stringify(clientes));

    limpiarFormulario();
    mostrarClientes();
}

// LISTAR CLIENTES
function mostrarClientes() {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    let tabla = document.getElementById("tablaClientes");
    let buscar = document.getElementById("buscarCliente").value.toLowerCase();

    tabla.innerHTML = "";

    clientes.forEach((c, index) => {
        if (c.nombre.toLowerCase().includes(buscar)) {
            tabla.innerHTML += `
                <tr>
                    <td>${c.nombre}</td>
                    <td>${c.edad}</td>
                    <td>${c.altura} cm</td>
                    <td>${c.peso} kg</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarCliente(${index})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${index})">Eliminar</button>
                    </td>
                </tr>
            `;
        }
    });
}

// EDITAR CLIENTE
function editarCliente(index) {
    let clientes = JSON.parse(localStorage.getItem("clientes"));

    let c = clientes[index];

    document.getElementById("cNombre").value = c.nombre;
    document.getElementById("cEdad").value = c.edad;
    document.getElementById("cAltura").value = c.altura;
    document.getElementById("cPeso").value = c.peso;

    editIndex = index;
    document.getElementById("btnGuardar").textContent = "Actualizar Cliente";
}

// ELIMINAR CLIENTE
function eliminarCliente(index) {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;

    let clientes = JSON.parse(localStorage.getItem("clientes"));
    clientes.splice(index, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    mostrarClientes();
}

// LIMPIAR FORMULARIO
function limpiarFormulario() {
    document.getElementById("cNombre").value = "";
    document.getElementById("cEdad").value = "";
    document.getElementById("cAltura").value = "";
    document.getElementById("cPeso").value = "";
}
