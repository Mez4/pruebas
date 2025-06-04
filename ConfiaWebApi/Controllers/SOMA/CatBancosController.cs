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
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CatBancos : ControllerBase
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
        public CatBancos(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los agrupaciones
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var archivosDispersion = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>();
            var catTipoBanco = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            var catBancos = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>();
            ArrayList res = new();

            try
            {
                foreach (var T in catBancos)
                {

                    res.Add(new
                    {
                        bancoID = T.BancoID,
                        nombre = T.Nombre,
                        activo = T.Activo,
                        archivoDispersion = archivosDispersion.Where(wer => wer.ArchivoDispersionID == T.ArchivoDispersionID).Select(sc => new { archivoDispersionID = sc.ArchivoDispersionID, clave = sc.Clave, descripcion = sc.Descripcion }).SingleOrDefault(),
                        tipoBanco = catTipoBanco.Where(wer => wer.TipoBancoId == T.TipoBancoId).Select(sc => new { tipoBancoID = sc.TipoBancoId, descripcion = sc.Descripcion }).SingleOrDefault()

                    });
                }
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception e)
            {
                await DBContext.Destroy();
                return BadRequest(e.Message);
            }
            /*             return Ok(await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>("select * from Bancos.CatalogoBancos cb inner join Catalogos.TipoArchivoDispersion tad on cb.ArchivoDispersionID = tad.ArchivoDispersionID inner join Bancos.CatalogoTipoBanco ctb  on cb.TipoBancoId = ctb.TipoBancoId "));
             */
        }


        [HttpGet]
        [Route("find-active/")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerActivo()
        {
            var archivosDispersion = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>();
            var catTipoBanco = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            var catBancos = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoBancos>("WHERE Activo=@0", 1).ToArrayAsync();

            ArrayList res = new();

            try
            {
                foreach (var T in catBancos)
                {

                    res.Add(new
                    {
                        bancoID = T.BancoID,
                        nombre = T.Nombre,
                        activo = T.Activo,
                        archivoDispersion = archivosDispersion.Where(wer => wer.ArchivoDispersionID == T.ArchivoDispersionID).Select(sc => new { archivoDispersionID = sc.ArchivoDispersionID, clave = sc.Clave, descripcion = sc.Descripcion }).SingleOrDefault(),
                        tipoBanco = catTipoBanco.Where(wer => wer.TipoBancoId == T.TipoBancoId).Select(sc => new { tipoBancoID = sc.TipoBancoId, descripcion = sc.Descripcion }).SingleOrDefault()

                    });
                }
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception e)
            {
                await DBContext.Destroy();
                return BadRequest(e.Message);
            }

        }
        //Busqueda de banco por ID
        [HttpGet]
        [Route("find-by-bank/{BancoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerPorId(int BancoID)
        {
            var archivosDispersion = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>();
            var catTipoBanco = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            var catBancos = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoBancos>("WHERE BancoID=@0", BancoID).ToArrayAsync();

            ArrayList res = new();

            try
            {

                foreach (var T in catBancos)
                {

                    res.Add(new
                    {
                        bancoID = T.BancoID,
                        nombre = T.Nombre,
                        activo = T.Activo,
                        archivoDispersion = archivosDispersion.Where(wer => wer.ArchivoDispersionID == T.ArchivoDispersionID).Select(sc => new { archivoDispersionID = sc.ArchivoDispersionID, clave = sc.Clave, descripcion = sc.Descripcion }).SingleOrDefault(),
                        tipoBanco = catTipoBanco.Where(wer => wer.TipoBancoId == T.TipoBancoId).Select(sc => new { tipoBancoID = sc.TipoBancoId, descripcion = sc.Descripcion }).SingleOrDefault()

                    });
                }
                await DBContext.Destroy();
                if (catBancos.LongCount() >= 1)
                {
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    return NotFound();
                }

            }
            catch (Exception e)
            {
                await DBContext.Destroy();
                return BadRequest(e.Message);
            }
        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatBancos.Agregar parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            var Bancos = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>();

            //Se genera el registro de la dispersion
            var Banco = new DBContext.DBConfia.Bancos.CatalogoBancos()
            {
                Nombre = parData.nombre,
                Activo = parData.activo,
                ArchivoDispersionID = parData.archivoDispersionID,
                //  Logo = FilesManager.ConvertFiletoByteArray(parData.Logo),
                TipoBancoId = parData.tipoBancoID

            };
            try
            {
                // Ingresamos la agrupacion a la bd
                await DBContext.database.InsertAsync(Banco);

                var dict = new Dictionary<string, string>();
                dict.Add("mensaje", "");
                var output = Newtonsoft.Json.JsonConvert.SerializeObject(dict);
                await DBContext.Destroy();
                return StatusCode(201);

            }
            catch (Exception e)
            {
                await DBContext.Destroy();
                return BadRequest(e.Message);
            }


        }

        [HttpPut]
        [Route("update/{BancoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.SOMA.CatBancos.Actualizar parData, int BancoID)
        {
            try
            {
                var Banco = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoBancos>(BancoID);

                Banco.Nombre = parData.nombre;
                Banco.Activo = parData.activo;
                Banco.TipoBancoId = parData.tipoBancoID;
                Banco.ArchivoDispersionID = parData.archivoDispersionID;
                //Banco.Logo = FilesManager.ConvertFiletoByteArray(parData.Logo);

                await DBContext.database.UpdateAsync(Banco);
                await DBContext.Destroy();
                return Ok(Banco);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("delete/{DispersionID}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int DispersionID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            var dispersion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>(DispersionID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Catalogos.TipoArchivoDispersion WHERE ArchivoDispersionID=@0", DispersionID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al elimnar la dispersion: " + ex.Message);
            }
        }

    }
}