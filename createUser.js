const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb+srv://bertello:condarco2113@cluster0.zmg1ksu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Crear el modelo de usuario
const User = mongoose.model('User', userSchema);

// Crear un nuevo usuario con una contraseña encriptada
const username = 'Bertello'; // Cambia esto por el nombre de usuario deseado
const password = 'asd11aaa1'; // Cambia esto por la contraseña deseada

bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
        console.error('Error en la encriptación de la contraseña', err);
        process.exit(1);
    }

    const newUser = new User({
        username,
        password: hash
    });

    try {
        await newUser.save();
        console.log('Usuario creado exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al guardar el usuario en la base de datos', error);
        process.exit(1);
    }
});
