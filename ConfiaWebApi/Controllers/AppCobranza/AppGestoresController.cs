using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Cortes;
using DBContext.DBConfia.Seguridad;
using Clientes = DBContext.DBConfia.Creditos.Clientes;
using Distribuidor = DBContext.DBConfia.Distribuidores.Clientes;
using DBContext.DBConfia.Cobranza;
using System.Collections.Generic;

namespace ConfiaWebApi.Controllers.AppGestoresController
{
    [Authorize]
    [ApiController]
    [Route("api/AppCobranza/[controller]")]
    public class AppGestores : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppGestores(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        [HttpPost]
        [Route("obtenerReferenciasVR")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> getReferenciasDistVR(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getReferenciasVR parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.DatosReferencias_Dist_VR_VW>("WHERE Referencia=@0 AND ProductoID=@1", parData.DistribuidorID, producto).ToArrayAsync();
                var res1 = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res
                };
                await DBContext.Destroy();
                return Ok(res1);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();


                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });

            }
        }


        [HttpPost]
        [Route("obtenerTiposActivos")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> getTiposActivos()
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.ActivosArticulos>("WHERE Activo = 1 ").ToArrayAsync();
                var res1 = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res
                };
                await DBContext.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("obtenerDireccionVR")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> getDireccionVR(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getDireccionVR parData)
        {
            try
            {
                var direccionVR = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.VR_Paso_DatosDistGenerales>("WHERE Referencia = @0", parData.PersonaID).SingleOrDefaultAsync();
                if (direccionVR != null)
                {

                    var res1 = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = new
                        {
                            NombreVialidad = direccionVR.NombreVialidad,
                            LugarNacimiento = direccionVR.LugarNacimiento,
                        }
                    };
                    await DBContext.Destroy();
                    return Ok(res1);
                }
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new
                    {
                        NombreVialidad = "N/C",
                        LugarNacimiento = "N/C",
                    }
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("insertarPagoActivo")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> postInsertarPagoActivo(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.insertarPago parData)
        {
            try
            {
                var _DistribuidorTicket = new DBContext.DBConfia.Cobranza.DistribuidoresTicket();
                _DistribuidorTicket.DistribuidorID = parData.DistribuidorID;
                _DistribuidorTicket.GestorID = parData.GestorID;
                _DistribuidorTicket.FechaRegistro = DateTime.Now;
                _DistribuidorTicket.Activo = true;
                _DistribuidorTicket.OrigenVR = parData.OrigenVR;
                _DistribuidorTicket.Monto = parData.Monto;
                _DistribuidorTicket.SaldoAntes = parData.SaldoAntes;
                _DistribuidorTicket.Mercancia = true;
                _DistribuidorTicket.TipoActivo = parData.TipoActivo;
                await DBContext.database.InsertAsync(_DistribuidorTicket);

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new
                    {
                        Ticket = _DistribuidorTicket.TicketID,
                        NuevoSaldo = _DistribuidorTicket.SaldoAntes
                    }
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }


        [HttpPost]
        [Route("insertarPago")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> postInsertarPago(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.insertarPago parData)
        {
            try
            {
                var _DistribuidorTicket = new DBContext.DBConfia.Cobranza.DistribuidoresTicket();
                _DistribuidorTicket.DistribuidorID = parData.DistribuidorID;
                _DistribuidorTicket.GestorID = parData.GestorID;
                _DistribuidorTicket.FechaRegistro = DateTime.Now;
                _DistribuidorTicket.Activo = true;
                _DistribuidorTicket.OrigenVR = parData.OrigenVR;
                _DistribuidorTicket.Monto = parData.Monto;
                _DistribuidorTicket.SaldoAntes = parData.SaldoAntes;
                await DBContext.database.InsertAsync(_DistribuidorTicket);

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new
                    {
                        Ticket = _DistribuidorTicket.TicketID,
                        NuevoSaldo = _DistribuidorTicket.SaldoAntes
                    }
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }


        [HttpPost]
        [Route("obtenerConvenios")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> getConvenios(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getListaConvenios parData)
        {
            try
            {
                var res2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.Convenios_VW>("WHERE UsuarioID=@0 order by FechaRegistro desc", parData.UsuarioID).ToArrayAsync();
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res2
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("obtenerTickets")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> getTickets(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getListaTicket2 parData)
        {
            try
            {
                var res2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.DistribuidoresTicket_VW>("WHERE GestorID=@0 order by FechaRegistro desc", parData.GestorID).ToArrayAsync();
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res2
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("obtenerTicketsXdv")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> getTicketsDV(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getListaTicket3 parData)
        {
            try
            {
                var res2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.DistribuidoresTicket_VW>("WHERE GestorID=@0 and DistribuidorID=@1", parData.GestorID, parData.DistribuidorID).ToArrayAsync();
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res2
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }


        [HttpPost]
        [Route("obtenerDireccion")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> GetDireccion(PeticionesRest.AppCobranzaPeticiones.AppCobranza.ObtenerDireccion parData)
        {
            try
            {
                var res2 = await DBContext.database.QueryAsync<Direcciones_VW>("SELECT top 1 dv.* FROM [General].PersonasDirecciones pd left join[General].Direcciones d on pd.DireccionID = d.DireccionID left join[General].Direcciones_VW dv on d.DireccionID = dv.DireccionID where pd.PersonaID = @0 order by d.CreacionFecha desc", parData.PersonaID).SingleOrDefaultAsync();
                if (res2 != null)
                {
                    var res = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = res2
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var res = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = new
                        {
                            DireccionID = 0,
                            AsentamientoID = 0,
                            Asentamiento = "NO PROPORCIONADO",
                            NombreVialidad = "NO PROPORCIONADO",
                            NumeroExterior = "NO PROPORCIONADO",
                            NumeroInterior = "NO PROPORCIONADO",
                            Estado = "NO PROPORCIONADO",
                            Municipio = "NO PROPORCIONADO",
                            Ciudad = "NO PROPORCIONADO",
                            CodigoPostal = 0,
                            VialidadTipo = "NO PROPORCIONADO",
                            OrientacionVialidad = "NO PROPORCIONADO",
                            CreacionFecha = "NO PROPORCIONADO",
                            zona = "NO PROPORCIONADO",
                            ViviendaTipo = "NO PROPORCIONADO",
                            Asentamiendo = "NO PROPORCIONADO",
                            ReferenciasGeograficas = "NO PROPORCIONADO",
                        }
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }



            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("obtenerInformacionGestor")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> GetInfoGestor(PeticionesRest.AppCobranzaPeticiones.AppCobranza.InfoGestor parData)
        {
            try
            {
                var res2 = await DBContext.database.QueryAsync<Personas_VW>("WHERE GestorCobranzaID = @0", parData.GestorID).SingleOrDefaultAsync();
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res2
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("obtenerMontoPagar")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> Get(PeticionesRest.AppCobranzaPeticiones.AppCobranza.MontoDV parData)
        {
            try
            {
                var obj = new { DistribuidorID = parData.DistribuidorID };
                var res = await DBContext.database.FetchAsync<AbonosGestores_VW>("WHERE DistribuidorID = @DistribuidorID", obj);
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("obtenerCobranzaXgestorVR")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> Get(PeticionesRest.AppCobranzaPeticiones.AppCobranza.CarteraGestor parData)
        {
            try
            {
                var res2 = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.RelacionGestoresDistribuidoresAgrupado_VR_VW>("WHERE GestorID = @0", parData.GestorID);
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res2
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("obtenerCobranzaXgestor")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> GetCobranzaGestor(PeticionesRest.AppCobranzaPeticiones.AppCobranza.CarteraGestor parData)
        {
            try
            {
                var res2 = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.RelacionGestoresDistribuidores_VW>("WHERE GestorID = @0 AND Activo = 1 ORDER BY SucursalID, ClasificadorGrupoID DESC", parData.GestorID);
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res2
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpPost]
        [Route("getDirecciones")]
        [Authorize]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> ObtenerDirecciones(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getDirecciones parData)
        {
            try
            {
                var obj = new { PersonaID = parData.PersonaID };
                var res2 = await DBContext.database.FetchAsync<DatosGeneralesUltimoRegistro_VW>("WHERE PersonaID = @PersonaID", obj);
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res2
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpPost]
        [Route("getListaTicketbyID")]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> get(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getListaTicket2 parData)
        {
            try
            {
                var obj = new { DistribuidorID = parData.GestorID };
                var res = await DBContext.database.FetchAsync<DistribuidoresTicket>("WHERE DistribuidorID = @DistribuidorID ORDER BY Activo DESC, TicketID DESC", obj);

                List<object> respList = new List<object>();
                int i = 0;
                for (i = 0; i < res.Count; i++)
                {
                    var resultado = new
                    {
                        TicketID = res[i].TicketID,
                        DistribuidorID = res[i].DistribuidorID,
                        FechaRegistro = res[i].FechaRegistro.ToString("dd/MM/yyyy"),
                        Activo = res[i].Activo,
                        Monto = res[i].Monto
                    };
                    respList.Add(resultado);
                }
                var res3 = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = respList
                };
                await DBContext.Destroy();
                return Ok(res3);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }




        [HttpPost]
        [Route("getReferenciasbyID")]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getReferencias parData)
        {
            var obj = new { DistribuidorID = parData.DistribuidorID };
            var res = await DBContext.database.FetchAsync<Referencia>("WHERE DistribuidorID = @DistribuidorID", obj);
            var res3 = new
            {
                resultCode = 0,
                resultDesc = "OK.",
                data = res
            };
            await DBContext.Destroy();
            return Ok(res3);
        }

        [HttpPost]
        [Route("getReferenciaAvales")]
        [Code.TProteccionAppVales]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto.getReferenciaAvales parData)
        {
            var obj = new { DistribuidorID = parData.DistribuidorID };
            var resultado1 = await DBContext.database.FetchAsync<AvalesDistribuidorDatosGenerales_VW>("WHERE DistribuidorID = @DistribuidorID", obj);

            if (resultado1.Count == 0)
            {
                var res3 = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = resultado1
                };
                await DBContext.Destroy();
                return Ok(res3);
            }

            var obj2 = new { resultado1[resultado1.Count - 1].NumeroFilas };
            var resultado2 = await DBContext.database.FetchAsync<AvalesDistribuidorDatosGenerales_VW>("WHERE NumeroFilas = @NumeroFilas", obj2);
            await DBContext.Destroy();
            {
                var res3 = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = resultado2
                };
                await DBContext.Destroy();
                return Ok(res3);
            }
        }

        [HttpPost]
        [Route("obtenerInfoGestorID")]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> getInfoGestor(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getListaTicket2 parData)
        {
            try
            {
                var obj = new { DistribuidorID = parData.GestorID };
                var res = await DBContext.database.FetchAsync<DistribuidoresTicket>("WHERE DistribuidorID = @DistribuidorID ORDER BY Activo DESC, TicketID DESC", obj);

                List<object> respList = new List<object>();
                int i = 0;
                for (i = 0; i < res.Count; i++)
                {
                    var resultado = new
                    {
                        TicketID = res[i].TicketID,
                        DistribuidorID = res[i].DistribuidorID,
                        FechaRegistro = res[i].FechaRegistro.ToString("dd/MM/yyyy"),
                        Activo = res[i].Activo,
                        Monto = res[i].Monto
                    };
                    respList.Add(resultado);
                }
                var res3 = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = respList
                };
                await DBContext.Destroy();
                return Ok(res3);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }



    }
}
