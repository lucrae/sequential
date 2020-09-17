-- events

INSERT INTO public.events (year, circa, description)
VALUES (2001, false, 'Wikipedia is founded.');

INSERT INTO public.events (year, circa, description)
VALUES (1969, false, 'Man lands on the moon for the first time.');

INSERT INTO public.events (year, circa, description)
VALUES (-2500, true, 'Egyptians do something, probably.');

INSERT INTO public.events (year, circa, description)
VALUES (1790, true, 'The first US patent is filed.');

-- hands

INSERT INTO public.hands (done)
VALUES (false);

-- cards

INSERT INTO public.cards (hand_id, event_id)
VALUES (1, 2)

