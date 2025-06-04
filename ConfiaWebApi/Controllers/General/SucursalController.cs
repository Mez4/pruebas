using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Tesoreria;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class SucursalController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public SucursalController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.General.Sucursal.Get parData)
        {
            if (parData.ZonaID != 0)
            {
                try
                {
                    var resZ = await DBContext.database.FetchAsync<Sucursales_VW>("WHERE (SucursalID=@0 OR @0=0) AND (ZonaID=@1)", parData.SucursalID, parData.ZonaID);
                    await DBContext.Destroy();
                    return Ok(resZ);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.SucursalID != 0)
            {
                try
                {
                    var resS = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID=@0", parData.SucursalID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.ProductoID != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<SucursalesProductos_VW>("WHERE  (ProductoID = @0)", parData.ProductoID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var Sucursales = await DBContext.database.FetchAsync<Sucursales_VW>();

            ArrayList res = new();

            foreach (var Sucursal in Sucursales)
            {

                var Productos = await DBContext.database.FetchAsync<SucursalProductos_VW>("WHERE SucursalID=@0", Sucursal.SucursalID);

                List<int> ProductosIds = new();

                foreach (var Producto in Productos)
                {
                    ProductosIds.Add(Producto.ProductoID);
                }

                res.Add(new
                {
                    Sucursal.SucursalID,
                    Sucursal.Nombre,
                    Sucursal.distribuidorIdMin,
                    Sucursal.distribuidorIdMax,
                    Sucursal.importeLimiteCreditoDefault,
                    Sucursal.tabuladorTipoID,
                    Sucursal.ZonaID,
                    Sucursal.ZonaNombre,
                    Sucursal.SucursalFisica,
                    Sucursal.SucursalFisicaID,
                    Sucursal.tabuladorTipoDesc,
                    Productos,
                    ProductosIds,
                    Sucursal.PersonaResponsableID,
                    Sucursal.NombreCompleto,
                    Sucursal.id_sucursal,
                    Sucursal.id_origen,
                    Sucursal.id_empresa,
                    Sucursal.sistema
                    //Sucursal.ConvenioID
                    //Se deja pendiente para posterior insercion,pues aun no se encuentra disponible en la vista
                    //Sucursal.PermisoRangoFechas
                });
            }

            await DBContext.Destroy();
            return Ok(res);

        }

        [HttpPost]
        [Route("getprod")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProd(PeticionesRest.General.Sucursal.Get parData)
        {
            if (parData.ProductoID != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<SucursalesProductos_VW>("WHERE  (ProductoID = @0)", parData.ProductoID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.ZonaID != 0)
            {
                try
                {
                    var resZ = await DBContext.database.FetchAsync<Sucursales_VW>("WHERE (SucursalID=@0 OR @0=0) AND (ZonaID=@1)", parData.SucursalID, parData.ZonaID);
                    await DBContext.Destroy();
                    return Ok(resZ);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.SucursalID != 0)
            {
                try
                {
                    var resS = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID=@0", parData.SucursalID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var Sucursales = await DBContext.database.FetchAsync<Sucursales_VW>();

            ArrayList res = new();

            foreach (var Sucursal in Sucursales)
            {

                var Productos = await DBContext.database.FetchAsync<SucursalProductos_VW>("WHERE SucursalID=@0", Sucursal.SucursalID);

                List<int> ProductosIds = new();

                foreach (var Producto in Productos)
                {
                    ProductosIds.Add(Producto.ProductoID);
                }

                res.Add(new
                {
                    Sucursal.SucursalID,
                    Sucursal.Nombre,
                    Sucursal.distribuidorIdMin,
                    Sucursal.distribuidorIdMax,
                    Sucursal.importeLimiteCreditoDefault,
                    Sucursal.tabuladorTipoID,
                    Sucursal.ZonaID,
                    Sucursal.ZonaNombre,
                    Sucursal.SucursalFisica,
                    Sucursal.SucursalFisicaID,
                    Sucursal.tabuladorTipoDesc,
                    Productos,
                    ProductosIds,
                    Sucursal.PersonaResponsableID,
                    Sucursal.NombreCompleto,
                    // Sucursal.PermisoRangoFechas
                });
            }

            await DBContext.Destroy();
            return Ok(res);

        }

        [HttpPost]
        [Route("getSucursalOrigen")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetSucursalOrigen()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<SucursalesOrigen_VW>();
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
        [Route("getById/{SucursalID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetById(int SucursalID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<Sucursales>("WHERE SucursalID = @0", SucursalID).FirstOrDefaultAsync();
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
        [Route("add")]
        [Authorize]
        // [Code.TProteccionAdmin]
        public async Task<IActionResult> Add(PeticionesRest.General.Sucursal.Add parData)
        {
            try
            {
                var sucOrigen = await DBContext.database.QueryAsync<SucursalesOrigen_VW>("WHERE SucursalOrigenID= @0", parData.SucursalOrigenID).SingleOrDefaultAsync();

                var sucursal = new Sucursales()
                {
                    Nombre = parData.Nombre,
                    distribuidorIdMin = parData.distribuidorIdMin,
                    distribuidorIdMax = parData.distribuidorIdMax,
                    importeLimiteCreditoDefault = parData.importeLimiteCreditoDefault,
                    tabuladorTipoID = parData.tabuladorTipoID,
                    ZonaID = parData.ZonaID,
                    SucursalFisicaID = parData.SucursalFisicaID,
                    PersonaResponsableID = parData.PersonaResponsableID,
                    PermisoRangoFechas = parData.PermisoRangoFecha,
                    id_origen = sucOrigen.id_origen,
                    id_sucursal = sucOrigen.id_sucursal,
                    id_empresa = sucOrigen.id_empresa,
                    CreacionFecha = DateTime.Now,
                    sistema = sucOrigen.sistema
                };

                await DBContext.database.InsertAsync(sucursal);

                foreach (var ProductoID in parData.ProductosIds)
                {
                    var SucursalProducto = new SucursalProductos()
                    {
                        SucursalID = sucursal.SucursalID,
                        ProductoID = ProductoID,
                        Activo = true
                    };

                    await DBContext.database.InsertAsync(SucursalProducto);

                }

                var Productos = await DBContext.database.FetchAsync<SucursalProductos_VW>("WHERE SucursalID=@0", sucursal.SucursalID);
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                List<int> ProductosIds = new();

                foreach (var Producto in Productos)
                {
                    ProductosIds.Add(Producto.ProductoID);

                    var Grupos = new Grupos()
                    {
                        ProductoID = Producto.ProductoID,
                        SucursalID = sucursal.SucursalID,
                        CoordinadorID = parData.PersonaResponsableID,
                        Estatus = true,
                        ClasificadorGrupoID = 1,
                        UsuarioCreoID = UsuarioActual.UsuarioID,
                        FechaCreacion = DateTime.Now
                    };
                    await DBContext.database.InsertAsync(Grupos);
                }


                var Sucursal = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID=@0", sucursal.SucursalID).SingleOrDefaultAsync();

                var res = new
                {
                    Sucursal.SucursalID,
                    Sucursal.Nombre,
                    Sucursal.distribuidorIdMin,
                    Sucursal.distribuidorIdMax,
                    Sucursal.importeLimiteCreditoDefault,
                    Sucursal.tabuladorTipoID,
                    Sucursal.ZonaID,
                    Sucursal.ZonaNombre,
                    Sucursal.SucursalFisica,
                    Sucursal.SucursalFisicaID,
                    Sucursal.tabuladorTipoDesc,
                    Productos,
                    ProductosIds,
                    Sucursal.PersonaResponsableID,
                    Sucursal.NombreCompleto,
                    Sucursal.id_sucursal,
                    Sucursal.id_empresa,
                    Sucursal.sistema,
                    Sucursal.id_origen
                    // Sucursal.PermisoRangoFechas

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

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Update(PeticionesRest.General.Sucursal.Update parData)
        {
            try
            {
                var sucOrigen = await DBContext.database.QueryAsync<SucursalesOrigen_VW>("WHERE SucursalOrigenID = @0", parData.SucursalOrigenID).FirstOrDefaultAsync();

                var sucursal = await DBContext.database.SingleByIdAsync<Sucursales>(parData.SucursalID);
                sucursal.Nombre = parData.Nombre;
                sucursal.distribuidorIdMin = parData.distribuidorIdMin;
                sucursal.distribuidorIdMax = parData.distribuidorIdMax;
                sucursal.importeLimiteCreditoDefault = parData.importeLimiteCreditoDefault;
                sucursal.tabuladorTipoID = parData.tabuladorTipoID;
                sucursal.ZonaID = parData.ZonaID;
                sucursal.SucursalFisicaID = parData.SucursalFisicaID;
                sucursal.PersonaResponsableID = parData.PersonaResponsableID;
                sucursal.PermisoRangoFechas = parData.PermisoRangoFecha;
                sucursal.id_origen = sucOrigen.id_origen;
                sucursal.id_sucursal = sucOrigen.id_sucursal;
                sucursal.id_empresa = sucOrigen.id_empresa;
                sucursal.sistema = sucOrigen.sistema;



                await DBContext.database.UpdateAsync(sucursal);

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                foreach (var ProductoID in parData.ProductosIds)
                {
                    var Producto = await DBContext.database.SingleOrDefaultByIdAsync<SucursalProductos>(new { sucursal.SucursalID, ProductoID });

                    if (Producto == null)
                    {
                        var SucursalProducto = new SucursalProductos()
                        {
                            SucursalID = sucursal.SucursalID,
                            ProductoID = ProductoID,
                            Activo = true
                        };

                        await DBContext.database.InsertAsync(SucursalProducto);

                        var Grupos = new Grupos()
                        {
                            ProductoID = ProductoID,
                            SucursalID = sucursal.SucursalID,
                            CoordinadorID = parData.PersonaResponsableID,
                            Estatus = true,
                            ClasificadorGrupoID = 1,
                            UsuarioCreoID = UsuarioActual.UsuarioID,
                            FechaCreacion = DateTime.Now
                        };
                        await DBContext.database.InsertAsync(Grupos);
                    }
                }

                var Productos = await DBContext.database.FetchAsync<SucursalProductos_VW>("WHERE SucursalID=@0", sucursal.SucursalID);

                List<int> ProductosIds = new();

                foreach (var Producto in Productos)
                {
                    ProductosIds.Add(Producto.ProductoID);
                }

                var Sucursal = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID=@0", sucursal.SucursalID).SingleOrDefaultAsync();

                var res = new
                {
                    Sucursal.SucursalID,
                    Sucursal.Nombre,
                    Sucursal.distribuidorIdMin,
                    Sucursal.distribuidorIdMax,
                    Sucursal.importeLimiteCreditoDefault,
                    Sucursal.tabuladorTipoID,
                    Sucursal.ZonaID,
                    Sucursal.ZonaNombre,
                    Sucursal.SucursalFisica,
                    Sucursal.SucursalFisicaID,
                    Sucursal.tabuladorTipoDesc,
                    Productos,
                    ProductosIds,
                    Sucursal.PersonaResponsableID,
                    Sucursal.NombreCompleto,
                    Sucursal.id_sucursal,
                    Sucursal.id_empresa,
                    Sucursal.sistema,

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

        [HttpPost]
        [Route("updatecontrato")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> UpdateContrato(PeticionesRest.General.Sucursal.UpdateContrato parData)
        {
            try
            {
                var SucursalProducto = await DBContext.database.SingleOrDefaultByIdAsync<SucursalProductos>(new { parData.SucursalID, parData.ProductoID });

                SucursalProducto.ContratoCIE = parData.ContratoCIE;

                await DBContext.database.UpdateAsync(SucursalProducto);

                var Productos = await DBContext.database.FetchAsync<SucursalProductos_VW>("WHERE SucursalID=@0", SucursalProducto.SucursalID);

                List<int> ProductosIds = new();

                foreach (var Producto in Productos)
                {
                    ProductosIds.Add(Producto.ProductoID);
                }

                var Sucursal = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID=@0", SucursalProducto.SucursalID).SingleOrDefaultAsync();

                var res = new
                {
                    Sucursal.SucursalID,
                    Sucursal.Nombre,
                    Sucursal.distribuidorIdMin,
                    Sucursal.distribuidorIdMax,
                    Sucursal.importeLimiteCreditoDefault,
                    Sucursal.tabuladorTipoID,
                    Sucursal.ZonaID,
                    Sucursal.ZonaNombre,
                    Sucursal.SucursalFisica,
                    Sucursal.SucursalFisicaID,
                    Sucursal.tabuladorTipoDesc,
                    Productos,
                    ProductosIds
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

        [HttpPost]
        [Route("getbycaja")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByCaja(PeticionesRest.General.Sucursal.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var Usuario = await DBContext.database.QueryAsync<UsuariosVW>("WHERE  (Usuario = @0)", UserName).FirstOrDefaultAsync();
                var Cajas = await DBContext.database.QueryAsync<CatalogoCajas>("WHERE (UsuarioID = @0) AND (Estatus = 1)", Usuario.UsuarioID).FirstOrDefaultAsync();

                var res = await DBContext.database.FetchAsync<SucursalesProductos_VW>("WHERE (ProductoID = @0) AND (SucursalID = @1)", producto, Cajas.SucursalID);
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
        [Route("GetByEmpresaDistribuidor")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByEmpresaDistribuidor(PeticionesRest.General.Sucursal.Get parData)
        {
            try
            {
                var Producto = await DBContext.database.QueryAsync<Productos>("WHERE (ProductoID = @ProductoID)", parData).FirstOrDefaultAsync();
                parData.EmpresaId = (Producto != null) ? Producto.EmpresaId : 0;

                var res = await DBContext.database.FetchAsync<SucursalDistribuidores_VW>("WHERE (EmpresaId = @EmpresaId) AND (DistribuidorID = @DistribuidorID)", parData);
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
        [Route("GetByEmpresaDistribuidorProd")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByEmpresaDistribuidorProd(PeticionesRest.General.Sucursal.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                if (parData.ProductoID == 0)
                    parData.ProductoID = producto;

                var Producto = await DBContext.database.QueryAsync<Productos>("WHERE (ProductoID = @ProductoID)", parData).FirstOrDefaultAsync();
                parData.EmpresaId = (Producto != null) ? Producto.EmpresaId : 0;

                var res = await DBContext.database.FetchAsync<SucursalDistribuidores_VW>("WHERE (EmpresaId = @EmpresaId) AND (DistribuidorID = @DistribuidorID)", parData);
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
        [Route("getAux")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAux(PeticionesRest.General.Sucursal.Get parData)
        {
            if (parData.ZonaID != 0)
            {
                try
                {
                    var resZ = await DBContext.database.FetchAsync<Sucursales_VW>("WHERE (SucursalID=@0 OR @0=0) AND (ZonaID=@1)", parData.SucursalID, parData.ZonaID);
                    await DBContext.Destroy();
                    return Ok(resZ);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.SucursalID != 0)
            {
                try
                {
                    var resS = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID=@0", parData.SucursalID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.ProductoID != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<SucursalesProductos_VW>("WHERE  (ProductoID = @0)", parData.ProductoID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var Sucursales = await DBContext.database.FetchAsync<Sucursales_VW>();

            ArrayList res = new();

            foreach (var Sucursal in Sucursales)
            {

                var Productos = await DBContext.database.FetchAsync<SucursalProductos_VW>("WHERE SucursalID=@0", Sucursal.SucursalID);

                List<int> ProductosIds = new();

                foreach (var Producto in Productos)
                {
                    ProductosIds.Add(Producto.ProductoID);
                }

                res.Add(new
                {
                    Sucursal.SucursalID,
                    Sucursal.Nombre,
                    Sucursal.distribuidorIdMin,
                    Sucursal.distribuidorIdMax,
                    Sucursal.importeLimiteCreditoDefault,
                    Sucursal.tabuladorTipoID,
                    Sucursal.ZonaID,
                    Sucursal.ZonaNombre,
                    Sucursal.SucursalFisica,
                    Sucursal.SucursalFisicaID,
                    Sucursal.tabuladorTipoDesc,
                    Productos,
                    ProductosIds,
                    Sucursal.PersonaResponsableID,
                    Sucursal.NombreCompleto
                });
            }

            await DBContext.Destroy();
            return Ok(res);

        }

        //Obtener el ClasificadorGrupoID de la sucursal para registrar el coordinador
        [HttpPost]
        [Route("getClasificadorGrupoIDSucursal")]
        [Authorize]
        public async Task<IActionResult> getClasificadorGrupoIDSucursal(PeticionesRest.General.Sucursal.GetClasificador data)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<dynamic>("EXEC General.pa_GetClasificadorGrupoSucursal @SucursalID", data);
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
}
