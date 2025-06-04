using ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto;
using DBContext.DBConfia;
using DBContext.DBConfia.Cobranza;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Cobranza
{
    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]

    public class RelacionMesaCreditoProductoController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;

        public RelacionMesaCreditoProductoController(IConfiguration _Configuration, DBConfiaContext _DBContext)

        {
            this.Configuracion = _Configuration;
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { Usu = UsuarioActual.UsuarioID, PersonaID = UsuarioActual.PersonaID, ProductoID = parData.ProductoID };

            // var res2 = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE UsuarioID = @Usu AND PuestoCV = 129", obj);
            var res2 = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE UsuarioID = @Usu AND EsDirector = 1 AND Ocupacion IS NULL", obj);
            if (res2.Count == 0)
            {
                var res = await DBContext.database.FetchAsync<RelacionMesaProducto_VW>("WHERE ProductoID = @ProductoID AND DirectorMesaCobranzaID = @PersonaID", obj);
                await DBContext.Destroy();
                return Ok(res);
            }
            else
            {
                var res = await DBContext.database.FetchAsync<RelacionMesaProducto_VW>("WHERE ProductoID = @ProductoID", obj);
                await DBContext.Destroy();
                return Ok(res);
            }
        }

        [HttpPost]
        [Route("getDirectores")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDirectores(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getDirectores parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DirectoresMesaCobranza_VW>("WHERE Activo = 1");
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //var obj = new { Usu = UsuarioActual.UsuarioID, ProductoID = parData.ProductoID, idTabMora = parData.idTabMora, Activo = parData.Activo, verifDom = parData.verifDom, Monitoreo = parData.Monitoreo, Cobranza = parData.Cobranza, MesaCobranzaDesc = parData.MesaCobranzaDesc, Clave = parData.Clave, Director = parData.DirectorMesaCobranzaID, Coordinador = parData.Coordinador, Legal = parData.Legal, regresa = parData.regresa, msj = parData.msj };
                var obj = new { Usu = UsuarioActual.UsuarioID, ProductoID = parData.ProductoID, idTabMora = parData.idTabMora, Activo = parData.Activo, verifDom = parData.verifDom, Monitoreo = parData.Monitoreo, Cobranza = parData.Cobranza, MesaCobranzaID = parData.MesaCobranzaID, Director = parData.DirectorMesaCobranzaID, Coordinador = parData.Coordinador, Legal = parData.Legal, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spAltaMesaCobranza>("EXEC Cobranza.AltaMesaCobranza @Usu, @ProductoID, @idTabMora, @Activo, @verifDom, @Monitoreo, @Cobranza, @MesaCobranzaID,  @Director, @Coordinador, @Legal ,@regresa, @msj", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    await DBContext.Destroy();
                return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> update(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, MesaCobranzaID = parData.MesaCobranzaID, Director = parData.DirectorMesaCobranzaID, Activo = parData.Activo, verifDom = parData.verifDom, Monitoreo = parData.Monitoreo, Cobranza = parData.Cobranza, Coordinador = parData.Coordinador, Legal = parData.Legal, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spAltaMesaCobranza>("EXEC Cobranza.ActualizaRelacionMesaCobranza @Usu, @MesaCobranzaID, @Director, @Activo, @verifDom, @Monitoreo, @Cobranza, @Coordinador, @Legal, @regresa, @msj", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    await DBContext.Destroy();
                return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);  
            }
        }

        [HttpPost]
        [Route("ValidacionAltaRelacionMesaProducto")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.ValidacionAltaRelacionMesaProducto parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var UsuarioActual2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { Usu = UsuarioActual.UsuarioID, 
                                regresa = parData.regresa,
                                msj = parData.msj 
                               };
 
                if(UsuarioActual2 != null 
                    && UsuarioActual2.PuestoCV == 129){
                        return Ok(UsuarioActual2);
                }
                else
                    await DBContext.Destroy();
                 return BadRequest();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMesaCobranza")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetMesaCobranza(ConfiaWebApi.PeticionesRest.Cobranza.MesaCobranza.getMesaCobranza parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<MesaCobranza>("WHERE Activo = 1");
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getTabMora")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getTabMora parData)
        {
            if (parData.id != 0)
            {
                var resultado = await DBContext.database.SingleByIdAsync<tabDiasMora>(parData.id);
                await DBContext.Destroy();
                return Ok(resultado);
            }
            var res = await DBContext.database.FetchAsync<tabDiasMora>("WHERE Activo = 1");
            await DBContext.Destroy();
            return Ok(res);
        }


        [HttpPost]
        [Route("validaAsignacion")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Validar(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getDistribuidoresDiasAtrasos parData)
        {
            try
            {
                var obj = new {ProductoID = parData.ProductoID };
                var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE AsignGestorMesaCobranzaID = 0 AND ProductoID = @ProductoID",obj);
                List<object> respList = new List<object>();
                int i = 0;
                for (i = 0; i < res.Count; i++)
                {
                    var resultado = new
                    {
                        DistribuidorID = res[i].DistribuidorID,
                        DistribuidorDesc = res[i].DistribuidorDesc,
                        SucursalDesc = res[i].SucursalDesc,
                        DiasAtraso = res[i].DiasAtraso,
                        ProductoID = res[i].ProductoID,
                        ColorAsignaGestor = res[i].ColorAsignaGestor,
                        ColorAsignaCobranza = res[i].ColorAsignaCobranza,
                        Grupo = res[i].Grupo,
                        Capital = res[i].Capital,
                        SaldoActual = res[i].SaldoActual,
                        MesaCobranzaID = res[i].MesaCobranzaID,
                        idRelMesaCredProd = res[i].idRelMesaCredProd,
                        
                    };
                    respList.Add(resultado);
                }
                await DBContext.Destroy();
                return Ok(respList);


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getDistribuidoresDiasAtrasos")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getDistribuidoresDiasAtrasos parData)
        {
            try
            {
                var RelacionMesa = await DBContext.database.FetchAsync<RelacionMesaProducto_VW>("WHERE idRelMesaCredProd = @idRelMesaCredProd", parData);
                var obj = new { limInferiorDias = RelacionMesa[0].limInferiorDias, limSuperiorDias = RelacionMesa[0].limSuperiorDias, MesaCobranzaID = RelacionMesa[0].MesaCobranzaID, TipoCobranza = "AUTOMATICO", ProductoID = parData.ProductoID };
                //var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE ((ProductoID = 1 AND DiasAtraso >= @limInferiorDias AND DiasAtraso <= @limSuperiorDias AND TipoCobranza = @TipoCobranza OR MesaCobranzaID = @MesaCobranzaID AND ProductoID = 1) ORDER BY SucursalID DESC)", obj);
                //var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE ProductoID = @ProductoID AND DiasAtraso >= @limInferiorDias AND DiasAtraso <= @limSuperiorDias AND TipoCobranza = @TipoCobranza OR MesaCobranzaID = @MesaCobranzaID AND ProductoID = @ProductoID ORDER BY SucursalID, ClasificadorGrupoID DESC", obj);
                //var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE (DiasAtraso BETWEEN @limInferiorDias AND @limSuperiorDias AND DiasAtraso > 0 AND ProductoID = @ProductoID) OR (AsignGestorMesaCobranzaID = @MesaCobranzaID AND DiasAtraso > 0 AND ProductoID = @ProductoID) OR (MesaCobranzaID = @MesaCobranzaID AND DiasAtraso > 0 AND ProductoID = @ProductoID) ORDER BY SucursalID, ClasificadorGrupoID DESC", obj);
                // var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE (DiasAtraso BETWEEN @limInferiorDias AND @limSuperiorDias AND DiasAtraso > 0 AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID ) OR (MesaCobranzaID = @MesaCobranzaID AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID AND TipoCobranzaID = 2) OR (AsignGestorMesaCobranzaID = @MesaCobranzaID AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID) ORDER BY SucursalID, ClasificadorGrupoID DESC", obj);
                var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE (DiasAtraso BETWEEN (case when @limInferiorDias = 1 then 0 else @limInferiorDias end ) AND @limSuperiorDias AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID ) OR (MesaCobranzaID = @MesaCobranzaID AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID AND TipoCobranzaID = 2) OR (AsignGestorMesaCobranzaID = @MesaCobranzaID AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID) ORDER BY SucursalID, ClasificadorGrupoID DESC", obj);
                //await DBContext.Destroy();
                //return Ok(res);
                List<object> respList = new List<object>();
                int i = 0;
                for (i = 0; i < res.Count; i++)
                {
                    var resultado = new
                    {
                        DistribuidorID = res[i].DistribuidorID,
                        DistribuidorDesc = res[i].DistribuidorDesc,
                        SucursalID = res[i].SucursalID,
                        SucursalDesc = res[i].SucursalDesc,
                        DiasAtraso = res[i].DiasAtraso,
                        ProductoID = res[i].ProductoID,
                        GestorId = res[i].GestorId,
                        GestorDesc = res[i].GestorDesc,
                        ColorAsignaGestor = res[i].ColorAsignaGestor,
                        ColorReferencias = res[i].ColorReferencias,
                        ColorReferenciasAvales = res[i].ColorReferenciasAvales,
                        ColorAsignaCobranza = res[i].ColorAsignaCobranza,
                        Grupo = res[i].Grupo,
                        ClasificadorGrupoID = res[i].ClasificadorGrupoID,
                        //TipoCobranza = res[i].TipoCobranza,
                        Capital = res[i].Capital,
                        SaldoActual = res[i].SaldoActual,
                        MesaCobranzaID = res[i].MesaCobranzaID,
                        MotivoID = res[i].MotivoID,
                        Motivo = res[i].Motivo,
                        Sucursal = res[i].SucursalDesc,
                        AsignGestorMesaCobranzaDesc = res[i].AsignGestorMesaCobranzaDesc,
                        AsignGestorMesaCobranzaID = res[i].AsignGestorMesaCobranzaID,
                        TipoCobranzaDescCorto = res[i].TipoCobranzaDescCorto,
                        TipoCobranzaID = res[i].TipoCobranzaID,
                        FechaHoraAsignacion = res[i].FechaHoraAsignacion,
                        FechaFiltro = res[i].FechaHoraAsignacion,
                    };
                    respList.Add(resultado);
                }
                await DBContext.Destroy();
                return Ok(respList);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("AsignarGestor")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.AsignarGestor parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, DistribuidorID = parData.DistribuidorID, GestorId = parData.GestorId, DiasAtraso = parData.DiasAtraso, ProductoID = parData.ProductoID, idRelMesaCredProd = parData.idRelMesaCredProd, MesaCobranzaID = parData.MesaCobranzaID, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spAsignarGestor>("EXEC Cobranza.AsignarGestor @Usu, @GestorId, @DistribuidorID, @DiasAtraso, @ProductoID, @idRelMesaCredProd, @MesaCobranzaID, @regresa, @msj", obj).FirstOrDefaultAsync();

                await DBContext.Destroy();

                if (res.regresa == 1)
                    return Ok(res);
                else
                    await DBContext.Destroy();
                return BadRequest(res.msj);
            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getReferencias")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getReferencias parData)
        {
            var obj = new { DistribuidorID = parData.DistribuidorID };
            var res = await DBContext.database.FetchAsync<Referencia>("WHERE DistribuidorID = @DistribuidorID", obj);

            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getDocumentos")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getDocumentos parData)
        {
            var obj = new { DistribuidorID = parData.DistribuidorID };
            var res = await DBContext.database.FetchAsync<PersonasDoc_VW>("WHERE PersonaID = @DistribuidorID", obj);

            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("GetVerDocumentos")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getVerDocumentos parData)
        {
            try
            {
                var src = "";

                var Documento = await DBContext.database.QueryAsync<PersonasDoc>("WHERE  (PersonasDocID = @PersonasDocID)", parData).LastOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.RutaDoc}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                 //Console.WriteLine(Documento.Ruta);
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.PersonasDocID}",
                    src = $"{src}",
                    //    Nota = Documento.Observacion,
                };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }


        [HttpPost]
        [Route("getPerfil")]
        [Code.TProteccionProducto]
        //[Authorize]
        public async Task<IActionResult> GetPerfil(PeticionesRest.Cobranza.RelacionMesaCreditoProducto.GetPerfil parData)
        {
            if (parData.PersonaID != null)
            {
                try
                {
                    var obj = new { PersonaID = parData.PersonaID };
                    var resultado = await DBContext.database.FetchAsync<DatosGenerales_VW>("WHERE PersonaID = @PersonaID", obj);

                    var obj2 = new { resultado[resultado.Count - 1].NumeroFilas };
                    var DatosGenerales = await DBContext.database.QueryAsync<DatosGenerales_VW>("WHERE NumeroFilas = @NumeroFilas", obj2).SingleOrDefaultAsync();

                    //var DatosGenerales = await DBContext.database.QueryAsync<DatosGenerales_VW>("WHERE PersonaID=@0", parData.PersonaID).SingleOrDefaultAsync();
                    var Firma = await GetFirma(parData.PersonaID);
                    var res = new
                    {
                        DatosGenerales,
                        Firma,
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                await DBContext.Destroy();
                return NotFound("Acción No Valida");
            }
        }

        protected async Task<string> GetFirma(int? PersonaID)
        {
            try
            {
                var src = "";
                var Documento = await DBContext.database.QueryAsync<PersonasDoc_VW>("WHERE PersonaID = @0 AND Clave = 'D044'", PersonaID).FirstOrDefaultAsync();
                //var Documento = await ConexionBD.database.SingleByIdAsync<ProspectosDocumentos_VW>(parData.DocumentoID);
                if (Documento == null) throw new Exception("SIN FIRMA");
                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.RutaDoc}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return src;
                    }
                }
                await DBContext.Destroy();
                return src;
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return (ex.Message);
            }
        }

        [HttpPost]
        [Route("getIne")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getIne parData)
        {
            try
            {
                var src = "";
                var Documento = await DBContext.database.QueryAsync<PersonasDoc_VW>("WHERE PersonaID = @PersonaID AND Clave = @Clave", parData).LastOrDefaultAsync();


                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    if (Documento != null)
                    {
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                        var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.RutaDoc}");
                        if (response.IsSuccessStatusCode)
                        {
                            var jsonString = await response.Content.ReadAsStringAsync();
                            var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                            src = request.url;
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest(response.StatusCode);
                        }
                    }
                    //Console.WriteLine(Documento.Ruta);
                    var res = new
                    {
                        res = 1,
                        msj = $"Consulta correcta del documento {parData.PersonaID}",
                        src = $"{src}",
                        //    Nota = Documento.Observacion,
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }

        [HttpPost]
        [Route("getGrupo")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getGrupo parData)
        {
            if (parData.GrupoID != 0)
            {
                var resultado = await DBContext.database.SingleByIdAsync<ClasificadorGrupos>(parData.GrupoID);
                await DBContext.Destroy();
                return Ok(resultado);
            }

            var res = await DBContext.database.FetchAsync<ClasificadorGrupos>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getDistribuidores")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getDistribuidores parData)
        {
            var RelacionMesa = await DBContext.database.FetchAsync<RelacionMesaProducto_VW>();
            var obj = new { limInferiorDias = RelacionMesa[0].limInferiorDias, limSuperiorDias = RelacionMesa[RelacionMesa.Count - 1].limSuperiorDias, ProductoID = parData.ProductoID };
            var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE DiasAtraso >= @limInferiorDias AND DiasAtraso <= @limSuperiorDias AND ProductoID = @ProductoID", obj);
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("FiltroDistribuidor")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.FiltroDistribuidor parData)
        {
            var obj = new { DistribuidorID = parData.DistribuidorID, ProductoID = parData.ProductoID };
            var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE DistribuidorID = @DistribuidorID AND ProductoID = @ProductoID", obj);
            await DBContext.Destroy();
            if (parData.DistribuidorID == 0)
            {
                return Ok(res);
            }
            else
            {
                return Ok(res[0].DiasAtraso);
            }
        }

        [HttpPost]
        [Route("getReferenciaAvales")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getReferenciaAvales parData)
        {
            var obj = new { DistribuidorID = parData.DistribuidorID };
            var resultado1 = await DBContext.database.FetchAsync<AvalesDistribuidorDatosGenerales_VW>("WHERE DistribuidorID = @DistribuidorID", obj);

            if (resultado1.Count == 0)
            {
                return Ok(resultado1);
            }

            var obj2 = new { resultado1[resultado1.Count - 1].NumeroFilas };
            var resultado2 = await DBContext.database.FetchAsync<AvalesDistribuidorDatosGenerales_VW>("WHERE NumeroFilas = @NumeroFilas", obj2);
            await DBContext.Destroy();
            return Ok(resultado2);
        }

        [HttpPost]
        [Route("getAsignarDistribuidor")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getAsignarDistribuidor parData)
        {
            try
            {
                var obj = new { ProductoID = parData.ProductoID };
                var res = await DBContext.database.FetchAsync<DistribuidoresDiasAtrasos_VW>("WHERE ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID AND DiasAtraso = 0", obj);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMotivosAsignacion")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getMotivosAsignacion parData)
        {
            var res = await DBContext.database.FetchAsync<MotivosAsignacion>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("AsignarDistribuidor")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> asignar(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.AsignarDistribuidor parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, PersonaID = UsuarioActual.PersonaID, DistribuidorID = parData.DistribuidorID, MesaCobranzaID = parData.MesaCobranzaID, MotivoID = parData.MotivoID, DiasAtraso = parData.DiasAtraso, Capital = parData.Capital, SaldoActual = parData.SaldoActual, ProductoID = parData.ProductoID, idRelMesaCredProd = parData.idRelMesaCredProd, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spAsignarDistribuidorCobranza>("EXEC Cobranza.AsignarDistribuidorCobranza @Usu, @PersonaID, @DistribuidorID, @MesaCobranzaID, @MotivoID, @DiasAtraso, @Capital, @SaldoActual, @ProductoID, @idRelMesaCredProd, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        [Route("getRelacion")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDirectores(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.get parData)
        {
            var obj = new { idRelMesaCredProd = parData.idRelMesaCredProd, ProductoID = parData.ProductoID };
            var res = await DBContext.database.FetchAsync<RelacionMesaProducto_VW>("WHERE ProductoID = @ProductoID AND idRelMesaCredProd = @idRelMesaCredProd", obj);
            await DBContext.Destroy();
            return Ok(res);
        }


        // [HttpPost]  //Se comenta porque esta opcion se manda ahora desde /[Route("getDistribuidoresDiasAtrasos")]
        // [Route("getGestorCobranza")]
        // [Code.TProteccionProducto]
        // //[Authorize]
        // //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        // //[ApiExplorerSettings(IgnoreApi = true)]
        // public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getGestorCobranza parData)
        // {
        //     try
        //     {
        //         var obj = new { idRelMesaCredProd = parData.idRelMesaCredProd };

        //         var Mesa = await DBContext.database.FetchAsync<RelacionMesaProducto_VW>("WHERE idRelMesaCredProd  = @idRelMesaCredProd", obj);

        //         var obj2 = new { MesaCobranzaID = Mesa[0].MesaCobranzaID };


        //         var res = await DBContext.database.FetchAsync<GestoresCobranza_VW>("WHERE MesaCobranzaID = @MesaCobranzaID", obj2);

        //         await DBContext.Destroy();
        //         return Ok(res);
        //     }
        //     catch (Exception ex)
        //     {
        //         await DBContext.Destroy();
        //         return BadRequest(ex);
        //     }

        // }

        [HttpPost]
        [Route("ValidacionBitMesaCobranza")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> validar(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.ValidacionBitMesaCobranza parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, idRelMesaCredProd = parData.idRelMesaCredProd, GestorID = parData.GestorID, Filtro = parData.Filtro, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spValida>("EXEC Cobranza.ValidacionBitMesaCobranza @Usu, @idRelMesaCredProd, @GestorID, @Filtro, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        [Route("getDirecciones")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getDirecciones parData)
        {
            var obj = new { PersonaID = parData.PersonaID };
            var res = await DBContext.database.FetchAsync<DatosGeneralesUltimoRegistro_VW>("WHERE PersonaID = @PersonaID", obj);

            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("addDireccion")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.addDireccion parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, PersonaID = UsuarioActual.PersonaID, AsentamientoID = parData.AsentamientoID, Calle = parData.Calle, NumeroExterior = parData.NumeroExterior, identificacionNumero = parData.identificacionNumero, vialidadTipoId = parData.vialidadTipoId, orientacionVialidadTipoId = parData.orientacionVialidadTipoId, viviendaTipoId = parData.viviendaTipoId, DistribuidorID = parData.DistribuidorID, Nota = parData.Nota, GestorID = parData.GestorID, idRelMesaCredProd = parData.idRelMesaCredProd, ReferenciasGeograficas = parData.ReferenciasGeograficas, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spCambiarDireccion>("EXEC Cobranza.CambiarDireccion @Usu, @PersonaID, @AsentamientoID, @Calle, @NumeroExterior, @identificacionNumero, @vialidadTipoId, @orientacionVialidadTipoId, @viviendaTipoId, @DistribuidorID, @Nota, @GestorID, @idRelMesaCredProd, @ReferenciasGeograficas, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        [Route("getSucursales")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getSucursales parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Sucursales_VW>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("ValidacionAsignaGestor")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.ValidacionAsignaGestor parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, DistribuidorID = parData.DistribuidorID, MesaCobranzaID = parData.MesaCobranzaID, ProductoID = parData.ProductoID, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spValida>("EXEC Cobranza.ValidacionAsignaGestor @Usu, @DistribuidorID, @MesaCobranzaID, @ProductoID, @regresa, @msj", obj).FirstOrDefaultAsync();

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
        [Route("getTipoCobranza")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getTipoCobranza parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<TipoCobranza>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }

}
