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

app.get('/', async(req, res) => {
    res.render('index.html')
})

app.get('/user/:name/pts/:pts', async(req, res) => {
    var name = req.params.name;
    var pts = req.params.pts
        //register user
    await pool.query('update set player(name, player_score) values($1, $2)', [name, 0]);
    res.json({ name });
});

app.get('/getuser/:name', async(req, res) => {
    var name = req.params.name;
    var userName = (await pool.query('select * from player where name= $1', [name])).rows;
    var data = userName[0]
    if (userName.length == 0) {
        await pool.query('insert into player(name, player_score) values($1, $2)', [name, 0]);
        var recent = (await pool.query('select * from player where name= $1', [name])).rows;
        res.json({
            data: recent[0]
        })
    } else {
        res.json({ data })
    }
});

app.post('/submit', async(req, res) => {
    ///submit/:name/level:levelName/score/:score
    var name = req.body.name;
    var level = req.body.levelName;
    var score = Number(req.body.player_score);
    await pool.query('update player set player_score = player_score + $1', [score]);
});

app.get('/getlevel', async(req, res) => {
    var level = (await pool.query('select * from levels')).rows;
    res.json({ data: level })
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server started on ' + PORT);
});