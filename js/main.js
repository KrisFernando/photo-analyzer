const BOT_NAME = "Health Bot";
const PERSON_NAME = "You";
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
var responseNum = 0;
let responseNew = true;
const API_URL = 'https://127.0.0.1:3000';

function sendRequest(URL, payload) {
    fetch(URL, payload)
        .then(response => {
            if (!response.ok) {
                console.log('Network response was not ok');
            }
            console.log(response.json);
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function streamResponse(chunk) {
    currentResponse = document.querySelector("#response-" + responseNum).innerHTML;
    str = chunk.replace(/\n\n/g, "<br/>");
    str = str.replace(/\n/g, "<br/>");
    document.querySelector("#response-" + responseNum).innerHTML += str;
    msgerChat.scrollTop += 500;
}

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    let jsonMsg = { method: 'POST', headers: {'Content-Type': 'application/json'}, body: {message: msgText}};
    sendRequest(JSON.stringify(jsonMsg));

    createRequest(PERSON_NAME, msgText);
    msgerInput.value = "";

    appendWaiting(BOT_NAME);

});

function createRequest(name, text) {
    //   Simple solution for small apps
    const msgHTML = `
    <div class="msg right-msg">
      <div class="msg-img">
        <i class="fas fa-user"></i>
      </div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text" id="request-${responseNum}">${text}</div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
    document.querySelector("#request-" + responseNum).parentElement.addEventListener("click", () => {
        console.log("clicked");
        document.querySelector("#question").value = text;
    });
}

function startResponse(name, text) {
    const msgHTML = `
    <div class="msg left-msg">
      <div class="msg-img">
        <i class="fas fa-circle-question"></i>
      </div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text" id="response-${responseNum}">${text}</div>
      </div>
    </div>
  `;
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
    var rid = "#response-" + responseNum;
    document.querySelector("#response-" + responseNum).parentElement.addEventListener("click", (event) => {
        console.log("clicked");
        navigator.clipboard.writeText(document.querySelector(rid).innerHTML);
    });
}


function appendWaiting(name) {
    //   Simple solution for small apps

    const msgWaiting = `
    <div class="msg left-msg waiting">
      <div class="msg-img">
        <i class="fas fa-circle-question"></i>
      </div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
        </div>

        <div class="msg-text">
          <div class="loader-container">
            <div class="loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>        
        </div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgWaiting);
    msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    return date.toLocaleTimeString();
}