const Sequelize = require('sequelize');
const sequelize = new Sequelize('CREDIUDO', 'Andres', '1234',
{
	
	host: 'localhost',
	dialect: 'postgres'
});

const Op = sequelize.Op;
module.exports.Op = Op;
// _________________________________________
//!Definicion de los modelos                !
//!_________________________________________!

//  1=========================================================modelo de universidad.
var Universidad = sequelize.define('Universidad', {

	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	representante: Sequelize.STRING
	})
 module.exports.Universidad = Universidad;
//  2=========================================================modelo de encuentro nacionales.
 var Enc_nace = sequelize.define('Enc_nace', {
   codigo: {type: Sequelize.INTEGER, primaryKey: true},
   nombre: Sequelize.STRING(30),
   direccion: Sequelize.STRING,
   fecha: Sequelize.DATE,
   resumen: Sequelize.STRING(8000)
  })
module.exports.Enc_nace = Enc_nace;
//  3=========================================================modelo actividad

var Actividad = sequelize.define('Actividad', {
   codigo: {type: Sequelize.INTEGER, primaryKey: true},
   nombre: Sequelize.STRING(30),
   responsable: Sequelize.STRING(100),
   direccion: Sequelize.STRING,
   fecha: Sequelize.DATE,
   capacidad: Sequelize.INTEGER,
   resumen: Sequelize.STRING(8000)
  })
module.exports.Actividad = Actividad;
//  4=========================================================modelo nucleo

var Nucleo = sequelize.define('Nucleo', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	nombre: Sequelize.STRING(30),
	direccion: Sequelize.STRING
	})
module.exports.Nucleo = Nucleo;

//  5=========================================================modelo personal

var Personal = sequelize.define('Personal', {
   cedula: {type: Sequelize.INTEGER, primaryKey: true},
   nombre: Sequelize.STRING(30),
   direccion: Sequelize.STRING,
   tmovil: Sequelize.STRING(11),
   thabitacion: Sequelize.STRING(11),
   apellido: Sequelize.STRING(30),
   password: Sequelize.STRING,
   clave: Sequelize.STRING(15),
   role: Sequelize.STRING,
   salt: Sequelize.STRING,
   email: Sequelize.STRING,
   titulo: Sequelize.STRING(100)
  })

module.exports.Personal = Personal;


//  6========================================================modelo tipo de personal

//Relacionada con el modelo personal
var Tipo_p = sequelize.define('Tipo_p', {
	codigo: {type: Sequelize.INTEGER, primaryKey: true},
	descripcion: Sequelize.STRING 
})

module.exports.Tipo_p = Tipo_p;
//  7========================================================modelo unidad

 var Unidad = sequelize.define('Unidad', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	nombre: Sequelize.STRING(30),
	mision: Sequelize.STRING(5000),
	funcion: Sequelize.STRING(5000),
	etapa: Sequelize.STRING(1000),
	objetivos: Sequelize.STRING(5000),
	proposito: Sequelize.STRING(5000),
	creacion: Sequelize.STRING(5000)

	})

module.exports.Unidad = Unidad;

//  8========================================================modelo reglamento

var Reglamento = sequelize.define('Reglamento', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	ruta: Sequelize.STRING(1000)
})

module.exports.Reglamento = Reglamento;

//  9=======================================================modelo evaluacion nucleo

var Eval_nucleo = sequelize.define('Eval_nucleo', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	ruta: Sequelize.STRING(1000)
})

module.exports.Eval_nucleo = Eval_nucleo;

//  10======================================================modelo boletines

var Boletines = sequelize.define('Boletines', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	ruta: Sequelize.STRING(1000)
})

module.exports.Boletines = Boletines;

//  11=======================================================modelo informe

var Informe = sequelize.define('Informe', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	ruta: Sequelize.STRING(1000)
})

module.exports.Informe = Informe;

//  12=======================================================modelo noticias

var Noticia = sequelize.define('Noticia', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	titulo: Sequelize.STRING(1000),
	descripcion: Sequelize.STRING(10000),
	ruta: Sequelize.STRING(1000)
})

