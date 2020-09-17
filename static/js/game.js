

function selectCorrect(position) {

    // get event details
    var year = $("#new-event-year").text();
    var circa = $("#new-event-circa").text();
    var description = $("#new-event-description").text();
    var nextRoundURL = $("#next-round-url").text();
    var score = $("#score").text();

    // format year display with "lead in" (e.g.: in..., around...)
    var yearDisplayLeadIn = "";
    if (circa == "true") {
        yearDisplayLeadIn += `around `;
    } else {
        yearDisplayLeadIn += 'in '
    }
    if (year >= 0) {
        yearDisplayLeadIn += `<u>${year}</u>`;
    } else {
        yearDisplayLeadIn += `<u>${-year} BCE</u>`
    }

    // format fancy year display
    var yearDisplayFancy = "";
    if (circa == "true") {
        yearDisplayFancy += `<small class="grayed">c.</small> `;
    }
    if (year >= 0) {
        yearDisplayFancy += year;
    } else {
        yearDisplayFancy += `${-year} <small class="grayed">BCE</small>`
    }

    // construct event panel
    var correctEvent = $(`
    <div class="event-panel" style="border: 2px solid var(--correct)">
        <div class="event-panel-year">
            <p style="background-color: var(--correct)">
                ${yearDisplayFancy}
            </p>
        </div>
        <div class="event-panel-description" style="font-weight: bold">
            <p> ${description} </p>
        </div>
    </div>
    `);

    // replace placeholder panel with event panel
    var placeholderPanel = $("#placeholder-panel-" + position);
    placeholderPanel.replaceWith(correctEvent);

    // construct prompt saying answer is correct
    var messageCorrect = getRandomMessageCorrect();
    var promptCorrect = $(`
    <div class="event-panel" style="border: 2px solid var(--correct)">
        <div class="event-panel-year">
            <p style="background-color: var(--correct)">
                <i class="fa fa-check"></i>
            </p>
        </div>
        <div class="event-panel-description" style="font-weight: bold">
            <p> ${messageCorrect} The event happened ${yearDisplayLeadIn}.</p>
        </div>
    </div>
    `);

    // replace prompt event panel with prompt
    var promptEventPanel = $("#prompt-event-panel");
    promptEventPanel.replaceWith(promptCorrect);

    // put in bottom text message
    $("#prompt-bottom-text").html(
        `<a class="link-button" href="${nextRoundURL}">
        Next <i class="fa fa-arrow-right"></i> </a>`
    )

    // remove other placeholders
    $(".placeholder-panel").addClass("placeholder-panel-gone");

    // scroll back to top
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


function selectIncorrect(position) {

    // get event details
    var hand_id = $("#hand-id").text();
    var year = $("#new-event-year").text();
    var circa = $("#new-event-circa").text();
    var description = $("#new-event-description").text();
    var newEventPosition = $("#new-event-position").text();
    var restartGameURL = $("#restart-game-url").text();
    var score = $("#score").text();

    // delete hand
    $.post(`delete_hand?hand_id=${hand_id}`);

    // pluralise/singularise "event/s"
    if (score > 1) {
        var eventsWordDisplay = "events"
    } else {
        var eventsWordDisplay = "event"
    }

    // format year display with "lead in" (e.g.: in..., around...)
    var yearDisplayLeadIn = "";
    if (circa == "true") {
        yearDisplayLeadIn += `around `;
    } else {
        yearDisplayLeadIn += 'in '
    }
    if (year >= 0) {
        yearDisplayLeadIn += `<u>${year}</u>`;
    } else {
        yearDisplayLeadIn += `<u>${-year} BCE</u>`
    }

    // format fancy year display
    var yearDisplayFancy = "";
    if (circa == "true") {
        yearDisplayFancy += `<small class="grayed">c.</small> `;
    }
    if (year >= 0) {
        yearDisplayFancy += year;
    } else {
        yearDisplayFancy += `${-year} <small class="grayed">BCE</small>`
    }

    // construct event panel
    var correctEvent = $(`
    <div class="event-panel" style="border: 2px solid var(--incorrect)">
        <div class="event-panel-year">
            <p style="background-color: var(--incorrect)">
                ${yearDisplayFancy}
            </p>
        </div>
        <div class="event-panel-description" style="font-weight: bold">
            <p> ${description} </p>
        </div>
    </div>
    `);

    // replace placeholder panel with event panel
    var placeholderPanel = $("#placeholder-panel-" + newEventPosition);
    placeholderPanel.replaceWith(correctEvent);

    // construct incorrect indicator
    var incorrectIndicator = $(`
    <div class="placeholder-panel-incorrect" >
        <i class="fa fa-times"></i>
    </div>
    `);

    // replace incorrectly-selected placeholder with incorrect indicator
    $("#placeholder-panel-" + position).replaceWith(incorrectIndicator);

    // construct prompt saying answer is correct
    var messageIncorrect = getRandomMessageIncorrect();
    var promptIncorrect = $(`
    <div class="event-panel" style="border: 2px solid var(--incorrect)">
        <div class="event-panel-year">
            <p style="background-color: var(--incorrect)">
                <i class="fa fa-times"></i>
            </p>
        </div>
        <div class="event-panel-description" style="font-weight: bold">
            <p> ${messageIncorrect} The event happened ${yearDisplayLeadIn}.
        </div>
    </div>
    `);

    // replace prompt event panel with prompt
    var promptEventPanel = $("#prompt-event-panel");
    promptEventPanel.replaceWith(promptIncorrect);

    // put in bottom text message
    var endPanel = $(`
    <div class="end-panel">
        <p>
            <b>${getRandomMessageEnd()} You got <span class="score">${score}</span> ${eventsWordDisplay} right in a row!</b>
        </p>
        ${generateAchievementPanel(score)}
        <p style="margin-top: 34px">
            <a class="link-button" href="${restartGameURL}">
            <i class="fa fa-play"></i> Play Again</a>
        </p>
    </div>
    `)
    $("#prompt-bottom-text").replaceWith(endPanel);
    endPanel.hide();
    endPanel.slideDown(1500);

    // remove other placeholders
    $(".placeholder-panel").addClass("placeholder-panel-gone");

    // scroll back to top
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function generateAchievementPanel(score) {

    let achievements = {
        5: {
            "title": "The Wheel (5+ events)",
            "description": "The wheel is considered one of the most primitive and fundamental of human inventions, establishing the early development of humans carving advanced stone tools.",
            "image": "static/images/achievements/wheel.jpg",
            "next": "Next achievement at 10 events in a row."
        },
        10: {
            "title": "Paper (10+ events)",
            "description": "Produced in its earliest form by Ancient Egyptians processing papyrus, the invention of paper was crucial in the development of easily writing and sharing written language.",
            "image": "static/images/achievements/paper.jpg",
            "next": "Next achievement at 15 events in a row."
        },
        15: {
            "title": "The Aqueduct (15+ events)",
            "description": "The invention of the aqueduct allowed the long-distance distribution of water, allowing large crop regions and cities to be artificially supplied with fresh water.",
            "image": "static/images/achievements/aqueduct.jpg",
            "next": "Next achievement at 20 events in a row."
        }
    }

    // 20: printing press
    // 30: electricty
    // 40: personal computer
    // 50: world wide web (internet)

    var achievement = null;
    for (var milestone in achievements) {
        if (score < milestone) {
            break;
        }
        achievement = achievements[milestone];
    }

    // if (score >= 15) {
    //     imageURL = "static/images/achievements/aqueduct.jpg";
    //     achievementTitle = "Aqueduct (15+ events)";
    //     achievementDescription = "The invention of the aqueduct allowed the long-distance distribution of water, allowing large crop regions and cities to be artificially supplied with fresh water.";
    //     nextAchievement = "Next achievement at 20 events in a row."
    // } else if (score >= 10) {
    //     imageURL = "static/images/achievements/paper.jpg";
    //     achievementTitle = "Paper (10+ events)";
    //     achievementDescription = "Produced in its earliest form by Ancient Egyptians processing papyrus, the invention of paper was crucial in the development of easily writing and sharing written language.";
    //     nextAchievement = "Next achievement at 15 events in a row."
    // } else if (score >= 5) {
    //     imageURL = "static/images/achievements/wheel.jpg";
    //     achievementTitle = "The Wheel (5+ events)";
    //     achievementDescription = "The wheel is considered one of the most primitive and fundamental of human inventions, establishing the early development of humans carving advanced stone tools.";
    //     nextAchievement = "Next achievement at 10 events in a row."
    // } else {

    if (achievement != null) {
        return `
        <div class="achievement-panel">
            <img src="${achievement['image']}"></img>
            <p>
                <b><i class="fa fa-star" style="color: var(--achievement);"></i> Achievement: ${achievement['title']}</b>
                <br><br>
                <span style="font-size: 10pt;">${achievement['description']}</span>
            </p>
        </div>
        <i>${achievement['next']}</i>
        `
    } else {
        return `
        <div class="achievement-panel">
            <i style="width: 100%; text-align: center;">Next achievement at 5 events in a row.</i>
        </div>
        `
    }
}


function getRandomMessageCorrect() {
    var messages = [
        "Correct!",
        "Well done!",
        "Good job!",
        "That's right!"
    ];

    return messages[Math.floor(Math.random() * messages.length)];
}


function getRandomMessageEnd() {
    var messages = [
        "Well done!",
        "Good job!",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
}


function getRandomMessageIncorrect() {
    var messages = [
        "Oops, not quite!",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
}