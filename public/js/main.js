'use strict';

let context = {};
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

page('report', async function () {
    renderReportPage({title: 'Signaler un problème'});

    async function renderReportPage(context) {
        await renderTemplate(templates('public/templates/report.mustache'), context);

        let homepage_button = document.getElementById('homepage');

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

        homepage_button.addEventListener('click', () => {
            page('/');
        });
    }
});



page.base('/'); // psi votre projet n'est pas hébergé à la racine de votre serveur, ajuster son url de base ici !
page.start();
