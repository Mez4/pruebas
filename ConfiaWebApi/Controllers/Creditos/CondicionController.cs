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
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Prospeccion;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class CondicionController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public CondicionController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Condicion.Get parData)
        {
            if (parData.ProductoID != 0 && parData.CondicionesID != 0)
            {
                try
                {
                    var Condicion = await ConexionBD.database.SingleByIdAsync<Condiciones>(new { parData.ProductoID, parData.CondicionesID });
                    var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(Condicion.ProductoID);
                    var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Condicion.RegistroUsuarioId).FirstOrDefaultAsync();
                    var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Condicion.ModificoUsuarioId).FirstOrDefaultAsync();

                    var res = new
                    {
                        Condicion.ProductoID,
                        Condicion.CondicionesID,
                        Condicion.Descripcion,
                        Condicion.Activo,
                        RegistroFecha = Condicion.RegistroFecha.ToString("dd/MM/yyyy"),
                        Condicion.RegistroUsuarioId,
                        ModificoFecha = Condicion.ModificoFecha.ToString("dd/MM/yyyy"),
                        Condicion.ModificoUsuarioId,
                        Producto,
                        UsuarioRegistro = new
                        {
                            UsuarioRegistro.UsuarioID,
                            Usuario = UsuarioRegistro.Usuario,
                            Nombre = UsuarioRegistro.Nombre
                        },
                        UsuarioModifico = new
                        {
                            UsuarioModifico.UsuarioID,
                            Usuario = UsuarioModifico.Usuario,
                            Nombre = UsuarioModifico.Nombre
                        }
                    };

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();

                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var Condiciones = await ConexionBD.database.FetchAsync<Condiciones>();
                    var Productos = await ConexionBD.database.FetchAsync<Productos>();

                    ArrayList res = new();

                    foreach (var T in Condiciones)
                    {
                        var Producto = Productos.Where(x => x.ProductoID == T.ProductoID).FirstOrDefault();
                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.RegistroUsuarioId).FirstOrDefaultAsync();
                        var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.ModificoUsuarioId).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            T.ProductoID,
                            T.CondicionesID,
                            T.Descripcion,
                            T.Activo,
                            RegistroFecha = T.RegistroFecha.ToString("dd/MM/yyyy"),
                            T.RegistroUsuarioId,
                            ModificoFecha = T.ModificoFecha.ToString("dd/MM/yyyy"),
                            T.ModificoUsuarioId,
                            Producto,
                            UsuarioRegistro = new
                            {
                                UsuarioRegistro.UsuarioID,
                                Usuario = UsuarioRegistro.Usuario,
                                Nombre = UsuarioRegistro.Nombre
                            },
                            UsuarioModifico = new
                            {
                                UsuarioModifico.UsuarioID,
                                Usuario = UsuarioModifico.Usuario,
                                Nombre = UsuarioModifico.Nombre
                            }
                        });
                    }

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();

                    return NotFound(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("getCondiciones")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetCondciones()
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<Condiciones_VW>();
                await ConexionBD.Destroy();
                return Ok(resS);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getCondicionesFiltro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByProducto(PeticionesRest.Creditos.Condicion.GetCondicionesFiltro parData)
        {
            try
            {
                if (parData.ProductoID != 0)
                {
                    try
                    {
                        var res2 = await ConexionBD.database.FetchAsync<Condiciones>("WHERE ProductoID = @ProductoID", parData);
                        await ConexionBD.Destroy();
                        return Ok(res2);
                    }
                    catch (Exception ex)
                    {
                        await ConexionBD.Destroy();
                        return NotFound(ex.Message);
                    }
                }

                var res = await ConexionBD.database.FetchAsync<Condiciones>();
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpPost]
        [Route("getCondicionesOrigenNivel")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetCondcionesOrigenNivel()
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<Condiciones_VW>();
                await ConexionBD.Destroy();
                return Ok(resS);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getCondicionOrigen")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetCondicionOrigen(PeticionesRest.Creditos.Condicion.GetCondicionOrigen parData)
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<Condiciones_VW>("WHERE CondicionesID = @0", parData.CondicionesID);
                await ConexionBD.Destroy();
                return Ok(resS);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getCondicionOrigenNivel")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetCondicionOrigenNivel(PeticionesRest.Creditos.Condicion.GetCondicionOrigen2 parData)
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<Condiciones_VW>("WHERE CondicionesID = @0", parData.CondicionesID);
                await ConexionBD.Destroy();
                return Ok(resS);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getByProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetByProducto(PeticionesRest.Creditos.Condicion.Get parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<Condiciones>("WHERE  (ProductoID = @ProductoID)", parData);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.Condicion.Add parData)
        {
            try
            {
                //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();


                var CondicionLast = await ConexionBD.database.QueryAsync<Condiciones>("ORDER BY CondicionesID DESC", parData).FirstOrDefaultAsync();

                var Condicion = new Condiciones()
                {
                    ProductoID = parData.ProductoID,
                    CondicionesID = CondicionLast.CondicionesID + 1,
                    Descripcion = parData.Descripcion,
                    Activo = parData.Activo,
                    RegistroFecha = DateTime.Now,
                    RegistroUsuarioId = UsuarioActual.UsuarioID,
                    ModificoFecha = DateTime.Now,
                    ModificoUsuarioId = UsuarioActual.UsuarioID,
                    PersonaIDRegistro = UsuarioActual.UsuarioID

                };

                await ConexionBD.database.InsertAsync(Condicion);

                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(Condicion.ProductoID);

                var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Condicion.RegistroUsuarioId).FirstOrDefaultAsync();
                var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Condicion.ModificoUsuarioId).FirstOrDefaultAsync();


                var res = new
                {
                    Condicion.ProductoID,
                    Condicion.CondicionesID,
                    Condicion.Descripcion,
                    Condicion.Activo,
                    RegistroFecha = Condicion.RegistroFecha.ToString("dd/MM/yyyy"),
                    Condicion.RegistroUsuarioId,
                    ModificoFecha = Condicion.ModificoFecha.ToString("dd/MM/yyyy"),
                    Condicion.ModificoUsuarioId,
                    Producto,
                    UsuarioRegistro = new
                    {
                        UsuarioRegistro.UsuarioID,
                        Usuario = UsuarioRegistro.Usuario,
                        Nombre = UsuarioRegistro.Nombre
                    },
                    UsuarioModifico = new
                    {
                        UsuarioModifico.UsuarioID,
                        Usuario = UsuarioModifico.Usuario,
                        Nombre = UsuarioModifico.Nombre
                    }
                };

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.Condicion.Update parData)
        {
            try
            {
                //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                //var Condicion = await DBContext.database.QueryAsync<Condiciones>("WHERE CondicionesID = @CondicionesID", parData).FirstOrDefaultAsync();
                var Condicion = await ConexionBD.database.SingleByIdAsync<Condiciones>(new { parData.ProductoID, parData.CondicionesID });
                //Condicion.ProductoID = parData.ProductoID;
                Condicion.Descripcion = parData.Descripcion;
                Condicion.Activo = parData.Activo;
                Condicion.ModificoFecha = DateTime.Now;
                Condicion.ModificoUsuarioId = UsuarioActual.UsuarioID;

                await ConexionBD.database.UpdateAsync(Condicion);

                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(Condicion.ProductoID);

                var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Condicion.RegistroUsuarioId).FirstOrDefaultAsync();
                var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Condicion.ModificoUsuarioId).FirstOrDefaultAsync();

                var res = new
                {
                    Condicion.ProductoID,
                    Condicion.CondicionesID,
                    Condicion.Descripcion,
                    Condicion.Activo,
                    RegistroFecha = Condicion.RegistroFecha.ToString("dd/MM/yyyy"),
                    Condicion.RegistroUsuarioId,
                    ModificoFecha = Condicion.ModificoFecha.ToString("dd/MM/yyyy"),
                    Condicion.ModificoUsuarioId,
                    Producto,
                    UsuarioRegistro = new
                    {
                        UsuarioRegistro.UsuarioID,
                        Usuario = UsuarioRegistro.Usuario,
                        Nombre = UsuarioRegistro.Nombre
                    },
                    UsuarioModifico = new
                    {
                        UsuarioModifico.UsuarioID,
                        Usuario = UsuarioModifico.Usuario,
                        Nombre = UsuarioModifico.Nombre
                    }
                };

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("TraspasoTabulador")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> TraspasoTabulador(PeticionesRest.Creditos.Condicion.TraspasoTabulador parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();

            try
            {
                if (parData.CondicionesID == parData.CondicionesDestinoID)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Las Condiciones Deben Ser Diferentes");
                }

                var productoDestino = await ConexionBD.database.QueryAsync<Condiciones>("WHERE CondicionesID = @CondicionesDestinoID", parData).FirstOrDefaultAsync();
                var condicionesDestino = await ConexionBD.database.QueryAsync<CondicionesDetalle>("WHERE ProductoID = @0 AND CondicionesID = @1", productoDestino.ProductoID, parData.CondicionesDestinoID).ToArrayAsync() ?? null;

                //Eliminar comisiones destino
                if (condicionesDestino.Length > 0)
                {
                    await ConexionBD.database.ExecuteAsync("DELETE FROM Creditos.CondicionesDetalle WHERE ProductoID = @0 AND CondicionesID = @1", productoDestino.ProductoID, parData.CondicionesDestinoID);

                }

                var condicionOrigen = await ConexionBD.database.QueryAsync<CondicionesDetalle>("WHERE ProductoID = @0 AND CondicionesID = @1 Order by DistribuidorNivelIdOri, DistribuidorNivelId, PlazosMinimos, PlazosMaximos", parData.ProductoID, parData.CondicionesID).ToArrayAsync();

                foreach (var item in condicionOrigen)
                {

                    var CondicionLast = await ConexionBD.database.QueryAsync<CondicionesDetalle>("WHERE ProductoID=@0 AND CondicionesID=@1 ORDER BY RenglonId DESC", productoDestino.ProductoID , productoDestino.CondicionesID).FirstOrDefaultAsync();
                    int RenglonId;
                    try
                    {
                        RenglonId = CondicionLast.RenglonId;
                    }
                    catch (Exception)
                    {
                        RenglonId = 0;
                    }

                    var insertDestino = new CondicionesDetalle
                    {
                        ProductoID = productoDestino.ProductoID,
                        CondicionesID = productoDestino.CondicionesID,
                        RenglonId = RenglonId + 1,
                        DistribuidorNivelId = item.DistribuidorNivelId,
                        DistribuidorNivelIdOri = item.DistribuidorNivelIdOri,
                        Activo = item.Activo,
                        PlazosMinimos = item.PlazosMinimos,
                        PlazosMaximos = item.PlazosMaximos,
                        ImporteMinimo = item.ImporteMinimo,
                        ImporteMaximo = item.ImporteMaximo,
                        ImporteMaximo1erCanje = item.ImporteMaximo1erCanje,
                        ImporteMaximo2doCanje = item.ImporteMaximo2doCanje,
                        PorcTasaPlazo = item.PorcTasaPlazo,
                        SeguroPlazo = item.SeguroPlazo,
                        PorcIVA = item.PorcIVA,
                        Cargo = item.Cargo,
                        ManejoCuenta = item.ManejoCuenta,
                        PlazosFijos = item.PlazosFijos,
                        PorcTasaMensual = item.PorcTasaMensual,
                        PorcTasaAnual = item.PorcTasaAnual,
                        PagoXMilMinimo = item.PagoXMilMinimo,
                        PorcCreditosActivosMax = item.PorcCreditosActivosMax,
                        PlazosEspeciales = item.PlazosEspeciales,
                        CapitalCorte = item.CapitalCorte,
                        UsuarioRegistro = item.UsuarioRegistro,
                        fhRegistro = item.fhRegistro,
                        UsuarioModifico = UsuarioActual.UsuarioID,
                        fhModificacion = DateTime.Now,
                        PersonaIDRegistro = item.PersonaIDRegistro,
                        ImporteMaximo3erCanje = item.ImporteMaximo3erCanje,
                        CostoAnualTotal = item.CostoAnualTotal,
                        ImporteMinimo1erCanje = item.ImporteMinimo1erCanje,
                        ImporteMinimo2doCanje = item.ImporteMinimo2doCanje,
                        ImporteMinimo3erCanje = item.ImporteMinimo3erCanje,
                    };
                    await ConexionBD.database.InsertAsync(insertDestino);
                }


                await ConexionBD.Destroy();

                return Ok("Se realizó el traspaso de tabuladores correctamente");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getNiveles")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetNiveles()
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<NivelesOrigen>("WHERE Activo = 1 Order by DistribuidorNivelID");
                await ConexionBD.Destroy();
                return Ok(resS);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("TraspasoTabuladorOrigen")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> TraspasoTabuladorOrigen(PeticionesRest.Creditos.Condicion.TraspasoTabuladorOrigen parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();

            try
            {
                var existCondiciones = await ConexionBD.database.QueryAsync<CondicionesDetalle>("WHERE ProductoID = @ProductoID AND CondicionesID = @CondicionesID AND DistribuidorNivelIdOri = @DistribuidorNivelID Order by DistribuidorNivelIdOri, DistribuidorNivelId, PlazosMinimos, PlazosMaximos", parData).ToArrayAsync();

                if (existCondiciones.Length == 0)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("No hay condiciones para traspasar con el nivel de origen seleccionado");
                }


                var productoDestino = await ConexionBD.database.QueryAsync<Condiciones>("WHERE CondicionesID = @CondicionesDestinoID", parData).FirstOrDefaultAsync();

                ArrayList res = new();

                foreach (var nivelDest in parData.NivelesDestinoIds)
                {
                    var condicionesDestino = await ConexionBD.database.QueryAsync<CondicionesDetalle>("WHERE ProductoID = @0 AND CondicionesID = @1 AND DistribuidorNivelIdOri = @2", productoDestino.ProductoID, parData.CondicionesDestinoID, nivelDest).ToArrayAsync();

                    //Eliminar comisiones destino
                    if (condicionesDestino.Length > 0)
                    {
                        await ConexionBD.database.ExecuteAsync("DELETE FROM Creditos.CondicionesDetalle WHERE ProductoID = @0 AND CondicionesID = @1 AND DistribuidorNivelIdOri = @2", productoDestino.ProductoID, parData.CondicionesDestinoID, nivelDest);

                    }

                    if (nivelDest > 0)
                    {
                        foreach (var item in existCondiciones)
                        {
                            var CondicionLast = await ConexionBD.database.QueryAsync<CondicionesDetalle>("WHERE ProductoID=@0 AND CondicionesID=@1 ORDER BY RenglonId DESC", productoDestino.ProductoID, parData.CondicionesDestinoID).FirstOrDefaultAsync();
                            int RenglonId;

                            try
                            {
                                RenglonId = CondicionLast.RenglonId;
                            }
                            catch (Exception)
                            {
                                RenglonId = 0;
                            }

                            var insertDestino = new CondicionesDetalle
                            {
                                ProductoID = productoDestino.ProductoID,
                                CondicionesID = parData.CondicionesDestinoID,
                                RenglonId = RenglonId + 1,
                                DistribuidorNivelId = item.DistribuidorNivelId,
                                DistribuidorNivelIdOri = nivelDest,
                                Activo = item.Activo,
                                PlazosMinimos = item.PlazosMinimos,
                                PlazosMaximos = item.PlazosMaximos,
                                ImporteMinimo = item.ImporteMinimo,
                                ImporteMaximo = item.ImporteMaximo,
                                ImporteMaximo1erCanje = item.ImporteMaximo1erCanje,
                                ImporteMaximo2doCanje = item.ImporteMaximo2doCanje,
                                PorcTasaPlazo = item.PorcTasaPlazo,
                                SeguroPlazo = item.SeguroPlazo,
                                PorcIVA = item.PorcIVA,
                                Cargo = item.Cargo,
                                ManejoCuenta = item.ManejoCuenta,
                                PlazosFijos = item.PlazosFijos,
                                PorcTasaMensual = item.PorcTasaMensual,
                                PorcTasaAnual = item.PorcTasaAnual,
                                PagoXMilMinimo = item.PagoXMilMinimo,
                                PorcCreditosActivosMax = item.PorcCreditosActivosMax,
                                PlazosEspeciales = item.PlazosEspeciales,
                                CapitalCorte = item.CapitalCorte,
                                UsuarioRegistro = item.UsuarioRegistro,
                                fhRegistro = item.fhRegistro,
                                UsuarioModifico = UsuarioActual.UsuarioID,
                                fhModificacion = DateTime.Now,
                                PersonaIDRegistro = item.PersonaIDRegistro,
                                ImporteMaximo3erCanje = item.ImporteMaximo3erCanje,
                                CostoAnualTotal = item.CostoAnualTotal,
                                ImporteMinimo1erCanje = item.ImporteMinimo1erCanje,
                                ImporteMinimo2doCanje = item.ImporteMinimo2doCanje,
                                ImporteMinimo3erCanje = item.ImporteMinimo3erCanje,
                            };
                            await ConexionBD.database.InsertAsync(insertDestino);
                        }
                    }
                }

                await ConexionBD.Destroy();

                return Ok("Se realizó el traspaso de tabuladores por nivel de origen correctamente");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }
    }
}