module.exports.Noticia = Noticia;

//  13======================================================modelo Galeria
var Galeria = sequelize.define('Galeria', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	descripcion: Sequelize.STRING(1000),
	ruta: Sequelize.STRING(2000)
})

module.exports.Galeria = Galeria;


//   14======================================================modelo Cargo
var Cargo = sequelize.define('Cargo', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	descripcion: Sequelize.STRING(100), 
	referencia: Sequelize.STRING(100)
	
})

module.exports.Cargo = Cargo;


//   15======================================================modelo Sub_comision
var Sub_comision = sequelize.define('Sub_comision', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},

	nombre: Sequelize.STRING(100),
	informacion:Sequelize.STRING(1000),
	ruta: Sequelize.STRING(2000)
})

module.exports.Sub_comision = Sub_comision;

//   16======================================================modelo Galeria Sub comision unidad
var Galeria_s = sequelize.define('Galeria_s', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	descripcion: Sequelize.STRING(1000),
	ruta: Sequelize.STRING(2000)
})

module.exports.Galeria_s = Galeria_s;


//   17=======================================================modelo noticias Sub comision Unidad

var Noticia_s = sequelize.define('Noticia_s', {
	codigo:  {type: Sequelize.INTEGER, primaryKey: true},
	titulo: Sequelize.STRING(1000),
	descripcion: Sequelize.STRING(10000),
	ruta: Sequelize.STRING(1000)
})

module.exports.Noticia_s = Noticia_s;

//   18=======================================================modelo evento locales

var Eventos_l = sequelize.define('Eventos_l', {
codigo: {type: Sequelize.INTEGER, primaryKey: true},
   nombre: Sequelize.STRING(30),
   resumen: Sequelize.STRING(8000),
   responsable: Sequelize.STRING(100),
   fecha: Sequelize.DATE,
   capacidad: Sequelize.INTEGER,
   direccion: Sequelize.STRING
})

module.exports.Eventos_l = Eventos_l;



	Actividad.belongsToMany(Personal, {foreignKey: 'codigo_actividad', through: 'actividad_personal'});
    Personal.belongsToMany(Actividad, {foreignKey: 'cedula_personal', through: 'actividad_personal'});
           

            //actividad-encuentros_nacionales

    Actividad.belongsToMany(Enc_nace, {foreignKey: 'codigo_actividad', through: 'actividad_encuentros'});
    Enc_nace.belongsToMany(Actividad, {foreignKey: 'codigo_enc', through: 'actividad_encuentros'});



//Universidad.belongsToMany(Enc_nace, {through: 'Univ_enc'});
//Enc_nace.belongsToMany(Universidad, {through: 'Univ_enc'});

