using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using System.Globalization;
using ConfiaWebApi.Code;
using System.IO;
using System.Diagnostics;
using System.Web;
using iText.Kernel.Pdf;
using System.Reflection.Metadata;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Geom;
using Path = System.IO.Path;
using iText.StyledXmlParser.Jsoup.Nodes;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Kernel.Colors;
using iText.Layout.Properties;
using iText.Layout.Borders;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Balances;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class MovimientosController : ControllerBase
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
        public MovimientosController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {



            var movs = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.Movimientos>();
            var movsDetalle = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosDetalle>();
            ArrayList res = new();

            foreach (var sc in movs)
            {

                res.Add(new
                {
                    movimientoID = sc.MovimientoID,
                    cuentaID = sc.CuentaID,
                    sucursalID = sc.SucursalId,
                    cuentaDestinoID = sc.CuentaDestinoID,
                    fechaAfectacion = sc.FechaAfectacion,
                    fechaCaptura = sc.FechaCaptura,
                    importe = sc.Importe,
                    observaciones = sc.Observaciones,
                    tipoMovimientoID = sc.TipoMovimientoID,
                    productoID = sc.ProductoId,
                    refAPL = sc.RefApl,
                    usuarioIDRegistra = sc.UsuarioIDRegistra,
                    gastoSucursal = sc.gastoSucursal,
                    movimientoIDTraspaso = sc.movimientoIdTraspaso,
                    cancelacionObservacion = sc.cancelacionObservacion,
                    cancelacionUsuario = sc.cancelacionUsuario,
                    cancelacionImporte = sc.cancelacionImporte,
                    cancelacionFhRegistro = sc.cancelacionFhRegistro,
                    cancelacionTipMovimiento = sc.cancelacionTipMovimiento,
                    estatus = sc.Estatus,
                    contabilizado = sc.Contabilizado,
                    cajaID = sc.CajaId,
                    listmovsDetalle = movsDetalle.Where(ws => ws.MovimientoID == sc.MovimientoID).Select(sc => new
                    {
                        movimientoDetalleID = sc.MovimientoDetalleID,
                        creditoID = sc.CreditoID,
                        noPago = sc.NoPago,
                        capital = sc.Capital,
                        interes = sc.Interes,
                        comision = sc.Comision,
                        seguro = sc.Seguro,
                        cargo = sc.Cargo,
                        iva = sc.IVA,
                        importe = sc.Importe,
                        noPagoCan = sc.noPagoCan,
                        capitalCan = sc.capitalCan,
                        interesCan = sc.interesCan,
                        comisionCan = sc.comisionCan,
                        seguroCan = sc.seguroCan,
                        cargoCan = sc.cargoCan,
                        ivaCan = sc.IVACan,
                        polizaMovId = sc.PolizaMovId
                    }),

                });
            }
            await ConexionBD.Destroy();
            return Ok(res);
        }

        [HttpGet]
        [Route("find-by-id/{MovimientoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int MovimientoID)
        {
            var movs = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.Movimientos>();
            var movsWhere = movs.Where(ws => ws.MovimientoID == MovimientoID).ToArray();
            var movsDetalle = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosDetalle>();
            ArrayList res = new();

            foreach (var sc in movsWhere)
            {

                res.Add(new
                {
                    movimientoID = sc.MovimientoID,
                    cuentaID = sc.CuentaID,
                    sucursalID = sc.SucursalId,
                    cuentaDestinoID = sc.CuentaDestinoID,
                    fechaAfectacion = sc.FechaAfectacion,
                    fechaCaptura = sc.FechaCaptura,
                    importe = sc.Importe,
                    observaciones = sc.Observaciones,
                    tipoMovimientoID = sc.TipoMovimientoID,
                    productoID = sc.ProductoId,
                    refAPL = sc.RefApl,
                    usuarioIDRegistra = sc.UsuarioIDRegistra,
                    gastoSucursal = sc.gastoSucursal,
                    movimientoIDTraspaso = sc.movimientoIdTraspaso,
                    cancelacionObservacion = sc.cancelacionObservacion,
                    cancelacionUsuario = sc.cancelacionUsuario,
                    cancelacionImporte = sc.cancelacionImporte,
                    cancelacionFhRegistro = sc.cancelacionFhRegistro,
                    cancelacionTipMovimiento = sc.cancelacionTipMovimiento,
                    estatus = sc.Estatus,
                    contabilizado = sc.Contabilizado,
                    cajaID = sc.CajaId,
                    listmovsDetalle = movsDetalle.Where(ws => ws.MovimientoID == sc.MovimientoID).Select(sc => new
                    {
                        movimientoDetalleID = sc.MovimientoDetalleID,
                        creditoID = sc.CreditoID,
                        noPago = sc.NoPago,
                        capital = sc.Capital,
                        interes = sc.Interes,
                        comision = sc.Comision,
                        seguro = sc.Seguro,
                        cargo = sc.Cargo,
                        iva = sc.IVA,
                        importe = sc.Importe,
                        noPagoCan = sc.noPagoCan,
                        capitalCan = sc.capitalCan,
                        interesCan = sc.interesCan,
                        comisionCan = sc.comisionCan,
                        seguroCan = sc.seguroCan,
                        cargoCan = sc.cargoCan,
                        ivaCan = sc.IVACan,
                        polizaMovId = sc.PolizaMovId
                    }),

                });
            }
            await ConexionBD.Destroy();
            return Ok(res);
        }


        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.Movimientos.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
            ArrayList res = new();

            if (parData.cuentaID == 0)
            {
                var cajaTipoOperacion = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CajaTipoOperacion>("WHERE CajaID=@0 AND Activa=1 AND TipoMovimientoID=@1", parData.cajaId, parData.tipoMovimientoID).FirstOrDefaultAsync();
                parData.cuentaID = (int)cajaTipoOperacion.CuentaBancoId;
            }
            var Producto = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID =@0", parData.productoId).FirstOrDefaultAsync();
            var Empresa = await ConexionBD.database.SingleByIdAsync<Empresas>(Producto.EmpresaId);
            var ProductoPrincipal = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE empresaId =@0 AND Principal = 1", Empresa.empresaId).FirstOrDefaultAsync();
            var Periodo2 = await ConexionBD.database.QueryAsync<Periodo2>("WHERE Estatus = 'A' AND ReAbierto = 0 AND ProductoID =@0", ProductoPrincipal.ProductoID).FirstOrDefaultAsync();
            // Generamos el registro de el estado civil
            var movDdetalle = new DBContext.DBConfia.Bancos.Movimientos()
            {
                CuentaID = parData.cuentaID,
                SucursalId = parData.sucursalId,
                CuentaDestinoID = parData.cuentaDestinoID,
                FechaAfectacion = parData.fechaAfectacion,
                FechaCaptura = DateTime.Now,
                Importe = parData.importe,
                Observaciones = parData.observaciones,
                ObservacionesUsuario = parData.ObservacionesUsuario,
                TipoMovimientoID = parData.tipoMovimientoID,
                ProductoId = parData.productoId,
                RefApl = parData.refAPL,
                gastoSucursal = parData.gastoSucursal,
                movimientoIdTraspaso = parData.movimientoIdTraspaso,
                cancelacionObservacion = parData.cancelacionObservacion,
                cancelacionUsuario = parData.cancelacionUsuario,
                cancelacionImporte = parData.cancelacionImporte,
                cancelacionFhRegistro = parData.cancelacionFhRegistro,
                PolizaId = parData.polizaId,
                Estatus = parData.estatus,
                Contabilizado = parData.contabilizado,
                CajaId = parData.cajaId,
                PeriodoID = Periodo2.PeriodoID,
                PersonaIDRegistro = UsuarioActual.PersonaID,
                UsuarioIDRegistra = UsuarioActual.UsuarioID,
                CatEstatusMovID = parData.CatEstatusMovID,
                bitAplicado = false
            };
            try
            {
                // Ingresamos la el movimiento  a la bd
                await ConexionBD.database.InsertAsync(movDdetalle);
                await ConexionBD.Destroy();
                // Regresamos el registro a la UI
                return Ok(movDdetalle);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al ingresar el movimiento: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{movAgrupaId}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.Movimientos.Update parData, int movAgrupaId)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();


            // Generamos el registro de bobeda
            var movBancario = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID=@0", movAgrupaId).SingleOrDefaultAsync();

            try
            {
                // Actualizamos el movimiento
                movBancario.CuentaID = parData.cuentaID;
                movBancario.SucursalId = parData.sucursalId;
                movBancario.CuentaDestinoID = parData.cuentaDestinoID;
                movBancario.FechaAfectacion = DateTime.Now;
                movBancario.FechaCaptura = movBancario.FechaCaptura;
                movBancario.Importe = parData.importe;
                movBancario.Observaciones = parData.observaciones;
                movBancario.TipoMovimientoID = parData.tipoMovimientoID;
                movBancario.ProductoId = parData.productoId;
                movBancario.RefApl = parData.refAPL;
                movBancario.gastoSucursal = parData.gastoSucursal;
                movBancario.movimientoIdTraspaso = parData.movimientoIdTraspaso;
                movBancario.cancelacionObservacion = parData.cancelacionObservacion;
                movBancario.cancelacionUsuario = parData.cancelacionUsuario;
                movBancario.cancelacionImporte = parData.cancelacionImporte;
                movBancario.cancelacionFhRegistro = parData.cancelacionFhRegistro;
                movBancario.PolizaId = parData.polizaId;
                movBancario.Estatus = parData.estatus;
                movBancario.Contabilizado = parData.contabilizado;
                movBancario.CajaId = parData.cajaId;
                movBancario.PersonaIDRegistro = (long)UsuarioActual.UsuarioID;
                movBancario.UsuarioIDRegistra = UsuarioActual.UsuarioID;


                // Ingresamos la bobeda a la bd
                await ConexionBD.database.UpdateAsync(movBancario);
                await ConexionBD.Destroy();
                // Regresamos el registro a la UI
                return Ok(movBancario);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar el movimiento: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{MovimientoID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int MovimientoID)
        {
            // Obtenemos el email del usuario de los claims
            try
            {
                var res = await ConexionBD.database.ExecuteAsync("DELETE FROM Bancos.Movimientos WHERE MovimientoID=@0", MovimientoID);
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al elimnar el movimiento: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("generar-movimiento")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> GenerarMovimiento(ConfiaWebApi.PeticionesRest.SOMA.Movimientos.AdmMovs parData)
        {
            // Obtenemos el email del usuario de los claims
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var ultimoPeriodo = "SELECT  * FROM Tesoreria.Periodo2 p "
                 + " JOIN Bancos.CatalogoCuentasBancos ccb "
                 + " ON p.ProductoID = ccb.ProductoID"
                 + " WHERE ccb.CuentaBancoID = @0 AND p.Estatus = 'A'";

                if (parData.tipoOperacion == 1)
                {
                    var periodoSeleccionado = await ConexionBD.database.QueryAsync<Periodo2>(ultimoPeriodo, parData.cuentaID).ToArrayAsync();
                    var res = new
                    {
                        estatus = 1,
                        periodos = periodoSeleccionado,
                        tipoMov = parData.tipoMovTransfiere
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else if (parData.tipoOperacion == 2)
                {
                    if (parData.tipoMovTransfiere)
                    {
                        ConexionBD.database.BeginTransaction();


                        var productoSeleccionado = await ConexionBD.database.QueryAsync<CatalogoCuentasBancos>("WHERE CuentaBancoID=@0", parData.cuentaID).SingleOrDefaultAsync();

                        var productoSeleccionado2 = await ConexionBD.database.QueryAsync<CatalogoCuentasBancos>("WHERE CuentaBancoID=@0", parData.cuentaDestinoID).SingleOrDefaultAsync();

                        var sqlPeriodo2 = "select TOP(1) * FROM Tesoreria.Periodo2 p WHERE Estatus = 'A' AND ReAbierto = 0 AND ProductoID = @0 ORDER BY Estatus DESC";
                        var periodo2 = await ConexionBD.database.QueryAsync<Periodo2>(sqlPeriodo2, productoSeleccionado2.ProductoID).SingleOrDefaultAsync();


                        var tipoMov = await ConexionBD.database.QueryAsync<TiposMovimientos>("WHERE Id=@0", parData.tipoMovimientoID).SingleOrDefaultAsync();
                        var tipoPoliza = 0;

                        tipoPoliza = tipoMov.Factor == -1 ? tipoPoliza = 2 : tipoPoliza = 3;

                        var PolizaGenerada = new Polizas()
                        {
                            Fecha = DateTime.Now,
                            Concepto = parData.concepto,
                            CatEstatusMovID = 1,
                            PersonaID = (long)UsuarioActual.UsuarioID,
                            UsuarioID = UsuarioActual.UsuarioID,
                            TipoPolizaID = tipoPoliza,
                        };
                        await ConexionBD.database.InsertAsync(PolizaGenerada);

                        var mov1 = parData.movimientosPoliza[0];
                        var mov2 = parData.movimientosPoliza[1];

                        var MovimientosPolizasGenerados = new Movimientopolizas()
                        {
                            PolizaID = PolizaGenerada.PolizaID,
                            Descripcion = parData.concepto,
                            CuentaID = mov1.cuentaContableId,
                            Referencia = parData.referenciaMovs,
                            CatEstatusMovID = 1,
                            Haber = mov1.haberNumero,
                            Debe = mov1.debeNumero,
                            PeriodoID = parData.periodoSeleccionado
                        };
                        await ConexionBD.database.InsertAsync(MovimientosPolizasGenerados);

                        var MovimientosPolizasGenerados2 = new Movimientopolizas()
                        {
                            PolizaID = PolizaGenerada.PolizaID,
                            Descripcion = parData.concepto,
                            CuentaID = mov2.cuentaContableId,
                            Referencia = parData.referenciaMovs,
                            CatEstatusMovID = 1,
                            Haber = mov2.haberNumero,
                            Debe = mov2.debeNumero,
                            PeriodoID = periodo2.PeriodoID
                        };
                        await ConexionBD.database.InsertAsync(MovimientosPolizasGenerados2);

                        var MovimientoGenerado = new DBContext.DBConfia.Bancos.Movimientos()
                        {
                            CuentaID = parData.cuentaID,
                            SucursalId = parData.sucursalID,
                            CuentaDestinoID = parData.cuentaDestinoID,
                            FechaAfectacion = DateTime.Now,
                            FechaCaptura = DateTime.Now,
                            Importe = parData.importe * tipoMov.Factor,
                            Observaciones = parData.concepto,
                            TipoMovimientoID = parData.tipoMovimientoID,
                            ProductoId = (int)productoSeleccionado.ProductoID,
                            Estatus = "A",
                            PeriodoID = parData.periodoSeleccionado,
                            UsuarioIDRegistra = UsuarioActual.UsuarioID,
                            PolizaId = PolizaGenerada.PolizaID,
                            ObservacionesUsuario = parData.referenciaMovs,
                            Contabilizado = true,
                            CatEstatusMovID = 1

                        };
                        await ConexionBD.database.InsertAsync(MovimientoGenerado);

                        var MovimientoGenerado2 = new Movimientos()
                        {
                            CuentaID = parData.cuentaDestinoID,
                            SucursalId = parData.sucursalID,
                            //CuentaDestinoID = parData.cuentaDestinoID,
                            FechaAfectacion = DateTime.Now,
                            FechaCaptura = DateTime.Now,
                            Estatus = "A",
                            Importe = (MovimientoGenerado.Importe * -1),
                            Observaciones = parData.concepto,
                            TipoMovimientoID = parData.tipoMovimientoID,
                            ProductoId = (int)productoSeleccionado2.ProductoID,
                            UsuarioIDRegistra = UsuarioActual.UsuarioID,
                            PeriodoID = parData.periodoSeleccionado,
                            PolizaId = PolizaGenerada.PolizaID,
                            ObservacionesUsuario = parData.referenciaMovs,
                            Contabilizado = true,
                            CatEstatusMovID = 1

                        };
                        await ConexionBD.database.InsertAsync(MovimientoGenerado2);
                        var res = new
                        {
                            estatus = 2,
                            MovimientoGenerado = MovimientoGenerado,
                            PolizaGenerada = PolizaGenerada

                        };
                        ConexionBD.database.CompleteTransaction();
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        ConexionBD.database.BeginTransaction();
                        var productoSeleccionado = await ConexionBD.database.QueryAsync<CatalogoCuentasBancos>("WHERE CuentaBancoID=@0", parData.cuentaID).SingleOrDefaultAsync();

                        var tipoMov = await ConexionBD.database.QueryAsync<TiposMovimientos>("WHERE Id=@0", parData.tipoMovimientoID).SingleOrDefaultAsync();
                        var tipoPoliza = 0;

                        tipoPoliza = tipoMov.Factor == -1 ? tipoPoliza = 2 : tipoPoliza = 3;

                        var PolizaGenerada = new Polizas()
                        {
                            Fecha = DateTime.Now,
                            Concepto = parData.concepto,
                            CatEstatusMovID = 1,
                            PersonaID = (long)UsuarioActual.UsuarioID,
                            UsuarioID = UsuarioActual.UsuarioID,
                            TipoPolizaID = tipoPoliza,
                        };
                        await ConexionBD.database.InsertAsync(PolizaGenerada);

                        var mov1 = parData.movimientosPoliza[0];

                        var MovimientosPolizasGenerados = new Movimientopolizas()
                        {
                            PolizaID = PolizaGenerada.PolizaID,
                            Descripcion = parData.concepto,
                            CuentaID = mov1.cuentaContableId,
                            Referencia = parData.referenciaMovs,
                            CatEstatusMovID = 1,
                            Haber = mov1.haberNumero,
                            Debe = mov1.debeNumero,
                            PeriodoID = parData.periodoSeleccionado
                        };
                        await ConexionBD.database.InsertAsync(MovimientosPolizasGenerados);

                        var MovimientoGenerado = new DBContext.DBConfia.Bancos.Movimientos()
                        {
                            CuentaID = parData.cuentaID,
                            SucursalId = parData.sucursalID,
                            FechaAfectacion = DateTime.Now,
                            FechaCaptura = DateTime.Now,
                            Importe = parData.importe * tipoMov.Factor,
                            Observaciones = parData.concepto,
                            TipoMovimientoID = parData.tipoMovimientoID,
                            ProductoId = (int)productoSeleccionado.ProductoID,
                            Estatus = "A",
                            CatEstatusMovID = 1,
                            PeriodoID = parData.periodoSeleccionado,
                            UsuarioIDRegistra = UsuarioActual.UsuarioID,
                            PolizaId = PolizaGenerada.PolizaID,
                            ObservacionesUsuario = parData.referenciaMovs,
                            Contabilizado = true
                        };
                        await ConexionBD.database.InsertAsync(MovimientoGenerado);
                        ConexionBD.database.CompleteTransaction();
                        var res = new
                        {
                            estatus = 2,
                            MovimientoGenerado = MovimientoGenerado,
                            PolizaGenerada = PolizaGenerada
                        };
                        ConexionBD.database.CompleteTransaction();
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("Error al elimnar el movimiento: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("detalle-movimiento-dni")]
        [Authorize]
        public async Task<IActionResult> DetalleMovimientoDNI(PeticionesRest.SOMA.Movimientos.DetalleDNI parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Movimiento = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos_VW>("WHERE MovimientoID = @0", parData.MovimientoID).FirstOrDefaultAsync();
                var CuentaMovimiento = await ConexionBD.database.QueryAsync<CatalogoCuentasBancos_VW>("WHERE CuentaBancoID = @0", Movimiento.CuentaID).FirstOrDefaultAsync();
                var CajaMovimiento = await ConexionBD.database.QueryAsync<CatalogoCajas>("WHERE CajaID = @0", Movimiento.CajaId).FirstOrDefaultAsync();
                var PersonaMovimiento = await ConexionBD.database.QueryAsync<Personas>("WHERE PersonaID = @0", Movimiento.PersonaIDRegistro).FirstOrDefaultAsync();
                //  var BalanceMovimiento = await ConexionBD.database.QueryAsync<Balance>("WHERE BalanceID = @0", Movimiento.Bal_Apl).FirstOrDefaultAsync();
                parData.ProductoID = producto;

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));

                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);

                iText.Layout.Document doc = new(pdfDocument, PageSize.LETTER);

                doc.SetMargins(40, 55, 40, 55);

                PdfPage pdfPage = pdfDocument.AddNewPage();

                PdfCanvas canvas = new(pdfPage);

                canvas.Rectangle(30, 40, 550, 720);
                canvas.Stroke();

                LineSeparator ls = new(new SolidLine());

                Paragraph salto1 = new(new Text("\n"));

                Paragraph salto3 = new(new Text("\n\n\n"));

                Paragraph salto4 = new(new Text("\n\n\n\n"));

                doc.Add(ls);
                Paragraph title = new Paragraph("DETALLE DE MOVIMIENTO DE CUENTA")
                    .SetFontSize(14)
                    .SetBold()
                    .SetTextAlignment(TextAlignment.CENTER);
                doc.Add(title);
                doc.Add(ls);
                doc.Add(salto3);

                Cell cParafo = new();
                cParafo.Add(new Paragraph());
                cParafo.SetBackgroundColor(ColorConstants.WHITE);
                cParafo.SetBorder(Border.NO_BORDER);

                float[] pointColumnWidths = { 25, 100, 175, 50, 150 };
                Table table = new(pointColumnWidths);

                Cell c1 = new();
                c1.Add(new Paragraph("ID:"));
                c1.SetBackgroundColor(ColorConstants.WHITE);
                c1.SetTextAlignment(TextAlignment.CENTER);
                c1.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c1.SetFontSize(10);
                c1.SetBold();

                Cell c2 = new();
                c2.Add(new Paragraph(Movimiento.MovimientoID.ToString()));
                c2.SetBackgroundColor(ColorConstants.WHITE);
                c2.SetTextAlignment(TextAlignment.CENTER);
                c2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c2.SetFontSize(10);

                Cell c3 = new();
                c3.Add(new Paragraph("TIPO MOVIMIENTO:"));
                c3.SetBackgroundColor(ColorConstants.WHITE);
                c3.SetTextAlignment(TextAlignment.CENTER);
                c3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c3.SetFontSize(10);
                c3.SetBold();

                Cell c4 = new();
                c4.Add(new Paragraph(Movimiento.TipoMovimientoID.ToString()));
                c4.SetBackgroundColor(ColorConstants.WHITE);
                c4.SetTextAlignment(TextAlignment.CENTER);
                c4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c4.SetFontSize(10);

                Cell c5 = new();
                c5.Add(new Paragraph(Movimiento.TipoMovimiento));
                c5.SetBackgroundColor(ColorConstants.WHITE);
                c5.SetTextAlignment(TextAlignment.CENTER);
                c5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c5.SetFontSize(10);

                table.AddCell(c1);
                table.AddCell(c2);
                table.AddCell(c3);
                table.AddCell(c4);
                table.AddCell(c5);
                doc.Add(table);
                doc.Add(salto1);

                float[] pointColumnWidths2 = { 200, 100, 300 };
                Table table2 = new(pointColumnWidths2);

                Cell c7 = new();
                c7.Add(new Paragraph("CUENTA:"));
                c7.SetBackgroundColor(ColorConstants.WHITE);
                c7.SetTextAlignment(TextAlignment.CENTER);
                c7.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c7.SetFontSize(10);
                c7.SetBold();

                Cell c8 = new();
                c8.Add(new Paragraph(CajaMovimiento.Nombre));
                c8.SetBackgroundColor(ColorConstants.WHITE);
                c8.SetTextAlignment(TextAlignment.CENTER);
                c8.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c8.SetFontSize(10);

                Cell c9 = new();
                c9.Add(new Paragraph(CajaMovimiento.Descripcion));
                c9.SetBackgroundColor(ColorConstants.WHITE);
                c9.SetTextAlignment(TextAlignment.CENTER);
                c9.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c9.SetFontSize(10);

                table2.AddCell(c7);
                table2.AddCell(c8);
                table2.AddCell(c9);
                doc.Add(table2);
                doc.Add(salto1);

                float[] pointColumnWidths4 = { 100, 225, 25, 150 };
                Table table4 = new(pointColumnWidths4);

                Cell c13 = new();
                c13.Add(new Paragraph("BALANCE:"));
                c13.SetBackgroundColor(ColorConstants.WHITE);
                c13.SetTextAlignment(TextAlignment.CENTER);
                c13.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c13.SetFontSize(10);
                c13.SetBold();

                Cell c14 = new();
                c14.Add(new Paragraph(Movimiento.Bal_Apl != null ? Movimiento.Bal_Apl.ToString() : " - "));
                c14.SetBackgroundColor(ColorConstants.WHITE);
                c14.SetTextAlignment(TextAlignment.CENTER);
                c14.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c14.SetFontSize(10);

                Cell c15 = new();
                c15.Add(new Paragraph("IMPORTE:"));
                c15.SetBackgroundColor(ColorConstants.WHITE);
                c15.SetTextAlignment(TextAlignment.CENTER);
                c15.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c15.SetFontSize(10);
                c15.SetBold();

                Cell c16 = new();
                c16.Add(new Paragraph("DESCRIPCION:"));
                c16.SetBackgroundColor(ColorConstants.WHITE);
                c16.SetTextAlignment(TextAlignment.CENTER);
                c16.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c16.SetFontSize(10);
                c16.SetBold();

                Cell c17 = new();
                c17.Add(new Paragraph(Movimiento.Observaciones));
                c17.SetBackgroundColor(ColorConstants.WHITE);
                c17.SetTextAlignment(TextAlignment.CENTER);
                c17.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c17.SetFontSize(10);

                Cell c18 = new();
                c18.Add(new Paragraph(Funciones.Truncate(Movimiento.Importe, 2).ToString("C", CultureInfo.CurrentCulture)));
                c18.SetBackgroundColor(ColorConstants.WHITE);
                c18.SetTextAlignment(TextAlignment.CENTER);
                c18.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c18.SetFontSize(10);

                table4.AddCell(c13);
                table4.AddCell(c14);
                table4.AddCell(cParafo);
                table4.AddCell(c15);
                table4.AddCell(c16);
                table4.AddCell(c17);
                table4.AddCell(cParafo);
                table4.AddCell(c18);
                doc.Add(table4);
                doc.Add(salto1);

                float[] pointColumnWidths5 = { 150, 250, 200 };
                Table table5 = new(pointColumnWidths5);

                Cell c19 = new();
                c19.Add(new Paragraph("CAPTURA:"));
                c19.SetBackgroundColor(ColorConstants.WHITE);
                c19.SetTextAlignment(TextAlignment.CENTER);
                c19.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c19.SetFontSize(10);
                c19.SetBold();

                Cell c20 = new();
                c20.Add(new Paragraph(PersonaMovimiento != null ? PersonaMovimiento.NombreCompleto : " - "));
                c20.SetBackgroundColor(ColorConstants.WHITE);
                c20.SetTextAlignment(TextAlignment.CENTER);
                c20.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c20.SetFontSize(10);

                Cell c21 = new();
                c21.Add(new Paragraph(PersonaMovimiento != null ? PersonaMovimiento.PersonaID.ToString() : "Sistema"));
                c21.SetBackgroundColor(ColorConstants.WHITE);
                c21.SetTextAlignment(TextAlignment.CENTER);
                c21.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c21.SetFontSize(10);

                table5.AddCell(c19);
                table5.AddCell(c20);
                table5.AddCell(c21);
                doc.Add(table5);
                doc.Add(salto1);

                float[] pointColumnWidths6 = { 100, 200, 100, 200 };
                Table table6 = new(pointColumnWidths6);

                var fechaAfectacion = Movimiento.FechaCaptura.Year == 1900 ? String.Empty : Movimiento.FechaAfectacion?.ToString("dd/MM/yyyy hh:mm:ss tt");

                Cell c22 = new();
                c22.Add(new Paragraph("FECHA MOV:"));
                c22.SetBackgroundColor(ColorConstants.WHITE);
                c22.SetTextAlignment(TextAlignment.CENTER);
                c22.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c22.SetFontSize(9);
                c22.SetBold();

                Cell c23 = new();
                c23.Add(new Paragraph(fechaAfectacion));
                c23.SetBackgroundColor(ColorConstants.WHITE);
                c23.SetTextAlignment(TextAlignment.CENTER);
                c23.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c23.SetFontSize(9);

                var fechaCaptura = Movimiento.FechaCaptura.Year == 1900 ? String.Empty : Movimiento.FechaCaptura.ToString("dd/MM/yyyy hh:mm:ss tt");

                Cell c24 = new();
                c24.Add(new Paragraph("FECHA CAPTURA:"));
                c24.SetBackgroundColor(ColorConstants.WHITE);
                c24.SetTextAlignment(TextAlignment.CENTER);
                c24.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c24.SetFontSize(9);
                c24.SetBold();

                Cell c25 = new();
                c25.Add(new Paragraph(fechaCaptura));
                c25.SetBackgroundColor(ColorConstants.WHITE);
                c25.SetTextAlignment(TextAlignment.CENTER);
                c25.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c25.SetFontSize(9);

                table6.AddCell(c22);
                table6.AddCell(c23);
                table6.AddCell(c24);
                table6.AddCell(c25);
                doc.Add(table6);
                doc.Add(salto1);

                float[] pointColumnWidths10 = { 100, 200, 75, 225 };
                Table table10 = new(pointColumnWidths10);

                Cell c36 = new();
                c36.Add(new Paragraph("IMPRESION:"));
                c36.SetBackgroundColor(ColorConstants.WHITE);
                c36.SetTextAlignment(TextAlignment.CENTER);
                c36.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c36.SetFontSize(10);
                c36.SetBold();

                Cell c37 = new();
                c37.Add(new Paragraph(DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt")));
                c37.SetBackgroundColor(ColorConstants.WHITE);
                c37.SetTextAlignment(TextAlignment.CENTER);
                c37.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c37.SetFontSize(10);

                Cell c38 = new();
                c38.Add(new Paragraph(UsuarioActual.PersonaID.ToString()));
                c38.SetBackgroundColor(ColorConstants.WHITE);
                c38.SetTextAlignment(TextAlignment.CENTER);
                c38.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c38.SetFontSize(10);

                Cell c39 = new();
                c39.Add(new Paragraph(UsuarioActual.NombreCompleto));
                c39.SetBackgroundColor(ColorConstants.WHITE);
                c39.SetTextAlignment(TextAlignment.CENTER);
                c39.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c39.SetFontSize(10);

                table10.AddCell(c36);
                table10.AddCell(c37);
                table10.AddCell(c38);
                table10.AddCell(c39);
                doc.Add(table10);
                doc.Add(salto1);

                float[] pointColumnWidths11 = { 250, 250 };
                Table table11 = new(pointColumnWidths11);

                LineSeparator rl = new(new SolidLine());

                LineSeparator lfl = new(new SolidLine());

                Cell c40 = new();
                c40.Add(new Paragraph("ENTREGUE"));
                c40.SetBackgroundColor(ColorConstants.WHITE);
                c40.SetTextAlignment(TextAlignment.CENTER);
                c40.SetVerticalAlignment(VerticalAlignment.TOP);
                c40.SetBorder(Border.NO_BORDER);
                c40.SetFontSize(10);

                Cell c41 = new();
                c41.Add(new Paragraph("RECIBI"));
                c41.SetBackgroundColor(ColorConstants.WHITE);
                c41.SetTextAlignment(TextAlignment.CENTER);
                c41.SetVerticalAlignment(VerticalAlignment.TOP);
                c41.SetBorder(Border.NO_BORDER);
                c41.SetFontSize(10);

                Cell c42 = new();
                c42.Add(rl);
                c42.SetBackgroundColor(ColorConstants.WHITE);
                c42.SetTextAlignment(TextAlignment.CENTER);
                c42.SetVerticalAlignment(VerticalAlignment.BOTTOM);
                c42.SetBorder(Border.NO_BORDER);
                c42.SetFontSize(10);

                Cell c43 = new();
                c43.Add(lfl);
                c43.SetBackgroundColor(ColorConstants.WHITE);
                c43.SetTextAlignment(TextAlignment.CENTER);
                c43.SetVerticalAlignment(VerticalAlignment.BOTTOM);
                c43.SetBorder(Border.NO_BORDER);
                c43.SetFontSize(10);

                table11.AddCell(c42);
                table11.AddCell(c43);
                table11.AddCell(c40);
                table11.AddCell(c41);
                doc.Add(salto4);
                doc.Add(table11);

                doc.Close();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Obtenemos nuestro PDF
                var pdfStream = new MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                await ConexionBD.Destroy();

                return File(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}