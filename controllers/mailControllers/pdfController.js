const { response } = require('express');
const PdfManager = require('../../models/pdf')




const getpdfOrder = async (req, res) => {
  //const id = req.params.id;
  const ultimo= await pgClient.query("select max(id_num_order) from orders");
  const id=ultimo.rows[0].max;
  const response = await PdfManager.getpdf(id)
  //cargamos y generamos pdf
  const pdf = require('html-pdf');
  const fs = require("fs");
  const ubicacionPlantilla = require.resolve("../../html/ticket.html");
  let contenidoHtml = fs.readFileSync(ubicacionPlantilla, 'utf8')
  // tomamos los datos de response
  const productos = response;
  
  
  // Nota:se formatea el dinero. No es requerido, es para que se vea bonito
  const formateador = new Intl.NumberFormat("de-DE", { style: "currency", "currency": "EUR" });
  // Generar el HTML de la tabla
  let tabla = "";
  let subtotal = 0;
  let num=0;
  let date="";
  for (const producto of productos) {
      // Aumentar el total
      const totalProducto = producto.units * producto.price;
      date = producto.fecha;
      num = producto.id_order;
      subtotal += totalProducto;
      // Y concatenar los productos
      tabla += `<tr>
      <td>${producto.name}</td>
      <td>${producto.units}</td>
      <td>${formateador.format(producto.price)}</td>
      <td>${formateador.format(totalProducto)}</td>
      </tr>`;
  }
   date = new Date().toISOString().slice(0, 10);
  const [yyyy,mm,dd] = date.split('-');
  const formattedDate = `${dd}/${mm}/${yyyy}`;
  subtotal = (subtotal/1.10);
  const impuestos = subtotal* 0.10;
  const total = subtotal + impuestos;
  // Remplazar el valor {{tablaProductos}} por el verdadero valor
  contenidoHtml = contenidoHtml.replace("{{tablaProductos}}", tabla); 
  
  
  // Y también los otros valores
  contenidoHtml = contenidoHtml.replace("{{date}}", formattedDate);
  contenidoHtml = contenidoHtml.replace("{{num}}",num);
  contenidoHtml = contenidoHtml.replace("{{subtotal}}", formateador.format(subtotal));
  contenidoHtml = contenidoHtml.replace("{{impuestos}}", formateador.format(impuestos));
  contenidoHtml = contenidoHtml.replace("{{total}}", formateador.format(total));
  pdf.create(contenidoHtml).toFile(`./pdf/ticket_${id_order}.pdf`, function(err, res) {
    if (err){
        console.log("Error creando PDF: " +err);
    } else {
        console.log("PDF creado correctamente" +res);
    }
});
    
 //res.status(200).json(response); ** he tenido q comentar esto por q daba error
};




module.exports = { getpdfOrder };
