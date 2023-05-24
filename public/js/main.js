'use strict';

let context = {logged: false};

// Route pour la page principale (index.html)
page('/', async function () {

    if (!context.logged)
        page('/login');
    else {
        let response = await fetch('/api/issues');
        let problemes = [];
        response.json().then(data => {
            data.forEach(issue => {
                problemes.push({id: issue.id, title: issue.title, status: issue.technicianID ? 'Pris en charge' : 'En cours'});
            });
        });
        renderMainPage({...context, title: 'Accueil', problemes: problemes});
    }

    async function renderMainPage(context) {
        await renderTemplate(templates('private/main.mustache'), context);

        let report_button = document.getElementById('report');
        let table = document.getElementById('recent-problems');
        let rows = table.rows;

        for (let i = 0; i < rows.length; i += 1 ) {
            rows[i].addEventListener('click', (event) => {
                let id = event.currentTarget.getAttribute('id');
                page(`/issue?id=${id}`);
            });
        }

        report_button.addEventListener('click', () => {
            page('report');
        });
    }
});

page('login', async function () {

    renderLoginPage(context);

    async function renderLoginPage(context) {
        await renderTemplate(templates('public/templates/login.mustache'), context);

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
                        context.user = result.user;
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
});

page('report', async function () {

    if (!context.logged)
        page('/login');
    else
        renderReportPage({...context, title: 'Signaler un problème'});

    async function renderReportPage(context) {
        await renderTemplate(templates('private/report-issue.mustache'), context);

        let homepage_button = document.getElementById('homepage');
        let form = document.getElementById('report-issue-form');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            let formData = new FormData(form);
            let jsonData = {
                userID: '38f7054e-f6f0-11ed-b67e-0242ac120002',
                technicianID: '11350cb5-3e81-4396-aeca-8b3ef6d31a7a',
                title: formData.get('issue-title'),
                description: formData.get('issue-description'),
                location: formData.get('issue-location'),
                type: parseInt(formData.get('issue-type')),
                criticity: parseInt(formData.get('issue-criticity')),
                anonymous: formData.get('issue-anonymous') === 'on' ? true : false,
            };

            await fetch('/api/issues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            page('/');
        });

        homepage_button.addEventListener('click', () => {
            page('/');
        });
    }

});

page('issue', async function (url) {
    if (!context.logged)
        page('/login');
    else {

        let id = url.querystring.split('=')[1];
        let response = await fetch(`/api/issues?issueID=${id}`);

        //error handling
        if (response.status !== 200) {
            console.log(`Erreur HTTP: ${response.status}`);
            return;
        }
        let issue = await response.json();

        issue.created = new Date(issue.created).toLocaleString();

        renderIssuePage({...context, title: issue.title, issue: {...issue, status: issue.technicianID ? 'Pris en charge' : 'En cours'}});
    }

    async function renderIssuePage(context) {
        await renderTemplate(templates('private/issue.mustache'), context);

        let homepage_button = document.getElementById('homepage');
        let report_user_button = document.getElementById('report-user');
        let issue_information_view = document.getElementById('issue-informations');
        let popup = document.getElementById('popup');
        let form = document.getElementById('report-user-form');
        let report_issue_button = document.getElementById('report');


        report_user_button.addEventListener('click', () => {
            if (popup.style.visibility !== 'visible') {
                issue_information_view.style.opacity = 0;
                issue_information_view.style.visibility = 'hidden';
                report_user_button.textContent = 'Fermer';
                popup.style.visibility = 'visible';
                popup.style.opacity = 1;
            }
            else {
                issue_information_view.style.opacity = 1;
                issue_information_view.style.visibility = 'visible';
                report_user_button.textContent = 'Signaler utilisateur';
                popup.style.visibility = 'hidden';
                popup.style.opacity = 0;
            }
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            let formData = new FormData(form);
            let jsonData = {
                issueID: context.issue.id,
                reporterID: context.user.id,
                reportedID: context.issue.userID,
                reason: formData.get('report-reason'),
            };

            await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            page('/');
        });

        report_issue_button.addEventListener('click', () => {
            page('report');
        });

        homepage_button.addEventListener('click', () => {
            page('/');
        });
    }
});

page.base('/'); // psi votre projet n'est pas hébergé à la racine de votre serveur, ajuster son url de base ici !
page.start();