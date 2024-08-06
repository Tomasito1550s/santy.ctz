// index.html
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 4);
    const maxDateString = maxDate.toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.max = maxDateString;

    document.getElementById('reservation-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;

        fetch('/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, time, name, surname })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Reserva creada exitosamente');
            } else {
                alert('Error al crear la reserva');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

// admin.html
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/admin-dashboard';
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


