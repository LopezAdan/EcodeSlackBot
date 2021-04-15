const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const axios = require('axios').default;


const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const port = process.env.SLACK_PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);


slackEvents.on('app_mention',  (event)=> {
    console.log(`${event.channel} Got message from user ${event.user}: ${event.text}`);
    (async () => {
        try {
            if (event.text.includes(" hello")) {
                await slackClient.chat.postMessage({channel: event.channel, text: `Hello <@${event.user}>! :fadingparrot:`})
            }
        } catch(error) {
            console.log(error.data)
        }
    })();
});

slackEvents.on('app_mention',  (event)=> {
    console.log(`${event.channel} Got message from user ${event.user}: ${event.text}`);
    var momma = [ "yo momma", "yo moma", "yomomma", "yomoma", "YOMOMA", "YOMOMMA"];
    var message = event.text.substr(event.text.indexOf(" ") + 1);

    console.log(message);
    console.log(momma.includes(message));
    console.log(event.text)
    if (momma.includes(message)) {
        (async () => {
            try {
                const baseUrl = 'https://api.yomomma.info/';
                axios.get(`${baseUrl}`).then(res => 
                    slackClient.chat.postMessage({channel: event.channel, text: res.data.joke}));
            } catch(error) {
                console.log(error.data)
            }
        })();
    } else if (event.text.includes(" chucknorris")) {
        (async () => {
            try {
                const baseUrl = 'http://api.icndb.com/jokes/random';
                axios.get(`${baseUrl}`).then(res => 
                    slackClient.chat.postMessage({channel: event.channel, text: res.data.value.joke}));
            } catch(error) {
                console.log(error.data)
            }
        })();
    }
});


slackEvents.on("error", console.error);

slackEvents.start(port).then(() => {
    console.log(`Server has started on port: ${port}`)
});
