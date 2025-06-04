// using DBContext.DBConfia;
// using DBContext.DBConfia.Distribuidores;
// using DBContext.DBConfia.General;
// using DBContext.DBConfia.Tesoreria;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Newtonsoft.Json;
// using System;
// using System.Collections.Generic;
// using System.IO;
// using System.Linq;
// using System.Net.Http;
// using System.Net.Http.Headers;
// using System.Threading.Tasks;

// namespace ConfiaWebApi.Controllers.Tesoreria
// {
//     [Authorize]
//     [ApiController]
//     [Route("api/tesoreria/[controller]")]
//     public class ReferenciasController : ControllerBase
//     {

//         private DBConfiaContext DBContext;

//         public ReferenciasController(DBConfiaContext _DBContext)
//         {
//             DBContext = _DBContext;
//         }

//         [HttpPost]
//         [Route("getConvenios")]
//         [Authorize]
//         public async Task<IActionResult> getConvenios(ConfiaWebApi.PeticionesRest.Tesoreria.Referencias.Convenio parData)
//         {
//             try
//             {
//                 var res = await DBContext.database.QueryAsync<Convenio>().ToArray();
//                 await DBContext.Destroy();
//                 return Ok(res);
//             }
//             catch (Exception ex)
//             {
//                 await DBContext.Destroy();
//                 return BadRequest(ex.Message);
//             }
//         }

//         [HttpPost]
//         [Route("addConvenios")]
//         [Authorize]
//         public async Task<IActionResult> addConvenios(ConfiaWebApi.PeticionesRest.Tesoreria.Referencias.Convenio parData)
//         {
//             try
//             {
//                 var newConvenio = new Convenio()
//                 {
//                     NombreConvenio = parData.NombreConvenio,
//                     CodigoConvenio = parData.CodigoConvenio,
//                     Contrasena = parData.Contrasena,
//                     Usuario = parData.Usuario
//                 };

//                 await DBContext.database.InsertAsync(newConvenio);
//                 var res = await DBContext.database.QueryAsync<Convenio>().ToArray();
//                 await DBContext.Destroy();
//                 return Ok(res);
//             }
//             catch (Exception ex)
//             {
//                 await DBContext.Destroy();
//                 return BadRequest(ex.Message);
//             }
//         }

//         [HttpPost]
//         [Route("asignarConvenios")]
//         [Authorize]
//         public async Task<IActionResult> asignarConvenios(ConfiaWebApi.PeticionesRest.General.Sucursal.Get parData)
//         {
//             try
//             {
//                 var Sucursal = await DBContext.database.SingleByIdAsync<Sucursales>(parData.SucursalID);
//                 Sucursal.ConvenioID = parData.ConvenioID;

//                 await DBContext.database.UpdateAsync(Sucursal);

//                 await DBContext.Destroy();
//                 return Ok(Sucursal);
//             }
//             catch (Exception ex)
//             {
//                 await DBContext.Destroy();
//                 return BadRequest(ex.Message);
//             }
//         }

//         [HttpGet]
//         [Route("rpm-generaClabe")]
//         public async Task<IActionResult> RPMGenerarClabe(PeticionesRest.Tesoreria.Referencias.Persona parData)
//         {
//             try
//             {
//                 // Ver si existe la referencia en la base de datos y si es asi, regresarla
//                 var ReferenciaExistente = await DBContext.database.QueryAsync<ReferenciasPersona>("WHERE PersonaID = @0", parData.PersonaID).SingleOrDefaultAsync();

//                 if (ReferenciaExistente != null)
//                 {
//                     await DBContext.Destroy();
//                     return Ok(ReferenciaExistente);
//                 }

//                 // ======================================== Obtener la informacion de la persona, si es un usuario o si es un cliente ========================================
//                 var Referencia = new { Nombre = "", Referencia = "" };
//                 var Distribuidor = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID = @0", parData.PersonaID).SingleOrDefaultAsync();
//                 if (Distribuidor != null)
//                 {
//                     var distID = Distribuidor.PersonaID.ToString();
//                     string numReferencia = "";
//                     for (int i = 0; i < 15 - distID.Length; i++)
//                     {
//                         numReferencia += "0";
//                     }
//                     numReferencia += distID;

//                     Referencia = new { Nombre = Distribuidor.PersonaNombre, Referencia = "1" + (Distribuidor.ProductoID < 10 ? "0" + Distribuidor.ProductoID : Distribuidor.ProductoID) + "1" + numReferencia };
//                 }


