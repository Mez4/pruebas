using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Seguridad;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NPoco;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using DBContext.DBConfia.IntegracionKeycloak;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class ComisionController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public ComisionController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Comision.Get parData)
        {
            if (parData.ProductoID != 0 && parData.ComisionesID != 0)
            {
                try
                {
                    var Comision = await ConexionBD.database.SingleByIdAsync<Comisiones>((parData.ProductoID, parData.ComisionesID));
                    var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(Comision.ProductoID);
                    var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.RegistroUsuarioId).FirstOrDefaultAsync();
                    var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.ModificaUsuarioId).FirstOrDefaultAsync();
                    var ComisionesSucursal = await ConexionBD.database.FetchAsync<ComisionesSucursal>("Where ProductoID = @ProductoID AND ComisionesID = @ComisionesID", Comision);
                    var Convenio = await ConexionBD.database.QueryAsync<ComisionesConvenios_VW>("WHERE (ProductoID = @ProductoID) AND (ComisionesID = @ComisionesID)", Comision).FirstOrDefaultAsync();

                    List<int> SucursalesIds = new();

                    foreach (var s in ComisionesSucursal)
                    {
                        SucursalesIds.Add(s.SucursalId);
                    }

                    int ConvenioID = 0;
                    string convenio = "";
                    string DescConv = "";

                    if (Convenio is not null)
                    {
                        ConvenioID = Convenio.ConvenioID;
                        convenio = Convenio.convenio;
                        DescConv = Convenio.descripcion;
                    }

                    var res = new
                    {
                        Comision.ProductoID,
                        Comision.ComisionesID,
                        Comision.Descripcion,
                        Comision.Activo,
                        ConvenioID,
                        convenio,
                        DescConv,
                        RegistroFecha = Comision.RegistroFecha.ToString("dd/MM/yyyy"),
                        Comision.RegistroUsuarioId,
                        ModificoFecha = Comision.ModificaFecha.ToString("dd/MM/yyyy"),
                        Comision.ModificaUsuarioId,
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
                        },
                        SucursalesIds
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
                    var Comisiones = await ConexionBD.database.FetchAsync<Comisiones_VW>();
                    var Productos = await ConexionBD.database.FetchAsync<Productos>();

                    ArrayList res = new();

                    foreach (var Comision in Comisiones)
                    {
                        var Producto = Productos.Where(x => x.ProductoID == Comision.ProductoID).FirstOrDefault();
                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.RegistroUsuarioId).FirstOrDefaultAsync();
                        var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.ModificaUsuarioId).FirstOrDefaultAsync();
                        var ComisionesSucursal = await ConexionBD.database.FetchAsync<ComisionesSucursal>("Where ProductoID = @ProductoID AND ComisionesID = @ComisionesID", Comision);
                        var Convenio = await ConexionBD.database.QueryAsync<ComisionesConvenios_VW>("WHERE (ProductoID = @ProductoID) AND (ComisionesID = @ComisionesID)", Comision).FirstOrDefaultAsync();

                        List<int> SucursalesIds = new();

                        foreach (var s in ComisionesSucursal)
                        {
                            SucursalesIds.Add(s.SucursalId);
                        }

                        int ConvenioID = 0;
                        string convenio = "";
                        string DescConv = "";

                        if (Convenio is not null)
                        {
                            ConvenioID = Convenio.ConvenioID;
                            convenio = Convenio.convenio;
                            DescConv = Convenio.descripcion;
                        }

                        res.Add(new
                        {
                            Comision.identifier,
                            Comision.ProductoID,
                            Comision.ComisionesID,
                            Comision.Descripcion,
                            Comision.Activo,
                            ConvenioID,
                            convenio,
                            DescConv,
                            RegistroFecha = Comision.RegistroFecha.ToString("dd/MM/yyyy"),
                            Comision.RegistroUsuarioId,
                            ModificoFecha = Comision.ModificaFecha.ToString("dd/MM/yyyy"),
                            Comision.ModificaUsuarioId,
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
                            },
                            SucursalesIds
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
        [Route("getByProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetByProducto(PeticionesRest.Creditos.Comision.Get parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<Comisiones>("WHERE  (ProductoID = @ProductoID)", parData);
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
        [Route("getComisionesFiltro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByProducto(PeticionesRest.Creditos.Comision.GetCondicionesFiltro parData)
        {
            try
            {
                if (parData.ProductoID != 0)
                {
                    try
                    {
                        var res2 = await ConexionBD.database.FetchAsync<Comisiones>("WHERE ProductoID = @ProductoID", parData);
                        await ConexionBD.Destroy();
                        return Ok(res2);
                    }
                    catch (Exception ex)
                    {
                        await ConexionBD.Destroy();
                        return NotFound(ex.Message);
                    }
                }

                var res = await ConexionBD.database.FetchAsync<Comisiones>();
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
        public async Task<IActionResult> Add(PeticionesRest.Creditos.Comision.Add parData)
        {
            try
            {
                //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var ComisionLast = await ConexionBD.database.QueryAsync<Comisiones>("ORDER BY ComisionesID DESC", parData).FirstOrDefaultAsync();

                var est = TimeZoneInfo.FindSystemTimeZoneById("Tokyo Standard Time");
                DateTimeOffset targetTime = TimeZoneInfo.ConvertTime(DateTime.Now, est);

                var Comision = new Comisiones()
                {
                    ProductoID = parData.ProductoID,
                    ComisionesID = ComisionLast.ComisionesID + 1,
                    Descripcion = parData.Descripcion,
                    Activo = parData.Activo,
                    RegistroFecha = DateTime.Now,
                    RegistroUsuarioId = UsuarioActual.UsuarioID,
                    ModificaFecha = DateTime.Now,
                    ModificaUsuarioId = UsuarioActual.UsuarioID
                };

                await ConexionBD.database.InsertAsync(Comision);

                var Convenio = new ComisionesConvenios()
                {
                    ProductoID = parData.ProductoID,
                    ComisionesID = Comision.ComisionesID,
                    ConvenioID = parData.ConvenioID,
                    Activo = parData.Activo,
                    RegistroFecha = DateTime.Now,
                    PersonaIDRegistro = (long)UsuarioActual.UsuarioID,
                    RegistroUsuarioId = UsuarioActual.UsuarioID,
                    ModificaFecha = DateTime.Now,
                    ModificaUsuarioId = UsuarioActual.UsuarioID
                };

                await ConexionBD.database.InsertAsync(Convenio);

                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(Comision.ProductoID);

                var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.RegistroUsuarioId).FirstOrDefaultAsync();
                var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.ModificaUsuarioId).FirstOrDefaultAsync();

                var ComisionesSucursal = await ConexionBD.database.FetchAsync<ComisionesSucursal>("Where ProductoID = @ProductoID AND ComisionesID = @ComisionesID", Comision);

                var ConvenioRes = await ConexionBD.database.QueryAsync<ComisionesConvenios_VW>("WHERE (ProductoID = @ProductoID) AND (ComisionesID = @ComisionesID)", Comision).FirstOrDefaultAsync();

                List<int> SucursalesIds = new();

                foreach (var s in ComisionesSucursal)
                {
                    SucursalesIds.Add(s.SucursalId);
                }

                int ConvenioID = 0;
                string convenio = "";
                string DescConv = "";

                if (Convenio is not null)
                {
                    ConvenioID = Convenio.ConvenioID;
                    convenio = "N/A";
                    DescConv = "N/A";
                }

                var res = new
                {
                    Comision.ProductoID,
                    Comision.ComisionesID,
                    Comision.Descripcion,
                    Comision.Activo,
                    ConvenioID,
                    convenio,
                    DescConv,
                    RegistroFecha = Comision.RegistroFecha.ToString("dd/MM/yyyy"),
                    Comision.RegistroUsuarioId,
                    ModificoFecha = Comision.ModificaFecha.ToString("dd/MM/yyyy"),
                    Comision.ModificaUsuarioId,
                    Producto,
                    UsuarioRegistro = new
                    {
                        UsuarioRegistro.UsuarioID,
                        UsuarioRegistro.Usuario,
                        UsuarioRegistro.Nombre
                    },
                    UsuarioModifico = new
                    {
                        UsuarioModifico.UsuarioID,
                        UsuarioModifico.Usuario,
                        UsuarioModifico.Nombre
                    },
                    SucursalesIds
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
        public async Task<IActionResult> Update(PeticionesRest.Creditos.Comision.Update parData)
        {
            try
            {
                //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionDB.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                //var Condicion = await DBContext.database.QueryAsync<Condiciones>("WHERE CondicionesID = @CondicionesID", parData).FirstOrDefaultAsync();
                var Comision = await ConexionBD.database.SingleByIdAsync<Comisiones>(new { parData.ProductoID, parData.ComisionesID });
                //Condicion.ProductoID = parData.ProductoID;
                Comision.Descripcion = parData.Descripcion;
                Comision.Activo = parData.Activo;
                Comision.ModificaFecha = DateTime.Now;
                Comision.ModificaUsuarioId = UsuarioActual.UsuarioID;

                await ConexionBD.database.UpdateAsync(Comision);

                var Convenio = await ConexionBD.database.SingleByIdAsync<ComisionesConvenios>(new { Comision.ProductoID, Comision.ComisionesID });

                if (Convenio != null)
                {
                    Convenio.ConvenioID = parData.ConvenioID;
                    Convenio.Activo = parData.Activo;
                    Convenio.ModificaFecha = DateTime.Now;
                    Convenio.ModificaUsuarioId = UsuarioActual.UsuarioID;

                    await ConexionBD.database.UpdateAsync(Convenio);
                }
                else
                {
                    Convenio = new ComisionesConvenios()
                    {
                        ProductoID = parData.ProductoID,
                        ComisionesID = Comision.ComisionesID,
                        ConvenioID = parData.ConvenioID,
                        Activo = parData.Activo,
                        RegistroFecha = DateTime.Now,
                        RegistroUsuarioId = UsuarioActual.UsuarioID,
                        ModificaFecha = DateTime.Now,
                        PersonaIDRegistro = (long)UsuarioActual.UsuarioID,
                        ModificaUsuarioId = UsuarioActual.UsuarioID
                    };

                    await ConexionBD.database.InsertAsync(Convenio);
                }


                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(Comision.ProductoID);

                var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.RegistroUsuarioId).FirstOrDefaultAsync();

                var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.ModificaUsuarioId).FirstOrDefaultAsync();

                var ComisionesSucursal = await ConexionBD.database.FetchAsync<ComisionesSucursal>("Where ProductoID = @ProductoID AND ComisionesID = @ComisionesID", Comision);

                var ConvenioRes = await ConexionBD.database.QueryAsync<ComisionesConvenios_VW>("WHERE (ProductoID = @ProductoID) AND (ComisionesID = @ComisionesID)", Comision).FirstOrDefaultAsync();

                List<int> SucursalesIds = new();

                foreach (var s in ComisionesSucursal)
                {
                    SucursalesIds.Add(s.SucursalId);
                }

                int ConvenioID = 0;
                string convenio = "";
                string DescConv = "";

                if (Convenio is not null)
                {
                    ConvenioID = Convenio.ConvenioID;
                    convenio = ConvenioRes.convenio;
                    DescConv = ConvenioRes.descripcion;
                }

                var res = new
                {
                    Comision.ProductoID,
                    Comision.ComisionesID,
                    Comision.Descripcion,
                    Comision.Activo,
                    ConvenioID,
                    convenio,
                    DescConv,
                    RegistroFecha = Comision.RegistroFecha.ToString("dd/MM/yyyy"),
                    Comision.RegistroUsuarioId,
                    ModificoFecha = Comision.ModificaFecha.ToString("dd/MM/yyyy"),
                    Comision.ModificaUsuarioId,
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
                    },
                    SucursalesIds
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
        [Route("getComisiones")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetComisiones()
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<Comisiones_VW>();
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
        [Route("getComisionesOrigenNivel")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetComisionesOrigenNivel()
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<Comisiones_VW>();
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
        [Route("getComisionOrigen")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetComisionOrigen(PeticionesRest.Creditos.Comision.Get parData)
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<Comisiones_VW>("WHERE ComisionesID = @0 AND ProductoID = @1", parData.ComisionesID , parData.ProductoID);
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
        [Route("getComisionOrigenNivel")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetComisionOrigenNivel(PeticionesRest.Creditos.Comision.Get parData)
        {
            try
            {
                var resS = await ConexionBD.database.FetchAsync<Comisiones_VW>("WHERE ComisionesID = @0 AND ProductoID = @1", parData.ComisionesID , parData.ProductoID);
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
        [Route("TraspasoTabulador")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> TraspasoTabulador(PeticionesRest.Creditos.Comision.TraspasoTabulador parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();
            try
            {
            var productoOrigen = await ConexionBD.database.QueryAsync<Comisiones_VW>("WHERE ComisionesID = @0 AND ProductoID = @1", parData.ComisionesID , parData.ProductoID).FirstOrDefaultAsync();
                // if (parData.ComisionesID == parData.ComisionesDestinoID)
                
                if (productoOrigen.identifier == parData.ComisionesDestinoID)
                {
                    await ConexionBD.Destroy();
                    // return BadRequest("Las Comisiones Deben Ser Diferentes");
                    return BadRequest (new {
                        status = false,
                        msj  = "Las Comisiones Deben Ser Diferentes"
                    });
                    
                }
                //  var productoDestino = await ConexionBD.database.QueryAsync<Comisiones>("WHERE ComisionesID = @ComisionesDestinoID", parData).FirstOrDefaultAsync();
                // var comisionesDestino = await ConexionBD.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID = @0 AND ComisionesID = @1", productoDestino.ProductoID, parData.ComisionesDestinoID).ToArrayAsync();
                
                var productoDestino = await ConexionBD.database.QueryAsync<Comisiones_VW>("WHERE identifier = @ComisionesDestinoID", parData).FirstOrDefaultAsync();
                var comisionesDestino = await ConexionBD.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID = @0 AND ComisionesID = @1", productoDestino.ProductoID,productoDestino.ComisionesID).ToArrayAsync() ?? null;
                //Eliminar comisiones destino
                if (comisionesDestino != null)
                {
                    await ConexionBD.database.ExecuteAsync("DELETE FROM Creditos.ComisionesDetalle WHERE ProductoID = @0 AND ComisionesID = @1", productoDestino.ProductoID, productoDestino.ComisionesID);

                }

                var comisionOrigen = await ConexionBD.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID = @0 AND ComisionesID = @1 Order by DistribuidorNivelIDOrigen, DistribuidorNivelID, DiasMin, DiasMax", parData.ProductoID, parData.ComisionesID).ToArrayAsync();
                foreach (var item in comisionOrigen)
                {
                    // var ComisionLast = await ConexionBD.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID=@ProductoID AND ComisionesID=@ComisionesDestinoID ORDER BY RenglonId DESC", parData).FirstOrDefaultAsync();
                    var ComisionLast = await ConexionBD.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID=@0 AND ComisionesID=@1 ORDER BY RenglonId DESC", productoDestino.ProductoID, productoDestino.ComisionesID).FirstOrDefaultAsync() ?? null;

                    int RenglonId;
                    try
                    {
                        RenglonId = ComisionLast.RenglonId;
                    }
                    catch (Exception)
                    {
                        RenglonId = 0;
                    }
                    var insertDestino = new ComisionesDetalle
                    {
                        ProductoID = productoDestino.ProductoID,
                        ComisionesID = productoDestino.ComisionesID,
                        RenglonId = RenglonId + 1,
                        DistribuidorNivelID = item.DistribuidorNivelID,
                        DistribuidorNivelIDOrigen = item.DistribuidorNivelIDOrigen,
                        Activo = item.Activo,
                        DiasMin = item.DiasMin,
                        DiasMax = item.DiasMax,
                        PorcComision = item.PorcComision,
                        PorcComisionReal = item.PorcComisionReal,
                        porcMonedero = item.porcMonedero,
                        porcMonederoReal = item.porcMonederoReal,
                        RegistroUsuarioId = item.RegistroUsuarioId,
                        fhRegitro = item.fhRegitro,
                        PersonaIDRegistro = item.PersonaIDRegistro,
                        ModificaUsuarioId = UsuarioActual.UsuarioID,
                        fhMoficiacion = DateTime.Now,
                        DistribuidorNivelID2 = item.DistribuidorNivelID2,
                    };
                    await ConexionBD.database.InsertAsync(insertDestino);
                }


                await ConexionBD.Destroy();

                return Ok("Se realizó el traspaso de tabuladores correctamente");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest (new {
                    status = false,
                    msj  = "Hubo un problema al traspasar la comision, intente mas tarde!",
                    err = ex.Message
                });
                // return BadRequest(ex.Message);
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
        [Route("getNivelesDestino")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetNivelesDestino()
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
        public async Task<IActionResult> TraspasoTabuladorOrigen(PeticionesRest.Creditos.Comision.TraspasoTabuladorOrigen parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();

            try
            {
                var existComisiones = await ConexionBD.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID = @ProductoID AND ComisionesID = @ComisionesID AND DistribuidorNivelIDOrigen = @DistribuidorNivelID Order by DistribuidorNivelIDOrigen, DistribuidorNivelID, DiasMin, DiasMax", parData).ToArrayAsync();

                if (existComisiones.Length == 0)
                {
                    await ConexionBD.Destroy();
                    // return BadRequest("No hay comisiones para traspasar con el nivel de origen seleccionado");
                    return BadRequest (new {
                        status = false,
                        msj  = "No hay comisiones para traspasar con el nivel de origen seleccionado"
                    });
                }


                var productoDestino = await ConexionBD.database.QueryAsync<Comisiones_VW>("WHERE identifier = @ComisionesDestinoID", parData).FirstOrDefaultAsync();

                ArrayList res = new();

                foreach (var nivelDest in parData.NivelesDestinoIds)
                {


                    var comisionesDestino = await ConexionBD.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID = @0 AND ComisionesID = @1 AND DistribuidorNivelIDOrigen = @2", productoDestino.ProductoID, productoDestino.ComisionesID, nivelDest).ToArrayAsync();

                    //Eliminar comisiones destino
                    if (comisionesDestino.Length > 0)
                    {
                        await ConexionBD.database.ExecuteAsync("DELETE FROM Creditos.ComisionesDetalle WHERE ProductoID = @0 AND ComisionesID = @1 AND DistribuidorNivelIDOrigen = @2", productoDestino.ProductoID, productoDestino.ComisionesID, nivelDest);

                    }

                    if (nivelDest > 0)
                    {
                        foreach (var item in existComisiones)
                        {
                            var ComisionLast = await ConexionBD.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID=@0 AND ComisionesID=@1 ORDER BY RenglonId DESC", productoDestino.ProductoID, productoDestino.ComisionesID).FirstOrDefaultAsync() ?? null;
                            int RenglonId;

                            try
                            {
                                RenglonId = ComisionLast.RenglonId;
                            }
                            catch (Exception)
                            {
                                RenglonId = 0;
                            }

                            var insertDestino = new ComisionesDetalle
                            {
                                ProductoID = productoDestino.ProductoID,
                                ComisionesID = productoDestino.ComisionesID,
                                RenglonId = RenglonId + 1,
                                DistribuidorNivelID = item.DistribuidorNivelID,
                                DistribuidorNivelIDOrigen = nivelDest,
                                Activo = item.Activo,
                                DiasMin = item.DiasMin,
                                DiasMax = item.DiasMax,
                                PorcComision = item.PorcComision,
                                PorcComisionReal = item.PorcComisionReal,
                                porcMonedero = item.porcMonedero,
                                porcMonederoReal = item.porcMonederoReal,
                                RegistroUsuarioId = item.RegistroUsuarioId,
                                fhRegitro = item.fhRegitro,
                                PersonaIDRegistro = item.PersonaIDRegistro,
                                ModificaUsuarioId = UsuarioActual.UsuarioID,
                                fhMoficiacion = DateTime.Now,
                                DistribuidorNivelID2 = item.DistribuidorNivelID2,
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
                return BadRequest (new {
                    status = false,
                    msj  = "Hubo un problema al traspasar la comision por origen, intente mas tarde!",
                    err = ex.Message
                });
                // return BadRequest(ex.Message);
                
            }
        }
    }
}
