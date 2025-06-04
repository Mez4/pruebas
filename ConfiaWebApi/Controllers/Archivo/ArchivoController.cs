
// using System;
// using System.Linq;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
// using DBContext.DBConfia;
// using DBContext.DBConfia.General;
// using DBContext.DBConfia.Creditos;
// using DBContext.DBConfia.Prospeccion;
// using DBContext.DBConfia.Catalogos;
// using DBContext.DBConfia.Seguridad;
// using System.IO;
// using Microsoft.Extensions.Configuration;
// using System.Net.Http;
// using System.Net.Http.Headers;
// using Newtonsoft.Json;
// using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
// using ConfiaWebApi.ModlesSP.Prospeccion;
// using System.Net;
// using System.Collections;
// using ConfiaWebApi.ModlesSP.Cobranzaglobal;


// namespace ConfiaWebApi.Controllers.Administracion.Bancos
// {
//     [Authorize]
//     [ApiController]
//     [Route("api/Archivo/[controller]")]
//     public class ArchivoController : ControllerBase
//     {
//         private DBConfiaContext ConexionBD;
//         private IConfiguration Configuracion;

//         public ArchivoController(IConfiguration _Configuration, DBConfiaContext _ConexionBD) { this.Configuracion = _Configuration; ConexionBD = _ConexionBD; }



//         // [HttpPost]
//         // [Route("get")]
//         // [Authorize]
//         // // [Code.TProteccionAdmin]
//         // public async Task<IActionResult> Get(PeticionesRest.Archivo.ArchivoPersona.Get parData)
//         // {
//         //     try
//         //     {
//         //         var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Archivo.Personas_Dcs_VW>("ORDER BY FechaHoraRegistro DESC");
//         //         await ConexionBD.Destroy();
//         //         return Ok(res);
//         //     }
//         //     catch (Exception ex)
//         //     {
//         //         await ConexionBD.Destroy();
//         //         return NotFound(ex.Message);
//         //     }

//         // }

//         [HttpPost]
//         [Route("get")]
//         [Authorize]
//         // [Code.TProteccionAdmin]
//         public async Task<IActionResult> Get(PeticionesRest.Archivo.ArchivoPersona.Get parData)
//         {
//             try
//             {
//                 var query = NPoco.Sql.Builder.Select("PersonaID", "NombreCompleto", "DistribuidorID", "ClienteID", "CoordinadorID", "creditoPromotorId", "AnalistaID", "DirectorMesaCreditoID", "GestorCobranzaID", "DirectorMesaCobranzaID", "EstatusID", "NombreEstatus", "Clave", "Color", "FechaHoraRegistro").From("Archivo.Personas_Dcs_VW");

//                 // Si tenemos la variable de nombre
//                 if (!string.IsNullOrEmpty(parData.NombreCompleto))
//                     query = query.Where(
//                         @"(
//                             dbo.Levenshtein(UPPER(NombreCompleto), UPPER(@0), 1) <= 1 OR NombreCompleto LIKE '%' + UPPER(@0) + '%'
//                         )", parData.NombreCompleto);

//                 if (parData.EstatusID != null)
//                     query = query.Where("EstatusID = @0", parData.EstatusID);


//                 // Clientes
//                 if (parData.Distribuidor != null)
//                     query = query.Where("DistribuidorID IS NOT NULL", parData);

//                 // Distribuidor
//                 if (parData.Cliente != null)
//                     query = query.Where("ClienteID IS NOT NULL", parData);

//                 // Coordinadores
//                 if (parData.Coordinador != null)
//                     query = query.Where("CoordinadorID IS NOT NULL", parData);

//                 //Promotores
//                 if (parData.Promotor != null)
//                     query = query.Where("creditoPromotorId IS NOT NULL", parData);

//                 //Analistas
//                 if (parData.Analista != null)
//                     query = query.Where("AnalistaID IS NOT NULL", parData);

//                 //Directores mesa credito
//                 if (parData.DirectorMesaCredito != null)
//                     query = query.Where("DirectorMesaCreditoID IS NOT NULL", parData);

//                 //gestores cobranza
//                 if (parData.GestorCobranza != null)
//                     query = query.Where("GestorCobranzaID IS NOT NULL", parData);

//                 //directores mesa de cobranza
//                 if (parData.DirectorMesaCobranza != null)
//                     query = query.Where("DirectorMesaCobranzaID IS NOT NULL", parData);

//                 // Prospectos
//                 // if (parData.Prospecto != null)
//                 //     query = query.Where("ProspectoID IS NOT NULL", parData.EstadoCivilID);
//                 var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Archivo.Personas_Dcs_VW>(query).ToArrayAsync();
//                 await ConexionBD.Destroy();
//                 return Ok(res);
//             }
//             catch (Exception ex)
//             {
//                 await ConexionBD.Destroy();
//                 return NotFound(ex.Message);
//             }


//         }


//         [HttpPost]
//         [Route("getEstatus")]
//         [Authorize]
//         // [Code.TProteccionProducto]
//         public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Archivo.Estatus.Get parData)
//         {
//             // if (parData.EstatusID != 0)
//             // {
//             try
//             {
//                 var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Archivo.Estatus>();
//                 await ConexionBD.Destroy();
//                 return Ok(res);
//             }
//             catch (Exception ex)
//             {
//                 await ConexionBD.Destroy();
//                 return NotFound(ex.Message);
//             }

//             // }
//             // var res1 = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Archivo.Estatus>();
//             // await ConexionBD.Destroy();
//             // return Ok(res1);
//         }


//         [HttpPost]
//         [Route("add")]
//         [Authorize]
//         // [Code.TProteccionProducto]
//         public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Archivo.Estatus.Add parData)
//         {
//             try
//             {
//                 var estatus = new DBContext.DBConfia.Archivo.Estatus() { NombreEstatus = parData.NombreEstatus, Clave = parData.Clave, Color = parData.Color, Descripcion = parData.Descripcion };
//                 await ConexionBD.database.InsertAsync<DBContext.DBConfia.Archivo.Estatus>(estatus);
//                 await ConexionBD.Destroy();
//                 return Ok(estatus);
//             }
//             catch (Exception ex)
//             {
//                 await ConexionBD.Destroy();
//                 return BadRequest(ex);
//             }
//         }

//         [HttpPost]
//         [Route("update")]
//         [Authorize]
//         // [Code.TProteccionProducto]
//         public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Archivo.Estatus.Update parData)
//         {
//             try
//             {
//                 var estatus = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Archivo.Estatus>(parData.EstatusID);
//                 estatus.NombreEstatus = parData.NombreEstatus;
//                 estatus.Clave = parData.Clave;
//                 estatus.Color = parData.Color;
//                 estatus.Descripcion = parData.Descripcion;
//                 await ConexionBD.database.UpdateAsync(estatus);
//                 await ConexionBD.Destroy();
//                 return Ok(estatus);
//             }
//             catch (Exception ex)
//             {
//                 await ConexionBD.Destroy();
//                 return BadRequest(ex);
//             }
//         }

        
//     }
// }
