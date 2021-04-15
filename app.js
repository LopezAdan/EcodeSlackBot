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

/** Function for checking if a word in an array is 
 * inside of a message. 
 * message: the message sent by a user
 * keywords: an array of words that are used to call an api
 * **/
function messageContainsKeyword(message, keywords) {
    for (var i = 0; i < keywords.length; i++) {
        if (message.includes(keywords[i])) {
            return true;
        }
    }
    return false;
}
/** A function for generalizing simple api calls.
 * Params:
 * apiLink: The link to the api being used
 * keywords: A list of keywords that will be used to call said function
 * attributes: A list of strings, that are used to access more parts of data
 *              ex. res.data.joke
 *              => ['data', 'joke']
 *   
 */
function callJokesAPI(apiLink, keywords, message, attributes) {
    if (messageContainsKeyword(message, keywords)) {
        (async () => {
            try {
                const baseUrl = apiLink;
                const res = axios.get(`${baseUrl}`);
                for (var i = 0; i < attributes.length; i++) {
                    res = res[i];
                }
                slackClient.chat.postMessage({channel: event.channel, text: res});
            } catch(error) {
                console.log(error.data)
            }
        })();
    }
}

slackEvents.on('app_mention',  (event)=> {
    console.log(`${event.channel} Got message from user ${event.user}: ${event.text}`);
    callJokesAPI('http://api.icndb.com/jokes/random', [' chucknorris'], event.text, ['data', 'value', 'joke']);
    callJokesAPI("'https://api.yomomma.info/';", ['yo momma', 'yomomma', 'Yo momma'], event.text, ['data', 'joke']);
});


slackEvents.on("error", console.error);

slackEvents.start(port).then(() => {
    console.log(`Server has started on port: ${port}`)
});
