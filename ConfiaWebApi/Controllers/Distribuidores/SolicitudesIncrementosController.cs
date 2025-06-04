using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Aclaraciones;
using DBContext.DBConfia.General;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Net;
using System.IO;
using ConfiaWebApi.Code;
using Microsoft.Extensions.Configuration;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia.Seguridad;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Creditos;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/Distribuidores/[controller]")]

    public class SolicitudesIncrementosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        private IConfiguration Configuracion;

        public SolicitudesIncrementosController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;

            DBContext = _DBContext;
        }


        [HttpGet]
        [Route("getIncrementosPersona/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getIncrementosPersona(int personaID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos_VW>("WHERE DistribuidorID = @0", personaID).ToArrayAsync();

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getAumentosNivelPersona/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAumentosNivelPersona(int personaID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesAumentoNivel_VW>("WHERE DistribuidorID = @0", personaID).ToArrayAsync();


                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getAumentosNivelPersona2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAumentosNivelPersona2()
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesAumentoNivel_VW>().ToArray();


                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getAumentosNivelPersonaCartera")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAumentosNivelPersonaCartera(PeticionesRest.Distribuidores.SolicitudIncrementos.FiltroAumentoNivelCartera parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesAumentoNivel_VW>(@"SELECT sp.* 
                    FROM Distribuidores.SolicitudesAumentoNivel_VW sp
                    JOIN Creditos.GruposDetalle gd ON sp.DistribuidorID = gd.DistribuidorID
                    JOIN Creditos.GruposUsuarios gu ON gd.GrupoID = gu.GrupoID
                    AND gu.UsuarioID = @UsuarioID
                    WHERE sp.FechaSolicitud BETWEEN @FechaInicio AND @FechaFin", parData).ToArrayAsync();


                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getIncrementosProductos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getIncrementosProductos(PeticionesRest.Distribuidores.SolicitudIncrementos.getIncrementosProductos parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE EsOperativo =1 AND EmpresaId=@0", parData.EmpresaId).ToArrayAsync();

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getDistribuidorNivel/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDistribuidorNivel(PeticionesRest.Distribuidores.SolicitudIncrementos.getDistribuidorNivel parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID=@0", parData.personaID).ToArrayAsync();

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        /*[HttpGet]
        [Route("obtenerProductos/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getProductos(int personaID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ProductosIncrementos_VW>("WHERE DistribuidorID = @0", personaID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }*/
        [HttpPost]
        [Route("CancelarSolicitudAumentoNivel")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CancelarSolicitudAumentoNivel(PeticionesRest.Distribuidores.SolicitudIncrementos.CancelarSolicitudAumento parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {


                var SolicitudAumento = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesAumentoNivel>("WHERE SolicitudAumentoNivID=@0", parData.SolicitudID).SingleOrDefaultAsync();
                SolicitudAumento.EstatusID = 2;
                SolicitudAumento.FechaRespuesta = DateTime.Now;
                SolicitudAumento.UsuarioRespondio = UsuarioActual.UsuarioID;
                await DBContext.database.UpdateAsync(SolicitudAumento);
                SolicitudAumento.MotivoCancelacion = parData.MotivoCancelacion;

                return Ok();

            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("UpdSolicitudAumentoNivel")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdSolicitudAumentoNivel(PeticionesRest.Distribuidores.SolicitudIncrementos.UpdSolicitudAumento parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {

                var DistribuidorNivelActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID=@0", parData.DistribuidorID).SingleOrDefaultAsync();
                DistribuidorNivelActual.DistribuidorNivelID = DistribuidorNivelActual.DistribuidorNivelID + 1;
                await DBContext.database.UpdateAsync(DistribuidorNivelActual);



                var SolicitudAumento = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesAumentoNivel>("WHERE DistribuidorID=@0", parData.DistribuidorID).SingleOrDefaultAsync();
                SolicitudAumento.EstatusID = 1;
                SolicitudAumento.FechaRespuesta = DateTime.Now;
                SolicitudAumento.UsuarioRespondio = UsuarioActual.UsuarioID;
                await DBContext.database.UpdateAsync(SolicitudAumento);






                return Ok();

            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("obtenerSolicitudIncremento")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> GetIncrementos()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var incremento = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos_VW>();

                await DBContext.Destroy();
                return Ok(incremento);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("obtenerSolicitudesIncrementoCartera")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetSolicitudesIncrementosCartera(PeticionesRest.Distribuidores.SolicitudIncrementos.FiltroIncrementosCartera parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;
                var incrementos = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos_VW>(@"SELECT sp.* 
                    FROM Distribuidores.SolicitudesIncrementos_VW sp
                    JOIN Creditos.GruposDetalle gd ON sp.DistribuidorID = gd.DistribuidorID
                    JOIN Creditos.GruposUsuarios gu ON gd.GrupoID = gu.GrupoID
                    AND gu.UsuarioID = @0
                    WHERE sp.FechaSolicitud BETWEEN @1 AND @2", parData.UsuarioID, parData.FechaInicio, parData.FechaFin);
                await DBContext.Destroy();
                return Ok(incrementos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("altaSolicitudAumentoNivel")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> altaSolicitudAumentoNivel(PeticionesRest.Distribuidores.SolicitudIncrementos.altaSolicitudIncremento parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var NivelDistribuidor = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();

                var MaxLevel = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesAumentoNivel>("SELECT top 1 * FROM Distribuidores.Niveles Order By DistribuidorNivelID DESC").SingleOrDefaultAsync();

                var SolicitudAumento = new DBContext.DBConfia.Distribuidores.SolicitudesAumentoNivel();
                /*  var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE DistribuidorID=@DistribuidorID AND ProductoID=@ProductoID", parData).FirstOrDefaultAsync();
                 var Sucursal = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID=@DistribuidorID AND ProductoID=@ProductoID", parData).FirstOrDefaultAsync(); */

                int error = 0;
                string errorMsj = "";

                if (MaxLevel.DistribuidorNivelID <= NivelDistribuidor.DistribuidorNivelID)
                {

                    error += 1;
                    errorMsj += $"LA SOCIA TIENE EL NIVEL MAXIMO, IMPOSIBLE SOLICITAR AUMENTO DE NIVEL\n";
                    return BadRequest("");

                }

                else
                {
                    if (NivelDistribuidor.DistribuidoresEstatusID == "N")
                    {
                        SolicitudAumento.DistribuidorNivelID = (int)NivelDistribuidor.DistribuidorNivelID;
                        SolicitudAumento.DistribuidorID = parData.DistribuidorID;
                        SolicitudAumento.FechaSolicitud = DateTime.Now;
                        SolicitudAumento.EstatusID = 3;
                        SolicitudAumento.UsuarioSolicito = UsuarioActual.UsuarioID;
                        SolicitudAumento.Observaciones = parData.Observaciones;

                        await DBContext.database.InsertAsync(SolicitudAumento);

                    }
                    else
                    {
                        error += 1;
                        errorMsj += $"LA SOCIA CUENTA CON ATRASO O ESTA DESACTIVADA TEMPORALMENTE";
                        return BadRequest("");
                    }

                }


                var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesAumentoNivel_VW>("WHERE SolicitudAumentoNivID = @0", SolicitudAumento.SolicitudAumentoNivID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(objeto);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("LA SOCIA TIENE EL NIVEL MAXIMO, IMPOSIBLE SOLICITAR AUMENTO DE NIVEL" + ex.Message);
            }
        }

        [HttpPost]
        [Route("altaSolicitudIncremento")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Alta(PeticionesRest.Distribuidores.SolicitudIncrementos.altaSolicitudIncremento parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var incremento = new DBContext.DBConfia.Distribuidores.SolicitudesIncrementos();

                var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE DistribuidorID=@DistribuidorID", parData).FirstOrDefaultAsync();
                var Sucursal = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID=@DistribuidorID", parData).FirstOrDefaultAsync();

                incremento.FechaSolicitud = DateTime.Now;
                incremento.ProductoID = parData.ProductoID;
                incremento.SucursalID = Sucursal.SucursalID;
                incremento.DistribuidorID = parData.DistribuidorID;
                incremento.ContratoID = contrato.ContratoID;
                incremento.IncrementoSolicitado = parData.IncrementoSolicitado;
                incremento.EstatusID = 2;
                incremento.UsuarioSolicitoID = UsuarioActual.UsuarioID;
                incremento.Observaciones = parData.Observaciones;

                await DBContext.database.InsertAsync(incremento);
                var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos_VW>("WHERE SolicitudID = @0", incremento.SolicitudID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(objeto);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("obtenerEstatusIncremento")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerEstatusIncremento()
        {
            try
            {
                var estatusIncremento = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementosEstatus>();
                await DBContext.Destroy();
                return Ok(estatusIncremento);
            }
            catch (Exception ex)
            {

                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerEstatusSolicitudNiveles")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerEstatusSolicitudNiveles()
        {
            try
            {
                var estatusIncremento = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.EstatusAumentoNivel>();
                await DBContext.Destroy();
                return Ok(estatusIncremento);
            }
            catch (Exception ex)
            {

                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerSucursalesSelect")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            try
            {
                var sucursales = await DBContext.database.FetchAsync<Sucursales_VW>();
                await DBContext.Destroy();
                return Ok(sucursales);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("updateIncremento")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudIncrementos.updateIncremento parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos>("WHERE SolicitudID=@0", parData.SolicitudID).SingleOrDefaultAsync();

                registro.IncrementoSolicitado = parData.IncrementoSolicitado;
                registro.FechaModifica = DateTime.Now;
                registro.UsuarioModificaID = UsuarioActual.UsuarioID;


                await DBContext.database.UpdateAsync(registro);
                var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos_VW>("WHERE SolicitudID = @0", parData.SolicitudID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(Solicitud);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Cancelacion")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> Cancelacion(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudIncrementos.Cancelacion parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos>("WHERE SolicitudID=@0", parData.SolicitudID).SingleOrDefaultAsync();

                registro.MotivoCancelacion = parData.MotivoCancelacion;
                registro.EstatusID = 3;
                registro.FechaCancelacion = DateTime.Now;
                registro.UsuarioCanceloID = UsuarioActual.UsuarioID;


                await DBContext.database.UpdateAsync(registro);
                var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos_VW>("WHERE SolicitudID = @0", parData.SolicitudID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(Solicitud);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("AceptarIncremento")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> AceptarIncremento(PeticionesRest.Distribuidores.SolicitudIncrementos.AceptarIncremento parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos>("WHERE SolicitudID = @0", parData.SolicitudID).SingleOrDefaultAsync();

            //parData.DistribuidorID = Solicitud.DistribuidorID;
            //parData.ContratoID = Solicitud.DistribuidorID;
            //parData.ProductoID = Solicitud.ProductoID;
            //parData.UsuarioID = UsuarioActual.UsuarioID;
            //parData.IncrementoSolicitado = Solicitud.IncrementoSolicitado;
            //parData.regresa = 0;
            //parData.msj = '';

            var obj = new
            {
                DistribuidorID = Solicitud.DistribuidorID,
                ContratoID = Solicitud.ContratoID,
                ProductoID = Solicitud.ProductoID,
                UsuarioID = UsuarioActual.UsuarioID,
                IncrementoQuincena = Solicitud.IncrementoSolicitado,
                regresa = parData.regresa,
                msj = parData.msj

            };
            var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.ContratoRes>("EXEC Distribuidores.pa_IncrementoLineaCredito_Ins @DistribuidorID, @ContratoID, @ProductoID, @UsuarioID, @IncrementoQuincena, @regresa, @msj", obj).FirstOrDefaultAsync();

            var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos>("WHERE SolicitudID=@0", parData.SolicitudID).SingleOrDefaultAsync();


            var empresa = await DBContext.database.QueryAsync<Productos>("WHERE ProductoID = @0", Solicitud.ProductoID).SingleOrDefaultAsync();
            var productos = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId = @0 AND PrestamoPersonal = 1", empresa.EmpresaId).SingleOrDefaultAsync();
            var LineaActualizada = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID = @0 AND DistribuidorID = @1 ", Solicitud.ProductoID, Solicitud.DistribuidorID).SingleOrDefaultAsync();
            var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID = @0 AND DistribuidorID = @1", productos.ProductoID, Solicitud.DistribuidorID).SingleOrDefaultAsync();

            if (res.regresa == 1)
            {

                registro.EstatusID = 1;
                registro.IncrementoAutorizado = registro.IncrementoSolicitado;
                registro.FechaAutorizacion = DateTime.Now;
                registro.UsuarioAutorizoID = UsuarioActual.UsuarioID;

                if (contrato != null)
                {

                    contrato.LineaCredito = LineaActualizada.LineaCredito * 10 / 100;
                    await DBContext.database.UpdateAsync(contrato);


                }

                await DBContext.database.UpdateAsync(registro);
                //var Solicitud2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos_VW>("WHERE SolicitudID = @0", parData.SolicitudID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            else
            {
                await DBContext.Destroy();

                return Ok(res);
            }



        }

        [HttpPost]
        [Route("AceptarMuchos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AceptarMuchos(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudIncrementos.AceptarMuchos parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                string msj = "";
                foreach (var item in parData.Incremento)
                {
                    var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos>("WHERE SolicitudID = @0", item.SolicitudID).SingleOrDefaultAsync();


                    var obj = new
                    {
                        DistribuidorID = Solicitud.DistribuidorID,
                        ContratoID = Solicitud.ContratoID,
                        ProductoID = Solicitud.ProductoID,
                        UsuarioID = UsuarioActual.UsuarioID,
                        IncrementoQuincena = Solicitud.IncrementoSolicitado,
                        regresa = parData.regresa,
                        msj = parData.msj

                    };
                    var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.ContratoRes>("EXEC Distribuidores.pa_IncrementoLineaCredito_Ins @DistribuidorID, @ContratoID, @ProductoID, @UsuarioID, @IncrementoQuincena, @regresa, @msj", obj).FirstOrDefaultAsync();

                    var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos>("WHERE SolicitudID=@0", item.SolicitudID).SingleOrDefaultAsync();

                    var empresa = await DBContext.database.QueryAsync<Productos>("WHERE ProductoID = @0", Solicitud.ProductoID).SingleOrDefaultAsync();
                    var productos = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId = @0 AND PrestamoPersonal = 1", empresa.EmpresaId).SingleOrDefaultAsync();
                    var LineaActualizada = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID = @0 AND DistribuidorID = @1 ", Solicitud.ProductoID, Solicitud.DistribuidorID).SingleOrDefaultAsync();
                    var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID = @0 AND DistribuidorID = @1", productos.ProductoID, Solicitud.DistribuidorID).SingleOrDefaultAsync();

                    if (res.regresa == 1)
                    {

                        registro.EstatusID = 1;
                        registro.IncrementoAutorizado = registro.IncrementoSolicitado;
                        registro.FechaAutorizacion = DateTime.Now;
                        registro.UsuarioAutorizoID = UsuarioActual.UsuarioID;

                        if (contrato != null)
                        {

                            contrato.LineaCredito = LineaActualizada.LineaCredito * 10 / 100;
                            await DBContext.database.UpdateAsync(contrato);


                        }
                    }
                    await DBContext.database.UpdateAsync(registro);

                    if (res.regresa == 1)
                    {
                        msj = "Aceptación de Solicitudes Éxitosa";
                    }
                    else
                    {
                        msj = "Aceptación de Solicitudes Éxitosa, Verifique Estatus";
                    }
                }

                await DBContext.Destroy();
                return Ok(msj);


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }

        }

    }
}