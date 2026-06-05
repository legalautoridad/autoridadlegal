-- Fill locations.gps_center using the average of available risk_points coordinates from the attached data
-- PostGIS geography(Point, 4326). Important: ST_MakePoint expects longitude, latitude.
BEGIN;

WITH coords(id, lng, lat) AS (
  VALUES
    ('0494e13b-e089-44ea-86df-4fde64d4f352'::uuid, 2.02400000::double precision, 41.60033333::double precision), -- matadepera
    ('0d6835ff-28e3-4795-abe5-c573e3eaec30'::uuid, 2.28500000::double precision, 42.00800000::double precision), -- manlleu
    ('0df1856a-43b5-465e-811d-957dd2f3bbb4'::uuid, 1.65500000::double precision, 41.32166667::double precision), -- santa-margarida-i-els-monjos
    ('14176971-23e1-4785-91fd-9d18aefc2b92'::uuid, 2.23483333::double precision, 41.45716667::double precision), -- montigala-badalona
    ('1a34ada0-5d6c-4158-8ac6-2c7fdcf99379'::uuid, 2.02466667::double precision, 41.31166667::double precision), -- viladecans
    ('1c58dc77-a94c-4f9b-8488-dff337f9a011'::uuid, 1.92336667::double precision, 41.48256667::double precision), -- martorell
    ('21588df2-0f2f-41ac-9481-69f714ad7a16'::uuid, 2.02400000::double precision, 41.55566667::double precision), -- terrassa
    ('21db3823-653f-4197-b9f2-a2c90704f47b'::uuid, 1.98700000::double precision, 41.47400000::double precision), -- castellbisbal
    ('22505161-5ca0-4587-81cf-7417abf52ff4'::uuid, 2.12633333::double precision, 41.40133333::double precision), -- tuneles-vallvidrera-sarria
    ('2b84f856-bd37-40f4-aec4-7835375584e6'::uuid, 1.64166667::double precision, 41.57133333::double precision), -- vilanova-del-cami
    ('31387b22-aa00-4772-b7b9-296866c206a7'::uuid, 2.17966667::double precision, 41.44183333::double precision), -- barcelona-capital
    ('40270cd6-39f0-4047-befb-171369521720'::uuid, 2.14516667::double precision, 41.48866667::double precision), -- cerdanyola-del-valles
    ('40dd3f29-2a95-42e3-b885-9348a754b7a0'::uuid, 2.08733333::double precision, 41.37416667::double precision), -- esplugues-de-llobregat
    ('4208c024-1ede-4d5b-8f34-f64a72b08856'::uuid, 2.23066667::double precision, 41.56500000::double precision), -- parets-del-valles
    ('4584b81b-8700-4979-8941-3bbfe2b28614'::uuid, 1.88400000::double precision, 41.76833333::double precision), -- sant-fruitos-de-bages
    ('45dbdab6-bf45-4481-b011-02063e531b17'::uuid, 1.94500000::double precision, 41.38700000::double precision), -- vallirana
    ('474e5ce3-08ab-4a2b-82ca-22fab3d46937'::uuid, 2.07183333::double precision, 41.29756667::double precision), -- aeropuerto-barcelona-prat
    ('4ee106d9-31ee-41f5-bd86-cccfbfb81efe'::uuid, 1.96600000::double precision, 41.55166667::double precision), -- viladecavalls
    ('53f8ce8f-100b-4af2-b542-aa9e82e96d95'::uuid, 2.10733333::double precision, 41.53733333::double precision), -- sabadell
    ('55458f67-1fa7-47f9-8db1-07543fab292f'::uuid, 1.83833333::double precision, 41.73133333::double precision), -- manresa
    ('574124f4-ca87-4fe7-a7e9-5983160d305e'::uuid, 2.15866667::double precision, 41.49783333::double precision), -- ripollet
    ('5c74f6da-0492-40eb-bcb2-5942da0f1249'::uuid, 2.11833333::double precision, 41.35450000::double precision), -- hospitalet-de-llobregat
    ('5d1a5251-58ad-47dd-a772-4434e9ad74cc'::uuid, 2.21600000::double precision, 41.54266667::double precision), -- mollet-del-valles
    ('5e0b7d28-6bd8-40df-b69c-dcf9487b0906'::uuid, 2.28633333::double precision, 41.63933333::double precision), -- les-franqueses-del-valles
    ('639fa87f-06ef-495f-b172-5323a0f70f85'::uuid, 2.07616667::double precision, 41.34566667::double precision), -- estadio-splau-cornella
    ('6683f95c-3876-4ff1-b610-7cbfac97c6a3'::uuid, 2.04166667::double precision, 41.38466667::double precision), -- sant-feliu-de-llobregat
    ('66f9abab-590c-4491-85db-b191674335f4'::uuid, 2.06000000::double precision, 41.31050000::double precision), -- mas-blau-prat
    ('67f462c3-950f-45e2-98f8-c23cf727cb61'::uuid, 2.00733333::double precision, 41.29850000::double precision), -- gava
    ('69c49ae0-0224-4439-89a5-73c0c7419ef8'::uuid, 1.81400000::double precision, 41.75166667::double precision), -- sant-joan-de-vilatorrada
    ('6c1d503a-457d-45b0-8525-47289dd5367d'::uuid, 2.24133333::double precision, 41.45140000::double precision), -- badalona
    ('6ce32baa-7709-4361-b5a0-fa0097c06dec'::uuid, 2.25466667::double precision, 41.93300000::double precision), -- vic
    ('6e9016fa-c480-449c-b97a-8616abe6c88d'::uuid, 2.08500000::double precision, 41.53433333::double precision), -- sant-quirze-del-valles
    ('6eefb836-0a54-4bdd-bd47-4aa95e8df542'::uuid, 2.08200000::double precision, 41.35050000::double precision), -- cornella-de-llobregat
    ('72e5b048-d0f9-4531-bcb3-9fe2716bbd76'::uuid, 1.82400000::double precision, 41.24266667::double precision), -- sitges
    ('771b8522-f3be-4976-a203-951b1219a4fc'::uuid, 1.62366667::double precision, 41.58833333::double precision), -- igualada
    ('78cec8bf-7a23-47c8-9dbb-3330925a99ac'::uuid, 2.31166667::double precision, 41.48166667::double precision), -- el-masnou
    ('7ab1cadf-0e24-4461-a0d7-40a1712096ca'::uuid, 1.72033333::double precision, 41.22833333::double precision), -- vilanova-i-la-geltru
    ('7b804736-ed49-467c-a08e-5d7540671de6'::uuid, 2.06933333::double precision, 41.38450000::double precision), -- sant-just-desvern
    ('89598ce4-7699-4ca5-a7c6-028a9648569b'::uuid, 2.20833333::double precision, 41.45016667::double precision), -- santa-coloma-de-gramenet
    ('8a62f25c-bc3c-407d-b444-0084ce24dca7'::uuid, 1.99800000::double precision, 41.27450000::double precision), -- castelldefels
    ('8b3ad299-78e6-487d-b847-51cad2465877'::uuid, 2.11116667::double precision, 41.50400000::double precision), -- bellaterra-uab
    ('98fc1939-c7f1-4002-b3e1-ebb5f7f7ca29'::uuid, 2.05000000::double precision, 41.33650000::double precision), -- sant-boi-comercial
    ('9bb2cf5f-9be8-4fd2-9fcd-c4b45d855516'::uuid, 2.39600000::double precision, 41.51500000::double precision), -- vilassar-de-mar
    ('9c0962f0-5b0c-4611-9105-bfaad802c8e7'::uuid, 2.00700000::double precision, 41.40650000::double precision), -- molins-de-rei
    ('9d590348-880a-4d99-ae30-a0f33293af61'::uuid, 2.09650000::double precision, 41.38475000::double precision), -- finestrelles-esplugues
    ('a1164a1f-2e30-4485-9268-eaef34572341'::uuid, 1.78500000::double precision, 41.42266667::double precision), -- sant-sadurni-d-anoia
    ('a4afffbe-6a69-4c1e-a2e1-7c41a37ee256'::uuid, 1.88166667::double precision, 42.03733333::double precision), -- gironella
    ('a4b7eaec-0ee0-42ba-a16c-8aab9dc819fc'::uuid, 2.07350000::double precision, 41.35700000::double precision), -- riera-cornella
    ('aad282e5-e9a3-46a9-a747-71a94d0accf2'::uuid, 2.20166667::double precision, 41.44233333::double precision), -- nudo-trinidad-scg
    ('ab2f356f-d7bd-4cce-8dcf-a115c817592a'::uuid, 2.03500000::double precision, 41.33383333::double precision), -- sant-boi-de-llobregat
    ('ac8409ca-32a0-4d9f-8c51-340f03b3e716'::uuid, 1.70066667::double precision, 41.34266667::double precision), -- vilafranca-del-penedes
    ('ae1f708f-d0ee-4955-bfea-6cb80175a5f8'::uuid, 2.09700000::double precision, 41.32050000::double precision), -- el-prat-de-llobregat
    ('b52335a3-6f1e-43cd-b66c-68679a23fedd'::uuid, 2.21250000::double precision, 41.45950000::double precision), -- bon-pastor-limite-scg
    ('b9044c6f-5b25-4882-b80c-74edeac7a61c'::uuid, 1.84416667::double precision, 42.08873333::double precision), -- berga
    ('b9d48127-af4c-4054-9e79-38ba5947cf5b'::uuid, 2.22066667::double precision, 41.42966667::double precision), -- sant-adria-de-besos
    ('ba9781e0-3ffa-4ab5-b3d6-e46f84c6b4ff'::uuid, 2.70500000::double precision, 41.69100000::double precision), -- tordera
    ('c34ff7aa-0954-4745-a8fb-31a7b50e4b2b'::uuid, 2.08950000::double precision, 41.35575000::double precision), -- femades-hospitalet
    ('c3ae77d2-5210-49a3-a90d-7e91ffd8034d'::uuid, 2.17400000::double precision, 41.53066667::double precision), -- santa-perpetua-de-mogoda
    ('c4e50aa9-5f08-4e5d-b642-6595e3f29bb3'::uuid, 2.23600000::double precision, 41.96833333::double precision), -- gurb
    ('c6bc5f44-25e4-4645-b004-872814e4f0ab'::uuid, 2.07966667::double precision, 41.47166667::double precision), -- sant-cugat-del-valles
    ('cbb26cbf-d4b5-4f0d-9c50-dff2fea38999'::uuid, 2.19466667::double precision, 41.38633333::double precision), -- puerto-ronda-litoral
    ('d056cf67-7b63-4a20-b596-9c3f9ecd2d9f'::uuid, 2.27700000::double precision, 41.59416667::double precision), -- granollers
    ('d234c18e-b80e-4f54-9812-7867c321bd42'::uuid, 1.76850000::double precision, 41.61000000::double precision), -- el-bruc
    ('d5a4322b-302b-4bf1-872e-42661cf4357c'::uuid, 2.55090000::double precision, 41.57795000::double precision), -- arenys-de-mar
    ('e0f1ed69-7111-4476-80ee-7396c7b55b89'::uuid, 1.86150000::double precision, 42.25500000::double precision), -- baga
    ('e84c079b-1e58-48a3-bdc1-53cef6477a45'::uuid, 2.02066667::double precision, 41.36166667::double precision), -- santa-coloma-de-cervello
    ('ec265384-a773-495a-8529-c045f2fd1564'::uuid, 2.68720000::double precision, 41.62670000::double precision), -- pineda-de-mar
    ('f0904969-0e57-4693-97ab-332b20cb1435'::uuid, 2.10500000::double precision, 41.34666667::double precision), -- bellvitge-hospitalet
    ('f34809de-b0ea-4f6b-922e-ac7ba4e67eb6'::uuid, 2.03500000::double precision, 41.48800000::double precision), -- rubi
    ('f3a716de-c67d-4c6d-a7c3-c2fd61a5a55d'::uuid, 1.90586667::double precision, 41.51046667::double precision), -- abrera
    ('f606c5e0-e1a6-4823-954f-15a6e445d6f2'::uuid, 1.76066667::double precision, 41.23466667::double precision), -- sant-pere-de-ribes
    ('f6b9c19b-1203-4412-a64b-53457ad351a8'::uuid, 2.25400000::double precision, 41.56533333::double precision), -- montmelo
    ('f94d0b67-f7da-4c7a-bc62-80037bf53add'::uuid, 2.12833333::double precision, 41.51166667::double precision), -- barbera-del-valles
    ('fcc29b11-7cfe-4ea1-88e1-601ec8d65aa7'::uuid, 2.43266667::double precision, 41.52800000::double precision), -- mataro
    ('fe9f6ae3-83f8-48b1-ae26-45d1c5cc6dd3'::uuid, 1.87200000::double precision, 41.53716667::double precision) -- esparreguera
)
UPDATE locations AS l
SET gps_center = ST_SetSRID(ST_MakePoint(c.lng, c.lat), 4326)::geography
FROM coords AS c
WHERE l.id = c.id
  AND l.gps_center IS NULL;

COMMIT;