//                 var Cliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ClientesZonas_VW>("WHERE PersonaID = @0", parData.PersonaID).SingleOrDefaultAsync();
//                 // Se agrego el && debido a que hay una situacion de que el DV es cliente a la vez y eso no debe pasar para generar la referencia
//                 if (Cliente != null && Distribuidor == null)
//                 {
//                     var cliID = Cliente.PersonaID.ToString();
//                     string numReferencia = "";
//                     for (int i = 0; i < 15 - cliID.Length; i++)
//                     {
//                         numReferencia += "0";
//                     }
//                     numReferencia += cliID;

//                     Referencia = new { Nombre = Cliente.NombreCompleto, Referencia = "1" + (Cliente.ProductoID < 10 ? "0" + Cliente.ProductoID : Cliente.ProductoID) + "0" + numReferencia };
//                 }
//                 // ================================================================ Obtener las credenciales segun el prefijo ================================================================
//                 //                                                                                 [ Convenios ]
//                 var Sucursal = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID = @0", Distribuidor != null ? Distribuidor.SucursalID : Cliente.SucursalID).SingleOrDefaultAsync();
//                 var credenciales = await DBContext.database.QueryAsync<Convenio>("WHERE ConvenioID = @0", Sucursal.ConvenioID).SingleOrDefaultAsync();

//                 var responseAuth = "";
//                 var responseRef = "";

//                 if (credenciales != null)
//                 {
//                     // string urlAuth = "https://auth.clubpago.site/api/auth"; // Production
//                     string urlAuth = "https://qa.clubpago.site/auth/api/auth"; // Testing
//                     var clientAuth = new HttpClient();
//                     RequestPostAutenticacionToken post = new RequestPostAutenticacionToken()
//                     {
//                         User = credenciales.Usuario,
//                         Pswd = credenciales.Contrasena
//                     };

//                     var dataAuth = System.Text.Json.JsonSerializer.Serialize<RequestPostAutenticacionToken>(post);
//                     HttpContent contentAuth = new StringContent(dataAuth, System.Text.Encoding.UTF8, "application/json");

//                     var httpResponseAuth = await clientAuth.PostAsync(urlAuth, contentAuth);

//                     if (httpResponseAuth.IsSuccessStatusCode)
//                     {
//                         responseAuth = await httpResponseAuth.Content.ReadAsStringAsync();
//                         var postResultAuth = System.Text.Json.JsonSerializer.Deserialize<ResponseToken>(responseAuth);
//                         if (postResultAuth.Message == "Exito")
//                         {
//                             // string urlRef = "https://referencias.clubpago.site/svc/generator/Reference"; // Production
//                             string urlRef = "https://qa.clubpago.site/referencegenerator/svc/generator/reference"; // Testing
//                             var clientRef = new HttpClient();
//                             clientRef.DefaultRequestHeaders.Clear();
//                             clientRef.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", postResultAuth.Token);
//                             RequestPostReferencia post2 = new RequestPostReferencia()
//                             {
//                                 Description = "Referencia de pago",
//                                 Amount = 1000000,
//                                 Account = Referencia.Referencia,
//                                 CustomerEmail = "demo@valeconfia.com",
//                                 CustomerName = Referencia.Nombre,
//                                 ExpirationDate = "",
//                                 RequestClabe = 1,
//                                 RequestPayTD = 1
//                             };

//                             var dataRef = System.Text.Json.JsonSerializer.Serialize(post2);
//                             Console.WriteLine(dataRef);
//                             HttpContent contentRef = new StringContent(dataRef, System.Text.Encoding.UTF8, "application/json");

//                             var httpResponseRef = await clientRef.PostAsync(urlRef, contentRef);

//                             if (httpResponseRef.IsSuccessStatusCode)
//                             {
//                                 responseRef = await httpResponseRef.Content.ReadAsStringAsync();
//                                 var postResult2 = System.Text.Json.JsonSerializer.Deserialize<ResponseReferencia>(responseRef);
//                                 dynamic objResponse = JsonConvert.DeserializeObject(responseRef);

//                                 //Read http response body as dynamic object
//                                 if (postResult2.Error == null)
//                                 {
//                                     var nuevaReferencia = new ReferenciasPersona()
//                                     {
//                                         Referencia = objResponse.Reference,
//                                         ClabeSpei = objResponse.Clabe.ToString(),
//                                         FechaGeneracion = DateTime.Now,
//                                         PersonaID = parData.PersonaID
//                                     };

//                                     await DBContext.database.InsertAsync(nuevaReferencia);

//                                     await DBContext.Destroy();
//                                     return Ok(nuevaReferencia);
//                                 }
//                             }
//                         }
//                     }
//                 }

