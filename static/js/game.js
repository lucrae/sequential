
window.onload = function onLoad() {
    // $('#center-block').attr("style", `min-height: ${screen.height - 400}px;`);
}

function selectCorrect(position) {

    // get event details
    var sessionHash = $("#session-hash").text();
    var handID = $("#hand-id").text();
    var newEventID = $("#new-event-id").text();
    var year = $("#new-event-year").text();
    var circa = $("#new-event-circa").text();
    var description = $("#new-event-description").text();
    var score = parseFloat($("#score").text());
    var yearDisplayLeadIn = formatYearLeadIn(year, circa);
    var yearDisplayFancy = formatFancyYear(year, circa);

    // update hand to have new event
    $.post(`update_hand?hand_id=${handID}&event_id=${newEventID}`);

    // update running score
    $('#running-score-div').attr("style", `display: inline;`);
    $('#running-score').text(score + 1);

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
    ${generateAchievementPanel(score + 1, false, true)}
    `);

    // replace prompt event panel with prompt
    var promptEventPanel = $("#prompt-event-panel");
    promptEventPanel.replaceWith(promptCorrect);
    promptCorrect.hide();
    promptCorrect.fadeIn(200);

    // put in bottom text message
    $("#prompt-bottom-text").html(
        `<a class="link-button" href="/game?s=${sessionHash}">
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
    var handID = $("#hand-id").text();
    var year = $("#new-event-year").text();
    var circa = $("#new-event-circa").text();
    var description = $("#new-event-description").text();
    var newEventPosition = $("#new-event-position").text();
    var score = $("#score").text();
    var yearDisplayLeadIn = formatYearLeadIn(year, circa);
    var yearDisplayFancy = formatFancyYear(year, circa);

    // delete hand
    $.post(`delete_hand?hand_id=${handID}`);

    // pluralise/singularise "event/s"
    var eventsWordDisplay = "event"
    if (score > 1) {eventsWordDisplay += "s"}

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
        ${generateAchievementPanel(score, true, false)}
        <p style="margin-top: 34px">
            <a class="link-button" href="/game?s=0">
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

function generateAchievementPanel(score, displayNext, isEqual) {

    // define achievments
    let achievements = {
        5: {
            "title": "The Sundial (5+ events)",
            "description": "The sundial is one of the first time-keeping devices invented, using the shadow of an object in relation to marks on a disk to quantify periods in the day.",
            "image": "static/images/achievements/sundial.jpg",
            "next": "Impressive! Next achievement at 10 events in a row."
        },
        10: {
            "title": "The Candle Clock (10+ events)",
            "description": "Candle clocks used the burning down of a candle (or alternatively, an incense stick) in relation to marks made behind it to record periods of time with more configuration and portability than possible with sundials or shadow clocks.",
            "image": "static/images/achievements/candle_clock.jpg",
            "next": "You must've really been paying attention in class!<br>Next achievement at 15 events in a row."
        },
        15: {
            "title": "The Hourglass (15+ events)",
            "description": "The hourglass developed as one of the first reliable and reusable methods of measuring time at sea, using sand through a small passage to measure the passing of a set period of time.",
            "image": "static/images/achievements/hourglass.jpg",
            "next": "Are you a historian? You really know your stuff :)<br>Next achievement at 20 events in a row."
        },
        20: {
            "title": "The Pendulum Clock (20+ events)",
            "description": "As society grew the need for precision time-keeping, Italian polymath Galileo Galilei discovered that the regular swing of a pendulum could be used to produce a regular pattern, leading to the development of the pendulum clock.",
            "image": "static/images/achievements/pendulum_clock.jpg",
            "next": "You must be an expert! You must really need a challenge...<br>Next achievement at 25 events in a row."
        },
        25: {
            "title": "The Pocket Watch (25+ events)",
            "description": "The use of a spiral-hairspring led to the innovation of a portable precision type-keeping device, leading to the mechanisms behind pocket watches and wristwatches",
            "image": "static/images/achievements/pocket_watch.png",
            "next": "We're going to run out of history!<br>Final achievement at 30 events in a row."
        },
        30: {
            "title": "The Atomic Clock (30+ events)",
            "description": "Atomic clocks measure the electromagnetic signal that electrons in atoms emit when changing energy levels, allowing for the most precise time-keeping device to date. They are accurate to within a few seconds over trillions of years.",
            "image": "static/images/achievements/atomic_clock.jpg",
            "next": "Congratulations! You are truly a master of dates :)"
        }
    }

    // let achievements = {
    //     5: {
    //         "title": "The Wheel (5+ events)",
    //         "description": "The wheel is considered one of the most primitive and fundamental of human inventions, establishing the early development of humans carving advanced stone tools.",
    //         "image": "static/images/achievements/wheel.jpg",
    //         "next": "Impressive! Next achievement at 10 events in a row."
    //     },
    //     10: {
    //         "title": "Paper (10+ events)",
    //         "description": "Produced in its earliest form by Ancient Egyptians processing papyrus, the invention of paper was crucial in the development of easily writing and sharing written language.",
    //         "image": "static/images/achievements/paper.jpg",
    //         "next": "You must've really been paying attention in class!<br>Next achievement at 15 events in a row."
    //     },
    //     15: {
    //         "title": "The Aqueduct (15+ events)",
    //         "description": "The invention of the aqueduct allowed the long-distance distribution of water, allowing large crop regions and cities to be artificially supplied with fresh water.",
    //         "image": "static/images/achievements/aqueduct.jpg",
    //         "next": "Are you a historian? Next achievement at 20 events in a row."
    //     },
    //     20: {
    //         "title": "The Printing Press (20+ events)",
    //         "description": "The printing press allowed information to be shared quickly and in huge numbers, drastically changing the nature of literature and knowledge, and paving the way for humanity's journey to the Information Age.",
    //         "image": "static/images/achievements/printing_press.jpg",
    //         "next": "You must be an expert! Congrats :)"
    //     }
    // }

    // get achievement level
    var milestones = Object.keys(achievements).reverse();
    var achievement = null;

    if (isEqual) {
        for (var i = 0; i < milestones.length; i++) {
            var milestone = parseFloat(milestones[i])
            if (score == milestone) {
                achievement = achievements[milestone];
                break;
            }
        }
    } else {
        for (var i = 0; i < milestones.length; i++) {
            var milestone = parseFloat(milestones[i])
            if (score >= milestone) {
                achievement = achievements[milestone];
                break;
            }
        }
    }

    // return achievement panel
    if (achievement != null) {
        let panel = `
        <div class="achievement-panel">
            <img src="${achievement['image']}"></img>
            <p>
                <b><i class="fa fa-star" style="color: var(--achievement);"></i> Achievement: ${achievement['title']}</b>
                <br><br>
                <span style="font-size: 10pt;">${achievement['description']}</span>
            </p>
        </div>`
        if (displayNext) {panel += `<i>${achievement['next']}</i>`};
        return panel
    } else if (displayNext == true) {
        return `
        <div class="achievement-panel">
            <i style="width: 100%; text-align: center;">Next achievement at 5 events in a row.</i>
        </div>
        `
    } else {
        return ``;
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


function formatYearLeadIn(year, circa) {
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
    return yearDisplayLeadIn;
}


function formatFancyYear(year, circa) {
    var yearDisplayFancy = "";
    if (circa == "true") {
        yearDisplayFancy += `<small class="grayed">c.</small> `;
    }
    if (year >= 0) {
        yearDisplayFancy += year;
    } else {
        yearDisplayFancy += `${-year} <small class="grayed">BCE</small>`
    }
    return yearDisplayFancy;
}
