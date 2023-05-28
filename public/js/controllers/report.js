export async function postload(context) {
    let form = document.getElementById('report-issue-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        let formData = new FormData(form);
        let jsonData = {
            userID: context.user.id,
            title: formData.get('issue-title'),
            description: formData.get('issue-description'),
            location: formData.get('issue-location'),
            type: parseInt(formData.get('issue-type')),
            criticity: parseInt(formData.get('issue-criticity')),
            anonymous:  document.getElementById('anonymous').checked,
        };

        console.log(jsonData);

        await fetch('/api/issues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        page('/');
    });
}