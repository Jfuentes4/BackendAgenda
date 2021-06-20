create table `users` (
    id int auto_incrtement not null,
    email varchar(100) not null,
    password varchar(100) not null,
    constraint user_pk primary key (id)
)
engine=innodb;
default charset=utf8mb4;
collate=utf8mb4_general_ci;
