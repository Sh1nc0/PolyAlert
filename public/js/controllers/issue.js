// eslint-disable-next-line no-unused-vars
export async function preload(context) {
    let url = new URL(window.location.href);
    let id = url.search.split('=')[1];
    let response = await fetch(`/api/issues?issueID=${id}`);

    let issue = await response.json();
    issue.created = new Date(issue.created).toLocaleString();

    return {issue: {...issue, status: issue.technicianID ? 'Pris en charge' : 'En cours'}};
}

export async function postload(context) {
    let report_user_button = document.getElementById('report-user');
    let issue_information_view = document.getElementById('issue-informations');
    let popup = document.getElementById('popup');
    let form = document.getElementById('report-user-form');

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
}