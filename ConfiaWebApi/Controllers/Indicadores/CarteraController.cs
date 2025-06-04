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
    public class CarteraController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        private CultureInfo provider = CultureInfo.InvariantCulture;

        public CarteraController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        /* 
        SP Para consultar el detalle de la cartera: Indicadores.sp_Historicos_Cartera
        Argumentos del SP:
        @fecha				DATE
        ,@nivel				INT		--1 ZONAL --2 GERENTE/SUCURSAL --3 COORIDNADOR --4 Producto
        ,@SucursalId		BIGINT
        ,@CooridinadorId	BIGINT
        ,@ProductoId		BIGINT
        */

        /*
        SP Para consultar el detalle de Cero atraso: Indicadores.sp_Historicos_Cobranza_CeroDias
        Argumentos del SP:
        @fecha				DATE    
        ,@nivel				INT		--1 ZONAL --2 GERENTE --3 COORIDNADOR --4 DVs
        ,@SucursalId		BIGINT
        ,@CooridinadorId	BIGINT
        ,@DistribuidorId	BIGINT
        */

        /*
        SP Para consultar el detalle de N Días atraso: Indicadores.sp_Historicos_Cobranza_DiasAtraso(
        Argumentos del SP:
        @fecha				DATE
        ,@nivel				INT		--1 ZONAL --2 GERENTE --3 COORIDNADOR --4 DVs
        ,@SucursalId		BIGINT
        ,@CooridinadorId	BIGINT
        ,@DistribuidorId	BIGINT
        ,@DiasAtraso		INT		--1 1/15  --2 1/45    --3 46/90
        */

        /// <summary>
        /// Nueva versión de las funciones de indicadores, ahora utilizando los SPs
        /// </summary>
        /// <param name="SucursalID">SucursalID de la cual se requiere obtener el indicador</param>
        /// <param name="Fecha">Fecha a obtener el indicador</param>
        /// <returns></returns>
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

                // Cobranza en la sucursal actual a nivel coordinador
                var CobranzaPorCoordinador__DiaCero = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_CeroDias @0, 3, @1, 0, 0", dFecha, SucursalID, 0, 0).ToArrayAsync();

                // Cobranza en la sucursal actual a nivel socia
                var CobranzaPorDistribuidor__DiaCero = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_CeroDias @0, 3, @1, 0, 0", dFecha, SucursalID, 0, 0).ToArrayAsync();
                var Distribuidoras__0__Diasatraso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_CeroDias @0,4,@1,0,0", dFecha, SucursalID).ToArrayAsync();
                var Distribuidoras = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_DiasAtraso @0,4,@1,0,0,''", dFecha, SucursalID).ToArrayAsync();

                // Cartera de la sucursal
                var DetalleCartera__Sucursal = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCartera>("EXEC Indicadores.sp_Historicos_Cartera @0, 2, @1, 0, -1", dFecha, SucursalID).ToArrayAsync();

                // Generamos un objeto dynamico y lo enviamos al frontend
                return Ok(new { CobranzaPorCoordinador__DiaCero, CobranzaPorDistribuidor__DiaCero, DetalleCartera__Sucursal, Distribuidoras, Distribuidoras__0__Diasatraso });
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error: " + ex.Message);
            }
        }

        /// <summary>
        /// Nueva versión de las funciones de indicadores, ahora utilizando los SPs
        /// </summary>
        /// <param name="CoordinadorID">SucursalID de la cual se requiere obtener el indicador</param>
        /// <param name="Fecha">Fecha a obtener el indicador</param>
        /// <returns></returns>
        [HttpGet]
        [Route("cobranza__coordinador/{CoordinadorID}/{Fecha}")]
        [Authorize]
        public async Task<IActionResult> CobranzaCoordinador(int CoordinadorID, string Fecha)   
        {
            // Parseamos la fecha
            var dFechaVals = Fecha.Split("-");
            var dFecha = new DateTime(int.Parse(dFechaVals[2]), int.Parse(dFechaVals[1]), int.Parse(dFechaVals[0]));

            // Detalle de la cartera de nuestro coordiador
            var Coordinador = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_CeroDias @0,3,0,@1,0", dFecha, CoordinadorID, 0, 0).FirstOrDefaultAsync();

            // Cartera del coordinador
            var Cartera = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCartera>("EXEC Indicadores.sp_Historicos_Cartera @0, 2, 0, @1, -1", dFecha, CoordinadorID).ToArrayAsync();

            // Cuentas con 0 días de atraso de nuestro coordinador
            var Cuentas0DiasAtraso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores. IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_CeroDias @0,4,0,@1,0", dFecha, CoordinadorID, 0, 0).ToArrayAsync();

            // Colocacion e improductivas
            var ColocacionImproductivas = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorColocacionImproductivas>("EXEC Indicadores.sp_Historicos_ColocacionImproductivas @0, 3, 0, @1, -1", dFecha, CoordinadorID, 0, 0).ToArrayAsync();

            // Obtenemos la cobranza general
            var Distribuidoras = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_DiasAtraso @0,4,0,@1,0,0,''", dFecha, CoordinadorID).ToArrayAsync();
            var Distribuidoras__1_15__Diasatraso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_DiasAtraso @0,4,0,@1,0,1,''", dFecha, CoordinadorID).ToArrayAsync();
            var Distribuidoras__1_45__Diasatraso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_DiasAtraso @0,4,0,@1,0,2,''", dFecha, CoordinadorID).ToArrayAsync();
            var Distribuidoras__46_90__Diasatraso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Custom.Indicadores.IndicadorCobranza>("EXEC Indicadores.sp_Historicos_Cobranza_DiasAtraso @0,4,0,@1,0,3,''", dFecha, CoordinadorID).ToArrayAsync();

            // Regresamos nuestro indicador
            await ConexionBD.Destroy();
            return Ok(new
            {
                Coordinador,
                Cartera,
                Cuentas0DiasAtraso,
                ColocacionImproductivas,
                Distribuidoras,
                Distribuidoras__1_15__Diasatraso,
                Distribuidoras__1_45__Diasatraso,
                Distribuidoras__46_90__Diasatraso
            });
        }
    }
}