/*=======================================DE LA CRUZ============================================*/
	/*==========MODELOS ANDRES===========================*/
		const Instrument = sequelize.define('instruments', {
		  name: Sequelize.STRING,
		  category: Sequelize.STRING,
		  t_instrument: Sequelize.STRING
		});

		const Factor = sequelize.define('factors', {
		  nameFactor: Sequelize.STRING
		});

		const Item = sequelize.define('items', {
		  name: Sequelize.STRING
		});

		var Evento = sequelize.define('Eventos', {
		  nombre: Sequelize.STRING,
		  direccion: Sequelize.STRING,
		  dirigido_a: Sequelize.STRING,
		  fecha: Sequelize.DATE,
		  capacidad: Sequelize.INTEGER,
		  tipo: Sequelize.ENUM('nacional', 'otros'),
		  descripcion: Sequelize.STRING,
		});

		const Evaluacion = sequelize.define('Evaluacion', {
		  tipo: Sequelize.ENUM('administrativos', 'centros'),
		  name: Sequelize.STRING,
		  enfoque: Sequelize.ENUM('Auto-Evaluacion', 'Jefe-Subordinado', 'Subordinado-Jefe', 'Co-Evaluación'),
		  cantidad: Sequelize.INTEGER,
		  inicio: Sequelize.DATE,
		  fin: Sequelize.DATE
		});
	/*==========FIN MODELOS ANDRES========================*/

	/*===================RELACIONES ANDRES========================*/
		Factor.hasMany(Item, { onDelete:'cascade' }) //un factor tienen muchos items
		Item.belongsTo(Factor) //un item pertenece a un factor

		Instrument.hasMany(Item, { onDelete:'cascade' }) //un instrumento tiene muchos items
		Item.belongsTo(Instrument) //un item pertenece a un instrumento

		Instrument.hasMany(Factor, { onDelete:'cascade' }) //un instrumento tiene muchos factores
		Factor.belongsTo(Instrument) //un factor pertenece a un instrumento

		Nucleo.hasMany(Evento, { onDelete:'cascade' })	
		Evento.belongsTo(Nucleo)
	/*===================RELACIONES ANDRES========================*/

	//relaciones modelos Monasterio
	Unidad.hasMany(Evaluacion, {foreignKey: 'codigo_unidad'}); // relacion uno a muchoo unidad informe clave foranea esta en informe
	Evaluacion.belongsTo(Unidad, { foreignKey: 'codigo_unidad', onDelete: 'CASCADE', });

	Unidad.hasMany(Evaluacion, {foreignKey: 'codigo_unidad'}); // relacion uno a muchoo unidad informe clave foranea esta en informe
	Evaluacion.belongsTo(Unidad, { foreignKey: 'codigo_unidad', onDelete: 'CASCADE', });


    Unidad.hasMany(Informe, {foreignKey: 'codigo_unidad'}); // relacion uno a muchoo unidad informe clave foranea esta en informe
	Informe.belongsTo(Unidad, { foreignKey: 'codigo_unidad', onDelete: 'CASCADE', });


	Unidad.hasMany(Boletines, {foreignKey: 'codigo_unidad'});
	Unidad.hasMany(Noticia, {foreignKey: 'codigo_unidad'});
	Unidad.hasMany(Reglamento, {foreignKey: 'codigo_unidad'});
	Unidad.hasMany(Eval_nucleo, {foreignKey: 'codigo_unidad'});
	Unidad.hasMany(Galeria, {foreignKey: 'codigo_unidad'});
	
	
	
			//Relacion Nucleo

	Nucleo.hasMany(Unidad, {foreignKey: 'codigo_nucleo'});
	Nucleo.hasMany(Personal, {foreignKey: 'codigo_nucleo'});
	Personal.belongsTo(Nucleo, {foreignKey: 'codigo_nucleo'});
	


			//Relacion Personal

	Personal.hasMany(Cargo, {foreignKey: 'cedula_personal'}); //un Personal tiene muchos cargos de eval
    Cargo.belongsTo(Personal, {foreignKey: 'cedula_personal'});// un cargo pertenece a una sola persona
    Unidad.hasMany(Cargo, {foreignKey: 'codigo_unidad'});//una Unidad tiene muchos cargos
    Cargo.belongsTo(Unidad, {foreignKey: 'codigo_unidad'} )// un cargo tiene una unidad

	//relacion uno a uno entre los modelos
			//Relacion personal

   //lo quite para la presentacion	
   // Tipo_p.hasMany(Personal, {foreignKey: 'codigo_tipo'}); // relacion uno a muchoo unidad informe clave foranea esta en informe
	//Personal.belongsTo(Tipo_p, { foreignKey: 'codigo_tipo', onDelete: 'CASCADE', });


	// relacion muchos a muchos
			//actividad-personal 

	module.exports.Instrument = Instrument;
	module.exports.Factor = Factor;
	module.exports.Item = Item;
	module.exports.Evaluacion = Evaluacion;
	module.exports.Evento = Evento;
/*=======================================DE LA CRUZ============================================*/

// _________________________________________
//!Sincronizacion con la base de datos      !
//!_________________________________________!
 sequelize.sync().then(function(){
console.log('modelos creados')

});