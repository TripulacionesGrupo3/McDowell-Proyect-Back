startConnection = require("./connection");

class Order {
    constructor(
      id_num_order=null,
      order_date=null, 
      order_to_go=null, 
      email=null, 
      num_line=null, 
      id_product=null, 
      units=null, 
      price=null, 
      total_line=null, 
      coment=null
    ) {
      this.id_num_order = id_num_order;
      this.order_date = order_date;
      this.order_to_go = order_to_go;
      this.email = email;
      this.num_line = num_line;
      this.id_product = id_product;
      this.units = id_units;
      this.price = price;
      this.total_line = total_line;
      this.coment = coment;
    }
}

pgClient = startConnection()

class OrdersManager {
  static async getAll() {
      const queryResponse = await pgClient.query("SELECT * FROM orders");
      const orders = convertOrderDataToObjects(queryResponse.rows);
      return orders;
    }
  static async getId(id) {
      const queryResponse = await pgClient.query("SELECT * FROM orders WHERE id_num_order=$1",[id])
      const orders = convertOrderDataToObjects(queryResponse.rows);
      return orders;
  }
  
  
    static async createOrder(order) {
      const newOrder = await convertOrderObjectToData(order)
      newOrder.map((prod)=> {return pgClient.query(`INSERT INTO orders (id_product,units,price) VALUES (${prod})`)})
      return newOrder
    }
    
  }
  
  function convertOrderObjectToData(order) {
    const newOrder = order.map((product)=>  { return `${product.id_product},${product.quantity},${product.price}`})
    return newOrder
    //return `'${order.Id_num_order.id}', '${order.order_date}', '${order.order_to_go}','${order.email}','${order.num_line}','${order.id_product}','${order.units}',
    //'${order.price}','${order.total_line}','${order.coment}'`;
  }
  function convertOrderDataToObjects(data) {
    let orders = [];
    for (const objectData of data) {
      orders.push(
        new Order(
          (id_num_order = objectData.id_num_order),
          (order_date = objectData.order_date),
          (order_to_go = objectData.order_to_go),
          (email = objectData.email),
          (num_line = objectData.num_line),
          (id_product = objectData.id_product),
          (units = objectData.units),
          (price = objectData.price),
          (total_line = objectData.total_line),
          (coment = objectData.coment)
        )
      );
    }
    return orders;
  }
  
  module.exports = OrdersManager;