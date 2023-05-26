// eslint-disable-next-line no-unused-vars
export async function preload(context) {
    let response = await fetch('/api/issues');

    let issues = await response.json();

    issues.forEach(issue => {
        issue.created = new Date(issue.created).toLocaleString();
        issue.status = issue.technicianID ? 'Pris en charge' : 'En cours';
        issue.checked = issue.closed !== null ? 1 : 0;
        if (issue.technicianID) {
            fetch(`/api/users/${issue.technicianID}`)
                .then(response => response.json())
                .then(user => {
                    issue.assigned = `${user.firstname} ${user.lastname}`;
                });
        }
    });

    return {issues: issues};
}

export async function postload(context) {
    console.log(context);
}