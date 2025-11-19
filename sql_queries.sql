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


-- Return a list of trainers and their amount of pokemons
select t.name, count(pokemon_id) as 'amount of pokemons'
from trainers t
join trainer_pokemon tp on t.id = tp.trainer_id
group by t.id;

-- Return a list of all battles incl. the participants
select 
	b.id as 'battle ID', 
	battle_date, 
	location, 
    winner_trainer_id, 
    battle_id, 
    t.id as 'trainer ID',
    name,
    hometown,
    level,
    badges,
    team_size
from battle b
join battle_participant bp on b.id = bp.battle_id
join trainers t on bp.trainer_id = t.id;

-- GET details of a trainer 
select *
from trainers ;

-- GET /stats/top-trainers  -- sort trainers after amount of wins
SELECT 
            t.id AS trainer_id,
            t.name,
            COALESCE(b.wins, 0) AS wins
        FROM trainers t
        LEFT JOIN (
            SELECT winner_trainer_id, COUNT(winner_trainer_id) AS wins
            FROM battle
            GROUP BY winner_trainer_id
        ) b ON t.id = b.winner_trainer_id
        ORDER BY wins DESC