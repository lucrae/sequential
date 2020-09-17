use diesel::prelude::*;
use diesel::pg::PgConnection;
use dotenv::dotenv;
use std::env;

use crate::models::{Event, Hand, Card, NewCard, NewHand};

pub fn add_hand(connection: &PgConnection, session_hash: i32) {
    use crate::schema::hands::dsl as hands;

    // set up values and insert new card
    let new_hand = NewHand { session_hash };
    diesel::insert_into(hands::hands)
        .values(&new_hand)
        .execute(connection)
        .expect("Error creating hand");
}

pub fn delete_hand(connection: &PgConnection, hand_id: i32) {
    use crate::schema::hands::dsl as hands;

    // set up values and insert new card
    diesel::delete(hands::hands.find(hand_id))
        .execute(connection)
        .expect("Error creating hand");
}

pub fn get_session_hand(connection: &PgConnection, session_hash: i32) -> Option<Hand> {
    use crate::schema::hands::dsl as hands;

    // query hands with given session_hash
    let result = hands::hands.filter(hands::session_hash.eq(session_hash))
        .load::<Hand>(connection)
        .unwrap_or(vec![]);

    match result.len() {
        1 => Some(result[0]),
        _ => None
    }
}

pub fn get_events(connection: &PgConnection, player_hand: &Hand) -> Vec<Event> {
    use crate::schema::events::dsl as events;
    use crate::schema::cards::dsl as cards;
    use crate::schema::hands::dsl as hands;

    // query for events for a given hand
    events::events.select((events::id, events::year, events::circa, &events::description))
        .inner_join(cards::cards.on(events::id.eq(cards::event_id)))
        .inner_join(hands::hands.on(cards::hand_id.eq(hands::id)))
        .filter(hands::id.eq(player_hand.id))
        .order(events::year)
        .load::<Event>(connection)
        .unwrap_or(vec![])
}

pub fn get_new_event(connection: &PgConnection, player_hand: &Hand) -> Event {
    use crate::schema::events::dsl as events;
    use crate::schema::cards::dsl as cards;
    use crate::schema::hands::dsl as hands;

    // get ids of events already in hand
    let hand_event_ids = events::events.select(events::id)
        .inner_join(cards::cards.on(events::id.eq(cards::event_id)))
        .inner_join(hands::hands.on(cards::hand_id.eq(hands::id)))
        .filter(hands::id.eq(player_hand.id))
        .order(events::year)
        .load::<i32>(connection)
        .unwrap_or(vec![]);

    // query for random event (of those not already in hand)
    no_arg_sql_function!(RANDOM, (), "Represents the SQL RANDOM() function");
    let result = events::events.filter(events::id.ne_all(hand_event_ids))
        .order(RANDOM)
        .limit(1)
        .load::<Event>(connection)
        .unwrap_or(vec![]);

    match result.len() {
        1 => result[0].clone(),
        _ => panic!("No events remaining!"),
    }
}

pub fn add_card(connection: &PgConnection, hand_id: i32, event_id: i32) {
    use crate::schema::cards::dsl as cards;

    // set up values and insert new card
    let new_card = NewCard { hand_id, event_id };
    diesel::insert_into(cards::cards)
        .values(&new_card)
        .execute(connection)
        .expect("Error putting event into hand");
}

