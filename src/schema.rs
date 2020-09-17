table! {
    cards (id) {
        id -> Int4,
        hand_id -> Int4,
        event_id -> Int4,
    }
}

table! {
    events (id) {
        id -> Int4,
        year -> Int4,
        circa -> Bool,
        description -> Text,
    }
}

table! {
    hands (id) {
        id -> Int4,
        session_hash -> Int4,
    }
}

joinable!(cards -> events (event_id));
joinable!(cards -> hands (hand_id));

allow_tables_to_appear_in_same_query!(
    cards,
    events,
    hands,
);
