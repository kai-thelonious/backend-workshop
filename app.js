require('dotenv').config();

const express = require('express')
const mysql = require('mysql2')
const app = express()


// create connection to MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})


// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connection to MySQL:', err)
        return
    }

    console.log('Connected to MySQL')
})

//Start server
app.listen(3000, () => console.log('Server running on port 3000'))

//Test route
app.get('/test', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

//GET /pokemons
app.get('/pokemons', (req, res) => {
    connection.query(`
        SELECT name
        FROM pokemon
    `, (err, results) => {
        if (err) return res.status(500).send(err)
        res.json(results)
    })
})

//GET /trainers/teamcount -- return a list of trainers and their amount of pokemons
app.get('/trainers/teamcount', (req, res) => {
    connection.query(`
            select t.name, count(pokemon_id) as 'amount of pokemons'
            from trainers t
            join trainer_pokemon tp on t.id = tp.trainer_id
            group by t.id;
            `,
        (err, results) => {
        if (err) return res.status(500).send(err)
        res.json(results)
    })
})


//GET /battles - return a list of all battles including participants
app.get('/battles', (req, res) => {
    connection.query(`
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
        `, (err, results) => {
        if (err) return res.status(500).send(err)
        res.json(results)
    })
})

//GET /trainers/:id  -- details of a trainer and his team
app.get('/trainers/:id', (req, res) => {
    const trainerID = req.params.id

    connection.query(`
        select *
        from trainers 
        where id = ?
        `, [trainerID], (err, results) => {
        if (err) return res.status(404).send(err)
        res.json(results)
    })
})

//GET /stats/top-trainers  -- sort trainers after amount of wins
app.get('/stats/top-trainers', (req, res) => {
    connection.query(`
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
        `, (err, results) => {
        if (err) return res.status(500).send(err)
        res.json(results)
    })
})



