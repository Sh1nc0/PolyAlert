// eslint-disable-next-line no-unused-vars
export async function preload(context) {
    let url = new URL(window.location.href);
    let id = url.search.split('=')[1];
    let response = await fetch(`/api/issues?issueID=${id}`);

    let issue = await response.json();
    let user = {firstname: 'Anonyme'};

    if (!issue.anonymous) {
        let response = await fetch(`/api/users/${issue.userID}`);
        user = await response.json();
    }

    const status = issue.technicianID ? 'Pris en charge' : 'En cours';
    issue.created = new Date(issue.created).toLocaleString();

    return {issue: {...issue, user: user, status: status}};

}

export async function postload(context) {
    if (context.issue.technicianID === context.user.id && context.issue.closedAt === null) {
        await addMessaging();
        await loadMessages();
        await addHandleButton('Marquer comme résolu');
        io().on(context.issue.id, onMessage);

        let messaging = document.getElementById('messaging');
        const callback = function (mutationsList) {
            for (let mutation of mutationsList)
                if (mutation.type === 'childList')
                    messaging.scrollTo(0, messaging.scrollHeight);
        };

        const observer = new MutationObserver(callback);
        observer.observe(messaging, {childList: true});
        messaging.scrollTop = messaging.scrollHeight;
    }
    else if (context.issue.technicianID === null && context.issue.closedAt === null) {
        await addHandleButton('Prendre en charge');
    }


    async function addMessaging(){
        let section = document.getElementsByTagName('section')[0];

        let article = document.createElement('article');
        let h1 = document.createElement('h1');
        let container = document.createElement('div');
        let messaging = document.createElement('div');
        let message_form = document.createElement('div');
        let message_input = document.createElement('input');
        let message_button = document.createElement('button');

        article.className = 'chat';
        h1.className = 'article-title';
        h1.innerHTML = 'Messagerie';
        container.className = 'message-container';
        messaging.className = 'messaging';
        messaging.id = 'messaging';
        message_form.className = 'message-form';
        message_input.id = 'message';
        message_input.name = 'message';
        message_input.type = 'text';
        message_input.placeholder = 'Message';
        message_button.id = 'send-message';
        message_button.innerHTML = 'Envoyer';
        message_button.addEventListener('click', () => {
            if (message_input.value !== '')
                sendMessage(message_input);
        });

        message_form.appendChild(message_input);
        message_form.appendChild(message_button);
        container.appendChild(messaging);
        article.appendChild(h1);
        article.appendChild(container);
        article.appendChild(message_form);
        section.appendChild(article);
    }

    async function addHandleButton(name_button){
        let button_container = document.getElementById('button-container');
        let button = document.createElement('button');
        let delete_button = document.createElement('button');

        button.id = 'handle-button';
        button.innerHTML = name_button;
        button.addEventListener('click', handleIssue);

        delete_button.id = 'delete-button';
        delete_button.className = 'red';
        delete_button.innerHTML = 'Supprimer';
        delete_button.addEventListener('click', deleteIssue);

        button_container.appendChild(button);
        button_container.appendChild(delete_button);
    }

    async function deleteIssue(){
        await fetch(`/api/issues/${context.issue.id}/close`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        page('/manage-issues');
    }

    async function handleIssue(){
        if (context.issue.technicianID === null) {
            await fetch(`/api/issues/${context.issue.id}/handle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({technicianID: context.user.id}),
            });
            page(`/manage-issue?id=${context.issue.id}`);
        }
        else {
            await fetch(`/api/issues/${context.issue.id}/close`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            page('/manage-issues');
        }
    }

    async function onMessage(message){
        let messaging = document.getElementById('messaging');
        if (parseInt(message.issueID) === context.issue.id && message.userID !== context.user.id) {
            let message_row = document.createElement('div');
            message_row.className = 'message message-left';
            message_row.innerHTML = `${message.content}`;
            messaging.appendChild(message_row);
        }
    }

    async function loadMessages(){
        let messaging = document.getElementById('messaging');
        let response = await fetch(`api/issues/${context.issue.id}/messages`);

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

    async function sendMessage(input_message){
        let messaging = document.getElementById('messaging');
        let message = {
            authorID: context.user.id,
            content: input_message.value,
        };

        await fetch(`api/issues/${context.issue.id}/messages`, {
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
    }
}