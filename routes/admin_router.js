import express from "express";
import { upload } from "../middleware/multer.js";
import { admin, agregarUsuario, borrandoJuego, borrandoUsuario, borrarJuego, borrarUsuario, editUser, games, orders, registrandoUser, registrarJuego, registroJuegos, subirEdicionUser, users, viewOrder } from "../controllers/admin/adminController.js";
import rutaProteger from "../middleware/rutasProteger.js";
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

const routerAdmin = express.Router();

routerAdmin.get('/', rutaProteger, admin);
routerAdmin.get('/orders', rutaProteger, orders);
routerAdmin.get('/us', rutaProteger, users);
routerAdmin.get('/us/add', rutaProteger, agregarUsuario);
routerAdmin.get("/us/edit/:id", rutaProteger, editUser);
routerAdmin.get("/us/delete/:id", rutaProteger, borrarUsuario);
routerAdmin.get('/games', rutaProteger, games);
routerAdmin.get("/games/add", rutaProteger, registroJuegos);
routerAdmin.get("/games/delete/:id", rutaProteger, borrarJuego);
routerAdmin.get("/orders/view/:id_carrito", rutaProteger, viewOrder);

routerAdmin.post('/us', rutaProteger, registrandoUser);
routerAdmin.post("/us/editsuccess", rutaProteger, subirEdicionUser);
routerAdmin.post("/us/deletesuccess", rutaProteger, borrandoUsuario);
routerAdmin.post('/games', upload.single('uploaded_file'), rutaProteger,  registrarJuego);
routerAdmin.post("/games/editsuccess")
routerAdmin.post("/games/deletesuccess", rutaProteger, borrandoJuego);

export default routerAdmin;