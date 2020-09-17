#![allow(unused_variables, unused_imports)] // temp

#![feature(proc_macro_hygiene, decl_macro)]

// local
pub mod models;
pub mod schema;
pub mod utils;
pub mod db;
pub mod hand;

// enable macro use on crates
#[macro_use] extern crate rocket;
#[macro_use] extern crate serde_json;
#[macro_use] extern crate diesel;

// rocket
use rocket::uri;
use rocket::response::Redirect;
use rocket_contrib::templates::Template;
use rocket_contrib::serve::StaticFiles;

// local
use models::{Event, Hand, Card};

#[get("/")]
fn index(_remote_addr: std::net::SocketAddr) -> Redirect {

    Redirect::to(uri!(game: 0))
}

#[get("/game?<s>")]
fn game(s: i32) -> Template {

    // establish database connection
    let connection = db::establish_connection();

    // get hand, or create new one if session hash not found
    let session_hash;
    let hand = match hand::get_session_hand(&connection, s) {
        Some(hand) => {
            session_hash = s;

            hand  
        },
        None => {

            session_hash = utils::generate_random_hash();

            // add new hand
            hand::add_hand(&connection, session_hash);
            let new_hand = match hand::get_session_hand(&connection, session_hash) {
                Some(new_hand) => new_hand,
                None => panic!("Error fetching new hand"),
            };

            // add first event to new hand
            let first_event = hand::get_new_event(&connection, &new_hand);
            hand::add_card(&connection, new_hand.id, first_event.id);

            new_hand
        },
    };

    // get events
    let hand_events = hand::get_events(&connection, &hand);
    let hand_new_event = hand::get_new_event(&connection, &hand);
    let new_event_position = utils::get_new_event_position(&hand_new_event, &hand_events);

    // construct display hand
    // for placeholders (index, correct, "", "placeholder")
    // for events (i32, bool, String) = (year, circa, description, "event")
    // for highlighted events (i32, bool, String) = (year, circa, description, "event-highlighted")
    let mut panels: Vec<(i32, bool, String, String)> = Vec::new();
    for i in 0..=hand_events.len() {
        if i == new_event_position {
            panels.push((i as i32, true, "".to_string(), "placeholder".to_string()));
        } else {
            panels.push((i as i32, false, "".to_string(), "placeholder".to_string()));
        }

        if i < hand_events.len() {
            panels.push((
                hand_events[i].year,
                hand_events[i].circa,
                hand_events[i].description.clone(),
                "event".to_string(),
            ));
        };
    }

    // set up next round (in case of success)
    let next_round_url = uri!(next_round: session_hash, hand.id, hand_new_event.id);
    let restart_game_url = uri!(restart_game: session_hash);
    
    // set context vars and render template
    let context = json!({
        "hand_id": hand.id,
        "new_event": hand_new_event,
        "new_event_position": new_event_position,
        "panels": panels,
        "score": hand_events.len(),
        "next_round_url": next_round_url.to_string(),
        "restart_game_url": restart_game_url.to_string(),
    });

    // render web page
    Template::render("game", &context)
}

#[get("/next?<s>&<hand_id>&<last_event_id>")]
fn next_round(s: i32, hand_id: i32, last_event_id: i32) -> Redirect {

    // establish database connection and add last event to hand
    let connection = db::establish_connection();
    hand::add_card(&connection, hand_id, last_event_id);

    // redirect back to main game route
    Redirect::to(uri!(game: s))
}

#[get("/restart?<s>")]
fn restart_game(s: i32) -> Redirect {

    // redirect back to main game route
    Redirect::to(uri!(game: 0))
}

#[post("/delete_hand?<hand_id>")]
fn delete_hand(hand_id: i32) {

    // delete hand
    let connection = db::establish_connection();
    hand::delete_hand(&connection, hand_id);
}

fn main() {

    // run rocket application
    rocket::ignite()
        .mount("/", routes![index, game, next_round, restart_game,]) // GET methods
        .mount("/", routes![delete_hand]) // POST methods
        .mount("/static", StaticFiles::from("static")) // static resources
        .attach(Template::fairing()) 
        .launch();
}
