using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Cortes;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Bancos;

namespace ConfiaWebApi.Controllers.AppDistribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/AppVale/[controller]")]
    public class AppCatalogosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppCatalogosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("getBancos")]
        [Authorize]
        //[Code.TProteccionAdmin]
        public async Task<IActionResult> getBancos(PeticionesRest.Bancos.Banco.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.FetchAsync<CatalogoBancos>("WHERE (TipoBancoId = @0)", parData.Id);
                    var data = new
                    {
                        data = res,
                        resultCode = 0,
                        resultDesc = "OK."
                    };
                    await DBContext.Destroy();
                    return Ok(data);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var TiposArchivoDispersion = await DBContext.database.FetchAsync<TipoArchivoDispersion>();

                    var Banco = (await DBContext.database.FetchAsync<CatalogoBancos>())
                        .Select(x => new //DBContext.DBConfia.Bancos.CatalogoBancos()
                        {
                            x.BancoID,
                            x.Nombre,
                            x.ArchivoDispersionID,
                            x.Logo, //String.Format("{0}://{1}{2}/wwwroot/Archivos/LogoBancos/{3}", Request.Scheme, Request.Host, Request.PathBase, x.LogoImg)
                            x.Activo,
                            TipoArchivoDispersion = TiposArchivoDispersion.Where(t => t.ArchivoDispersionID == x.ArchivoDispersionID).FirstOrDefault()
                        }).ToList();
                    await DBContext.Destroy();
                    return Ok(Banco);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }

            //return Ok(await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>());
        }
        [HttpPost]
        [Route("getdestinos")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetDestinos()
        {
            try
            {

                var data = await DBContext.database.FetchAsync<DestinosDeCredito>();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getdatosbancariostipos")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetDatosBancariosTipos()
        {
            try
            {

                var data = await DBContext.database.FetchAsync<DatosBancariosTipos>("WHERE (EnApp = 1)");

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getocupaciones")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]

        public async Task<IActionResult> GetOcupaciones(ConfiaWebApi.PeticionesRest.Catalogos.Ocupacion.Get parData)
        {
            try
            {

                var Ocupaciones = await DBContext.database.FetchAsync<Ocupaciones>();

                var data = new ArrayList();

                foreach (var Ocupacion in Ocupaciones)
                {
                    data.Add(new
                    {
                        ocupacionId = Ocupacion.Id,
                        ocupacionDesc = Ocupacion.Ocupacion
                    });
                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("getdesembolsos")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]

        public async Task<IActionResult> GetDesembolsos(PeticionesRest.AppValePeticiones.AppClientes.GetSingle parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var DvCliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE (PersonaID = @1) AND (DistribuidorID = @0)", parData.DistribuidorID, parData.ClienteID).SingleOrDefaultAsync();
                if (DvCliente.bloqueado == true)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -16,
                        resultDesc = "Cliente Bloqueado",
                        data = new { }

                    });
                }

                parData.ProductoID = producto;

                //TODO ELIMINAR ESTA PARTE DE CODIGO CUANDO SE HABGILITE DE NEW EL SPEI A PRESTA
                bool isPresta = false;
                var empresas = await DBContext.database.FetchAsync<Empresas>("WHERE (TipoEmpresaID = 2)");
                var produc = await DBContext.database.QueryAsync<Productos>("WHERE (ProductoID = @0)", parData.ProductoID).FirstOrDefaultAsync();
                foreach (var empresa in empresas)
                {
                    if (empresa.empresaId == produc.EmpresaId)
                    {
                        isPresta = true;
                    }
                }
                //TODO HASTA ACA
                var TiposDesembolso = await DBContext.database.FetchAsync<AppTiposDesembolsoDistribuidor_VW>("WHERE (ProductoID = @ProductoID) AND (DistribuidorID = @DistribuidorID) AND (Activo = 1) AND (EsEnApp = 1)", parData);
                var PersonaDatosBancarios = await DBContext.database.QueryAsync<PersonasDatosBancarios>("WHERE (activo = 1) AND (personaID = @ClienteID)", parData).LastOrDefaultAsync();
                CatalogoBancos Banco = null;

                string numeroTarjeta = "";
                string nombrebanco = "";
                long personasDatosBancariosID = 0;

                try
                {
                    Banco = await DBContext.database.SingleOrDefaultByIdAsync<CatalogoBancos>(PersonaDatosBancarios.cveBancoRef);
                    numeroTarjeta = "**** " + PersonaDatosBancarios.datoBancario[^4..];
                    nombrebanco = Banco.Nombre;
                    personasDatosBancariosID = PersonaDatosBancarios.personasDatosBancariosID;
                }
                catch (Exception ex)
                {

                }

                var data = new ArrayList();

                foreach (var TipoDesembolso in TiposDesembolso)
                {
                    //TODO ELIMINAR ESTE FRAGMENTO DE CODIGO CUANDO PRESTA SPEI SE HABILITE(SOLO EL IF OBVIO)

                    if (TipoDesembolso.TipoDesembolsoID == 7 && isPresta == true)
                    {
                        continue;
                    }
                    else
                    {
                        data.Add(new
                        {
                            desembolsoTipoId = TipoDesembolso.TipoDesembolsoID,
                            desembolsoTipoDesc = TipoDesembolso.TipoDesembolso,
                            iconoDesembolsoTipo = TipoDesembolso.iconoDesembolsoTipo,
                            requiereDatosBancarios = TipoDesembolso.RequiereDatosBancarios,
                            nombrebanco,
                            numeroTarjeta,
                            personasDatosBancariosID
                        });
                    }

                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("getdireccionbycp")]
        [Authorize]
        //[Code.TProteccionProducto]
        //      [Code.TProteccionAppVales]

        public async Task<IActionResult> GetDireccionByCP(PeticionesRest.Catalogos.Asentamiento.GetbyCP parData)
        {
            try
            {

                var data = await DBContext.database.FetchAsync<Asentamientos>("WHERE (CodigoPostal = @CodigoPostal)", parData);

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getViviendasTipos")]
        [Authorize]
        ////[Code.TProteccionProducto]
        //      [Code.TProteccionAppVales]
        public async Task<IActionResult> GetViviendasTipos()
        {
            var res = await DBContext.database.FetchAsync<ViviendasTipos>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getEstadosCiviles")]
        [Authorize]
        ////[Code.TProteccionProducto]
        //      [Code.TProteccionAppVales]
        public async Task<IActionResult> GetEstadosCiviles()
        {
            var res = await DBContext.database.FetchAsync<EstadosCiviles>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getEstadosPais")]
        [Authorize]
        ////[Code.TProteccionProducto]
        //      [Code.TProteccionAppVales]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetEstadosPais()
        {
            var res = await DBContext.database.FetchAsync<EstadosPais>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("GetCatalogoTiendita")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetCatalogoTiendita()
        {
            try
            {
                var catalogo = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "Catalogo_Tiendita").FirstOrDefaultAsync();


                // if (catalogo == 0)
                // {
                //     return NotFound(); 
                // }


                var data = new
                {
                    catalogo = catalogo.varValue
                };
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };



                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

    }
}
