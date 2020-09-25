use serde::Serialize;
use super::schema::{events, hands, cards, scores};

#[derive(Debug, Serialize, Queryable)]
pub struct Event {
    pub id: i32,
    pub year: i32,
    pub circa: bool,
    pub description: String, 
}

#[derive(Debug, Clone, Copy, Queryable)]
pub struct Hand {
    pub id: i32,
    pub session_hash: i32,
    pub extra_lives: i32
}

#[derive(Debug, Clone, Copy, Queryable)]
pub struct Card {
    pub id: i32,
    pub hand_id: i32,
    pub event_id: i32,
}

#[derive(Queryable)]
pub struct Score {
    pub id: i32,
    pub ip_address: String,
    pub score: i32,
}

#[derive(Insertable)]
#[table_name="hands"]
pub struct NewHand {
    pub session_hash: i32,
    pub extra_lives: i32,
}

#[derive(Insertable)]
#[table_name="cards"]
pub struct NewCard {
    pub hand_id: i32,
    pub event_id: i32,
}

#[derive(Insertable)]
#[table_name="scores"]
pub struct NewScore {
    pub ip_address: String,
    pub score: i32,
}

impl Event {
    pub fn new(id: i32, year: i32, circa: bool, description: &str) -> Self {
        Event {
            id,
            year,
            circa,
            description: description.to_string(),
        }
    }
}

impl Clone for Event {
    fn clone(&self) -> Self {
        Self::new(
            self.id,
            self.year,
            self.circa,
            &self.description,
        )
    }
}

impl Hand {
    pub fn new(id: i32, session_hash: i32, extra_lives: i32) -> Self {
        Self { id, session_hash, extra_lives }
    }
}