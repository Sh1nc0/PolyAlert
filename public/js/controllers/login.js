

export async function postload(context) {

    let form = await document.getElementById('login-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        let formData = new FormData(form);
        const username = formData.get('email');
        const password = formData.get('password');
        let result;
        try {
            // On fait ensuite un fetch sur l'api pour s'authentifier
            result = await fetch('api/login', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                },
                method: 'POST',
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            });

        }
        catch (e) {
            console.error(e);
            return;
        }
        try {
            if (result.ok) {
                // Si tout s'est bien passé
                result = await result.json();
                // Et que l'authentification s'est bien passée
                if (result.success) {
                    // on passe à la page d'administration
                    context.logged = true;
                    setCookie('user', JSON.stringify(result.user));
                    context.user = result.user;
                    context.button = {title: result.user.role === 'Technicien' ? 'Gérer signalements' : 'Mes signalements', path: result.user.role === 'Technicien' ? '/manage-issues' : '/my-issues'};
                    page('/');
                }
                else {
                    // Sinon on réaffiche la page avec quelques infos pour expliquer ce qui n'a pas marché
                    renderLoginPage({...context, username, password, message: result.message});
                }
            }
        }
        catch (e) {
            console.error(e);
            return;
        }
    });
}