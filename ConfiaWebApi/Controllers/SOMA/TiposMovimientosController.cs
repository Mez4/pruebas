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
using DBContext.DBConfia.Tesoreria;
//using DBContext.DBConfia.IntegracionKeycloak;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;
using DBContext.DBConfia.Bancos;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class TiposMovimientosController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext DBContext;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public TiposMovimientosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> FindAll()
        {
            var movsDetalle = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.TiposMovimientos>();
            var corresponsales = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CorresponsalesPago>();
            var rubros = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.GastosRubros>();
            var movsAgrupa = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosAgrupa>();
            var ctasContables = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var tiposCuenta = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.TipoCuenta>();
            var acumulaCuenta = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var naturalezas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.Naturaleza>();
            var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
            var vMoneda = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.MonedaSAT>();


            var result = movsDetalle.Select(sc => new
            {
                id = sc.Id,
                cveMovimiento = sc.CveMovimientoID,
                tipoMovimiento = sc.TipoMovimiento,
                cargo = sc.Cargo,
                factor = sc.Factor,
                usuario = sc.usuario,
                corresponsalID = corresponsales.Where(ws => ws.CorresponsalId == sc.CorresponsalId).Select(sc1 => new
                {
                    corresponsalId = sc1.CorresponsalId,
                    corresponsalDesc = sc1.CorresponsalDesc,
                    comision = sc1.comision,
                    ordenEnTabla = sc1.ordenEnTabla,
                    mostrarEnTabla = sc1.mostrarEnTabla,
                    montoMaximoPago = sc1.montoMaximoPago
                }).SingleOrDefault(),
                gastosRubroID = rubros.Where(ws1 => ws1.gastosRubroID == sc.gastosRubroID).Select(sc2 => new
                {
                    gastosRubroID = sc2.gastosRubroID,
                    gastosRubroDesc = sc2.gastosRubroDesc,
                    activo = sc2.activo
                }).SingleOrDefault(),
                aceptaDepositos = sc.AceptaDepositos,
                aceptaRetiros = sc.AceptaRetiros,
                aplicaIva = sc.AplicaIva,
                manejaCuentasdeOrden = sc.ManejaCuentasdeOrden,
                aplicaIDE = sc.AplicaIde,
                pagaInteres = sc.PagaInteres,
                tasaInteres = sc.TasaInteres,
                retieneISR = sc.RetieneIsr,
                montoApertura = sc.MontoApertura,
                montoMaximo = sc.MontoMaximo,
                aplicaComision = sc.AplicaComision,
                montoComision = sc.MontoComision,

                retiroID = ctasContables.Where(ws4 => ws4.CuentaID == sc.RetiroId).Select(sc5 => new
                {
                    id = sc5.CuentaID,
                    cuenta = sc5.Cuenta,
                    nombre = sc5.Nombre,
                    acumulaCuenta = acumulaCuenta.Where(ws10 => ws10.CuentaID == sc5.AcumulaCuentaID).Select(sc10 => new
                    {
                        id = sc10.AcumulaCuentaID,
                        cuenta = sc10.Cuenta,
                        nombre = sc10.Nombre,
                        tipoId = sc10.TipoID,
                        tipoBancoId = sc10.TipoBancoId
                    }).SingleOrDefault(),
                    tipoCuenta = tiposCuenta.Where(ws10 => ws10.TipoID == sc5.TipoID).Select(sc6 => new
                    {
                        id = sc6.TipoID,
                        descripcion = sc6.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = naturalezas.Where(ws11 => ws11.NaturalezaID == sc5.NaturalezaID).Select(sc7 => new
                    {
                        id = sc7.NaturalezaID,
                        descripcion = sc7.Descripcion
                    }).SingleOrDefault(),
                    rubro = rubros.Where(ws12 => ws12.gastosRubroID == sc5.RubroID).Select(sc7 => new
                    {
                        id = sc7.gastosRubroID,
                        descripcion = sc7.gastosRubroDesc
                    }).SingleOrDefault(),
                    empresa = empresas.Where(ws13 => ws13.empresaId == sc5.EmpresaID).Select(sc7 => new
                    {
                        id = sc7.empresaId,
                        descripcion = sc7.empresaNombre
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws15 => ws15.MonedaSatID == sc5.CatMonedaSatID).Select(sc15 => new
                    {
                        monedaId = sc15.MonedaSatID,
                        nombreMoneda = sc15.NombreMoneda
                    }).SingleOrDefault(),
                    activa = sc5.Activa,
                    fechaRegistro = sc5.FechaRegistro,
                    tipoBancoID = sc5.TipoBancoId
                }).SingleOrDefault(),
                depositoID = ctasContables.Where(ws4 => ws4.CuentaID == sc.RetiroId).Select(sc16 => new
                {
                    id = sc16.CuentaID,
                    cuenta = sc16.Cuenta,
                    nombre = sc16.Nombre,
                    acumulaCuenta = acumulaCuenta.Where(ws10 => ws10.CuentaID == sc16.AcumulaCuentaID).Select(sc10 => new
                    {
                        id = sc10.AcumulaCuentaID,
                        cuenta = sc10.Cuenta,
                        nombre = sc10.Nombre,
                        tipoId = sc10.TipoID,
                        tipoBancoId = sc10.TipoBancoId
                    }).SingleOrDefault(),
                    tipoCuenta = tiposCuenta.Where(ws10 => ws10.TipoID == sc16.TipoID).Select(sc6 => new
                    {
                        id = sc6.TipoID,
                        descripcion = sc6.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = naturalezas.Where(ws11 => ws11.NaturalezaID == sc16.NaturalezaID).Select(sc7 => new
                    {
                        id = sc7.NaturalezaID,
                        descripcion = sc7.Descripcion
                    }).SingleOrDefault(),
                    rubro = rubros.Where(ws12 => ws12.gastosRubroID == sc16.RubroID).Select(sc7 => new
                    {
                        id = sc7.gastosRubroID,
                        descripcion = sc7.gastosRubroDesc
                    }).SingleOrDefault(),
                    empresa = empresas.Where(ws13 => ws13.empresaId == sc16.EmpresaID).Select(sc7 => new
                    {
                        id = sc7.empresaId,
                        descripcion = sc7.empresaNombre
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws15 => ws15.MonedaSatID == sc16.CatMonedaSatID).Select(sc15 => new
                    {
                        monedaId = sc15.MonedaSatID,
                        nombreMoneda = sc15.NombreMoneda
                    }).SingleOrDefault(),
                    activa = sc16.Activa,
                    fechaRegistro = sc16.FechaRegistro,
                    tipoBancoID = sc16.TipoBancoId
                }).SingleOrDefault(),
                comisionID = ctasContables.Where(ws4 => ws4.CuentaID == sc.RetiroId).Select(sc17 => new
                {
                    id = sc17.CuentaID,
                    cuenta = sc17.Cuenta,
                    nombre = sc17.Nombre,
                    acumulaCuenta = acumulaCuenta.Where(ws10 => ws10.CuentaID == sc17.AcumulaCuentaID).Select(sc10 => new
                    {
                        id = sc10.AcumulaCuentaID,
                        cuenta = sc10.Cuenta,
                        nombre = sc10.Nombre,
                        tipoId = sc10.TipoID,
                        tipoBancoId = sc10.TipoBancoId
                    }).SingleOrDefault(),
                    tipoCuenta = tiposCuenta.Where(ws10 => ws10.TipoID == sc17.TipoID).Select(sc6 => new
                    {
                        id = sc6.TipoID,
                        descripcion = sc6.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = naturalezas.Where(ws11 => ws11.NaturalezaID == sc17.NaturalezaID).Select(sc7 => new
                    {
                        id = sc7.NaturalezaID,
                        descripcion = sc7.Descripcion
                    }).SingleOrDefault(),
                    rubro = rubros.Where(ws12 => ws12.gastosRubroID == sc17.RubroID).Select(sc7 => new
                    {
                        id = sc7.gastosRubroID,
                        descripcion = sc7.gastosRubroDesc
                    }).SingleOrDefault(),
                    empresa = empresas.Where(ws13 => ws13.empresaId == sc17.EmpresaID).Select(sc7 => new
                    {
                        id = sc7.empresaId,
                        descripcion = sc7.empresaNombre
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws15 => ws15.MonedaSatID == sc17.CatMonedaSatID).Select(sc15 => new
                    {
                        monedaId = sc15.MonedaSatID,
                        nombreMoneda = sc15.NombreMoneda
                    }).SingleOrDefault(),
                    activa = sc17.Activa,
                    fechaRegistro = sc17.FechaRegistro,
                    tipoBancoID = sc17.TipoBancoId
                }).SingleOrDefault(),
                ivaID = ctasContables.Where(ws4 => ws4.CuentaID == sc.RetiroId).Select(sc18 => new
                {
                    id = sc18.CuentaID,
                    cuenta = sc18.Cuenta,
                    nombre = sc18.Nombre,
                    acumulaCuenta = acumulaCuenta.Where(ws10 => ws10.CuentaID == sc18.AcumulaCuentaID).Select(sc10 => new
                    {
                        id = sc10.AcumulaCuentaID,
                        cuenta = sc10.Cuenta,
                        nombre = sc10.Nombre,
                        tipoId = sc10.TipoID,
                        tipoBancoId = sc10.TipoBancoId
                    }).SingleOrDefault(),
                    tipoCuenta = tiposCuenta.Where(ws10 => ws10.TipoID == sc18.TipoID).Select(sc6 => new
                    {
                        id = sc6.TipoID,
                        descripcion = sc6.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = naturalezas.Where(ws11 => ws11.NaturalezaID == sc18.NaturalezaID).Select(sc7 => new
                    {
                        id = sc7.NaturalezaID,
                        descripcion = sc7.Descripcion
                    }).SingleOrDefault(),
                    rubro = rubros.Where(ws12 => ws12.gastosRubroID == sc18.RubroID).Select(sc7 => new
                    {
                        id = sc7.gastosRubroID,
                        descripcion = sc7.gastosRubroDesc
                    }).SingleOrDefault(),
                    empresa = empresas.Where(ws13 => ws13.empresaId == sc18.EmpresaID).Select(sc7 => new
                    {
                        id = sc7.empresaId,
                        descripcion = sc7.empresaNombre
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws15 => ws15.MonedaSatID == sc18.CatMonedaSatID).Select(sc15 => new
                    {
                        monedaId = sc15.MonedaSatID,
                        nombreMoneda = sc15.NombreMoneda
                    }).SingleOrDefault(),
                    activa = sc18.Activa,
                    fechaRegistro = sc18.FechaRegistro,
                    tipoBancoID = sc18.TipoBancoId
                }).SingleOrDefault(),
                activa = sc.Activa,
                movAgrupaID = movsAgrupa.Where(ws2 => ws2.MovAgrupaId == sc.MovAgrupaID).Select(sc3 => new
                {
                    movAgrupaId = sc3.MovAgrupaId,
                    clave = sc3.Clave,
                    nombre = sc3.Nombre,
                    estatus = sc3.Estatus

                }).SingleOrDefault(),
                productoID = sc.ProductoId
            });
            await DBContext.Destroy();
            return Ok(result);


        }

        [HttpGet]
        [Route("find-by-id/{Id}")]
        [Authorize]
        public async Task<IActionResult> Boveda(int Id)


        {
            var movsDetalle = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.TiposMovimientos>("WHERE Id =@0", Id).ToArrayAsync();
            var corresponsales = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CorresponsalesPago>();
            var rubros = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.GastosRubros>();
            var movsAgrupa = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosAgrupa>();
            var ctasContables = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var tiposCuenta = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.TipoCuenta>();
            var acumulaCuenta = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var naturalezas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.Naturaleza>();
            var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
            var vMoneda = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.MonedaSAT>();


            var result = movsDetalle.Select(sc => new
            {
                id = sc.Id,
                cveMovimiento = sc.CveMovimientoID,
                tipoMovimiento = sc.TipoMovimiento,
                cargo = sc.Cargo,
                factor = sc.Factor,
                usuario = sc.usuario,
                corresponsalID = corresponsales.Where(ws => ws.CorresponsalId == sc.CorresponsalId).Select(sc1 => new
                {
                    corresponsalId = sc1.CorresponsalId,
                    corresponsalDesc = sc1.CorresponsalDesc,
                    comision = sc1.comision,
                    ordenEnTabla = sc1.ordenEnTabla,
                    mostrarEnTabla = sc1.mostrarEnTabla,
                    montoMaximoPago = sc1.montoMaximoPago
                }).SingleOrDefault(),
                gastosRubroID = rubros.Where(ws1 => ws1.gastosRubroID == sc.gastosRubroID).Select(sc2 => new
                {
                    gastosRubroID = sc2.gastosRubroID,
                    gastosRubroDesc = sc2.gastosRubroDesc,
                    activo = sc2.activo
                }).SingleOrDefault(),
                aceptaDepositos = sc.AceptaDepositos,
                aceptaRetiros = sc.AceptaRetiros,
                aplicaIva = sc.AplicaIva,
                manejaCuentasdeOrden = sc.ManejaCuentasdeOrden,
                aplicaIDE = sc.AplicaIde,
                pagaInteres = sc.PagaInteres,
                tasaInteres = sc.TasaInteres,
                retieneISR = sc.RetieneIsr,
                montoApertura = sc.MontoApertura,
                montoMaximo = sc.MontoMaximo,
                aplicaComision = sc.AplicaComision,
                montoComision = sc.MontoComision,

                retiroID = ctasContables.Where(ws4 => ws4.CuentaID == sc.RetiroId).Select(sc5 => new
                {
                    id = sc5.CuentaID,
                    cuenta = sc5.Cuenta,
                    nombre = sc5.Nombre,
                    acumulaCuenta = acumulaCuenta.Where(ws10 => ws10.CuentaID == sc5.AcumulaCuentaID).Select(sc10 => new
                    {
                        id = sc10.AcumulaCuentaID,
                        cuenta = sc10.Cuenta,
                        nombre = sc10.Nombre,
                        tipoId = sc10.TipoID,
                        tipoBancoId = sc10.TipoBancoId
                    }).SingleOrDefault(),
                    tipoCuenta = tiposCuenta.Where(ws10 => ws10.TipoID == sc5.TipoID).Select(sc6 => new
                    {
                        id = sc6.TipoID,
                        descripcion = sc6.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = naturalezas.Where(ws11 => ws11.NaturalezaID == sc5.NaturalezaID).Select(sc7 => new
                    {
                        id = sc7.NaturalezaID,
                        descripcion = sc7.Descripcion
                    }).SingleOrDefault(),
                    rubro = rubros.Where(ws12 => ws12.gastosRubroID == sc5.RubroID).Select(sc7 => new
                    {
                        id = sc7.gastosRubroID,
                        descripcion = sc7.gastosRubroDesc
                    }).SingleOrDefault(),
                    empresa = empresas.Where(ws13 => ws13.empresaId == sc5.EmpresaID).Select(sc7 => new
                    {
                        id = sc7.empresaId,
                        descripcion = sc7.empresaNombre
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws15 => ws15.MonedaSatID == sc5.CatMonedaSatID).Select(sc15 => new
                    {
                        monedaId = sc15.MonedaSatID,
                        nombreMoneda = sc15.NombreMoneda
                    }).SingleOrDefault(),
                    activa = sc5.Activa,
                    fechaRegistro = sc5.FechaRegistro,
                    tipoBancoID = sc5.TipoBancoId
                }).SingleOrDefault(),
                depositoID = ctasContables.Where(ws4 => ws4.CuentaID == sc.RetiroId).Select(sc16 => new
                {
                    id = sc16.CuentaID,
                    cuenta = sc16.Cuenta,
                    nombre = sc16.Nombre,
                    acumulaCuenta = acumulaCuenta.Where(ws10 => ws10.CuentaID == sc16.AcumulaCuentaID).Select(sc10 => new
                    {
                        id = sc10.AcumulaCuentaID,
                        cuenta = sc10.Cuenta,
                        nombre = sc10.Nombre,
                        tipoId = sc10.TipoID,
                        tipoBancoId = sc10.TipoBancoId
                    }).SingleOrDefault(),
                    tipoCuenta = tiposCuenta.Where(ws10 => ws10.TipoID == sc16.TipoID).Select(sc6 => new
                    {
                        id = sc6.TipoID,
                        descripcion = sc6.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = naturalezas.Where(ws11 => ws11.NaturalezaID == sc16.NaturalezaID).Select(sc7 => new
                    {
                        id = sc7.NaturalezaID,
                        descripcion = sc7.Descripcion
                    }).SingleOrDefault(),
                    rubro = rubros.Where(ws12 => ws12.gastosRubroID == sc16.RubroID).Select(sc7 => new
                    {
                        id = sc7.gastosRubroID,
                        descripcion = sc7.gastosRubroDesc
                    }).SingleOrDefault(),
                    empresa = empresas.Where(ws13 => ws13.empresaId == sc16.EmpresaID).Select(sc7 => new
                    {
                        id = sc7.empresaId,
                        descripcion = sc7.empresaNombre
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws15 => ws15.MonedaSatID == sc16.CatMonedaSatID).Select(sc15 => new
                    {
                        monedaId = sc15.MonedaSatID,
                        nombreMoneda = sc15.NombreMoneda
                    }).SingleOrDefault(),
                    activa = sc16.Activa,
                    fechaRegistro = sc16.FechaRegistro,
                    tipoBancoID = sc16.TipoBancoId
                }).SingleOrDefault(),
                comisionID = ctasContables.Where(ws4 => ws4.CuentaID == sc.RetiroId).Select(sc17 => new
                {
                    id = sc17.CuentaID,
                    cuenta = sc17.Cuenta,
                    nombre = sc17.Nombre,
                    acumulaCuenta = acumulaCuenta.Where(ws10 => ws10.CuentaID == sc17.AcumulaCuentaID).Select(sc10 => new
                    {
                        id = sc10.AcumulaCuentaID,
                        cuenta = sc10.Cuenta,
                        nombre = sc10.Nombre,
                        tipoId = sc10.TipoID,
                        tipoBancoId = sc10.TipoBancoId
                    }).SingleOrDefault(),
                    tipoCuenta = tiposCuenta.Where(ws10 => ws10.TipoID == sc17.TipoID).Select(sc6 => new
                    {
                        id = sc6.TipoID,
                        descripcion = sc6.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = naturalezas.Where(ws11 => ws11.NaturalezaID == sc17.NaturalezaID).Select(sc7 => new
                    {
                        id = sc7.NaturalezaID,
                        descripcion = sc7.Descripcion
                    }).SingleOrDefault(),
                    rubro = rubros.Where(ws12 => ws12.gastosRubroID == sc17.RubroID).Select(sc7 => new
                    {
                        id = sc7.gastosRubroID,
                        descripcion = sc7.gastosRubroDesc
                    }).SingleOrDefault(),
                    empresa = empresas.Where(ws13 => ws13.empresaId == sc17.EmpresaID).Select(sc7 => new
                    {
                        id = sc7.empresaId,
                        descripcion = sc7.empresaNombre
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws15 => ws15.MonedaSatID == sc17.CatMonedaSatID).Select(sc15 => new
                    {
                        monedaId = sc15.MonedaSatID,
                        nombreMoneda = sc15.NombreMoneda
                    }).SingleOrDefault(),
                    activa = sc17.Activa,
                    fechaRegistro = sc17.FechaRegistro,
                    tipoBancoID = sc17.TipoBancoId
                }).SingleOrDefault(),
                ivaID = ctasContables.Where(ws4 => ws4.CuentaID == sc.RetiroId).Select(sc18 => new
                {
                    id = sc18.CuentaID,
                    cuenta = sc18.Cuenta,
                    nombre = sc18.Nombre,
                    acumulaCuenta = acumulaCuenta.Where(ws10 => ws10.CuentaID == sc18.AcumulaCuentaID).Select(sc10 => new
                    {
                        id = sc10.AcumulaCuentaID,
                        cuenta = sc10.Cuenta,
                        nombre = sc10.Nombre,
                        tipoId = sc10.TipoID,
                        tipoBancoId = sc10.TipoBancoId
                    }).SingleOrDefault(),
                    tipoCuenta = tiposCuenta.Where(ws10 => ws10.TipoID == sc18.TipoID).Select(sc6 => new
                    {
                        id = sc6.TipoID,
                        descripcion = sc6.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = naturalezas.Where(ws11 => ws11.NaturalezaID == sc18.NaturalezaID).Select(sc7 => new
                    {
                        id = sc7.NaturalezaID,
                        descripcion = sc7.Descripcion
                    }).SingleOrDefault(),
                    rubro = rubros.Where(ws12 => ws12.gastosRubroID == sc18.RubroID).Select(sc7 => new
                    {
                        id = sc7.gastosRubroID,
                        descripcion = sc7.gastosRubroDesc
                    }).SingleOrDefault(),
                    empresa = empresas.Where(ws13 => ws13.empresaId == sc18.EmpresaID).Select(sc7 => new
                    {
                        id = sc7.empresaId,
                        descripcion = sc7.empresaNombre
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws15 => ws15.MonedaSatID == sc18.CatMonedaSatID).Select(sc15 => new
                    {
                        monedaId = sc15.MonedaSatID,
                        nombreMoneda = sc15.NombreMoneda
                    }).SingleOrDefault(),
                    activa = sc18.Activa,
                    fechaRegistro = sc18.FechaRegistro,
                    tipoBancoID = sc18.TipoBancoId
                }).SingleOrDefault(),
                activa = sc.Activa,
                movAgrupaID = movsAgrupa.Where(ws2 => ws2.MovAgrupaId == sc.MovAgrupaID).Select(sc3 => new
                {
                    movAgrupaId = sc3.MovAgrupaId,
                    clave = sc3.Clave,
                    nombre = sc3.Nombre,
                    estatus = sc3.Estatus

                }).SingleOrDefault(),
                productoID = sc.ProductoId
            });
            await DBContext.Destroy();
            return Ok(result);

        }

        [HttpPost]
        [Route("create/{comisionid}/{depositoid}/{ivaid}/{retiroid}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> AgregarTipoMov(ConfiaWebApi.PeticionesRest.SOMA.TiposMovimiento.Add parData, int comisionid, int depositoid, int ivaid, int retiroid)
        {
            try
            {
                var tiposMovimiento = new TiposMovimientos()
                {
                    CveMovimientoID = parData.cveMovimientoID,
                    TipoMovimiento = parData.tipoMovimiento,
                    Cargo = parData.cargo,
                    Factor = parData.factor,
                    usuario = parData.usuario,
                    CorresponsalId = parData.CorresponsalId,
                    gastosRubroID = parData.gastosRubroID,
                    AceptaDepositos = parData.aceptaDepositos,
                    AceptaRetiros = parData.aceptaRetiros,
                    AplicaIva = parData.aplicaIva,
                    ManejaCuentasdeOrden = parData.manejaCuentasdeOrden,
                    AplicaIde = parData.aplicaIDE,
                    PagaInteres = parData.pagaInteres,
                    TasaInteres = parData.tasaInteres,
                    RetieneIsr = parData.retieneISR,
                    MontoApertura = parData.montoApertura,
                    MontoMaximo = parData.montoMaximo,
                    AplicaComision = parData.aplicaComision,
                    MontoComision = parData.montoComision,
                    RetiroId = retiroid,
                    DepositoId = depositoid,
                    ComisionId = comisionid,
                    IvaId = ivaid,
                    Activa = parData.activa,
                    MovAgrupaID = parData.movAgrupaID,
                    ProductoId = parData.productoID
                };
                await DBContext.database.InsertAsync(tiposMovimiento);
                await DBContext.Destroy();
                return Ok(tiposMovimiento);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update/{id}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.SOMA.TiposMovimiento.Update parData, int Id)
        {
            try
            {
                var mov = await DBContext.database.SingleByIdAsync<TiposMovimientos>(Id);
                mov.CveMovimientoID = parData.cveMovimientoID;
                mov.TipoMovimiento = parData.tipoMovimiento;
                mov.Cargo = parData.cargo;
                //mov.Factor = parData.factor;
                mov.usuario = parData.usuario;
                // mov.CorresponsalId = parData.CorresponsalId;
                // mov.gastosRubroID = parData.gastosRubroID;
                mov.AceptaDepositos = parData.aceptaDepositos;
                mov.AceptaRetiros = parData.aceptaRetiros;
                mov.AplicaIva = parData.aplicaIva;
                mov.ManejaCuentasdeOrden = parData.manejaCuentasdeOrden;
                mov.AplicaIde = parData.aplicaIDE;
                mov.PagaInteres = parData.pagaInteres;
                mov.TasaInteres = parData.tasaInteres;
                mov.RetieneIsr = parData.retieneISR;
                mov.MontoApertura = parData.montoApertura;
                mov.MontoMaximo = parData.montoMaximo;
                mov.AplicaComision = parData.aplicaComision;
                mov.MontoComision = parData.montoComision;
                // mov.RetiroId = retiroid;
                // mov.DepositoId = depositoid;
                // mov.ComisionId = comisionid;
                // mov.IvaId = ivaid;
                mov.Activa = parData.activa;
                // mov.MovAgrupaID = parData.movAgrupaID;
                mov.ProductoId = parData.productoID;
                await DBContext.database.UpdateAsync(mov);
                await DBContext.Destroy();
                return Ok(mov);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update/{id}/{depositoid}/{comisionid}/{retiroid}/{ivaid}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> UpdateDCRI(ConfiaWebApi.PeticionesRest.SOMA.TiposMovimiento.Update parData, int id, int depositoid, int comisionid, int retiroid, int ivaid)
        {
            var tDeposito = await DBContext.database.QueryAsync<CuentasContables>("WHERE CuentaID=@0", depositoid).ToArrayAsync();
            var tRetiro = await DBContext.database.QueryAsync<CuentasContables>("WHERE CuentaID=@0", retiroid).ToArrayAsync();
            var tComision = await DBContext.database.QueryAsync<CuentasContables>("WHERE CuentaID=@0", comisionid).ToArrayAsync();
            var tIva = await DBContext.database.QueryAsync<CuentasContables>("WHERE CuentaID=@0", ivaid).ToArrayAsync();

            try
            {
                var mov = await DBContext.database.SingleByIdAsync<TiposMovimientos>(id);
                mov.CveMovimientoID = parData.cveMovimientoID;
                mov.TipoMovimiento = parData.tipoMovimiento;
                mov.Cargo = parData.cargo;
                mov.Factor = parData.factor;
                mov.usuario = parData.usuario;
                mov.CorresponsalId = parData.CorresponsalId;
                mov.gastosRubroID = parData.gastosRubroID;
                mov.AceptaDepositos = parData.aceptaDepositos;
                mov.AceptaRetiros = parData.aceptaRetiros;
                mov.AplicaIva = parData.aplicaIva;
                mov.ManejaCuentasdeOrden = parData.manejaCuentasdeOrden;
                mov.AplicaIde = parData.aplicaIDE;
                mov.PagaInteres = parData.pagaInteres;
                mov.TasaInteres = parData.tasaInteres;
                mov.RetieneIsr = parData.retieneISR;
                mov.MontoApertura = parData.montoApertura;
                mov.MontoMaximo = parData.montoMaximo;
                mov.AplicaComision = parData.aplicaComision;
                mov.MontoComision = parData.montoComision;

                mov.RetiroId = retiroid;
                mov.DepositoId = depositoid;
                mov.ComisionId = comisionid;
                mov.IvaId = ivaid;

                mov.Activa = parData.activa;
                mov.MovAgrupaID = parData.movAgrupaID;
                mov.ProductoId = parData.productoID;



                if (tDeposito.Count() <= 0)
                {
                    var dict = new Dictionary<string, string>();
                    dict.Add("mensaje", "Error: no se pudo editar, El TipoMovimientos ID: " + id + " La clave de la cuenta para Deposito ID ingresada no existe en la base de Datos");
                    var output = Newtonsoft.Json.JsonConvert.SerializeObject(dict);

                    return NotFound(output);
                }
                if (tRetiro.Count() <= 0)
                {
                    var dict = new Dictionary<string, string>();
                    dict.Add("mensaje", "Error: no se pudo editar, El TipoMovimientos ID: " + id + " La clave de la cuenta para Retiro ID ingresada no existe en la base de Datos");
                    var output = Newtonsoft.Json.JsonConvert.SerializeObject(dict);

                    return NotFound(output);
                }
                if (tIva.Count() <= 0)
                {
                    var dict = new Dictionary<string, string>();
                    dict.Add("mensaje", "Error: no se pudo editar, El TipoMovimientos ID: " + id + " La clave de la cuenta para IVA ID ingresada no existe en la base de Datos");
                    var output = Newtonsoft.Json.JsonConvert.SerializeObject(dict);

                    return NotFound(output);
                }
                if (tComision.Count() <= 0)
                {
                    var dict = new Dictionary<string, string>();
                    dict.Add("mensaje", "Error: no se pudo editar, El TipoMovimientos ID: " + id + " La clave de la cuenta para Comision ID ingresada no existe en la base de Datos");
                    var output = Newtonsoft.Json.JsonConvert.SerializeObject(dict);

                    return NotFound(output);
                }
                await DBContext.database.UpdateAsync(mov);
                await DBContext.Destroy();
                return Ok(mov);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> DeleteById(int id)
        {
            var res = await DBContext.database.ExecuteAsync("delete from Bancos.TiposMovimientos WHERE Id =@0", id);
            await DBContext.Destroy();
            return Ok(res);

        }
    }
}