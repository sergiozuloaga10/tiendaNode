import express from "express";
import session from "express-session"
import router from "./routes/inicio_router.js";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import routerCredenciales from "./routes/credenciales_router.js"
import db from "./config/db.js";
import routerAdmin from "./routes/admin_router.js";
import routerTrabajador from "./routes/trabajador_router.js";
import defineRelationships from "./models/relaciones.js";
import multer from "multer";

//Crear la aplicacion
const app = express();

//app.use(multer());

//habilitar cookie parser
app.use(cookieParser())

//accesos a los datos del formulario
app.use(express.urlencoded({extended:true}));

//CSRF, forma global para la aplicación.
//app.use(csrf({cookie:true}))

// Middleware CSRF global
const csrfProtection = csrf({ cookie: true });

// Aplica CSRF solo a rutas seleccionadas
app.use((req, res, next) => {
    // Desactiva CSRF para rutas específicas
    const exemptRoutes = [
        '/adm/games', // Ruta donde quieres desactivar CSRF
        '/adm/games/deletesuccess',
        '/adm/games/edit/:id',
        '/adm/games/editsuccess',
        '/trb/inventario'
    ];
    if (exemptRoutes.includes(req.path)) {
        return next();
    }
    csrfProtection(req, res, next); // Aplicar CSRF normalmente
});


//conectando a la base de datos
try{
    await db.authenticate();
    db.sync();
    console.log("Conexion exitosa a la b.d");
} catch(error){
    console.log(error);
}
//iniciamos las relaciones muchos a muchos
defineRelationships();

//pug
app.set("view engine", "pug");
app.set("views", "./views");

//carpeta publica
app.use(express.static("public"));

//sesion
app.use(session({
    secret: 'mi_secreto',  // Usar una clave secreta única
    resave: false,  // No resguardar la sesión si no hay cambios
    saveUninitialized: true,  // Guardar sesiones aún si no están inicializadas
    cookie: { secure: false }  // Cambia a true si usas HTTPS
}));

//routing
app.use("/", routerCredenciales);
app.use("/", router);
app.use("/adm", routerAdmin);
app.use("/trb", routerTrabajador);

//definiendo el puerto
const port = 2802;
app.listen(port, () => {
    console.log(`Esperando peticiones`);
})
