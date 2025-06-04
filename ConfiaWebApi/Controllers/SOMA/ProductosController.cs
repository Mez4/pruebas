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
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class ProductosController : ControllerBase
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
        public ProductosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var productos = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Productos>();
            var empresa = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
            var tasasTipo = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.TasasTipos>();
            var argupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();


            var result = productos.Select(c => new
            {
                productoID = c.ProductoID,
                empresaID = empresa.Where(ws => ws.empresaId == c.EmpresaId).Select(sc1 => new
                {
                    id = sc1.empresaId,
                    nombre = sc1.empresaNombre,
                    rfc = sc1.empresaRfc,
                    dirFiscal = sc1.empresaDireccionFiscal,
                    regpPatronal = sc1.empresaRegistroPatronal,
                    razonSocial = sc1.empresaRazonSocial
                }).SingleOrDefault(),
                producto = c.Producto,
                activo = c.Activo,
                tasaTipoID = tasasTipo.Where(ws => ws.TasaTipoId == c.TasaTipoId).Select(sc2 => new
                {
                    tasaTipoID = sc2.TasaTipo,
                    tasaTipo = sc2.TasaTipo,
                    capitalizacionesPorMes = sc2.capitalizacionesPorMes,
                    capitalizacionesPorAnio = sc2.capitalizacionesPorAnio,
                    usuarioRegistro = sc2.UsuarioRegistro,
                    usuarioModifico = sc2.UsuarioModifico
                }).SingleOrDefault(),
                diasPago = c.DiasPago,
                diasParaCorte = c.DiaParaCorte,
                requiereDistribuidor = true,
                requiereGrupo = c.RequiereGrupo,
                validaDisponible = c.ValidaDisponible,
                restructura = c.Restructura,
                generaDesembolso = c.GeneraDesembolso,
                seguroFinanciado = c.SeguroFinanciado,
                canje = c.Canje,
                desglosarIVA = c.DesglosarIVA,
                edadMinima = c.EdadMinima,
                edadMaxima = c.EdadMaxima,
                capitalAlFinal = c.CapitalAlFinal,
                cargoFinanciado = c.CargoFinanciado,
                cargoAlInicio = c.CargoAlInicio,
                activaCredito = c.ActivaCredito,
                creditosLiquidadosReq = c.CreditosLiquidadosReq,
                permisoEspecial = c.PermisoEspecial,
                validarCondiciones = c.ValidarCondiciones,
                fhRegitro = c.FhRegitro,
                fhMoficiacion = c.FhMoficiacion,
                aplicaIVAInteres = true,
                aplicaIVASeguro = true,
                aplicaIVAManejoCuenta = false,
                logo = c.Logo,
                adicProductoID = 19,
                usuarioRegistro = c.UsuarioRegistro,
                usuarioModifico = c.UsuarioModifico,
                ctaCapitalID = c.CtaCapitalId,
                ctaInteresNormalID = c.CtaInteresNormalId,
                ctaInteresMoraID = c.CtaInteresMoraId,
                ctaIvaID = c.CtaIvaId,
                ctaInteresNormDeudorID = c.CtaInteresNormAcreedorId,
                ctaInteresNormAcreedorID = c.CtaInteresNormAcreedorId,
                ctaInteresMoraDeudorID = c.CtaInteresMoraDeudorId,
                ctaInteresMoraAcreedorID = c.CtaInteresMoraAcreedorId
            }).ToArray();
            await DBContext.Destroy();
            return Ok(result);
        }

        [HttpGet]
        [Route("find-by-id/{ProductoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int ProductoID)
        {
            var productos = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID = @0", ProductoID).ToArrayAsync();
            var empresa = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
            var tasasTipo = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.TasasTipos>();
            var argupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();

            if (productos.LongCount() >= 1)
            {
                var result = productos.Select(c => new
                {
                    productoID = c.ProductoID,
                    empresaID = empresa.Where(ws => ws.empresaId == c.EmpresaId).Select(sc1 => new
                    {
                        id = sc1.empresaId,
                        nombre = sc1.empresaNombre,
                        rfc = sc1.empresaRfc,
                        dirFiscal = sc1.empresaDireccionFiscal,
                        regpPatronal = sc1.empresaRegistroPatronal,
                        razonSocial = sc1.empresaRazonSocial
                    }).SingleOrDefault(),
                    producto = c.Producto,
                    activo = c.Activo,
                    tasaTipoID = tasasTipo.Where(ws => ws.TasaTipoId == c.TasaTipoId).Select(sc2 => new
                    {
                        tasaTipoID = sc2.TasaTipo,
                        tasaTipo = sc2.TasaTipo,
                        capitalizacionesPorMes = sc2.capitalizacionesPorMes,
                        capitalizacionesPorAnio = sc2.capitalizacionesPorAnio,
                        usuarioRegistro = sc2.UsuarioRegistro,
                        usuarioModifico = sc2.UsuarioModifico
                    }).SingleOrDefault(),
                    diasPago = c.DiasPago,
                    diasParaCorte = c.DiaParaCorte,
                    requiereDistribuidor = true,
                    requiereGrupo = c.RequiereGrupo,
                    validaDisponible = c.ValidaDisponible,
                    restructura = c.Restructura,
                    generaDesembolso = c.GeneraDesembolso,
                    seguroFinanciado = c.SeguroFinanciado,
                    canje = c.Canje,
                    desglosarIVA = c.DesglosarIVA,
                    edadMinima = c.EdadMinima,
                    edadMaxima = c.EdadMaxima,
                    capitalAlFinal = c.CapitalAlFinal,
                    cargoFinanciado = c.CargoFinanciado,
                    cargoAlInicio = c.CargoAlInicio,
                    activaCredito = c.ActivaCredito,
                    creditosLiquidadosReq = c.CreditosLiquidadosReq,
                    permisoEspecial = c.PermisoEspecial,
                    validarCondiciones = c.ValidarCondiciones,
                    fhRegitro = c.FhRegitro,
                    fhMoficiacion = c.FhMoficiacion,
                    aplicaIVAInteres = true,
                    aplicaIVASeguro = true,
                    aplicaIVAManejoCuenta = false,
                    logo = c.Logo,
                    adicProductoID = 19,
                    cuentaMaestraID = argupaciones.Where(ws => ws.AgrupacionID == c.CuentaMaestraId).Select(sc4 => new
                    {
                        agrupacionID = sc4.AgrupacionID,
                        clave = sc4.Clave,
                        descripcion = sc4.Descripcion,
                        activo = sc4.Activo
                    }).SingleOrDefault(),
                    usuarioRegistro = c.UsuarioRegistro,
                    usuarioModifico = c.UsuarioModifico,
                    ctaCapitalID = c.CtaCapitalId,
                    ctaInteresNormalID = c.CtaInteresNormalId,
                    ctaInteresMoraID = c.CtaInteresMoraId,
                    ctaIvaID = c.CtaIvaId,
                    ctaInteresNormDeudorID = c.CtaInteresNormAcreedorId,
                    ctaInteresNormAcreedorID = c.CtaInteresNormAcreedorId,
                    ctaInteresMoraDeudorID = c.CtaInteresMoraDeudorId,
                    ctaInteresMoraAcreedorID = c.CtaInteresMoraAcreedorId
                }).ToArray();
                await DBContext.Destroy();
                return Ok(result);
            }
            else
            {
                await DBContext.Destroy();
                return NotFound();
            }
        }
    }
}