// eslint-disable-next-line no-unused-vars
export async function preload(context) {
    const response = await fetch('/api/issues');
    const issues = await response.json();

    const fetchTechnician = async (technicianID) => {
        const responseTechnician = await fetch(`/api/users/${technicianID}`);
        const user = await responseTechnician.json();
        return `${user.firstname} ${user.lastname}`;
    };

    const processedIssues = await Promise.all(
        issues.map(async (issue) => {
            issue.created = new Date(issue.created).toLocaleString();
            issue.status = issue.technicianID ? 'Pris en charge' : 'En cours';
            if (issue.technicianID)
                issue.assigned = await fetchTechnician(issue.technicianID);

            return issue;
        }),
    );

    return {
        issues: processedIssues,
    };
}

export async function postload(context) {

    console.log(context.issues);
    let form = document.getElementById('form-filter');
    let checkbox = document.getElementById('issue-closed');
    let type = document.getElementById('issue-type');
    let asigned = document.getElementById('issue-asigned');

    type.selectedIndex = -1;
    asigned.selectedIndex = -1;

    form.addEventListener('change', async function (e) {
        let formData = new FormData(form);
        let filter = {
            closed: checkbox.checked,
            type: parseInt(formData.get('issue-type')),
            asigned: parseInt(formData.get('issue-asigned')),
        };

        let filteredIssues = context.issues;

        if (e.target.name === 'issue-closed' && checkbox.checked) {
            type.selectedIndex = -1;
            asigned.selectedIndex = -1;
            filteredIssues = context.issues.filter((issue) => !filter.closed === (issue.closedAt !== null));
        }
        else if (e.target.name === 'issue-type') {
            checkbox.checked = false;
            asigned.selectedIndex = -1;
            filteredIssues = context.issues.filter((issue) => filter.type === issue.type);
        }
        else if (e.target.name === 'issue-asigned') {
            checkbox.checked = false;
            type.selectedIndex = -1;
            switch (filter.asigned) {
                case 0:
                    filteredIssues = context.issues;
                    break;
                case 1:
                    filteredIssues = context.issues.filter((issue) => issue.technicianID === context.user.id);
                    break;
                case 2:
                    filteredIssues = context.issues.filter((issue) => issue.technicianID === null);
                    break;
            }
        }

        cleanTable();
        filteredIssues.forEach((issue) => {
            addRow(issue);
        });
    });

    initTable();

    async function initTable() {
        context.issues.forEach((issue) => {
            let target = document.getElementById(issue.id).getElementsByTagName('input')[0];
            if (issue.closedAt !== null)
                target.setAttribute('checked', true);
        });
    }

    async function addRow(data) {
        let table = document.getElementById('recent-problems');
        let row = document.createElement('tr');
        let closed = document.createElement('td');
        let name = document.createElement('td');
        let date = document.createElement('td');
        let asign = document.createElement('td');
        let checkbox = document.createElement('input');

        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'resolved');
        checkbox.setAttribute('name', 'resolved');
        checkbox.setAttribute('disabled', true);

        if (data.closedAt !== null)
            checkbox.setAttribute('checked', true);

        closed.appendChild(checkbox);

        name.innerHTML = data.title;
        date.innerHTML = data.created;
        if (data.assigned)
            asign.innerHTML = data.assigned;
        else
            asign.innerHTML = '';

        row.setAttribute('id', data.id);
        row.appendChild(closed);
        row.appendChild(name);
        row.appendChild(date);
        row.appendChild(asign);

        table.appendChild(row);
    }

    async function cleanTable() {
        let table = document.getElementById('recent-problems');
        table.innerHTML = '';
    }
}