//                 await DBContext.Destroy();
//                 return Ok(new { code = 204, msg = "No hay credenciales validas para la generacion de referencias en ConvenioID : " + Sucursal.ConvenioID });
//             }
//             catch (Exception ex)
//             {
//                 await DBContext.Destroy();
//                 return BadRequest(ex.Message);
//             }
//         }

//         // [HttpPost]
//         // [Route("conekta-oxxo")]
//         // public async Task<IActionResult> ConektaOxxo()
//         // {
//         //     var userAgent = HttpContext.Request.Headers["User-Agent"];
//         //     var ipAgent = HttpContext.Connection.RemoteIpAddress;
//         //     bool transaccion = false;

//         //     try
//         //     {
//         //         string json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
//         //         dynamic objectData = JsonConvert.DeserializeObject(json);
//         //         var evento = new Object();
//         //         var objetoCompleto = objectData.ToString();


//         //         if (objectData.type != null)
//         //         {
//         //             if (objectData.type == "webhook_ping")
//         //             {
//         //                 evento = new
//         //                 {
//         //                     ping = true,
//         //                 };
//         //                 return Ok(evento);
//         //             }
//         //             else if (objectData.type == "inbound_payment.lookup")
//         //             {
//         //                 evento = new
//         //                 {
//         //                     payable = true,
//         //                     min_amount = 2000,
//         //                     max_amount = 10000000,
//         //                 };
//         //                 return Ok(evento);
//         //             }
//         //             else if (objectData.type == "inbound_payment.payment_attempt")
//         //             {
//         //                 evento = new
//         //                 {
//         //                     payable = true,
//         //                 };
//         //                 return Ok(evento);
//         //             }
//         //             else if (objectData.type == "order.paid" || objectData.type == "charge.paid")
//         //             {
//         //                 long unixTime = objectData.data.@object.created_at;
//         //                 dynamic paymenMethod = objectData.data.@object.charges.data[0].payment_method;
//         //                 int amount = (objectData.data.@object.charges.data[0].amount);
//         //                 string datetime = DateTime.Now.ToString("yyyy-MM-dd");
//         //                 DateTime date = DateTime.ParseExact(datetime, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
//         //                 string order_id = objectData.data.@object.charges.data[0].id;
//         //                 string reference = objectData.data.@object.charges.data[0].payment_method.reference;
//         //                 Guid MyUniqueId = Guid.NewGuid();

//         //                 // Revisar las ordenes en VR
//         //                 var existe = await ConexionBD.database.QueryAsync<BDVRPagos_TOFER_Context.BDVRPagos_TOFER.dbo.PagosConekta>("WHERE id=@0", order_id).ToArrayAsync();

//         //                 if (existe.Count() == 0)
//         //                 {
//         //                     // Revisar pagos conekta en VR
//         //                     var registro = new BDVRPagos_TOFER_Context.BDVRPagos_TOFER.dbo.PagosConekta()
//         //                     {
//         //                         id = order_id,
//         //                         referencia = reference,
//         //                         amount = amount,
//         //                         empresaid = -2,
//         //                         transaccionID = MyUniqueId.ToString(),
//         //                         fechaCreacion = date,
//         //                         fhRegistro = DateTime.Now,
//         //                     };

//         //                     transaccion = true;
//         //                     await ConexionBD.database.InsertAsync(registro);
//         //                     await ConexionBD.Destroy();

//         //                     evento = new
//         //                     {
//         //                         ok = true,
//         //                     };
//         //                     return Ok(evento);
//         //                 }
//         //                 else
//         //                 {
//         //                     evento = new
//         //                     {
//         //                         ok = false,
//         //                         pago_existe = true
//         //                     };
//         //                     return Ok(evento);
//         //                 }

//         //             }
//         //             else
//         //             {
//         //                 // Revisar tabla ObjetosOxxo en VR
//         //                 var objeto_oxxo2 = new BDVRPagos_TOFER_Context.BDVRPagos_TOFER.dbo.ObjetosOxxo()
//         //                 {
//         //                     Objeto = objetoCompleto,
//         //                     Fecha = DateTime.Now,
//         //                     Insertado = true,
//         //                 };
//         //                 await ConexionBD.database.InsertAsync(objeto_oxxo2);
//         //                 await ConexionBD.Destroy();
//         //                 return Ok(evento);
//         //             }
//         //         }
//         //         return Ok(evento);

//         //     }

//         //     catch (Exception ex)
//         //     {
//         //         return BadRequest(ex.Message);
//         //     }
//         // }
//     }
// }
