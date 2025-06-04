using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Diagnostics; //Método de Debugusing System.Text.Json;


using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;
using DBContext.DBConfia.Custom.Creditos;
using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using DBContext.DBConfia.Tesoreria;
using System.Data;
using DBContext.DBConfia.Seguridad;
using registraOrden;
using System.Text.RegularExpressions;
using System.Text;
using DBContext.DBConfia.STP;
using System.Globalization;
using System.IO;
using ConfiaWebApi.Code;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto;

namespace ConfiaWebApi.Controllers.Tesoreria 
{
    [ApiController]
    [Route("api/Tesoreria/[controller]")]
    public class RentaSucursalesController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)
        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;
        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public RentaSucursalesController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
            
        }



        [HttpGet]
        [Route("obtenerSucursalHist")]
        [Authorize]
        [Code.TProteccionProducto]
         public async Task<IActionResult> ObtenerSucursalHist () 
         {
             var data = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.ContratosHist>();
                
             try
             {
                 var result = data.Select(d => new
                 {
                     SucId2 = d.IdSucursal,
                     ContId = d.IdContrato,
                     NombSuc2 = d.NombreSuc,
                     Costo = d.CostoRenta,
                     descripcion = d.ContDesc,
                     FechaIni = d.FechaFinCont,
                     FechaFin = d.FechaFinCont,
                     DocRenta = d.DOcCont

                     
                 }).ToArray();
                await ConexionBD.Destroy();
                return Ok(result);
             }
             catch (Exception ex)
             {
                 await ConexionBD.Destroy();
                 return BadRequest(ex); 
             }
           
         }




        [HttpGet]
        [Route("obtenerSucursal")]
        [Authorize]
        [Code.TProteccionProducto]
         public async Task<IActionResult> ObtenerSucursal () 
         {
             var data = await ConexionBD.database.FetchAsync<DBContext.DBConfia.General.Sucursales>();
                
             try
             {
                 var result = data.Select(d => new
                 {
                     SucId2 = d.SucursalID,
                     NombSuc2 = d.Nombre,
                     
                 }).ToArray();
                await ConexionBD.Destroy();
                return Ok(result);
             }
             catch (Exception ex)
             {
                 await ConexionBD.Destroy();
                 return BadRequest(ex); 
             }
           
         }


    
        [HttpGet]
        [Route("obtenerDetalleRentaSucursal")]
        [Authorize]
        [Code.TProteccionProducto]
         public async Task<IActionResult> ObtenerDetalleRentaSucursal () 
         {
             var data = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.RentaLocalDetalle>();
             
             try
             {
                 var result = data.Select(c => new
                 {
                     SucursalId = c.SucursalId,
                     ContratoId = c.ContratoID,
                     NombreSucursal = c.Nombre_suc,
                     Monto = c.Monto,
                     FechaInicio = c.Fecha_inicio,
                     FechaFin = c.Fecha_Fin,
                     DiasRest = c.DiasRestantes,
                     DetSuc = c.DetalleSuc,
                     Estatus = c.EstatusSucursal
              
                 }).ToArray();
                await ConexionBD.Destroy();
                return Ok(result);
             }
             catch (Exception ex)
             {
                 await ConexionBD.Destroy();
                 return BadRequest(ex); 
             }
           
         }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Tesoreria.DetalleSucursal.ActualizarSucursalDetalle parData)
        {
            try
            {
                var ModificarSucursal = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.RentaLocalDetalle>(parData.ContratoID);
                    ModificarSucursal.Monto = parData.Monto;
                    ModificarSucursal.Fecha_Fin = parData.FechaFin;
                    ModificarSucursal.Fecha_inicio = parData.FechaInicio;
                    ModificarSucursal.DetalleSuc = parData.DetSuc;
                await    ConexionBD.database.UpdateAsync(ModificarSucursal);
                
                var sucursalRent = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.ContratosHist>("WHERE  IdContrato = @0", parData.ContratoID).FirstOrDefaultAsync();
                if(sucursalRent != null){
                var IdContrato = parData.ContratoID;
                var ModificarSucursalHist = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.ContratosHist>(IdContrato);
                    ModificarSucursalHist.CostoRenta = parData.Monto;
                    ModificarSucursalHist.FechaFinCont = parData.FechaFin;
                    ModificarSucursalHist.FechaIniCont = parData.FechaInicio;
                    ModificarSucursalHist.ContDesc = parData.DetSuc;
                await ConexionBD.database.UpdateAsync(ModificarSucursalHist);
                }
                await ConexionBD.Destroy();

                return Ok();

                
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
          public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Tesoreria.DetalleSucursal.AgregarSucursalDetalle parData)          {
              try
              {
                
                  var sucursalRent = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE  SucursalID = @0", parData.SucursalId).FirstOrDefaultAsync();
                  var DetRenta = new DBContext.DBConfia.Tesoreria.RentaLocalDetalle()
                  {
                    SucursalId       =           parData.SucursalId,    
                    Nombre_suc       =           sucursalRent.Nombre,
                    Monto            =           parData.Monto,
                    Fecha_Fin        =           parData.FechaFin,
                    Fecha_inicio     =           parData.FechaInicio,
                    DetalleSuc       =           parData.DetSuc

                  };
                  await ConexionBD.database.InsertAsync<DBContext.DBConfia.Tesoreria.RentaLocalDetalle>(DetRenta);
                  

                  var IdCont = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.RentaLocalDetalle>("WHERE  SucursalId = @0", parData.SucursalId).FirstOrDefaultAsync();
                  var DetRentaHist = new DBContext.DBConfia.Tesoreria.ContratosHist()
                  {
                    IdSucursal       =           parData.SucursalId,  
                    IdContrato       =           IdCont.ContratoID,  
                    NombreSuc        =           sucursalRent.Nombre,
                    CostoRenta       =           parData.Monto,
                    FechaFinCont     =           parData.FechaFin,
                    FechaIniCont     =           parData.FechaInicio,
                    ContDesc         =           parData.DetSuc

                  };        
                  await ConexionBD.database.InsertAsync<DBContext.DBConfia.Tesoreria.ContratosHist>(DetRentaHist);

                  
                  await ConexionBD.Destroy();
                  return Ok(DetRenta);
              }
              catch (Exception ex)
              {
                  await ConexionBD.Destroy();
                  return BadRequest(ex);
              }
          }

            [Consumes("multipart/form-data")]
            [HttpPost]
            [Route("subirDoc")]
            [Authorize]
            [Code.TProteccionProducto]
            public async Task<IActionResult> subirDoc([FromForm] PeticionesRest.Tesoreria.DetalleSucursal.subirDoc parData)
            {
                try
                {
                    var contrato = await ConexionBD.database.QueryAsync<RentaLocalDetalle>("WHERE ContratoID = @0", parData.ContratoID).FirstOrDefaultAsync();

                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                    int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                    
                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                    var basicToken = Convert.ToBase64String(plainTextBytes);
                    string path = Configuracion["BucketApi:AwsPath_ReestructuraDocumento"];
                    var ext = Path.GetExtension(parData.doc.FileName);
                    string file_name = $"{parData.identificador}_{parData.ContratoID}{ext}";
                    byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                    HttpContent bytesContent = new ByteArrayContent(file_byte);
                    HttpContent stringContent = new StringContent(path);
                    using (var client = new HttpClient())
                    using (var formData = new MultipartFormDataContent())
                    {
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                        formData.Add(stringContent, "path");
                        formData.Add(bytesContent, "file", $"{file_name}");
                        var response = await client.PostAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:uploadRequest"]}", formData);
                         if (response.IsSuccessStatusCode)
                            {
                           switch (parData.identificador)
                                                        {
                                                            case 1:
                                                                contrato.DocContrato = $"{path}/{file_name}";
                                                                break;
                                                        }

                            await ConexionBD.database.UpdateAsync(contrato);
                            await ConexionBD.Destroy();
                            var res = new
                            {
                                regresa = 1,
                                msj = $"OK",
                                data = new { path = $"CONTRATO SUBIDO CON ÉXITO" }
                            };
                            await ConexionBD.Destroy();
                            return Ok(res);
                         }
                         
                        else
                        {
                            await ConexionBD.Destroy();
                            return BadRequest(response.StatusCode);
                        }
                    }
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return BadRequest(ex.Message);
                }

           }




        [HttpPost]
        [Route("getDoc")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.Tesoreria.DetalleSucursal.GetDoc parData)
        {
            try
            {
                var src = "";
                var Documento = await ConexionBD.database.SingleByIdAsync<RentaLocalDetalle>(parData.ContratoID);

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.DocContrato}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                    }
                    else
                    {
                        return BadRequest(response.StatusCode);
                    }
                }
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.ContratoID}",
                    src = $"{src}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }



    }
}