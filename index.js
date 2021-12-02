const express = require('express');
const body = require('body-parser');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');

app.use(cors({
    origin: "*"
}));
app.use(express.static('public'));
app.use(body.urlencoded({ extended: false }));
app.use(body.json());
var connectionstr = process.env.DATABASE_URL;
var pool;
if (connectionstr) {
    pool = new Pool({
        connectionString: connectionstr,
        ssl: { rejectUnauthorized: false },
    });
} else {
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        port: 5432,
        password: 'mthobisi',
        database: 'users',
        ssl: false,
    });
}



app.get('/newuser/:name', async(req, res) => {
    var name = req.params.name;
    //register user
    await pool.query('insert into player(name) values($1)', [name]);
    res.json({ name });
});

app.get('/getuser/:name', async(req, res) => {
    var name = req.params.name;
    var userName = (await pool.query('select * from player where name= $1', [name])).rows;
    if (userName.length == 0) {
        res.json({ err: 'no such username' })
    } else {
        var usersData = (await pool.query('select * from player_exercise where player_id = $1', [userName[0].id])).rows;
        console.log(usersData)
        if (usersData.length == 0) {
            res.json({ name: userName[0].name, userStatus: 'New User' });
        } else {
            res.json({ name: userName[0].name, data: usersData[0], userStatus: 'Have played before' });
        };

    }
});

app.post('/submit', async(req, res) => {
    ///submit/:name/level:levelName/score/:score
    var name = req.body.name;
    var level = req.body.levelName;
    var score = Number(req.body.score);
    console.log(name, level, score);
    //first check if they have level

    var userData = (await pool.query('select * from player where name= $1', [name])).rows;
    if (userData.length == 0) {
        //user does not exist
        await pool.query('insert into player(name) values($1)', [name]);
        var id = ((await pool.query('select id from player where name= $1', [name])).rows)[0].id;
        await pool.query(`insert into player_exercise (player_id,level,player_score) 
            values($1,$2,$3)`, [id, level, score]);

    } else {
        var usersData = (await pool.query('select * from player_exercise where player_id = $1', [userData[0].id])).rows;
        //check if the have level
        if (usersData.length == 0) {
            // wecan just insert
            await pool.query(`insert into player_exercise (player_id,level,player_score) 
            values($1,$2,$3)`, [userData[0].id, level, score]);

        } else {
            //we can update
            await pool.query('update player_exercise set level = $1, score = score + $2', [level, score]);

        };
    }
});
app.get('/board', async(req, res) => {
    var usersData = (await pool.query('select * from player_exercise')).rows;
    res.json({
        data: usersData
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server started on ' + PORT);
});