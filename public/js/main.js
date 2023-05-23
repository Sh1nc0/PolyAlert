'use strict';

let context = {logged: false};
// Route pour la page principale (index.html)
page('/', async function () {

    let response = await fetch('/api/issues');
    context.title = 'Accueil';
    context.problemes = [];
    response.json().then(data => {
        data.forEach(issue => {
            context.problemes.push({id: issue.id, title: issue.title, status: issue.technicianID ? 'Pris en charge' : 'En cours'});
        });
    });

    renderMainPage(context);

    async function renderMainPage(context) {

        await renderTemplate(templates('public/templates/main.mustache'), context);

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
    }
});

page('report', async function () {
    renderReportPage({title: 'Signaler un problème'});

    async function renderReportPage(context) {
        await renderTemplate(templates('public/templates/report-issue.mustache'), context);

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

page('issue', async function (context) {
    let id = context.querystring.split('=')[1];
    let response = await fetch(`/api/issues?issueID=${id}`);

    //error handling
    if (response.status !== 200) {
        console.log(`Erreur HTTP: ${response.status}`);
        return;
    }
    let issue = await response.json();

    issue.created = new Date(issue.created).toLocaleString();

    renderIssuePage({title: issue.title, issue: {...issue, status: issue.technicianID ? 'Pris en charge' : 'En cours'}});

    async function renderIssuePage(context) {
        await renderTemplate(templates('public/templates/issue.mustache'), context);

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
                issueID: id,
                reporterID: '38f7054e-f6f0-11ed-b67e-0242ac120002',
                reportedID: '11350cb5-3e81-4396-aeca-8b3ef6d31a7a',
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