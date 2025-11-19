Wed-19-Nov-2025
Status: #new
Topics:

# Backend Workshop

I skal arbejde med domænet "Pokémon" og gå hele backend processen gennem:

1. Forstå data
2. Designe datamodel + ER-diagram (database design)
3. Implementere et relations­database­design i MySQL
4. Skrive SQL-queries (inkl. joins og aggregates)
5. Lave en Express-API applikation ovenpå databasen

### Del 1 - Dataforståelse

#### Opgave 1 – Hvad er det her for data?

Med udgangspunkt i tabellen `pokemon`:

1. Beskriv med få linjer:
   * Hvad repræsenterer én række i tabellen?
     En række repræsentere forskellige pokemons og deres respektive værdier.
   * Hvad er “domænet” (hvilke koncepter beskrives)?
     Domænet er Pokemon universet. Og der beskrives koncepter som angreb og defence, da disse pokemon kæmper mod hindanen. Der beskrives også hvilke elementære typer disse Pokemons tilhører, da dette er et vigtigt element i Pokemon universet.
1. Brug [**WKID-pyramiden**](https://behu.gitbook.io/ita25-1-sem/data-literacy/01-what-is-data) fra *What is data* som reference.
   * Giv 2 eksempler på rå data.
     1. '5', 'Charmeleon', '80', '65', '80', '58', '64', '58', 'Fire', NULL
     2. '150', 'Mewtwo', '130', '90', '154', '90', '110', '106', 'Psychic', NULL

   * Giv 2 eksempler på information.
	1. Det første 5-tal i Charmeleon rækken hører under 'pokedex-number', så vi ved at denne pokemon har det unikke pokedex nummer '5'.
	2. 'NULL' i sidste kolonne i andet eksempel indikerer at Mewtwo ikke har nogen secondary type. Og derfor kun tilhører klassen 'psychic'
   * Giv 1 eksempel på en beslutning, man kunne understøtte med Pokémon-data (f.eks i en kontekst af et spil).
     Man skal fx bruge data som 'attack', 'defence' og 'hp (health points)' når man skal regne ud hvorvidt ens pokemon er stærkere end modstanderens. Der er selfølgelig også andet man skal tænke over som fx hvilken type. 

#### Opgave 2 – Datakvalitet og constraints

1. Kig på kolonnerne i `pokemon` (fx `hp`, `speed`, `primary_type`, `secondary_type`).
2. Lav en lille liste over mulige datakvalitetsproblemer:
   * Hvilke felter kunne være `NULL`, men ikke burde være det?
     Alle kollonner undtagen 'secondary_type' må ikke være null, da de skal ha angivet en værdi for at være brugbare. Hvis det er fordi at man gerne vil have at en Pokemons hp er 0 så skal 0 angives som en integer og ikke værdien null. Secondary type er det helt ok at angive som null, da det ikke er nødvendigt for en pokemon at have en secondary type, men kun en primary type.
   * Hvad hvis typer staves forkert?
     Dette er et problem for så vil spillet ikke registrere det som den korrekte type. Det er derfor vigtigt at vi får det indtastet rigtigt, og ikke kommer til at ændre det.
   * Hvad hvis stats er negative eller urimeligt høje?
     Umiddelbart kan jeg ikke se hvordan negative tal kan bruges i vores kontekst og skal derfor undgås. Det er også vigtigt vi sørger for at de ikke er for høje, for så vil de jo kunne slå alle andre pokemons urimeligt. Med mindre det er det vi gerne vil have selvfølgelig. 
1. For mindst 3 felter: formuler en eller flere idéer til [constraints](https://behu.gitbook.io/ita25-1-sem/data-literacy/03-data-quality).
   * Fx: `hp > 0`, `primary_type` skal være én af en fast liste, `secondary_type` må være NULL men ikke tom tekst.
   'Name' må ikke indeholde tal eller være tom. 
   'attack' & 'defence' & 'special_attack' % 'special_defence' > 0
   'pokedex_number' skal være primary ID der automatisk incrementer når man tilføjer nye pokemons.

### Del 2 - Datamodel og ER-diagram (Database Design)

Nu udvider vi domænet: forestil jer et lille Pokémon-spil med trænere, kampe og hold. Foreslå et sæt af entiteter, der kunne være relevante.

#### Opgave 3 – Identificér entiteter

1. Udvid domænet med minimum 3 entiteter f.eks:
   * `Pokemon`
   * `Trainer`
   * `Battle`
   * `Location` eller `Gym` (valgfrit)
   * Evt. `Team` / `League`
2. For hver entitet:
   * Vælg en primærnøgle (naturlig eller kunstig/surrogat).
   * Skriv 3–6 nøgleattributter (fx for `Trainer`: navn, alder, hometown, badge\_count).
1. Brug begreberne fra [Cardinality and database diagrams](https://behu.gitbook.io/ita25-1-sem/database-design/02-cardinality-and-eer) (PK, attributter, relationer).

Trainer table:

| Trainer ID | Name | Age | Gym            | Battle Style |
| ---------- | ---- | --- | -------------- | ------------ |
| 1          | Ash  | 17  | "Pallet Town"  | "Offensive"  |
| 2          | Kai  | 26  | "Cerulean Gym" | "Balanced"   |
| 3          | Yui  | 35  | "Pewter Gym"   | "Defensive"  |
| 4          | Ben  | 23  | "Independant"  | "Speed"      |
Trainer's pokemon:
They can only bring three to battle

| Trainer ID | Pokemon 1 | Pokemon 2 | Pokemon 3 |
| ---------- | --------- | --------- | --------- |
| 1          | 5         | 1         | 25        |
| 2          | 20        | 2         | 8         |

Battle Table:

| Battle ID | Trainer ID | Name | Battle Style |
| --------- | ---------- | ---- | ------------ |
| 1         | 1          | Ash  | "Offensive"  |
| 1         | 2          | Kai  | "Balanced"   |


#### Opgave 4 – Cardinality og EER-diagram

1. Beskriv relationer mellem entiteterne, fx:
   * En `Trainer` kan eje mange `Pokemon`
   * En `Battle` foregår mellem 2 (eller flere) trænere.
   * Én `Pokemon` kan deltage i mange `Battles` over tid (M–N).
2. Lav et ER/EER-diagram med:
   * Entiteter
   * Relationer
   * Cardinalities (1:1, 1:M, M:N)

![[Pokemon EER.png]]
### Del 3 – Relations­design i MySQL (DDL)

**I må gerne bruge chatGPT til at generere insert statements og data**

#### Opgave 5 – Fra ER-diagram til tabeller

1. Opret en ny database, fx `pokemon_game`.
2. Skriv DDL (CREATE TABLE) til mindst disse tabeller:
   * `trainer`
   * `pokemon` (kan være kopi/variant af den eksisterende pokemontabel, men med en PK, fx `pokedex_number` eller `id`)
   * `trainer_pokemon` (join-tabel for ejerskab)
   * `battle` (kamp-info: dato, sted, vinder osv.)
   * `battle_participant` (hvilke trænere deltager i hvilke kampe)
3. For hver tabel:
   * Angiv primærnøgle (`PRIMARY KEY (...)`).
   * Angiv relevante foreign keys (`FOREIGN KEY (...) REFERENCES ...`).
   * Tilføj mindst eventuelle **CHECK** constraints/logiske regler. [behu.gitbook.io](https://behu.gitbook.io/ita25-1-sem/database-design/01-ddl-constraints)

#### Opgave 6 – Indsæt test-data

**I må gerne bruge chatGPT til at generere insert statements og data**

1. Indsæt minimum 10 trænere i `trainer`.
2. Indsæt minimum 40 rækker i `trainer_pokemon` (hvem ejer hvilke Pokémon).
3. Indsæt minimum 10 kampe i `battle` og tilhørende rækker i `battle_participant`.

### Del 4 – SQL-queries og aggregater (Data literacy + joins)

Brug nu jeres egne tabeller i `pokemon_game` til at lave queries.

#### Opgave 7 – Joins

Lav mindst disse queries:

1. Find alle trænere med deres Pokémon-navne (JOIN mellem `trainer`, `trainer_pokemon`, `pokemon`).
2. Find alle kampe med:
   * dato
   * deltagende træner-navne
   * evt. vinder
3. Find alle Pokémon som ejes af mere end én træner (GROUP BY + HAVING).
``` SQL
-- Find all trainers w their pokemons
select *
from trainers t
join trainer_pokemon tp on  t.id = tp.trainer_id
join pokemon p on tp.pokemon_id = p.pokedex_number;

-- Find all battles with respective trainers
select *
from battle b 
join battle_participant bp on b.id = bp.battle_id
join trainers t on bp.trainer_id = t.id;

-- Find all battles and the winner
select *
from battle b 
join trainers t on b.winner_trainer_id = t.id;

-- Find all Pokemon owned by more than one trainer
select pokemon_id, count(pokemon_id)
from trainer_pokemon
group by pokemon_id
having count(pokemon_id) > 1;
```
#### Opgave 8 – Aggregater

Lav mindst 3 queries med aggregate-funktioner:

1. Gennemsnitlig `hp` pr. `primary_type` (GROUP BY).
2. Antal Pokémon pr. træner.
3. Antal kampe pr. træner og sortér efter flest kampe.

(Brug fx `COUNT`, `AVG`, `MIN`, `MAX` osv., som i *Data analysis – Aggregate functions*.) [behu.gitbook.io](https://behu.gitbook.io/ita25-1-sem/data-literacy)

``` SQL
-- Average HP per primary type
select primary_type, avg(hp) as average_hp
from pokemon
group by primary_type;

-- Amount of Pokemon per trainer (I gave all of them 4)
select trainer_id, count(pokemon_id)
from trainer_pokemon
group by trainer_id;

-- Amount of battles pr trainer and sort after most battles
select t.name, bp.trainer_id, count(trainer_id) as 'battle amount'
from battle b 
join battle_participant bp on b.id = bp.trainer_id
join trainers t on bp.trainer_id = t.id
group by bp.trainer_id
order by 'battle amount';

-- Amount of wins pr trainers and sort by wins
select name, winner_trainer_id, count(winner_trainer_id) as count
from battle b
join trainers t on b.winner_trainer_id = t.id
group by winner_trainer_id
order by count DESC;
```
### Del 5 – Simpelt API Express.js

#### Opgave 9 – Express-skelet + DB-connection

1. Opret et nyt Node-projekt
2. Installer nødvendige pakker:
   * `npm install express mysql2`
3. Lav en `app.js`, der:
   * Opretter en Express-app
   * Opretter en MySQL-connection til `pokemon_game`
   * Har et simpelt `GET /test`, der returnerer `{ status: "ok" }`.

#### Opgave 10 – Endpoints

Implementer mindst 3 endpoints:

1. `GET /pokemons`
   * Returner en liste af alle pokemonners navne.
2. `GET /trainers/teamcount`
   * Returner en liste af trænere med antallet af Pokémonner de har.
3. `GET /battles`
   * Returner en liste af alle kampe inkl. deltagere.
4. `GET /trainers/:id` – detaljer om én træner inkl. team.
5. `GET /stats/top-trainers` – sorter trænere efter antal kampe.





