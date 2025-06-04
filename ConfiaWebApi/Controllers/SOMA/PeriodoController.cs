using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Balances;



using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class PeriodoController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;
        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public PeriodoController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }
        // Obtenemos los balances
        [HttpGet]
        [Route("obtener/{Estatus}/{ProductoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener(string Estatus, int ProductoID)
        {
            try
            {

                if (Estatus == "A")
                {
                    var empresaID = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID=@0", ProductoID).FirstOrDefaultAsync();

                    var productos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE EmpresaID=@0", empresaID.EmpresaId).ToArrayAsync();

                    ArrayList res2 = new ArrayList();

                    if (productos != null)
                    {
                        foreach (var item in productos)
                        {
                            var periodos2 = "SELECT a.ProductoID, PeriodoID, a.Producto + ' P: ' + CONVERT(VARCHAR(MAX),p.numeroperiodo) + ', E:' + "
                                + "CONVERT(VARCHAR(MAX),p.ejercicio) Periodo FROM Tesoreria.Periodo2 p "
                                + "JOIN Creditos.Productos a ON p.ProductoID = a.ProductoID WHERE Estatus = @0 AND a.ProductoID = @1";

                            var resp = await ConexionBD.database.QueryAsync<PeriodosCerrados>(periodos2, Estatus, item.ProductoID).ToArrayAsync();
                            res2.AddRange(resp);

                        }
                    }

                    /*   var periodos = "SELECT a.ProductoID, PeriodoID, a.Producto + ' P: ' + CONVERT(VARCHAR(MAX),p.numeroperiodo) + ', E:' + "
                          + "CONVERT(VARCHAR(MAX),p.ejercicio) Periodo FROM Tesoreria.Periodo2 p "
                          + "JOIN Creditos.Productos a ON p.ProductoID = a.ProductoID WHERE Estatus = @0"; */

                    //var res = await ConexionBD.database.QueryAsync<PeriodosCerrados>(periodos2, Estatus).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res2);
                }
                else
                {
                    var periodosConBalance = await ConexionBD.database.QueryAsync<PeriodosConBalance>("WHERE Estatus = 'C' AND ReAbierto=0").ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(periodosConBalance);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtener2")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> Obtener2(string Estatus)
        {
            try
            {
                var periodos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.Productos>();
                await ConexionBD.Destroy();
                return Ok(periodos);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("estatusPeriodo2/{BalanceTempID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerEstatusPeriodo2(int BalanceTempID)
        {
            try
            {
                var periodos2 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.Balance2>("WHERE BalanceTempID = @0", BalanceTempID).SingleOrDefaultAsync();
                var estatusPeriodo = await ConexionBD.database.QueryAsync<Periodo2>("WHERE PeriodoID=@0", periodos2.PeriodoID).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(estatusPeriodo);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("estatusPeriodo/{PeriodoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerEstatusPeriodo(int PeriodoID)
        {
            try
            {
                var estatusPeriodo = await ConexionBD.database.QueryAsync<Periodo2>("WHERE PeriodoID=@0", PeriodoID).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(estatusPeriodo);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("inicializar-periodo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> InicializarPeriodo()
        {
            try
            {
                var nperiodo = new Periodo2();
                var periodos = await ConexionBD.database.FetchAsync<Periodo2>();
                if (periodos.Count <= 0)
                {
                    ConexionBD.database.BeginTransaction();
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    int consecutivoPeriodo = 0;

                    var agrupaciones = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.Productos>();
                    nperiodo = new Periodo2();

                    foreach (var item in agrupaciones)
                    {
                        var numeroPeriodoAnterior = await ConexionBD.database.QueryAsync<Periodo2>().OrderByDescending(t => t.PeriodoID).FirstOrDefault();
                        if (numeroPeriodoAnterior == null)
                        {
                            consecutivoPeriodo = 1;
                        }
                        else
                        {
                            consecutivoPeriodo = numeroPeriodoAnterior.NumeroPeriodo;
                        }

                        nperiodo = new Periodo2()

                        {
                            NumeroPeriodo = consecutivoPeriodo + 1,
                            FechaApertura = DateTime.Now,
                            FechaInicio = DateTime.Now,
                            DiasGracia = 0,
                            Estatus = "A",
                            ReAbierto = 0,
                            Ejercicio = DateTime.Now.ToString("yyyy"),
                            UsuarioIDApertura = UsuarioActual.UsuarioID,
                            PersonaIDApertura = (long)UsuarioActual.PersonaID,
                            ProductoID = item.ProductoID
                        };
                        await ConexionBD.database.InsertAsync(nperiodo);

                        var bitacoraCambios = new BitacoraCambios()
                        {
                            Accion = "Inicialización de periodo ID: " + nperiodo.PeriodoID + " " + nperiodo.Ejercicio,
                            Modulo = "Tesoreria",
                            PersonaID = (long)UsuarioActual.PersonaID,
                            FechaAfectacion = DateTime.Now
                        };
                        await ConexionBD.database.InsertAsync(bitacoraCambios);
                        ConexionBD.database.CompleteTransaction();
                    }
                }
                else
                {
                    ConexionBD.database.AbortTransaction();
                    await ConexionBD.Destroy();
                    return BadRequest();
                }
                await ConexionBD.Destroy();
                return Ok(nperiodo);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("find-all")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerPeriodos()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                ArrayList res = new();
                var periodos = await ConexionBD.database.FetchAsync<Periodo2>();

                foreach (var item in periodos)
                {
                    var PersonaApertura = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", item.UsuarioIDApertura).FirstOrDefaultAsync();
                    var personaCierre = "";
                    var producto = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID=@0", item.ProductoID).FirstOrDefaultAsync();

                    if (item.PersonaIDCierre == null)
                    {
                        personaCierre = "";
                    }
                    else
                    {
                        var PersonaCierre = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE PersonaID=@0", item.PersonaIDCierre).FirstOrDefaultAsync();
                        personaCierre = PersonaCierre.Nombre;
                    }

                    res.Add(new
                    {
                        item.ProductoID,
                        item.DiasGracia,
                        item.Ejercicio,
                        item.FechaApertura,
                        item.FechaCierre,
                        item.Estatus,
                        item.FechaFin,
                        item.FechaInicio,
                        item.NumeroPeriodo,
                        item.PeriodoID,
                        item.PersonaIDApertura,
                        item.ReAbierto,
                        PersonaApertura = PersonaApertura.Nombre,
                        item.PersonaIDCierre,
                        PersonaCierre = personaCierre,
                        Agrupacion = producto.Producto
                    });
                }
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
        [Route("reabrirperiodo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ReAbrirPeriodo(PeticionesRest.SOMA.Periodos.Get parData)
        {
            try
            {
                ConexionBD.database.BeginTransaction();

                var periodoSeleccionado = await ConexionBD.database.QueryAsync<Periodo2>("WHERE PeriodoID=@0", parData.PeriodoID).SingleOrDefaultAsync();
                var PersonaApertura = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", periodoSeleccionado.UsuarioIDApertura).FirstOrDefaultAsync();
                var personaCierre = "";
                var producto = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID=@0", periodoSeleccionado.ProductoID).FirstOrDefaultAsync();
                int DiasGracia = periodoSeleccionado.DiasGracia;
                int? ProductoID = periodoSeleccionado.ProductoID;
                var periodosAbiertos = await ConexionBD.database.QueryAsync<Periodo2>("WHERE ProductoID=@1 AND Estatus='A'", parData.PeriodoID, ProductoID).ToArrayAsync();
                int d3 = (int)(DateTime.Now - periodoSeleccionado.FechaCierre.Value).TotalDays;
                int DiasDiferencia = ((TimeSpan)(DateTime.Now - periodoSeleccionado.FechaCierre)).Days;
                int Estatus = 0;
                int PeriodosAbiertos = periodosAbiertos.Count();
                if (periodoSeleccionado.PersonaIDCierre == null)
                {
                    personaCierre = "";
                }
                else
                {
                    var PersonaCierre = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", periodoSeleccionado.UsuarioIDCierre).FirstOrDefaultAsync();
                    personaCierre = PersonaCierre.Nombre;
                }
                if (PeriodosAbiertos <= 2)
                {
                    if (DiasDiferencia < DiasGracia)
                    {
                        Estatus = 1;
                        periodoSeleccionado.Estatus = "A";
                        periodoSeleccionado.ReAbierto = 1;
                        await ConexionBD.database.UpdateAsync(periodoSeleccionado);
                    }
                    else
                    {
                        Estatus = 2;
                    }
                }
                else
                {
                    Estatus = 3;
                }
                var resPeriodo = new
                {
                    periodoSeleccionado.ProductoID,
                    periodoSeleccionado.DiasGracia,
                    periodoSeleccionado.Ejercicio,
                    periodoSeleccionado.FechaApertura,
                    periodoSeleccionado.FechaCierre,
                    periodoSeleccionado.Estatus,
                    periodoSeleccionado.FechaFin,
                    periodoSeleccionado.FechaInicio,
                    periodoSeleccionado.NumeroPeriodo,
                    periodoSeleccionado.PeriodoID,
                    periodoSeleccionado.PersonaIDApertura,
                    periodoSeleccionado.ReAbierto,
                    PersonaApertura = PersonaApertura.Nombre,
                    periodoSeleccionado.PersonaIDCierre,
                    PersonaCierre = personaCierre,
                    Agrupacion = producto.Producto
                };
                var res = new
                {
                    Estatus = Estatus,
                    Periodo = resPeriodo
                };
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res);

            }


            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("cerrarperiodo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CerrarPeriodo(PeticionesRest.SOMA.Periodos.Get parData)
        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var periodoSeleccionado = await ConexionBD.database.QueryAsync<Periodo2>("WHERE PeriodoID=@0", parData.PeriodoID).SingleOrDefaultAsync();
                var PersonaApertura = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", periodoSeleccionado.UsuarioIDApertura).FirstOrDefaultAsync();
                var personaCierre = "";
                var producto = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID=@0", periodoSeleccionado.ProductoID).FirstOrDefaultAsync();
                periodoSeleccionado.ReAbierto = 0;
                periodoSeleccionado.Estatus = "C";
                await ConexionBD.database.UpdateAsync(periodoSeleccionado);

                if (periodoSeleccionado.PersonaIDCierre == null)
                {
                    personaCierre = "";
                }
                else
                {
                    var PersonaCierre = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", periodoSeleccionado.UsuarioIDCierre).FirstOrDefaultAsync();
                    personaCierre = PersonaCierre.Nombre;
                }
                var resPeriodo = new
                {
                    periodoSeleccionado.ProductoID,
                    periodoSeleccionado.DiasGracia,
                    periodoSeleccionado.Ejercicio,
                    periodoSeleccionado.FechaApertura,
                    periodoSeleccionado.FechaCierre,
                    periodoSeleccionado.Estatus,
                    periodoSeleccionado.FechaFin,
                    periodoSeleccionado.FechaInicio,
                    periodoSeleccionado.NumeroPeriodo,
                    periodoSeleccionado.PeriodoID,
                    periodoSeleccionado.PersonaIDApertura,
                    periodoSeleccionado.ReAbierto,
                    PersonaApertura = PersonaApertura.Nombre,
                    periodoSeleccionado.PersonaIDCierre,
                    PersonaCierre = personaCierre,
                    Agrupacion = producto.Producto
                };
                var res = new
                {
                    Estatus = 1,
                    Periodo = resPeriodo
                };
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("obtenersaldosperiodo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SaldosPeriodo(PeticionesRest.SOMA.Periodos.Get parData)
        {
            try
            {
                var resBalances = await ConexionBD.database.QueryAsync<Balance2>("WHERE PeriodoID=@0", parData.PeriodoID).ToArrayAsync();
                if (resBalances.Length > 0)
                {
                    var balance = resBalances.OrderBy(x => x.BalanceID).Last();
                    var saldosBalance = await ConexionBD.database.QueryAsync<BalanceResumen2>("WHERE BalanceID=@0", balance.BalanceID).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(saldosBalance);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("editardias")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> EditarDia(PeticionesRest.SOMA.Periodos.Get parData)
        {
            try
            {
                ConexionBD.database.BeginTransaction();

                var periodoSeleccionado = await ConexionBD.database.QueryAsync<Periodo2>("WHERE PeriodoID=@0", parData.PeriodoID).SingleOrDefaultAsync();
                var PersonaApertura = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", periodoSeleccionado.UsuarioIDApertura).FirstOrDefaultAsync();
                var personaCierre = "";
                var producto = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID=@0", periodoSeleccionado.ProductoID).FirstOrDefaultAsync();
                if (parData.DiasGracia >= 1)
                {
                    periodoSeleccionado.DiasGracia = parData.DiasGracia;

                    await ConexionBD.database.UpdateAsync(periodoSeleccionado);

                    if (periodoSeleccionado.PersonaIDCierre == null)
                    {
                        personaCierre = "";
                    }
                    else
                    {
                        var PersonaCierre = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", periodoSeleccionado.UsuarioIDCierre).FirstOrDefaultAsync();
                        personaCierre = PersonaCierre.Nombre;
                    }
                    var resPeriodo = new
                    {
                        periodoSeleccionado.ProductoID,
                        periodoSeleccionado.DiasGracia,
                        periodoSeleccionado.Ejercicio,
                        periodoSeleccionado.FechaApertura,
                        periodoSeleccionado.FechaCierre,
                        periodoSeleccionado.Estatus,
                        periodoSeleccionado.FechaFin,
                        periodoSeleccionado.FechaInicio,
                        periodoSeleccionado.NumeroPeriodo,
                        periodoSeleccionado.PeriodoID,
                        periodoSeleccionado.PersonaIDApertura,
                        periodoSeleccionado.ReAbierto,
                        PersonaApertura = PersonaApertura.Nombre,
                        periodoSeleccionado.PersonaIDCierre,
                        PersonaCierre = personaCierre,
                        Agrupacion = producto.Producto
                    };
                    var res = new
                    {
                        Estatus = 1,
                        Periodo = resPeriodo
                    };
                    ConexionBD.database.CompleteTransaction();
                    await ConexionBD.Destroy();
                    return Ok(res);

                }
                else
                {
                    ConexionBD.database.AbortTransaction();
                    await ConexionBD.Destroy();
                    return BadRequest();
                }


            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
