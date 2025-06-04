using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Sistema;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class CondicionDetalleController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CondicionDetalleController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.CondicionDetalle.Get parData)
        {
            if (parData.ProductoID != 0 && parData.CondicionesID != 0 && parData.RenglonId != 0)
            {
                try
                {

                    var CondicionDetalle = await DBContext.database.SingleByIdAsync<CondicionesDetalle_VW2>(new { parData.ProductoID, parData.CondicionesID, parData.RenglonId });
                    /*                     var Condicion = (await CondicionDetalle.CH__CONDICIONES(DBContext)).FirstOrDefault();
                     */
                    var Nivel = await DBContext.database.SingleByIdAsync<Niveles>(CondicionDetalle.DistribuidorNivelId);

                    var res = new
                    {
                        CondicionDetalle.ProductoID,
                        CondicionDetalle.CondicionesID,
                        CondicionDetalle.RenglonId,
                        CondicionDetalle.DistribuidorNivelId,
                        CondicionDetalle.DistribuidorNivelOrigen,
                        CondicionDetalle.DistribuidorNivelOrigenID,
                        CondicionDetalle.Activo,
                        CondicionDetalle.PlazosMinimos,
                        CondicionDetalle.PlazosMaximos,
                        CondicionDetalle.ImporteMinimo,
                        CondicionDetalle.ImporteMaximo,
                        CondicionDetalle.ImporteMaximo1erCanje,
                        CondicionDetalle.ImporteMaximo2doCanje,
                        CondicionDetalle.ImporteMaximo3erCanje,
                        CondicionDetalle.ImporteMinimo1erCanje,
                        CondicionDetalle.ImporteMinimo2doCanje,
                        CondicionDetalle.ImporteMinimo3erCanje,
                        CondicionDetalle.PorcTasaPlazo,
                        CondicionDetalle.SeguroPlazo,
                        CondicionDetalle.PorcIVA,
                        CondicionDetalle.Cargo,
                        CondicionDetalle.ManejoCuenta,
                        CondicionDetalle.PlazosFijos,
                        fhRegistro = CondicionDetalle.fhRegistro.ToString("dd/MM/yyyy"),
                        fhModificacion = CondicionDetalle.fhModificacion?.ToString("dd/MM/yyyy"),
                        CondicionDetalle.PorcTasaMensual,
                        CondicionDetalle.PorcTasaAnual,
                        CondicionDetalle.PagoXMilMinimo,
                        CondicionDetalle.PagoXMilMaximo,
                        CondicionDetalle.PlazosEspeciales,
                        CondicionDetalle.CapitalCorte,
                        CondicionDetalle.PorcCreditosActivosMax,
                        CondicionDetalle.CostoAnualTotal,
                        /*                         Condicion,
                         */
                        Nivel
                    };

                    await DBContext.Destroy();
                    return Ok(res);
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
                    var CondicionDetalle = await DBContext.database.FetchAsync<CondicionesDetalle_VW2>("Where ProductoID = @ProductoID AND CondicionesID = @CondicionesID ORDER BY ProductoID, CondicionesID, DistribuidorNivelOrigenID, DistribuidorNivelId, PlazosMinimos, PlazosMaximos", parData);
                    var Niveles = await DBContext.database.FetchAsync<Niveles>();

                    ArrayList res = new();

                    foreach (var T in CondicionDetalle)
                    {
                        /*                         var Condicion = (await T.CH__CONDICIONES(DBContext)).FirstOrDefault();
                         */
                        var Nivel = Niveles.Where(x => x.DistribuidorNivelID == T.DistribuidorNivelId).FirstOrDefault();
                        res.Add(new
                        {
                            T.ProductoID,
                            T.CondicionesID,
                            T.RenglonId,
                            T.DistribuidorNivelId,
                            T.DistribuidorNivelOrigen,
                            T.DistribuidorNivelOrigenID,
                            T.Activo,
                            T.PlazosMinimos,
                            T.PlazosMaximos,
                            T.ImporteMinimo,
                            T.ImporteMaximo,
                            T.ImporteMaximo1erCanje,
                            T.ImporteMaximo2doCanje,
                            T.ImporteMaximo3erCanje,
                            T.ImporteMinimo1erCanje,
                            T.ImporteMinimo2doCanje,
                            T.ImporteMinimo3erCanje,
                            T.PorcTasaPlazo,
                            T.SeguroPlazo,
                            T.PorcIVA,
                            T.Cargo,
                            T.ManejoCuenta,
                            T.PlazosFijos,
                            fhRegistro = T.fhRegistro.ToString("dd/MM/yyyy"),
                            fhModificacion = T.fhModificacion?.ToString("dd/MM/yyyy"),
                            T.PorcTasaMensual,
                            T.PorcTasaAnual,
                            T.PagoXMilMinimo,
                            T.PagoXMilMaximo,
                            T.PlazosEspeciales,
                            T.CapitalCorte,
                            T.PorcCreditosActivosMax,
                            T.CostoAnualTotal,

                            Nivel
                        });
                    }

                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.CondicionDetalle.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var existCondicion = await DBContext.database.QueryAsync<CondicionesDetalle>("WHERE ProductoID=@ProductoID AND CondicionesID=@CondicionesID AND DistribuidorNivelId=@DistribuidorNivelId AND DistribuidorNivelIdOri=@DistribuidorNivelOrigenID", parData).ToArrayAsync();
                if (existCondicion.Length > 0)
                {
                    await DBContext.Destroy();
                    return BadRequest("YA EXISTE UNA LÍNEA DE NIVEL Y NIVEL ORIGEN");
                }
                else
                {

                    var CondicionDetalleLast = await DBContext.database.QueryAsync<CondicionesDetalle>("Where ProductoID = @ProductoID AND CondicionesID = @CondicionesID ORDER BY RenglonId DESC", parData).FirstOrDefaultAsync();

                    int RenglonId;

                    try
                    {
                        RenglonId = CondicionDetalleLast.RenglonId;
                    }
                    catch (Exception)
                    {
                        RenglonId = 0;
                    }

                    var CondicionesDetalle = new CondicionesDetalle()
                    {
                        ProductoID = parData.ProductoID,
                        CondicionesID = parData.CondicionesID,
                        RenglonId = RenglonId + 1,
                        DistribuidorNivelId = parData.DistribuidorNivelId,
                        DistribuidorNivelIdOri = parData.DistribuidorNivelOrigenID,
                        Activo = parData.Activo,
                        PlazosMinimos = parData.PlazosMinimos,
                        PlazosMaximos = parData.PlazosMaximos,
                        ImporteMinimo = parData.ImporteMinimo,
                        ImporteMaximo = parData.ImporteMaximo,
                        ImporteMaximo1erCanje = parData.ImporteMaximo1erCanje,
                        ImporteMaximo2doCanje = parData.ImporteMaximo2doCanje,
                        ImporteMaximo3erCanje = parData.ImporteMaximo3erCanje,
                        ImporteMinimo1erCanje = parData.ImporteMinimo1erCanje,
                        ImporteMinimo2doCanje = parData.ImporteMinimo2doCanje,
                        ImporteMinimo3erCanje = parData.ImporteMinimo3erCanje,
                        PorcTasaPlazo = parData.PorcTasaPlazo,
                        SeguroPlazo = parData.SeguroPlazo,
                        PorcIVA = parData.PorcIVA,
                        Cargo = parData.Cargo,
                        ManejoCuenta = parData.ManejoCuenta,
                        PlazosFijos = parData.PlazosFijos,
                        fhRegistro = DateTime.Now,
                        UsuarioRegistro = UsuarioActual.UsuarioID,
                        PersonaIDRegistro = UsuarioActual.PersonaID,
                        //fhModificacion = DateTime.Now,
                        PorcTasaMensual = parData.PorcTasaMensual,
                        PorcTasaAnual = parData.PorcTasaAnual,
                        PagoXMilMinimo = parData.PagoXMilMinimo,
                        PagoXMilMaximo = parData.PagoXMilMaximo,
                        PlazosEspeciales = parData.PlazosEspeciales,
                        CapitalCorte = parData.CapitalCorte,
                        PorcCreditosActivosMax = parData.PorcCreditosActivosMax,
                        CostoAnualTotal = parData.CostoAnualTotal,
                    };
                    await DBContext.database.InsertAsync(CondicionesDetalle);

                    var Condicion = (await CondicionesDetalle.CH__CONDICIONES(DBContext)).FirstOrDefault();
                    var Nivel = await DBContext.database.SingleByIdAsync<Niveles>(CondicionesDetalle.DistribuidorNivelId);
                    var CondicionesDetalleVW = await DBContext.database.QueryAsync<CondicionesDetalle_VW2>("WHERE ProductoID=@0 AND CondicionesID=@1 AND RenglonId=@2", parData.ProductoID, parData.CondicionesID, CondicionDetalleLast.RenglonId).FirstAsync();

                    var res = new
                    {
                        CondicionesDetalle.ProductoID,
                        CondicionesDetalle.CondicionesID,
                        CondicionesDetalle.RenglonId,
                        CondicionesDetalle.DistribuidorNivelId,
                        CondicionesDetalleVW.DistribuidorNivelOrigenID,
                        CondicionesDetalleVW.DistribuidorNivelOrigen,
                        CondicionesDetalle.Activo,
                        CondicionesDetalle.PlazosMinimos,
                        CondicionesDetalle.PlazosMaximos,
                        CondicionesDetalle.ImporteMinimo,
                        CondicionesDetalle.ImporteMaximo,
                        CondicionesDetalle.ImporteMaximo1erCanje,
                        CondicionesDetalle.ImporteMaximo2doCanje,
                        CondicionesDetalle.ImporteMaximo3erCanje,
                        CondicionesDetalle.ImporteMinimo1erCanje,
                        CondicionesDetalle.ImporteMinimo2doCanje,
                        CondicionesDetalle.ImporteMinimo3erCanje,
                        CondicionesDetalle.PorcTasaPlazo,
                        CondicionesDetalle.SeguroPlazo,
                        CondicionesDetalle.PorcIVA,
                        CondicionesDetalle.Cargo,
                        CondicionesDetalle.ManejoCuenta,
                        CondicionesDetalle.PlazosFijos,
                        fhRegistro = CondicionesDetalle.fhRegistro.ToString("dd/MM/yyyy"),
                        fhModificacion = CondicionesDetalle.fhModificacion?.ToString("dd/MM/yyyy"),
                        CondicionesDetalle.PorcTasaMensual,
                        CondicionesDetalle.PorcTasaAnual,
                        CondicionesDetalle.PagoXMilMinimo,
                        CondicionesDetalle.PagoXMilMaximo,
                        CondicionesDetalle.PlazosEspeciales,
                        CondicionesDetalle.CapitalCorte,
                        CondicionesDetalle.PorcCreditosActivosMax,
                        CondicionesDetalle.CostoAnualTotal,
                        Condicion,
                        Nivel
                    };

                    await DBContext.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.CondicionDetalle.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var CondicionesDetalle = await DBContext.database.QueryAsync<CondicionesDetalle>("WHERE ProductoID=@ProductoID AND CondicionesID=@CondicionesID AND RenglonId=@RenglonId AND DistribuidorNivelIdOri=@DistribuidorNivelOrigenID AND DistribuidorNivelId=@DistribuidorNivelId", parData).FirstAsync();
                CondicionesDetalle.DistribuidorNivelId = parData.DistribuidorNivelId;
                CondicionesDetalle.DistribuidorNivelIdOri = parData.DistribuidorNivelOrigenID;
                CondicionesDetalle.Activo = parData.Activo;
                CondicionesDetalle.PlazosMinimos = parData.PlazosMinimos;
                CondicionesDetalle.PlazosMaximos = parData.PlazosMaximos;
                CondicionesDetalle.ImporteMinimo = parData.ImporteMinimo;
                CondicionesDetalle.ImporteMaximo = parData.ImporteMaximo;
                CondicionesDetalle.ImporteMaximo1erCanje = parData.ImporteMaximo1erCanje;
                CondicionesDetalle.ImporteMaximo2doCanje = parData.ImporteMaximo2doCanje;
                CondicionesDetalle.ImporteMaximo3erCanje = parData.ImporteMaximo3erCanje;
                CondicionesDetalle.ImporteMinimo1erCanje = parData.ImporteMinimo1erCanje;
                CondicionesDetalle.ImporteMinimo2doCanje = parData.ImporteMinimo2doCanje;
                CondicionesDetalle.ImporteMinimo3erCanje = parData.ImporteMinimo3erCanje;
                CondicionesDetalle.PorcTasaPlazo = parData.PorcTasaPlazo;
                CondicionesDetalle.SeguroPlazo = parData.SeguroPlazo;
                CondicionesDetalle.PorcIVA = parData.PorcIVA;
                CondicionesDetalle.Cargo = parData.Cargo;
                CondicionesDetalle.ManejoCuenta = parData.ManejoCuenta;
                CondicionesDetalle.PlazosFijos = parData.PlazosFijos;
                CondicionesDetalle.fhModificacion = DateTime.Now;
                CondicionesDetalle.UsuarioModifico = UsuarioActual.UsuarioID;
                CondicionesDetalle.PorcTasaMensual = parData.PorcTasaMensual;
                CondicionesDetalle.PorcTasaAnual = parData.PorcTasaAnual;
                CondicionesDetalle.PagoXMilMinimo = parData.PagoXMilMinimo;
                CondicionesDetalle.PagoXMilMaximo = parData.PagoXMilMaximo;
                CondicionesDetalle.PlazosEspeciales = parData.PlazosEspeciales;
                CondicionesDetalle.CapitalCorte = parData.CapitalCorte;
                CondicionesDetalle.PorcCreditosActivosMax = parData.PorcCreditosActivosMax;
                CondicionesDetalle.CostoAnualTotal = parData.CostoAnualTotal;

                await DBContext.database.UpdateAsync(CondicionesDetalle);

                var Condicion = (await CondicionesDetalle.CH__CONDICIONES(DBContext)).FirstOrDefault();
                var Nivel = await DBContext.database.SingleByIdAsync<Niveles>(CondicionesDetalle.DistribuidorNivelId);

                var CondicionesDetalleVW = await DBContext.database.QueryAsync<CondicionesDetalle_VW2>("WHERE ProductoID=@0 AND CondicionesID=@1 AND RenglonId=@2", parData.ProductoID, parData.CondicionesID, CondicionesDetalle.RenglonId).FirstAsync();

                var res = new
                {
                    CondicionesDetalle.ProductoID,
                    CondicionesDetalle.CondicionesID,
                    CondicionesDetalle.RenglonId,
                    CondicionesDetalle.DistribuidorNivelId,
                    CondicionesDetalleVW.DistribuidorNivelOrigenID,
                    CondicionesDetalleVW.DistribuidorNivelOrigen,
                    CondicionesDetalle.Activo,
                    CondicionesDetalle.PlazosMinimos,
                    CondicionesDetalle.PlazosMaximos,
                    CondicionesDetalle.ImporteMinimo,
                    CondicionesDetalle.ImporteMaximo,
                    CondicionesDetalle.ImporteMaximo1erCanje,
                    CondicionesDetalle.ImporteMaximo2doCanje,
                    CondicionesDetalle.ImporteMaximo3erCanje,
                    CondicionesDetalle.ImporteMinimo1erCanje,
                    CondicionesDetalle.ImporteMinimo2doCanje,
                    CondicionesDetalle.ImporteMinimo3erCanje,
                    CondicionesDetalle.PorcTasaPlazo,
                    CondicionesDetalle.SeguroPlazo,
                    CondicionesDetalle.PorcIVA,
                    CondicionesDetalle.Cargo,
                    CondicionesDetalle.ManejoCuenta,
                    CondicionesDetalle.PlazosFijos,
                    fhRegistro = CondicionesDetalle.fhRegistro.ToString("dd/MM/yyyy"),
                    fhModificacion = CondicionesDetalle.fhModificacion?.ToString("dd/MM/yyyy"),
                    CondicionesDetalle.PorcTasaMensual,
                    CondicionesDetalle.PorcTasaAnual,
                    CondicionesDetalle.PagoXMilMinimo,
                    CondicionesDetalle.PagoXMilMaximo,
                    CondicionesDetalle.PlazosEspeciales,
                    CondicionesDetalle.CapitalCorte,
                    CondicionesDetalle.PorcCreditosActivosMax,
                    CondicionesDetalle.CostoAnualTotal,
                    Condicion,
                    Nivel
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
    }
}
