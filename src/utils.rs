use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use rand::{thread_rng, Rng};

use super::models::Event;

pub fn abs(x: i32) -> i32 {
    if x >= 0 { x } else { -x }
}

pub fn get_new_event_position(new_event: &Event, events: &Vec<Event>) -> usize {
    for i in 0..events.len() {
        if new_event.year < events[i].year {
            return i
        }
    }

    events.len()
}

pub fn generate_hash(val: i32) -> i32 {
    let mut hasher = DefaultHasher::new();
    val.hash(&mut hasher);

    abs(hasher.finish() as i32)
}

pub fn generate_random_hash() -> i32 {
    let mut rng = rand::thread_rng();
    let val: i32 = rng.gen();
    
    generate_hash(val as i32)
}