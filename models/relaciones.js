// relationships.js
import Videojuego from './Videojuego.js';
import Plataforma from './Plataforma.js';
import VideojuegoPlataforma from './VideojuegoPlataforma.js';
import Carrito from './Carrito.js';
import CarritoVideojuego from './CarritoVideojuego.js';
import Usuario from './Usuario.js';
import MetodoPago from './MetodoPago.js';

// Configuración de relaciones

export default function defineRelationships() {
    // Configurar relaciones entre Videojuego y Plataforma
Videojuego.belongsToMany(Plataforma, { 
    through: VideojuegoPlataforma,
    foreignKey: 'id_videojuego', // Clave foránea en videojuegos_plataformas
    otherKey: 'id_plataforma',  // Otra clave foránea
});

Plataforma.belongsToMany(Videojuego, { 
    through: VideojuegoPlataforma,
    foreignKey: 'id_plataforma',
    otherKey: 'id_videojuego',
});

VideojuegoPlataforma.belongsTo(Videojuego, { foreignKey: 'id_videojuego' });
VideojuegoPlataforma.belongsTo(Plataforma, { foreignKey: 'id_plataforma' });


// Relación muchos a muchos entre Carrito y Videojuego, pasando por CarritoVideojuego
Carrito.belongsToMany(Videojuego, {
    through: CarritoVideojuego,
    foreignKey: 'id_carrito',
    otherKey: 'id_videojuego'
});

Videojuego.belongsToMany(Carrito, {
    through: CarritoVideojuego,
    foreignKey: 'id_videojuego',
    otherKey: 'id_carrito'
});

// Relación entre Carrito y CarritoVideojuego
Carrito.hasMany(CarritoVideojuego, { foreignKey: 'id_carrito' });
CarritoVideojuego.belongsTo(Carrito, { foreignKey: 'id_carrito' });

// Relación entre Videojuego y CarritoVideojuego
Videojuego.hasMany(CarritoVideojuego, { foreignKey: 'id_videojuego' });
CarritoVideojuego.belongsTo(Videojuego, { foreignKey: 'id_videojuego' });


Usuario.belongsToMany(Carrito, {
    through: MetodoPago,
    foreignKey: 'id_usuario',
    otherKey: 'id_carrito'
});

Carrito.belongsToMany(Usuario, {
    through: MetodoPago,
    foreignKey: 'id_carrito',
    otherKey: 'id_usuario'
})

Usuario.hasMany(MetodoPago, { foreignKey: 'id_usuario' });
MetodoPago.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Carrito.hasMany(MetodoPago, { foreignKey: 'id_carrito' })
MetodoPago.belongsTo(Carrito, { foreignKey: 'id_carrito' });

Carrito.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Usuario.hasMany(Carrito, { foreignKey: 'id_carrito' });


}
