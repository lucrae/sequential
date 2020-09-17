SELECT *
FROM events

INNER JOIN cards ON events.id = cards.event_id
INNER JOIN hands ON cards.hand_id = hands.id
	
WHERE hands.id = 1;