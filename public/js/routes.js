const routes = [
    {
        path: '/',
        template: 'private/main.mustache',
        title: 'Accueil',
        preload : async function (context) {
            const controllers = await import('./controllers/homepage.js');
            return await controllers.preload(context);
        },
        postload : async function (context) {
            const controllers = await import('./controllers/homepage.js');
            return await controllers.postload(context);
        },
    },
    {
        path: 'login',
        template: 'public/templates/login.mustache',
        title: 'Login',
        postload : async function (context) {
            const controllers = await import('./controllers/login.js');
            return await controllers.postload(context);
        },
    },
    {
        path: 'report',
        template: 'private/report-issue.mustache',
        title: 'Signaler un problème',
        postload : async function (context) {
            const controllers = await import('./controllers/report.js');
            return await controllers.postload(context);
        },
    },
    {
        path: 'issue',
        template: 'private/issue.mustache',
        title: 'Gérer les problèmes',
        preload : async function (context) {
            const controllers = await import('./controllers/issue.js');
            return await controllers.preload(context);
        },
        postload : async function (context) {
            const controllers = await import('./controllers/issue.js');
            return await controllers.postload(context);
        },
    },
    {
        path: 'my-issues',
        template: 'private/my-issues.mustache',
        title: 'Mes signalements',
        preload : async function (context) {
            const controllers = await import('./controllers/myIssues.js');
            return await controllers.preload(context);
        },
        postload : async function (context) {
            const controllers = await import('./controllers/myIssues.js');
            return await controllers.postload(context);
        },
    },
    {
        path: 'manage-issues',
        template: 'admin/manage-issues.mustache',
        title: 'Gérer les signalements',
        preload : async function (context) {
            const controllers = await import('./controllers/manageIssues.js');
            return await controllers.preload();
        },
        postload : async function (context) {
            const controllers = await import('./controllers/manageIssues.js');
            return await controllers.postload(context);
        },
    },
]

export default routes;