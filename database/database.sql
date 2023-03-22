CREATE TABLE PRODUCTS (
    id_product SERIAL NOT NULL,
    name VARCHAR(50)NOT NULL,
	description VARCHAR(255),
	image varchar(155),
    price float,
    stock_day INT,
	available_stock INT,
    PRIMARY KEY (id_product)
);

insert into products (name,description,image,price,stock_day,available_stock) values
('MENU McDOWELLS','Carne de vacuno, queso cheddar, lechuga, tomate y cebolla en pan brioche tostado con dos sésamos. Acompañada de guarnición a elegir.',
 'https://cdn-icons-png.flaticon.com/512/9425/9425772.png',8.50,100,100),
 ('MENU McDOWELLS JR','McDowell Jr te trae la fórmula perfecta. Un menú completo y diversión sin fin con la sorpresa que esconde en su interior. La mejor opción para cubrir las necesidad tanto de los padres como de los más pequeños.',
 'https://cdn-icons-png.flaticon.com/512/7451/7451012.png',4.25,100,100);

 select * from products;


CREATE TABLE users (
    id_user SERIAL NOT NULL,
    username varchar(150),
	password VARCHAR(150),
    PRIMARY KEY (id_user)
);


CREATE TABLE clients (
	id_client SERIAL not null,
    id_user int references users(id_user),
	name VARCHAR(50),
    PRIMARY KEY (id_client)
);

CREATE TABLE waiter (
	id_waiter SERIAL not null,
    id_user int references users(id_user),
    PRIMARY KEY (id_waiter)
);


CREATE TABLE chef (
	id_chef SERIAL not null,
    id_user int references users(id_user),
    PRIMARY KEY (id_chef)
);


CREATE TABLE admin (
	id_admin SERIAL not null,
    id_user int references users(id_user),
    PRIMARY KEY (id_admin)
);

CREATE TABLE STATUS (
    id_STATUS SERIAL NOT NULL,
	DESCRIPTION VARCHAR(150),
    PRIMARY KEY (id_STATUS)
);

insert into status (description) values
('Pendiente Preparacion'),('Cocina'),('Pendiente servir'),('En servicio'),('Finalizado');

 select * from status;

CREATE TABLE orders(
	id_num_order SERIAL NOT NULL,
	order_date date,
	order_time time,
	order_mail VARCHAR(50),
	order_to_go	Boolean default false,
	id_user int references users(id_user),
    PRIMARY KEY (id_num_order)
);

CREATE TABLE products_in_order(
	id_order int references orders(id_num_order),
	id_product int references products(id_product),
	Units int,
	price float,
	coment varchar(255)
);

CREATE TABLE order_status(
	id_order int references orders(id_num_order),
	id_status int references status(id_status)
);


//todos los estados 1,2,3,4,5

-- --insert into users (username,password) values ('CAMARERO',123456),('COCINERO',234567),('ADMINISTRACION',345678);
-- --insert into chef(id_user) values (2);
-- --insert into waiter(id_user) values(1);
-- --insert into admin(id_user) values(3);
-- select * from users;
-- select * from chef;
-- select * from waiter;
-- select * from admin;


---Ejemplo creacion con relaciones

-- insert into users (email) values ('gjcuenca@hotmail.com');
select * from users;
-- insert into orders (id_num_order,order_date,id_user) values (1,'2023-02-03',4);
select * from orders;
-- insert into products_in_order (id_order,id_product,units,price) values (1,1,1,8.5),(1,2,1,4.25);
select * from products_in_order;
-- insert into order_status values (1,5);
select * from order_status;
select * from products;
-- update products 


---Consulta orders

---estados de pedidos
select *  from (select order_status.id_order,status.id_status, status.description  from order_status left join status on order_status.id_status=status.id_status) as estado;

--- todos los pedidos con descripcion producto
select products_in_order.id_order,orders.order_date fecha,orders.id_user,products_in_order.id_product, products.name, products_in_order.units, products_in_order.price, products_in_order.coment,  products.stock_day , products.available_stock as stock from products_in_order 
	right join orders on orders.id_num_order= products_in_order.id_order
	inner join products on products.id_product=products_in_order.id_product	;

---con estado y descripcion producto
	
select pedidos.*,estado.id_status,estado.description from (
select products_in_order.id_order,orders.order_date fecha,orders.id_user,products_in_order.id_product, products.name, products_in_order.units, products_in_order.price, products_in_order.coment,  products.stock_day , products.available_stock as stock from products_in_order 
	right join orders on orders.id_num_order= products_in_order.id_order
	inner join products on products.id_product=products_in_order.id_product	)  as pedidos
inner join  (select order_status.id_order,status.id_status, status.description  from order_status 
                left join status on order_status.id_status=status.id_status) as estado 
on pedidos.id_order=estado.id_order;

--- tickes  id finalizados
select * from (select pedidos.*,estado.id_status,estado.description from (
select products_in_order.id_order,orders.order_date fecha,orders.id_user,products_in_order.id_product, products.name, products_in_order.units, products_in_order.price, products_in_order.coment,  products.stock_day , products.available_stock as stock from products_in_order 
	right join orders on orders.id_num_order= products_in_order.id_order
	inner join products on products.id_product=products_in_order.id_product	)  as pedidos
inner join  (select order_status.id_order,status.id_status, status.description  from order_status left join status on order_status.id_status=status.id_status) as estado 
on pedidos.id_order=estado.id_order )  as tickets  where tickets.id_status=1 and tickets.id_order=1;