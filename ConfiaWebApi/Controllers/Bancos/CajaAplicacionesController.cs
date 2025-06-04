/*
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Bancos
{
    [Authorize]
    [ApiController]
    [Route("api/bancos/[controller]")]
    public class CajaAplicacionesController : ControllerBase
    {
        private DBConfiaContext DBContext;

//        public CajaAplicacionesController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Bancos.CajaAplicaciones.Get parData)
//        {
//            try
//            {
//                if (parData.CajaAplicacionID != 0)
//                    return Ok(await DBContext.database.SingleByIdAsync<CajaAplicaciones>(parData.CajaAplicacionID));


//                return Ok(await DBContext.database.FetchAsync<CorresponsalesPago>());
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }


//        [HttpPost]
//        [Route("add")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
//        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Bancos.CajaAplicaciones.Add parData)
//        {
//            try
//            {
//                var CajaAplicaion = new CajaAplicaciones() { ReferenciaID = parData.ReferenciaID, CuentaID = parData.CuentaID, Importe = parData.Importe, EstatusAplicacionID = parData.EstatusAplicacionID, MovimientoID = parData.MovimientoID, FHRegistro = parData.FHRegistro, FHPago = parData.FHPago, CreditoID = parData.CreditoID, FechaComision = parData.FechaComision, UsuarioID = parData.UsuarioID, ImporteBonificacionFija = parData.ImporteBonificacionFija, intentosAplicacion = parData.intentosAplicacion, ultimoErrorAplicacion = parData.ultimoErrorAplicacion };
//                await DBContext.database.InsertAsync(CajaAplicaion);
//                return Ok(CajaAplicaion);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

//        [HttpPost]
//        [Route("update")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
//        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.CajaAplicaciones.Update parData)
//        {
//            try
//            {
//                var CajaAplicacion = await DBContext.database.SingleByIdAsync<CajaAplicaciones>(parData.CajaAplicacionID);
//                CajaAplicacion.ReferenciaID = parData.ReferenciaID;
//                CajaAplicacion.CuentaID = parData.CuentaID;
//                CajaAplicacion.Importe = parData.Importe;
//                CajaAplicacion.EstatusAplicacionID = parData.EstatusAplicacionID;
//                CajaAplicacion.MovimientoID = parData.MovimientoID;
//                CajaAplicacion.FHRegistro = parData.FHRegistro;
//                CajaAplicacion.FHPago = parData.FHPago;
//                CajaAplicacion.CreditoID = parData.CreditoID;
//                CajaAplicacion.FechaComision = parData.FechaComision;
//                CajaAplicacion.UsuarioID = parData.UsuarioID;
//                CajaAplicacion.ImporteBonificacionFija = parData.ImporteBonificacionFija;
//                CajaAplicacion.intentosAplicacion = parData.intentosAplicacion;
//                CajaAplicacion.ultimoErrorAplicacion = parData.ultimoErrorAplicacion;





//                await DBContext.database.UpdateAsync(CajaAplicacion);
//                return Ok(CajaAplicacion);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }


    }
}
*/