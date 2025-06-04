
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Catalogos;
using System.IO;
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Bancos
{
    [Authorize]
    [ApiController]
    [Route("api/Bancos/[controller]")]
    public class BancoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public BancoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        //[Code.TProteccionAdmin]
        public async Task<IActionResult> Get(PeticionesRest.Bancos.Banco.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<CatalogoBancos>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var TiposArchivoDispersion = await DBContext.database.FetchAsync<TipoArchivoDispersion>();

                    var Banco = (await DBContext.database.FetchAsync<CatalogoBancos>())
                        .Select(x => new //DBContext.DBConfia.Bancos.CatalogoBancos()
                        {
                            x.BancoID,
                            x.Nombre,
                            x.ArchivoDispersionID,
                            x.Logo, //String.Format("{0}://{1}{2}/wwwroot/Archivos/LogoBancos/{3}", Request.Scheme, Request.Host, Request.PathBase, x.LogoImg)
                            x.Activo,
                            TipoArchivoDispersion = TiposArchivoDispersion.Where(t => t.ArchivoDispersionID == x.ArchivoDispersionID).FirstOrDefault()
                        }).ToList();
                    await DBContext.Destroy();
                    return Ok(Banco);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }

            //return Ok(await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>());
        }

        [HttpPost]
        [Route("getBanco")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetBanco(PeticionesRest.Bancos.Banco.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<CatalogoBancos>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var TiposArchivoDispersion = await DBContext.database.FetchAsync<TipoArchivoDispersion>();

                    var Banco = (await DBContext.database.FetchAsync<CatalogoBancos>())
                        .Select(x => new //DBContext.DBConfia.Bancos.CatalogoBancos()
                        {
                            x.BancoID,
                            x.Nombre,
                            x.ArchivoDispersionID,
                            x.Logo, //String.Format("{0}://{1}{2}/wwwroot/Archivos/LogoBancos/{3}", Request.Scheme, Request.Host, Request.PathBase, x.LogoImg)
                            x.Activo,
                            TipoArchivoDispersion = TiposArchivoDispersion.Where(t => t.ArchivoDispersionID == x.ArchivoDispersionID).FirstOrDefault()
                        }).ToList();
                    await DBContext.Destroy();
                    return Ok(Banco);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }

            //return Ok(await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>());
        }

        [HttpPost]
        [Route("getprod")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Getprod(PeticionesRest.Bancos.Banco.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<CatalogoBancos>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var TiposArchivoDispersion = await DBContext.database.FetchAsync<TipoArchivoDispersion>();

                    var Banco = (await DBContext.database.FetchAsync<CatalogoBancos>())
                        .Select(x => new //DBContext.DBConfia.Bancos.CatalogoBancos()
                        {
                            x.BancoID,
                            x.Nombre,
                            x.ArchivoDispersionID,
                            x.Logo, //String.Format("{0}://{1}{2}/wwwroot/Archivos/LogoBancos/{3}", Request.Scheme, Request.Host, Request.PathBase, x.LogoImg)
                            x.Activo,
                            TipoArchivoDispersion = TiposArchivoDispersion.Where(t => t.ArchivoDispersionID == x.ArchivoDispersionID).FirstOrDefault()
                        }).ToList();
                    await DBContext.Destroy();
                    return Ok(Banco);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }

            //return Ok(await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>());
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("add")]
        [Authorize]
        public async Task<IActionResult> Add([FromForm] PeticionesRest.Bancos.Banco.Add parData)
        {
            try
            {
                //string imgName;

                //if (parData.file != null)
                //{
                //    imgName = await FilesManager.SaveImage(parData.file);
                //}
                //else
                //{
                //    imgName = "noimage.png";
                //}

                var Banco = new CatalogoBancos()
                {
                    Nombre = parData.Nombre,
                    Activo = parData.Activo,
                    ArchivoDispersionID = parData.ArchivoDispersionID,
                    Logo = FilesManager.ConvertFiletoByteArray(parData.Logo)
                };

                await DBContext.database.InsertAsync(Banco);

                var TipoArchivoDispersion = await DBContext.database.SingleByIdAsync<TipoArchivoDispersion>(Banco.ArchivoDispersionID);

                var res = new
                {
                    Banco.BancoID,
                    Banco.Nombre,
                    Banco.Activo,
                    Banco.ArchivoDispersionID,
                    Banco.Logo,
                    TipoArchivoDispersion
                    //LogoImg = String.Format("{0}://{1}{2}/wwwroot/Archivos/LogoBancos/{3}", Request.Scheme, Request.Host, Request.PathBase, Banco.LogoImg)
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

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("update")]
        [Authorize]
        public async Task<IActionResult> Update([FromForm] PeticionesRest.Bancos.Banco.Update parData)
        {
            try
            {
                var Banco = await DBContext.database.SingleByIdAsync<CatalogoBancos>(parData.BancoID);

                //string imgName;

                //if (parData.file != null)
                //{
                //    if (Banco.LogoImg != "noimage.png")
                //    {
                //        FilesManager.DeleteImage(Banco.LogoImg);
                //    }

                //    imgName = await FilesManager.SaveImage(parData.file);
                //}
                //else
                //{
                //    imgName = Banco.LogoImg;
                //}

                Banco.Nombre = parData.Nombre;
                Banco.Activo = parData.Activo;
                Banco.ArchivoDispersionID = parData.ArchivoDispersionID;
                Banco.Logo = FilesManager.ConvertFiletoByteArray(parData.Logo);
                // Banco.EsBanco = parData.EsBanco;

                await DBContext.database.UpdateAsync(Banco);

                var TipoArchivoDispersion = await DBContext.database.SingleByIdAsync<TipoArchivoDispersion>(Banco.ArchivoDispersionID);

                var res = new
                {
                    Banco.BancoID,
                    Banco.Nombre,
                    Banco.Activo,
                    Banco.ArchivoDispersionID,
                    Banco.Logo,
                    // Banco.EsBanco,
                    TipoArchivoDispersion
                    //    LogoImg = String.Format("{0}://{1}{2}/wwwroot/Archivos/LogoBancos/{3}", Request.Scheme, Request.Host, Request.PathBase, Banco.LogoImg)
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
    }
}
