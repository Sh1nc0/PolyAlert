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

        report_button.addEventListener('click', () => {
            page('report');
        });
    }
});

page('report', async function () {
    renderReportPage({title: 'Signaler un problème'});

    async function renderReportPage(context) {
        await renderTemplate(templates('public/templates/report.mustache'), context);

        let report_button = document.getElementById('homepage');

        report_button.addEventListener('click', () => {
            page('/');
        });
    }

});



page.base('/'); // psi votre projet n'est pas hébergé à la racine de votre serveur, ajuster son url de base ici !
page.start();
