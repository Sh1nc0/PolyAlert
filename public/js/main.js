
let coockie = getCookie('user');
let context = {logged: coockie !== null, user: JSON.parse(coockie), button: {title: JSON.parse(coockie).role === 'Technicien' ? 'Gérer signalements' : 'Mes signalements', path: JSON.parse(coockie).role === 'Technicien' ? '/manage-issues' : '/my-issues'}};

import routes from './routes.js';

routes.forEach(route => {
    page(route.path, async function () {
        if (!context.logged && route.path !== 'login')
            page('/login');

        else {
            let subcontext = {};

            if (typeof route.preload !== 'undefined')
                subcontext = await route.preload(context);

            await renderTemplate(templates(route.template), {...context, ...subcontext, title: route.title});

            if (typeof route.postload !== 'undefined')
                await route.postload(context);
        }
    });
});

page.base('/'); // psi votre projet n'est pas hébergé à la racine de votre serveur, ajuster son url de base ici !
page.start();