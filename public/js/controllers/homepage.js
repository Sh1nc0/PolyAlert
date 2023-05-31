// eslint-disable-next-line no-unused-vars
export async function preload(context) {
    let response = await fetch('/api/issues');
    let problemes = [];

    response.json().then(data => {
        data.forEach(issue => {
            if (!issue.closedAt)
                problemes.push({id: issue.id, created: issue.created, title: issue.title, status: issue.technicianID ? 'Pris en charge' : 'En cours'});
        });
        problemes.sort((a, b) => new Date(b.created) - new Date(a.created));
    });

    return {problemes: problemes};
}

export async function postload(context) {
    let manage_issues_button = document.getElementById('manage-issues');
    let table = document.getElementById('recent-problems');
    let rows = table.rows;

    for (let i = 0; i < rows.length; i += 1 ) {
        rows[i].addEventListener('click', (event) => {
            let id = event.currentTarget.getAttribute('id');
            page(`/issue?id=${id}`);
        });
    }

    manage_issues_button.addEventListener('click', () => {
        if (context.user.role === 'Technicien')
            page('manage-issues');
        else
            page('my-issues');
    });
}

