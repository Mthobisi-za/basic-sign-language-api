create table player(id serial primary key, name text not null);

/*create table exercises(id serial primary key, level_name text not null);*/

create table player_exercise(player_id int, level text not null, player_score int not null,
foreign key(player_id) references player(id));