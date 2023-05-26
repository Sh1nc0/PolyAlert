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
    let table = document.getElementById('recent-problems');
    let input_message = document.getElementById('message');
    let send_message_button = document.getElementById('send-message');
    let messaging = document.getElementById('messaging');

    let rows = table.rows;
    let selectedRow = rows[0].id || null;
    loadMessages();
    highlightRow(selectedRow);

    //Scroll to bottom
    const callback = function (mutationsList) {
        for (let mutation of mutationsList)
            if (mutation.type === 'childList')
                messaging.scrollTo(0, messaging.scrollHeight);
    };

    const observer = new MutationObserver(callback);
    observer.observe(messaging, {childList: true});
    messaging.scrollTop = messaging.scrollHeight;

    for (let i = 0; i < rows.length; i += 1 ) {
        rows[i].addEventListener('click', function () {
            selectedRow = rows[i].id;
            highlightRow(selectedRow);
            clearMessages();
            loadMessages();
        });
    }

    send_message_button.addEventListener('click', async () => {
        let message = {
            authorID: context.user.id,
            content: input_message.value,
        };

        await fetch(`api/issues/${selectedRow}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        let message_row = document.createElement('div');
        message_row.className = 'message message-right';
        message_row.innerHTML = `${message.content}`;
        messaging.appendChild(message_row);
        input_message.value = '';
    });

    async function highlightRow(selectedRow) {
        for (let i = 0; i < rows.length; i += 1) {
            if (rows[i].id === selectedRow) {
                rows[i].style.fontWeight = 'bold';
                rows[i].style.color = '#27374D';
            }
            else {
                rows[i].style.fontWeight = 'normal';
                rows[i].style.color = 'black';
            }
        }
    }

    async function clearMessages() {
        while (messaging.firstChild) {
            messaging.removeChild(messaging.firstChild);
        }
    }

    async function loadMessages() {
        let response = await fetch(`api/issues/${selectedRow}/messages`);

        let messages = await response.json();

        messages.sort((a, b) => {
            return new Date(a.created) - new Date(b.created);
        });


        messages.forEach(message => {
            let message_row = document.createElement('div');
            message_row.className = message.authorID === context.user.id ? 'message message-right' : 'message message-left';
            message_row.innerHTML = `${message.content}`;
            messaging.appendChild(message_row);
        });
    }
}