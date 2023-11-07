show databases;
use crm;
show tables in crm;
select * from users;
					
delete from users;

select * from project;
update users set name="Joe admin" where id=21;

insert into project (name, description, owner, userId) values ("DWDD", "test",  "joe" , 1 )