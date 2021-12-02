create table player(id serial primary key, name text not null, player_score int not null);

create table levels(id serial primary key, level_name text not null);

/*
create table player_exercise(player_id int, level_id, player_score int not null,
foreign key(player_id) references player(id),
foreign key(level_id) references levels(id)

); */

insert into levels(level_name) values('Please');

insert into levels(level_name) values('Thank You');

insert into levels(level_name) values('Hello');
