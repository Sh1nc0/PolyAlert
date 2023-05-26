export async function preload(context) {
    let response = await fetch(`/api/issues?userID=${context.user.id}`);

    //error handling
    if (response.status !== 200) {
        console.log(`Erreur HTTP: ${response.status}`);
        return;
    }
    let issues = await response.json();

    issues.forEach(issue => {
        issue.created = new Date(issue.created).toLocaleString();
        issue.status = issue.technicianID ? 'Pris en charge' : 'En cours';
    });

    return {issues: issues};
}

export async function postload(context) {
    console.log(context);
}