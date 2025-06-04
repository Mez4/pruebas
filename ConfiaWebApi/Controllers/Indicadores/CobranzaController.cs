using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using System.Globalization;
using System.Collections.Generic;

namespace ConfiaWebApi.Controllers.Indicadores
{
    [Authorize]
    [ApiController]
    [Route("api/Indicadores/[controller]")]
    public class CobranzaController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        private CultureInfo provider = CultureInfo.InvariantCulture;

        public CobranzaController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpGet]
        [Route("cobranza__sucursal/{SucursalID}/{Fecha}")]
        [Authorize]
        public async Task<IActionResult> CobranzaSucursal(int SucursalID, string Fecha)
        {
            try
            {
                // Parseamos la fecha
                var dFechaVals = Fecha.Split("-");
                var dFecha = new DateTime(int.Parse(dFechaVals[2]), int.Parse(dFechaVals[1]), int.Parse(dFechaVals[0]));

                // Obtenemos el detalle de las socias agrupados por defecto
                var DetalleAgrupado = (await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Indicadores.Historicos_Socias_DetalleGroup_VW>().Where(x => x.Fecha == dFecha && x.SucursalID == SucursalID && x.DiasAtraso <= 90).OrderByDescending(x => x.OrdenTipoPago).ThenByDescending(x => x.Pendiente).ToArray());
                var Detalle = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Indicadores.Historicos_Socias_Detalle_VW>().Where(x => x.Fecha == dFecha && x.SucursalID == SucursalID && x.DiasAtraso <= 90).ToArray();
                var DetalleTipoPago = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).GroupBy(x => x.TipoPago);

                // Detalle por producto
                var DetalleProducto = Detalle.GroupBy(x => x.ProductoNombre);

                // Generamos el ID del coordinador
                var IdsCoordinador = DetalleAgrupado.Select(x => x.CoordinadorID).Distinct().ToArray();

                // Generamos nuestro Indicador de tabla inicial
                var Coordinadores = new dynamic[IdsCoordinador.Count()];
                for (var idCor = 0; idCor < IdsCoordinador.Count(); idCor++)

                    Coordinadores[idCor] = new
                    {
                        CoordinadorID = IdsCoordinador[idCor],
                        CoordinadorNombre = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor]).FirstOrDefault().CoordinadorNombre,

                        // Detalle del Coordinador
                        Total = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0).Select(x => x.Vencido).Sum(),
                        Recuperacion = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0).Select(x => x.Cobranza + x.Bono).Sum(),
                        PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0).Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0).Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Pendientes = DetalleAgrupado.Where(x => x.Pendiente > 0 && x.DiasAtraso <= 0 && x.CoordinadorID == IdsCoordinador[idCor]).Count(),
                        Pendiente = DetalleAgrupado.Where(x => x.Pendiente > 0 && x.DiasAtraso <= 0 && x.CoordinadorID == IdsCoordinador[idCor]).Select(x => x.Pendiente).Sum(),

                        // Pago anticipado
                        Anticipado__Total = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA").Select(x => x.Vencido).Sum(),
                        Anticipado__Recuperacion = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA").Select(x => x.Cobranza + x.Bono).Sum(),
                        Anticipado__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA").Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA").Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Anticipado__Pendientes = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA" && x.Pendiente > 0).Count(),
                        Anticipado__Pendiente = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA" && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                        // Pago puntual
                        Puntual__Total = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP").Select(x => x.Vencido).Sum(),
                        Puntual__Recuperacion = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP").Select(x => x.Cobranza + x.Bono).Sum(),
                        Puntual__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP").Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP").Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Puntual__Pendientes = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP" && x.Pendiente > 0).Count(),
                        Puntual__Pendiente = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP" && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                        // Pago acumulado
                        Acumulado__Total = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1)).Select(x => x.Vencido).Sum(),
                        Acumulado__Recuperacion = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1)).Select(x => x.Cobranza + x.Bono).Sum(),
                        Acumulado__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1)).Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1)).Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Acumulado__Pendientes = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1) && x.Pendiente > 0).Count(),
                        Acumulado__Pendiente = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1) && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                        // Pago impuntual
                        Impuntual__Total = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI").Select(x => x.Vencido).Sum(),
                        Impuntual__Recuperacion = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI").Select(x => x.Cobranza + x.Bono).Sum(),
                        Impuntual__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI").Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI").Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Impuntual__Pendientes = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI" && x.Pendiente > 0).Count(),
                        Impuntual__Pendiente = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI" && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                        // Pago Tardio
                        Tardio__Total = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT").Select(x => x.Vencido).Sum(),
                        Tardio__Recuperacion = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT").Select(x => x.Cobranza + x.Bono).Sum(),
                        Tardio__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT").Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT").Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Tardio__Pendientes = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT" && x.Pendiente > 0).Count(),
                        Tardio__Pendiente = DetalleAgrupado.Where(x => x.CoordinadorID == IdsCoordinador[idCor] && x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT" && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                    };

                var Indicador = new
                {
                    Coordinadores,
                    Distribuidoras = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).ToArray(),
                    ResumenCartera = new
                    {
                        Pendiente = Detalle.Select(x => x.Pendiente).Sum(),
                        C090 = CacularCalidad(Detalle, "C090"),
                        C115 = CacularCalidad(Detalle, "C115"),
                        C145 = CacularCalidad(Detalle, "C145"),
                        C4690 = CacularCalidad(Detalle, "C4690"),
                        C91 = CacularCalidad(Detalle, "C91"),
                        Productos = new dynamic[DetalleProducto.Count()]
                    },
                    TotalesCoordinadores = new
                    {
                        // Detalle del Coordinador
                        Total = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Vencido).Sum(),
                        Recuperacion = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Cobranza + x.Bono).Sum(),
                        PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Pendientes = DetalleAgrupado.Where(x => x.Pendiente > 0 && x.DiasAtraso <= 0).Count(),
                        Pendiente = DetalleAgrupado.Where(x => x.Pendiente > 0 && x.DiasAtraso <= 0).Select(x => x.Pendiente).Sum(),

                        // Pago anticipado
                        Anticipado__Total = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA").Select(x => x.Vencido).Sum(),
                        Anticipado__Recuperacion = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA").Select(x => x.Cobranza + x.Bono).Sum(),
                        Anticipado__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA").Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA").Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Anticipado__Pendientes = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA" && x.Pendiente > 0).Count(),
                        Anticipado__Pendiente = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PA" && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                        // Pago puntual
                        Puntual__Total = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP").Select(x => x.Vencido).Sum(),
                        Puntual__Recuperacion = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP").Select(x => x.Cobranza + x.Bono).Sum(),
                        Puntual__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP").Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP").Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Puntual__Pendientes = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP" && x.Pendiente > 0).Count(),
                        Puntual__Pendiente = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PP" && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                        // Pago acumulado
                        Acumulado__Total = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1)).Select(x => x.Vencido).Sum(),
                        Acumulado__Recuperacion = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1)).Select(x => x.Cobranza + x.Bono).Sum(),
                        Acumulado__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1)).Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1)).Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Acumulado__Pendientes = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1) && x.Pendiente > 0).Count(),
                        Acumulado__Pendiente = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && new string[] { "PP", "PA" }.Contains(x.TipoPagoAnt1) && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                        // Pago impuntual
                        Impuntual__Total = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI").Select(x => x.Vencido).Sum(),
                        Impuntual__Recuperacion = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI").Select(x => x.Cobranza + x.Bono).Sum(),
                        Impuntual__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI").Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI").Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Impuntual__Pendientes = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI" && x.Pendiente > 0).Count(),
                        Impuntual__Pendiente = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PI" && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),

                        // Pago Tardio
                        Tardio__Total = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT").Select(x => x.Vencido).Sum(),
                        Tardio__Recuperacion = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT").Select(x => x.Cobranza + x.Bono).Sum(),
                        Tardio__PRecuperacion = CalcularPorcentaje(
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT").Select(x => x.Vencido).Sum() ?? 0,
                            DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT").Select(x => x.Cobranza + x.Bono).Sum() ?? 0
                        ),
                        Tardio__Pendientes = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT" && x.Pendiente > 0).Count(),
                        Tardio__Pendiente = DetalleAgrupado.Where(x => x.DiasAtraso <= 0 && x.TipoPagoAnt1 == "PT" && x.Pendiente > 0).Select(x => x.Pendiente).Sum(),
                    }
                };

                // Resumen de la cartera
                for (var i = 0; i < DetalleProducto.Count(); i++)
                {
                    Indicador.ResumenCartera.Productos[i] = new
                    {
                        Producto = DetalleProducto.ElementAt(i).Key,
                        C090 = CacularCalidad(DetalleProducto.ElementAt(i), "C090"),
                        C115 = CacularCalidad(DetalleProducto.ElementAt(i), "C115"),
                        C145 = CacularCalidad(DetalleProducto.ElementAt(i), "C145"),
                        C4690 = CacularCalidad(DetalleProducto.ElementAt(i), "C4690"),
                        C91 = CacularCalidad(DetalleProducto.ElementAt(i), "C91"),
                    };
                }
                await ConexionBD.Destroy();
                return Ok(Indicador);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("cobranza__coordinador/{CoordinadorId}/{Fecha}")]
        [Authorize]
        public async Task<IActionResult> CobranzaCoordinador(int CoordinadorId, string Fecha)
        {
            try
            {
                // Parseamos la fecha
                var dFechaVals = Fecha.Split("-");
                var dFecha = new DateTime(int.Parse(dFechaVals[2]), int.Parse(dFechaVals[1]), int.Parse(dFechaVals[0]));

                // Obtenemos los ID de los coordinadores de este socia
                var DistribuidorIDs = (await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores_Distribuidores__EstatusVW>().Where(x => x.DistribuidoresEstatusID != "I" && x.CoordinadorID == CoordinadorId).ToArray()).Select(x => x.DistribuidorID).ToArray();

                // Obtenemos el detalle de las socias agrupados por defecto
                var DetalleAgrupado = (await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Indicadores.Historicos_Socias_DetalleGroup_VW>().Where(x => x.Fecha == dFecha && DistribuidorIDs.Contains(x.DistribuidorID) && x.DiasAtraso <= 90).OrderByDescending(x => x.OrdenTipoPago).ThenByDescending(x => x.Pendiente).ToArray());
                var Detalle = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Indicadores.Historicos_Socias_Detalle_VW>().Where(x => x.Fecha == dFecha && DistribuidorIDs.Contains(x.DistribuidorID) && x.DiasAtraso <= 90).ToArray();
                var DetalleTipoPago = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).GroupBy(x => x.TipoPago);

                // Detalle por producto
                var DetalleProducto = Detalle.GroupBy(x => x.ProductoNombre);

                // Valor de retorno para la vista
                var Indicador = new
                {
                    CarteraPorConcepto = new
                    {
                        Total = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Vencido).Sum() ?? 0,
                        Recuperado = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Cobranza + x.Comision).Sum() ?? 0,
                        Pendiente = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Pendiente).Sum() ?? 0,
                        Conceptos = new dynamic[DetalleTipoPago.Count()],
                        PRecuperado = CalcularPorcentaje(DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Vencido).Sum() ?? 0, DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Cobranza + x.Comision).Sum() ?? 0),
                        PPendiente = CalcularPorcentaje(DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Vencido).Sum() ?? 0, DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Select(x => x.Pendiente).Sum() ?? 0),
                        Cuentas = DetalleAgrupado.Where(x => x.DiasAtraso <= 0).Count()
                    },
                    ResumenCartera = new
                    {
                        Pendiente = Detalle.Select(x => x.Pendiente).Sum(),
                        C090 = CacularCalidad(Detalle, "C090"),
                        C115 = CacularCalidad(Detalle, "C115"),
                        C145 = CacularCalidad(Detalle, "C145"),
                        C4690 = CacularCalidad(Detalle, "C4690"),
                        C91 = CacularCalidad(Detalle, "C91"),
                        Productos = new dynamic[DetalleProducto.Count()]
                    },
                    Distribuidoras = DetalleAgrupado
                };

                // Seguimiento de cobranza
                for (var i = 0; i < DetalleTipoPago.Count(); i++)
                {
                    Indicador.CarteraPorConcepto.Conceptos[i] = new
                    {
                        Etiqueta = DetalleTipoPago.ElementAt(i).Key,
                        Monto = DetalleTipoPago.ElementAt(i).Select(x => x.Vencido).Sum() ?? 0,
                        Recuperado = DetalleTipoPago.ElementAt(i).Select(x => x.Cobranza + x.Comision).Sum() ?? 0,
                        Pendiente = DetalleTipoPago.ElementAt(i).Select(x => x.Pendiente).Sum() ?? 0,
                        PRecuperado = CalcularPorcentaje(Indicador.CarteraPorConcepto.Total, DetalleTipoPago.ElementAt(i).Select(x => x.Cobranza + x.Comision).Sum() ?? 0),
                        // Peso = CalcularPorcentaje(Indicador.CarteraPorConcepto.Total, DetalleTipoPago.ElementAt(i).Select(x => x.Vencido).Sum() ?? (decimal)0.0),
                        Peso = CalcularPorcentaje(Indicador.CarteraPorConcepto.Cuentas, DetalleTipoPago.ElementAt(i).Where(x => x.Cobranza > 0).Count()),
                        // Peso = CalcularPorcentaje(DetalleAgrupado.Where(x => (x.Cobranza + x.Comision) > 0).Count(), DetalleTipoPago.ElementAt(i).Where(x => x.Cobranza > 0).Count()),
                        Cuentas = DetalleTipoPago.ElementAt(i).Where(x => x.Cobranza > 0).Count()
                    };
                }

                // Resumen de la cartera
                for (var i = 0; i < DetalleProducto.Count(); i++)
                {
                    Indicador.ResumenCartera.Productos[i] = new
                    {
                        Producto = DetalleProducto.ElementAt(i).Key,
                        C090 = CacularCalidad(DetalleProducto.ElementAt(i), "C090"),
                        C115 = CacularCalidad(DetalleProducto.ElementAt(i), "C115"),
                        C145 = CacularCalidad(DetalleProducto.ElementAt(i), "C145"),
                        C4690 = CacularCalidad(DetalleProducto.ElementAt(i), "C4690"),
                        C91 = CacularCalidad(DetalleProducto.ElementAt(i), "C91"),
                    };
                }

                // Regresamos el listado
                await ConexionBD.Destroy();
                return Ok(Indicador);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        private decimal CalcularPorcentaje(decimal total, decimal cantidad)
        {
            if (cantidad <= 0 || total <= 0)
            {
                return (decimal)0.0;
            }

            return ((decimal)100.0 / total) * cantidad;
        }

        private dynamic CacularCalidad(IEnumerable<DBContext.DBConfia.Indicadores.Historicos_Socias_Detalle_VW> pItems, string Modo)
        {
            // Saldo Total
            var SaldoTotal = pItems.Select(x => x.Saldo).Sum();
            int DiaInicial = 0;
            int DiaFinal = 0;

            // Parseamos nuestra lista
            switch (Modo)
            {
                case "C115":
                    DiaInicial = 1;
                    DiaFinal = 15;
                    break;
                case "C145":
                    DiaInicial = 1;
                    DiaFinal = 45;
                    break;
                case "C4690":
                    DiaInicial = 46;
                    DiaFinal = 90;
                    break;
            }

            // Validamos si tenemos vencido en nuestra lista
            if (SaldoTotal <= 0)
                return new { Calidad = 0, Monto = pItems.Where(x => x.DiasAtraso >= DiaInicial && x.DiasAtraso <= DiaFinal).Select(x => x.Vencido).Sum(), Saldo = pItems.Where(x => x.DiasAtraso >= DiaInicial && x.DiasAtraso <= DiaFinal).Select(x => x.Saldo).Sum() };

            var Monto = pItems.Where(x => x.DiasAtraso >= DiaInicial && x.DiasAtraso <= DiaFinal).Select(x => x.Vencido).Sum();
            var Saldo = pItems.Where(x => x.DiasAtraso >= DiaInicial && x.DiasAtraso <= DiaFinal).Select(x => x.Saldo).Sum();
            decimal? Calidad = 0;
            if (Modo == "C090")
            {
                Calidad = Saldo / SaldoTotal;
            }
            else
            {
                Calidad = 1 - (Saldo / SaldoTotal);
            }

            // Calculamos la calidad de nuestra cartera de clientes con convenio
            var CuentasConvenio = pItems.Where(x => x.DiasAtraso >= DiaInicial && x.DiasAtraso <= DiaFinal && x.DistribuidoresEstatusID == "C").GroupBy(x => x.DistribuidorID).Count();
            var SaldoConvenio = pItems.Where(x => x.DiasAtraso >= DiaInicial && x.DiasAtraso <= DiaFinal && x.DistribuidoresEstatusID == "C").Select(x => x.Saldo).Sum();
            decimal CalidadConvenio = 100 - CalcularPorcentaje(SaldoTotal ?? 0, SaldoConvenio ?? 0);

            // Return
            return new { Calidad, Monto, Saldo, SaldoConvenio, CalidadConvenio, CuentasConvenio };
        }
    }
}