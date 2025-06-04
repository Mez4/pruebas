using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.General;
using ConfiaWebApi.ModlesSP.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Distribuidores;
using Newtonsoft.Json;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class MesaCreditoController : ControllerBase
    {
        private DBConfiaContext DBContext;
        // private DBConfiaContext ConexionBD;


        public MesaCreditoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Prospeccion.MesaCredito>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.MesaCredito>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito.add parData)
        {
            try
            {
                var mesaDeCredito = new DBContext.DBConfia.Prospeccion.MesaCredito()
                {
                    Nombre = parData.Nombre,
                    Clave = parData.Clave,
                    Activo = parData.Activo,
                    MostrarBuroPromotor = true
                };
                await DBContext.database.InsertAsync<DBContext.DBConfia.Prospeccion.MesaCredito>(mesaDeCredito);
                await DBContext.Destroy();
                return Ok(mesaDeCredito);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito.update parData)
        {
            try
            {
                var mesaCredito = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Prospeccion.MesaCredito>(parData.MesaCreditoID);
                mesaCredito.Nombre = parData.Nombre;
                mesaCredito.Clave = parData.Clave;
                mesaCredito.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(mesaCredito);
                await DBContext.Destroy();
                return Ok(mesaCredito);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getMuestraBC")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMuestraBC(ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito.get parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            var mesaAux = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ProductoMesaCredito>("WHERE ProductoID=@0", ProductoID).FirstOrDefaultAsync();
            var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Prospeccion.MesaCredito>(mesaAux.MesaCreditoID);
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("UpdateMuestraBC")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateMuestraBC(ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito.getProceso parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var obj = new { UsuarioID = UsuarioActual.UsuarioID, ProductoID };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_UpdateMustraBC  @UsuarioID, @ProductoID", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getProceso")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito.getProceso parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Prospeccion.StatusProceso>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.QueryAsync<StatusProceso>("WHERE StatusProcesoID >= 8").OrderBy(x => x.StatusProcesoID).ToArrayAsync();
            await DBContext.Destroy();
            return Ok(res1);
            //return Ok(await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.StatusProceso>());
        }

        /*PROSPECCION MESA DE CRÉDITO*/
        [HttpPost]
        [Route("getMesaCreditoBuro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMesaCreditoBuro(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            DBContext.database.CommandTimeout = 9999;
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }


            // var query = NPoco.Sql.Builder.Select("ProspectoID", "SucursalID", "ZonaID", "FechaAsignacionBuro", "NombreProspecto", "Descripcion", "NombreAnalistaBuro", "Nombre", "ZonaNombre", "AnalistaBuroID", "FechaEnMesa", "MsjNoLeidosMesa", "EstatusConsultaBuroDesc", "EstatusConsultaBuroID", "RevisionBuro", "BuroInternoEstatusID", "ColorRevisionBuro", "ColorRevisionBuroDesc", "StatusProcesoID", "Activo", "ProductoID", "FechaUltimaActualizacion").From("Prospeccion.Prospectos_VW").Where("Consolidacion <>1");
            // query = query.Where("EnMesa = @0", 1);
            // query = query.Where("ProductoID = @0", ProductoID);
            // query = query.OrderBy("FechaUltimaActualizacion DESC");

            // var res1 = await DBContext.database.QueryAsync<Prospectos_VW>(query).ToArrayAsync();
            var obj = new
            {
                ProductoID = ProductoID
            };
            string stored = "EXEC Prospeccion.pa_GetProspectosBuro @ProductoID";
            var res1 = await DBContext.database.QueryAsync<dynamic>(stored, obj).ToArrayAsync();

            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getArchivados")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getArchivados(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            DBContext.database.CommandTimeout = 9999;
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }

            var obj = new
            {
                ProductoID = ProductoID
            };
            string stored = "EXEC Prospeccion.pa_GetProspectosArchivados @ProductoID";
            var res1 = await DBContext.database.QueryAsync<dynamic>(stored, obj).ToArrayAsync();

            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getTipoArchivados")]
        [Authorize]
        public async Task<IActionResult> getTipoArchivados()
        {
            try
            {
                var Credito = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.CatalogoTipoArchivados>();
                await DBContext.Destroy();
                return Ok(Credito);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMesaCreditoIndex")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMesaCreditoIndex(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.get parData)
        {
            try
            {
                DBContext.database.CommandTimeout = 9999;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                if (parData.id != 0)
                {
                    var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }

                //var query = "WHERE EnMesa = 1 AND RevisionBuro = 1";
                //var Encargado = await DBContext.database.QueryAsync<DirectorMesaCredito>("WHERE DirectorMesaCreditoID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                //if (Encargado == null)
                //{
                //    var Analista = await DBContext.database.QueryAsync<Analista>("WHERE AnalistaID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                //    query = Analista != null ? $"{query} AND PersonaAnalistaID = @0" : query;
                //}
                //var res1 = await DBContext.database.QueryAsync<Prospectos_VW>(query, UsuarioActual.PersonaID).OrderByDescending(x => x.FechaEnMesa).ToArrayAsync();

                // var query = NPoco.Sql.Builder.Select("ProspectoID", "SucursalID", "ZonaID", "FechaAsignacion", "NombreAnalista", "Nombre", "ZonaNombre", "NombreProspecto", "DistribuidorTiposID", "AsignadoValidado", "FechaEnMesa", "PersonaAnalistaID", "Descripcion", "ColorAsignadoValidado", "StatusProcesoID", "MsjNoLeidosMesa", "DistribuidorTipos", "BuroInternoEstatusColor", "BuroInternoEstatus", "BuroInternoEstatusID", "RevisionDocumentos", "ColorRevisionDocumentos", "Dictamen", "DistribuidorNivel", "DistribuidoresEstatus", "MontoDictaminado", "ColorDictamen", "Consolidacion", "DistribuidorNivelID", "DistribuidoresEstatusID", "ColorConsolidacion", "Activo", "ProductoID", "ColorRevisionDocumentosDesc", "ColorDictamenDesc", "ColorConsolidacionDesc", "DistribuidorNivelInternoID", "NivelOrigen_BuroID", "FechaUltimaActualizacion").From("Prospeccion.Prospectos_VW").Where("BuroInternoEstatusID <> 0 AND Consolidacion <> 1 AND PantallaProcesoID = 3");
                // query = query.Where("EnMesa = @0", 1);
                // query = query.Where("RevisionBuro = @0", 1);
                // query = query.Where("ProductoID = @0", ProductoID);
                // var Encargado = await DBContext.database.QueryAsync<DirectorMesaCredito>("WHERE DirectorMesaCreditoID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();


                /*     if (Encargado == null)
                    {
                        var Analista = await DBContext.database.QueryAsync<Analista>("WHERE AnalistaID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                        query = query.Where("PersonaAnalistaID = @0", Analista.AnalistaID);
                    } */
                // query = query.OrderBy("FechaUltimaActualizacion	DESC");
                // var res1 = await DBContext.database.QueryAsync<Prospectos_VW>(query).ToArrayAsync();
                var obj = new
                {
                    ProductoID = ProductoID
                };
                string stored = "EXEC Prospeccion.pa_GetProspectosExpedienteActivacion @ProductoID";
                var res1 = await DBContext.database.QueryAsync<dynamic>(stored, obj).ToArrayAsync();


                await DBContext.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getMesaCreditoLlamadas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMesaCreditoLlamadas(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }

            //var query = "WHERE EnMesa = 1 AND RevisionBuro = 1 AND RevisionDocumentos = 1";
            //var Encargado = await DBContext.database.QueryAsync<DirectorMesaCredito>("WHERE DirectorMesaCreditoID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
            //if (Encargado == null)
            //{
            //    var Analista = await DBContext.database.QueryAsync<Analista>("WHERE AnalistaID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
            //    query = Analista != null ? $"{query} AND AnalistaLlamadasID = @0" : query;
            //}
            //var res1 = await DBContext.database.QueryAsync<Prospectos_VW>(query, UsuarioActual.PersonaID).OrderByDescending(x => x.FechaEnMesa).ToArrayAsync();

            var query = NPoco.Sql.Builder.Select("ProspectoID", "SucursalID", "ZonaID", "FechaAsignacion", "NombreAnalistaLlamadas", "Nombre", "ZonaNombre", "NombreProspecto", "AnalistaLlamadasID", "Descripcion", "FechaEnMesa", "StatusProcesoID", "MsjNoLeidosMesa", "VerificaTitular", "ColorVerificaTitular", "RevisionRefTitular", "ObservacionRevisionRefTitular", "ColorRevisionRefTitular", "VerificaAval", "ObservacionVerificaAval", "ColorVerificaAval", "RevisionRefAval", "ObservacionRevisionRefAval", "ColorRevisionRefAval", "Activo", "ProductoID", "ColorVerificaTitularDesc", "ColorRevisionRefTitularDesc", "ColorVerificaAvalDesc", "ColorRevisionRefAvalDesc", "FechaUltimaActualizacion").From("Prospeccion.Prospectos_VW").Where("Consolidacion <>1");
            query = query.Where("EnMesa = @0", 1);
            query = query.Where("RevisionBuro = @0", 1);
            query = query.Where("RevisionDocumentos = @0", 1);
            query = query.Where("ProductoID = @0", ProductoID);

            var Encargado = await DBContext.database.QueryAsync<DirectorMesaCredito>("WHERE DirectorMesaCreditoID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
            /* if (Encargado == null)
            {
                var Analista = await DBContext.database.QueryAsync<Analista>("WHERE AnalistaID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                query = query.Where("AnalistaLlamadasID = @0", Analista.AnalistaID);
            } */
            query = query.OrderBy("FechaUltimaActualizacion DESC");
            var res1 = await DBContext.database.QueryAsync<Prospectos_VW>(query).ToArrayAsync();
            //Obtener IDs de la consulta para usarlos en logTimposPeriodo y evaluar cuáles están verificados
            var idsDeProspectos = res1.Select(p => p.ProspectoID).ToList();
            var idsComoCadena = string.Join(",", idsDeProspectos);
            var LogDate = await DBContext.database.QueryAsync<LogTiemposPeriodo>("EXEC Prospeccion.pa_LogTiemposPeriodo @0, @1, @2, @3, @4", null, null, 2, 3, idsComoCadena).FirstOrDefaultAsync();
            var log = LogDate;
            await DBContext.Destroy();
            return Ok(res1);

        }

        [HttpPost]
        [Route("getActivo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetActivo(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.activo parData)
        {
            try
            {
                var query = NPoco.Sql.Builder.Select("DISTINCT Activo", "ActivoDesc").From("Prospeccion.Prospectos_VW");
                var res = await DBContext.database.QueryAsync<Prospectos_VW>(query).ToArrayAsync();

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getAnalistas")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetAnalistas(ConfiaWebApi.PeticionesRest.Prospeccion.Analista.get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var query = "";
                var Encargado = await DBContext.database.QueryAsync<DirectorMesaCredito>("WHERE DirectorMesaCreditoID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                if (Encargado == null)
                {
                    var Analista = await DBContext.database.QueryAsync<Analista>("WHERE AnalistaID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                    query = Analista != null ? $"WHERE AnalistaID = @0" : query;
                }
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Analistas_VW>(query, UsuarioActual.PersonaID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }

        }
        protected async Task<object> ObjectProspecto(Prospectos_VW prospectos_VW)

        {

            var res = new
            {
                prospectos_VW.ProspectoID,
                prospectos_VW.Nombre,
                prospectos_VW.NombreProspecto,
                prospectos_VW.PersonaAnalistaID,
                prospectos_VW.NombreAnalista,
                prospectos_VW.Descripcion,
                prospectos_VW.AsignadoValidado,
                prospectos_VW.ColorAsignadoValidado,
                prospectos_VW.StatusProcesoID

            };
            return res;
        }

        [HttpPost]
        [Route("AsignaAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AsignaAnalista(ConfiaWebApi.PeticionesRest.Prospeccion.AsignaAnalista.add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //son los parametros del SP
                var obj = new { usuarioAsignaID = UsuarioActual.UsuarioID, prospectoID = parData.ProspectoID, personaAnalistaID = parData.PersonaAnalistaID };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_Asigna_Analista  @usuarioAsignaID, @prospectoID, @personaAnalistaID", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("AsignaAnalistaM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AsignaAnalistaM(ConfiaWebApi.PeticionesRest.Prospeccion.AsignaAnalista.addM parData)
        {
            try
            {
                int error = 0;
                string errorMsj = "";
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                DBContext.database.BeginTransaction();
                foreach (var item in parData.Asignacion)
                {
                    var obj = new { usuarioAsignaID = UsuarioActual.UsuarioID, prospectoID = item.ProspectoID, AnalistaBuroID = parData.PersonaAnalistaID };
                    var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_Asigna_Analista  @usuarioAsignaID, @prospectoID, @AnalistaBuroID", obj).FirstOrDefaultAsync();
                    if (res.regresa != 1)
                    {
                        error += 1;
                        errorMsj += $"Ocurrio un error al asignar al prospecto {item.ProspectoID} - {res.msj}\n";
                    }
                }
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                if (error == 0)
                    return Ok(new { regresa = error == 0 ? 1 : 0, msj = "Asignación realizada con éxito" });
                else
                    return BadRequest(errorMsj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("AsignaAnalistaBuro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AsignaAnalistaBuro(ConfiaWebApi.PeticionesRest.Prospeccion.AsignaAnalista.add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //son los parametros del SP
                var obj = new { usuarioAsignaID = UsuarioActual.UsuarioID, prospectoID = parData.ProspectoID, AnalistaBuroID = parData.PersonaAnalistaID };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_Asigna_AnalistaBuro  @usuarioAsignaID, @prospectoID, @AnalistaBuroID", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("AsignaAnalistaBuroM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AsignaAnalistaBuroM(ConfiaWebApi.PeticionesRest.Prospeccion.AsignaAnalista.addM parData)
        {
            try
            {
                int error = 0;
                string errorMsj = "";
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                DBContext.database.BeginTransaction();
                foreach (var item in parData.Asignacion)
                {
                    var obj = new { usuarioAsignaID = UsuarioActual.UsuarioID, prospectoID = item.ProspectoID, AnalistaBuroID = parData.PersonaAnalistaID };
                    var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_Asigna_AnalistaBuro  @usuarioAsignaID, @prospectoID, @AnalistaBuroID", obj).FirstOrDefaultAsync();
                    if (res.regresa != 1)
                    {
                        error += 1;
                        errorMsj += $"Ocurrio un error al asignar al prospecto {item.ProspectoID} - {res.msj}\n";
                    }
                }
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                if (error == 0)
                    return Ok(new { regresa = error == 0 ? 1 : 0, msj = "Asignación realizada con éxito" });
                else
                    return BadRequest(errorMsj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("AsignaAnalistaLlamadas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AsignaAnalistaLlamadas(ConfiaWebApi.PeticionesRest.Prospeccion.AsignaAnalista.add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //son los parametros del SP
                var obj = new { usuarioAsignaID = UsuarioActual.UsuarioID, prospectoID = parData.ProspectoID, AnalistaBuroID = parData.PersonaAnalistaID };

                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_Asigna_AnalistaLlamadas  @usuarioAsignaID, @prospectoID, @AnalistaBuroID", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("AsignaAnalistaLlamadasM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AsignaAnalistaLlamadasM(ConfiaWebApi.PeticionesRest.Prospeccion.AsignaAnalista.addM parData)
        {
            try
            {
                int error = 0;
                string errorMsj = "";
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                DBContext.database.BeginTransaction();
                foreach (var item in parData.Asignacion)
                {
                    var obj = new { usuarioAsignaID = UsuarioActual.UsuarioID, prospectoID = item.ProspectoID, AnalistaBuroID = parData.PersonaAnalistaID };
                    var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_Asigna_AnalistaLlamadas  @usuarioAsignaID, @prospectoID, @AnalistaBuroID", obj).FirstOrDefaultAsync();
                    if (res.regresa != 1)
                    {
                        error += 1;
                        errorMsj += $"Ocurrio un error al asignar al prospecto {item.ProspectoID} - {res.msj}\n";
                    }
                }
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                if (error == 0)
                    return Ok(new { regresa = error == 0 ? 1 : 0, msj = "Asignación realizada con éxito" });
                else
                    return BadRequest(errorMsj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        protected async Task<object> ObjectTiempos(TiemposAsignaAnalista_VW tiemposAsignaAnalista_VW)

        {

            var res = new
            {
                tiemposAsignaAnalista_VW.LogTiempoID,
                tiemposAsignaAnalista_VW.AsignaAnalistaID,
                tiemposAsignaAnalista_VW.Tiempo,
                tiemposAsignaAnalista_VW.ProspectoID,
                tiemposAsignaAnalista_VW.StatusProcesoID,
                tiemposAsignaAnalista_VW.Descripcion
            };
            return res;
        }

        [HttpPost]
        [Route("getLogTiempos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetLogTiempos(ConfiaWebApi.PeticionesRest.Prospeccion.Tiemposasignaanalista.get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            // var obj = new { ProspectoID = parData.id, UsuarioActual.UsuarioID };
            // var validaUser = await DBContext.database.QueryAsync<ProspectosAsignaciones_VW>("WHERE ProspectoID = @ProspectoID AND (AnalistaBuroUsuarioID = @UsuarioID OR AnalistaLlamadaUsuarioID = @UsuarioID OR AnalistaMesaUsuarioID = @UsuarioID) ", obj).FirstOrDefaultAsync();
            // if (validaUser == null)
            // {
            //     await DBContext.Destroy();
            //     return BadRequest($"El usuario actual no esta asignado a este Prospecto {obj.ProspectoID}");
            // }
            List<object> respList = new List<object>();
            var ListCabeceras = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.TiemposAsignaAnalista_VW>("WHERE (ProspectoID = @id)", parData);
            foreach (var item in ListCabeceras)
            {
                var res = new
                {
                    item.LogTiempoID,
                    item.AsignaAnalistaID,
                    item.NombreCompleto,
                    item.Descripcion,
                    item.ProspectoID,
                    item.StatusProcesoID,
                    tiempo = item.Tiempo.ToString("dd/MM/yyyy HH:mm:ss"),
                    item.Validado,

                };
                respList.Add(res);
                //respList.Add(await ObjectValeraCabecera(item));
            }
            await DBContext.Destroy();
            return Ok(respList);

        }

        [HttpPost]
        [Route("getLogMesajes")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetLogMesajes(ConfiaWebApi.PeticionesRest.Prospeccion.LogMensajes.get parData)
        {
            List<object> respList = new List<object>();
            var ListMensajes = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.LogMensajesProspectos_VW>("WHERE (ProspectoID = @id)", parData);
            foreach (var item in ListMensajes)
            {
                var res = new
                {
                    item.LogMensajeID,
                    item.Mensaje,
                    fecha = item.Fecha_hora.ToString("dd/MM/yyyy hh:mm"),
                    item.Descripcion,
                    item.NombreCompleto,

                };
                respList.Add(res);
                //respList.Add(await ObjectValeraCabecera(item));
            }
            await DBContext.Destroy();
            return Ok(respList);

        }


        [HttpPost]
        /*titular es PROSPECTO  ProspectosVw*/
        [Route("getInfoTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getInfoTitular(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.get parData)
        {
            try
            {
                var prospecto = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ProspectosDatosGenereles_VW>("WHERE PersonaID=@0", parData.id).SingleOrDefaultAsync();
                var socioeconomico = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ProspectosDatosSocioeconomicos_VW>("WHERE PersonaID=@0", parData.id).SingleOrDefaultAsync();
                var vehiculos = await DBContext.database.QueryAsync<RelacionAutoMoto>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.id).ToArrayAsync();
                var experiencia = await DBContext.database.QueryAsync<ProspectosExperienciaVentas_VW>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.id).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(new { prospecto, socioeconomico, vehiculos, experiencia });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }

        }


        [HttpPost]
        /*titular es PROSPECTO  ProspectosVw*/
        [Route("getByTitularRef")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getByTitularRef(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.getByProspecto parData)
        {
            try
            {

                var referencias = await DBContext.database.QueryAsync<Referencias>("WHERE PersonaID=@0", parData.ProspectoID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(new { referencias });

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("updateProcesoTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateProcesoTitular(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.updateProcesoTitular parData)
        {
            try
            {
                var prospectoValida = await DBContext.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);
                if (!prospectoValida.Activo)
                {
                    await DBContext.Destroy();
                    return BadRequest("Este prospecto esta cancelado");//throw new Exception("Este prospecto esta cancelado");
                }
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Identificador = parData.Identificador, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_TuberiaProceso @Usu, @ProspectoID, @Identificador, @regresa, @msj", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                // return Ok(res.msj);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("updateVerificaTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateVerificaTitular(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.updateValidaTitular parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, regresa = parData.regresa, msj = parData.msj };
                //HACER SP DE VALIDAR AUTORIZA TITULAR Y SP MODELO
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_VerificarTitular @Usu, @ProspectoID, @regresa, @msj", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("updateRechazaTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateRechazaTitular(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.updateRechazaTitular parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Nota = parData.Nota, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_RechazarTitular @Usu, @ProspectoID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


        /******************************ref titular**********************************************/


        //    [HttpPost]
        // /*titular es PROSPECTO  ProspectosVw*/
        // [Route("getByProspectoRefTitular")]
        // [Authorize]
        // [Code.TProteccionProducto]
        // public async Task<IActionResult> getByProspectoRefTitular(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.getByProspectoRefTitular parData)
        // {
        //     try
        //     {

        //         var referencias = await DBContext.database.QueryAsync<Referencias>("WHERE PersonaID=@0", parData.ProspectoID).ToArrayAsync();
        //         return Ok(new { referencias });


        //     }
        //     catch (Exception ex)
        //     {

        //         return BadRequest(ex);
        //     }

        // }
        [HttpPost]
        [Route("updateProcesoRefTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateProcesoRefTitular(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.updateProcesoRefTitular parData)
        {
            try
            {
                var prospectoValida = await DBContext.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);
                if (!prospectoValida.Activo)
                {
                    await DBContext.Destroy();
                    return BadRequest("Este prospecto esta cancelado");//throw new Exception("Este prospecto esta cancelado");
                }
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Identificador = parData.Identificador, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_TuberiaProceso @Usu, @ProspectoID, @Identificador, @regresa, @msj", obj).FirstOrDefaultAsync();
                var EstatusProceso = await DBContext.database.FirstAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>("WHERE ProspectoID=@0", parData.ProspectoID);
                var EstatusProceso2 = await DBContext.database.FirstAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProspectoID=@0", parData.ProspectoID);
                await DBContext.Destroy();
                if (res.regresa == 1)
                    try
                    {

                        if (EstatusProceso.VerificaTitular == 1 & EstatusProceso.RevisionRefTitular == 1 & EstatusProceso.RevisionRefAval == 1 & EstatusProceso.VerificaAval == 1)
                        {
                            EstatusProceso2.StatusProcesoID = 22;
                            await DBContext.database.UpdateAsync(EstatusProceso2);
                            await DBContext.Destroy();
                        }
                        return Ok(res);

                    }
                    catch (Exception ex)
                    {
                        return Ok(res);
                    }
                // return Ok(res.msj);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("updateValidaRefTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateValidaRefTitular(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.updateValidaRefTitular parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ReferenciaID = parData.ReferenciaID, regresa = parData.regresa, msj = parData.msj };
                //HACER SP DE VALIDAR AUTORIZA TITULAR Y SP MODELO
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.ValidaReferenciasTitular>("EXEC Prospeccion.pa_ValidaReferenciaTitular @Usu, @ReferenciaID, @regresa, @msj", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("updateRechazRefTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateRechazRefTitular(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.updateRechazaRefTitular parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ReferenciaID = parData.ReferenciaID, Nota = parData.Nota, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.RechazaReferenciaTitular>("EXEC Prospeccion.pa_RechazaReferenciaTitular @Usu, @ReferenciaID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        //REFERENCIASSS

        [HttpPost]
        [Route("updateVerificaReferenciasTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateVerificaAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.updateVerificaReferenciasTitular parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, regresa = parData.regresa, msj = parData.msj };
                //HACER SP DE VALIDAR AUTORIZA TITULAR Y SP MODELO
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_VerificarReferenciasTitular @Usu, @ProspectoID, @regresa, @msj", obj).FirstOrDefaultAsync();
                var EstatusProceso = await DBContext.database.FirstAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>("WHERE ProspectoID=@0", parData.ProspectoID);
                var EstatusProceso2 = await DBContext.database.FirstAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProspectoID=@0", parData.ProspectoID);
                await DBContext.Destroy();
                if (res.regresa == 1)
                    try
                    {

                        if (EstatusProceso.VerificaTitular == 1 & EstatusProceso.RevisionRefTitular == 1 & EstatusProceso.RevisionRefAval == 1 & EstatusProceso.VerificaAval == 1)
                        {
                            EstatusProceso2.StatusProcesoID = 22;
                            await DBContext.database.UpdateAsync(EstatusProceso2);
                            await DBContext.Destroy();
                        }
                        return Ok(res);

                    }
                    catch (Exception ex)
                    {
                        return Ok(res);
                    }

                return BadRequest(res.msj);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("updateRechazarReferenciasTitular")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateRechazarAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos.updateRechazarReferenciasTitular parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Nota = parData.Nota, regresa = parData.regresa, msj = parData.msj };

                //CREAR EL SP DE RECHAZAR REFERNECIAS TITULAR
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_RechazaReferenciasTitular @Usu, @ProspectoID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("GetMensajesFijos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetMensajesFijos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetMensajesFijos parData)
        {
            try
            {
                var Mensajes = new List<MensajesRelacion_VW>().ToArray();
                if (parData.StatusProcesoID > 0)
                {
                    if (parData.TipoDocumentoID > 0)
                        Mensajes = await DBContext.database.QueryAsync<MensajesRelacion_VW>("WHERE StatusProcesoID = @StatusProcesoID AND TipoDocumentoID = @TipoDocumentoID ", parData).ToArrayAsync();
                    else
                        Mensajes = await DBContext.database.QueryAsync<MensajesRelacion_VW>("WHERE StatusProcesoID = @StatusProcesoID AND MensajeID IS NOT NULL ", parData).ToArrayAsync();
                }
                else
                    Mensajes = await DBContext.database.QueryAsync<MensajesRelacion_VW>("SELECT MensajeID, Mensaje FROM Prospeccion.MensajesRelacion_VW WHERE  MensajeID IS NOT NULL GROUP BY MensajeID, Mensaje ", parData).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(Mensajes);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        //  ANALISTAS
        protected async Task<object> ObjectPersona(DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW personas)
        {
            var res = new
            {
                personas.PersonaID,
                personas.NombreCompleto
                // producto.ProductoID,
                // producto.Producto            

            };
            await DBContext.Destroy();
            return res;
        }

        protected async Task<object> ObjectMesaCredito(DBContext.DBConfia.Prospeccion.MesaCredito mesacredito)
        {
            var res = new
            {

                mesacredito.MesaCreditoID,
                mesacredito.Nombre,
                mesacredito.Clave,
                mesacredito.Activo

            };
            //await DBContext.Destroy();
            return res;
        }

        [HttpPost]
        [Route("getPersonas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPersonas(ConfiaWebApi.PeticionesRest.Seguridad.UsuariospersonaspuestosVw.get parData)
        {


            try
            { //rtru
                //         if (parData.id != 0)
                // {
                //     var personasvw = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestos_VW>(parData.id);
                //     return Ok(await ObjectPersona(personasvw));
                // }
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                List<object> respList = new List<object>();
                var ListSeries = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Roles>("WHERE ProductoID = @0 AND RolID IN (85)", ProductoID).ToArrayAsync();
                foreach (var item in ListSeries)
                {
                    var persona = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID = @0", item.UsuarioID).FirstOrDefaultAsync();
                    respList.Add(new { persona.PersonaID, NombreCompleto = (item.RolID == 87 ? "(Encargado) " : "(Analista) ") + persona.NombreCompleto });
                }
                await DBContext.Destroy();
                return Ok(respList);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("getMesaCredito")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetMesaCredito(ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito.get parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                List<object> respList = new List<object>();
                var mesa = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ProductoMesaCredito>("WHERE ProductoID = @0", ProductoID).FirstOrDefaultAsync();
                var ListSeries = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.MesaCredito>("WHERE MesaCreditoID = @0", mesa.MesaCreditoID);
                foreach (var item in ListSeries)
                {
                    respList.Add(await ObjectMesaCredito(item));
                }
                await DBContext.Destroy();
                return Ok(respList);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        protected async Task<object> ObjectAnalista(Analista analista)
        {
            // var dani = analista;
            var res = new
            {
                analista.AnalistaID,
                mesaCredito = 1,// (await analista.CH__MESA_CREDITO(DBContext)).FirstOrDefault(),
                analista.Activo

            };
            return res;
        }

        [HttpPost]
        [Route("addAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> addAnalista(ConfiaWebApi.PeticionesRest.Prospeccion.Analista.add parData)
        {
            try
            {
                var NombreCompleto = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE PersonaID=@0", parData.PersonaID).FirstOrDefaultAsync();
                var NombreMesaCredito = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.MesaCredito>("WHERE MesaCreditoID=@0", parData.MesaCreditoID).FirstOrDefaultAsync();


                var analista = new Analista()
                {
                    AnalistaID = parData.PersonaID,
                    MesaCreditoID = NombreMesaCredito.MesaCreditoID,
                    Activo = parData.Activo,
                };


                var mesaCredito = new DBContext.DBConfia.Prospeccion.MesaCredito()
                {
                    MesaCreditoID = parData.MesaCreditoID,
                    Nombre = NombreMesaCredito.Nombre,
                    Clave = NombreMesaCredito.Clave,
                    Activo = NombreMesaCredito.Activo

                };
                await ObjectMesaCredito(mesaCredito);
                await DBContext.database.InsertAsync<Analista>(analista);
                await ObjectAnalista(analista);
                var resp = new
                {
                    AnalistaID = analista.AnalistaID,
                    MesaCreditoID = analista.MesaCreditoID,
                    Activo = analista.Activo,
                    NombreCompleto = NombreCompleto.NombreCompleto,
                    mesaCredito = mesaCredito.Nombre
                };
                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getDirectoresIndex")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetDirectoresIndex(ConfiaWebApi.PeticionesRest.Prospeccion.DirectoresMesaCredito.get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.Directores_VW>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("getDirectores")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDirectores(ConfiaWebApi.PeticionesRest.Seguridad.UsuariospersonaspuestosVw.get parData)
        {


            try
            {
                //         if (parData.id != 0)
                // {
                //     var personasvw = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestos_VW>(parData.id);
                //     return Ok(await ObjectPersona(personasvw));
                // }
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                List<object> respList = new List<object>();
                //var ListSeries = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE PuestoCV = 28");
                var ListSeries = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.Usuarios_Roles>("WHERE ProductoID = @0 AND RolID = 17", ProductoID);
                foreach (var item in ListSeries)
                {
                    var persona = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID = @0", item.UsuarioID).FirstOrDefaultAsync();
                    respList.Add(new { persona.PersonaID, persona.NombreCompleto });
                }
                await DBContext.Destroy();
                return Ok(respList);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        protected async Task<object> ObjectDirector(DirectorMesaCredito directorMesaCredito)
        {
            // var dani = analista;
            var res = new
            {
                directorMesaCredito.DirectorMesaCreditoID,
                mesaCredito = 1,
                directorMesaCredito.Activo
                // analista.AnalistaID,
                // mesaCredito = 1,// (await analista.CH__MESA_CREDITO(DBContext)).FirstOrDefault(),
                // analista.Activo

            };
            await DBContext.Destroy();
            return res;
        }

        [HttpPost]
        [Route("addDirector")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> addDirector(ConfiaWebApi.PeticionesRest.Prospeccion.DirectoresMesaCredito.add parData)
        {
            try
            {
                var NombreCompleto = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE PersonaID=@0", parData.PersonaID).FirstOrDefaultAsync();
                var NombreMesaCredito = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.MesaCredito>("WHERE MesaCreditoID=@0", parData.MesaCreditoID).FirstOrDefaultAsync();


                var director = new DirectorMesaCredito()
                {
                    DirectorMesaCreditoID = parData.PersonaID,
                    MesaCreditoID = NombreMesaCredito.MesaCreditoID,
                    Activo = parData.Activo,
                };


                var mesaCredito = new DBContext.DBConfia.Prospeccion.MesaCredito()
                {
                    MesaCreditoID = parData.MesaCreditoID,
                    Nombre = NombreMesaCredito.Nombre,
                    Clave = NombreMesaCredito.Clave,
                    Activo = NombreMesaCredito.Activo

                };
                await ObjectMesaCredito(mesaCredito);
                await DBContext.database.InsertAsync<DirectorMesaCredito>(director);
                await ObjectDirector(director);
                var resp = new
                {
                    DirectorMesaCreditoID = director.DirectorMesaCreditoID,
                    MesaCreditoID = director.MesaCreditoID,
                    Activo = director.Activo,
                    NombreCompleto = NombreCompleto.NombreCompleto,
                    mesaCredito = mesaCredito.Nombre
                };
                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("NotificacionLeida")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> NotificacionLeida(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.NotificacionLeida parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { parData.ProspectoID, UsuarioActual.PersonaID };
                var validacion = await DBContext.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_ActualizaMensajesSucursal @ProspectoID", obj).FirstOrDefaultAsync();

                if (validacion.regresa == 1)
                {

                    return Ok(validacion);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest(validacion.msj);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("EviarMsjPromotorSucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> EviarMsjPromotorSucursal(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.AddMsjSucursalPromotor parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, parData.Nota, UsuarioActual.UsuarioID, parData.TipoMesa, parData.DesdeProceso };
                var validacion = await DBContext.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_AgregarNota @ProspectoID, @Nota, 1, @UsuarioID, @TipoMesa, @DesdeProceso", obj).FirstOrDefaultAsync();

                if (validacion.regresa == 1)
                {
                    await DBContext.Destroy();
                    return Ok(validacion);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest(validacion.msj);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("EditarSocia")]
        [Authorize]

        public async Task<IActionResult> EditarSociaPreActivacion(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.UpdateProspectoPreActivacion parData)
        {

            try
            {
                /*  var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                 var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync(); */

                var obj = new { parData.opcion, parData.ProspectoID, parData.ProductoID, parData.NivelOrigen, parData.Dictamen };
                var json = JsonConvert.SerializeObject(obj);
                var Datos = new { Datos = json };

                var validacion = await DBContext.database.QueryAsync<LogTiemposPeriodo>("EXEC Prospeccion.pa_MesaCredito @Datos", Datos).FirstOrDefaultAsync();

                if (validacion.res == 1)
                {
                    var prospecto = await DBContext.database.QueryAsync<Prospectos_VW>("WHERE ProspectoID=@0", parData.ProspectoID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(prospecto);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest(validacion.msj);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


    }
}

