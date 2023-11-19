show databases;
use crm;
show tables in crm;
select * from users;
describe users;
update users set active=1 where id=10;
					
delete from users;

select * from project;

select * from calender;

insert into project (name, description, owner, userId) values ("DWDD", "test",  "joe" , 1 )