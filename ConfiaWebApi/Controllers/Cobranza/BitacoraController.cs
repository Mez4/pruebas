using DBContext.DBConfia;
using DBContext.DBConfia.Cobranza;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Cobranza
{
    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]
    public class BitacoraController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public BitacoraController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.Bitacora.get parData)
        {

            try
            {

                var res = await DBContext.database.FetchAsync<Bitacora_VW>();

                List<object> respList = new List<object>();
                int i = 0;

                for (i = 0; i < res.Count; i++)
                {
                    var resultado = new
                    {
                        Id = res[i].Id,
                        UsuarioNombre = res[i].UsuarioNombre,
                        PersonaLogueadaNombre = res[i].PersonaLogueadaNombre,
                        GestorNombre = res[i].GestorNombre,
                        EncargadoNombre = res[i].EncargadoNombre,
                        MesaCobranzaNombre = res[i].MesaCobranzaNombre,
                        DistribuidorNombre = res[i].DistribuidorNombre,
                        Clave = res[i].Clave,
                        Descripcion = res[i].Descripcion,
                        Fecha = res[i].Fecha.ToString("dd/MM/yyyy")
                    };
                    respList.Add(resultado);
                }
                await DBContext.Destroy();
                return Ok(respList);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getProcesos")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetProcesos(ConfiaWebApi.PeticionesRest.Cobranza.Bitacora.getProcesos parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Procesos>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("addProcesos")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> AddPProcesos(ConfiaWebApi.PeticionesRest.Cobranza.Bitacora.addP parData)
        {
            try
            {
                var Procesos = new Procesos() { Clave = parData.Clave, Descripcion = parData.Descripcion, Activo = parData.activo };
                await DBContext.database.InsertAsync<Procesos>(Procesos);
                await DBContext.Destroy();
                return Ok(Procesos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("updProcesos")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> UpdProcesos(ConfiaWebApi.PeticionesRest.Cobranza.Bitacora.updP parData)
        {
            try
            {
                // var Procesos = new Procesos() { Clave = parData.Clave, Descripcion = parData.Descripcion, Activo = parData.activo };
                
                var Procesos = await DBContext.database.SingleByIdAsync<Procesos>(parData.ProcesoId);
                Procesos.Clave = parData.Clave;                                         
                Procesos.Descripcion = parData.Descripcion;
                Procesos.Activo = parData.activo;
                await DBContext.database.UpdateAsync(Procesos);
                await DBContext.Destroy();
                return Ok(Procesos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
