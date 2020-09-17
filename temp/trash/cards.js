function selectCardSpot(position) {
    

    if (document.getElementById("done").getAttribute("class") == 0) {
        
        // get correct card position
        let new_card_position = (document.getElementById("new-card-position").getAttribute("class") - 24) / 169;

        // remove card spots
        let card_spots = document.getElementsByClassName("card-spot");
        for (let i = 0; i < card_spots.length ; i++){
            if (i != position) {
                card_spots[i].setAttribute("style", "display: none;");
            } else {
                if (position != new_card_position) {
                    card_spots[i].setAttribute("style", "color: var(--red);")
                    card_spots[i].classList.add("no-hover");
                    console.log(card_spots[i].childNodes[1].childNodes[1].setAttribute("class", "fa fa-times-circle"));
                } else {
                    card_spots[i].setAttribute("style", "display: none;");
                }
            }
        }

        // set card
        let correct_card = document.getElementById("correct-card");
        let correct_card_description = document.getElementById("new-card-description").innerHTML;
        document.getElementById("correct-card-description").innerHTML = correct_card_description;

        if (position == new_card_position) {

            // present and style card
            correct_card.setAttribute("style", "display: block;");
            correct_card.classList.add("correct-card")

            // present reponse
            document.getElementById("response-correct").setAttribute("style", "display: block;");
        } else {

            // present and style card
            correct_card.setAttribute("style", "display: block;");
            correct_card.classList.add("incorrect-card")

            // present response
            document.getElementById("response-incorrect").setAttribute("style", "display: block;");
        }

        // set round to done
        document.getElementById("done").setAttribute("class", "1");
    }

}