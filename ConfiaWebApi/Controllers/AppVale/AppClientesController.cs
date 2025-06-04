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
using Microsoft.Extensions.Configuration;
using System.Data;
using DBContext.DBConfia.Cortes;
using DBContext.DBConfia.Seguridad;
using ConfiaWebApi.Code;
using Clientes = DBContext.DBConfia.Creditos.Clientes;
using Distribuidor = DBContext.DBConfia.Distribuidores.Clientes;
using DBContext.DBConfia.Catalogos;
using Newtonsoft.Json;
using ConfiaWebApi.RespuestasPersonalizadas.RENAPO.DatosCURP;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc.Razor;
using System.Net.Http;
using System.Text;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Globalization;
using ConfiaWebApi.Controllers.General;
using ConfiaWebApi.PeticionesRest.General.CodigoSMS;
using Microsoft.AspNetCore.Hosting;
using Org.BouncyCastle.Asn1.X509.SigI;

namespace ConfiaWebApi.Controllers.AppDistribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/AppVale/[controller]")]
    public class AppClientesController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;
        private readonly SqlConnection sqlConnection;
        private readonly IWebHostEnvironment env;

        public AppClientesController(DBConfiaContext _DBContext, IWebHostEnvironment _env, IConfiguration _Configuration)
        {

            this.Configuracion = _Configuration;
            IConfiguration Configuration;

            Configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", false, true)
                .Build();

            var sqlServerConfig = Configuration.GetSection("ConnectionStrings");
            string conn = sqlServerConfig["DBConfia_Personas"];

            sqlConnection = new(conn);
            DBContext = _DBContext;
            env = _env;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        //[Code.TProteccionProducto]
        //  [Code.TProteccionAppVales]
        public async Task<IActionResult> Get(PeticionesRest.AppValePeticiones.AppClientes.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                var Clentes = await DBContext.database.FetchAsync<AppClientes_VW>("WHERE (ProductoID = @ProductoID) AND (DistribuidorID = @DistribuidorID)  order by ClienteID desc", parData);
                // var Direcciones = await DBContext.database.FetchAsync<AppDirecciones_VW>("WHERE (PersonaID = @0)", Clente.ClienteID);

                var data = new ArrayList();

                foreach (var Clente in Clentes)
                {
                    // var Creditos = await DBContext.database.QueryAsync<DistribuidoresClientesGlobalVW>("WHERE (ClienteID = @ClienteID) AND (DistribuidorID = @DistribuidorID)", parData).FirstOrDefaultAsync();
                    // var PersonasDatosBancarios = await DBContext.database.FetchAsync<PersonasDatosBancarios_VW>("WHERE (personaID = @ClienteID)", parData);

                    // var datosBancariosCliente = new ArrayList();

                    // foreach (var DatosBancarios in PersonasDatosBancarios)
                    // {
                    //     datosBancariosCliente.Add(new
                    //     { 
                    //         claveBanco= DatosBancarios.BancoID,
                    //         bancoDesc = DatosBancarios.BancoNombre,
                    //         numTarjeta = DatosBancarios.datoBancario,
                    //     });
                    // }

                    var DvCliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE (PersonaID = @1) AND (DistribuidorID = @0)", parData.DistribuidorID, Clente.ClienteID).SingleOrDefaultAsync();
                    var Cliente_VW = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes_VW>("WHERE (PersonaID = @1) AND (DistribuidorID = @0)", parData.DistribuidorID, Clente.ClienteID).SingleOrDefaultAsync();

                    data.Add(new
                    {
                        clienteId = Clente.ClienteID,
                        Clente.primerNombre,
                        Clente.segundoNombre,
                        Clente.primerApellido,
                        Clente.segundoApellido,

                        fechaNacimiento = Clente.FechaNacimiento.ToString("yyyy-MM-dd"),
                        // Clente.curp,
                        // Clente.rfc,
                        // Clente.edad,
                        // saldoActual = Creditos.SaldoActual,
                        //  Cliente_VW.CanjeaVale,
                        CanjeaVale = Clente.EsttausId,
                        estatusId = Clente.PagareEstatusId,
                        estatusDesc = Clente.pagareEstatusDesc,

                        Clente.telefono,
                        // Clente.telefonoTipo,
                        // datosBancariosCliente,
                        DvCliente.bloqueado,
                    });
                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
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
        [Route("actualizarFotoCliente")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> ActualizarFotoPerfil(PeticionesRest.Distribuidores.Distribuidor.UpdateImageDistribuidora parData)
        {
            try
            {
                var Cliente = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.General.Personas>(parData.Id);
                Cliente.ImagenCliente = parData.Image;
                await DBContext.database.UpdateAsync(Cliente);
                await DBContext.Destroy();
                return Ok(Cliente);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("getImagenCliente")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> getImagenDistribuidor(PeticionesRest.Distribuidores.Distribuidor.UpdateImageDistribuidora parData)
        {
            try
            {
                var Cliente = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.General.Personas>(parData.Id);

                if (Cliente != null)
                {
                    await DBContext.Destroy();
                    return Ok(Cliente);
                }
                await DBContext.Destroy();
                return NotFound(new
                {

                });

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {

                });
            }

        }
        [HttpPost]
        [Route("actualizarNotaCliente")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> ActualizarNotaCliente(PeticionesRest.AppValePeticiones.AppClientes.GetNota parData)
        {
            try
            {
                // var Cliente2 = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Clientes>(parData.Id);
                var Cliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE PersonaID = @0", parData.PersonaID).FirstAsync();
                Cliente.Nota = parData.Nota;
                await DBContext.database.UpdateAsync(Cliente);
                await DBContext.Destroy();
                return Ok(Cliente);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("getNotaCliente")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetNotaCliente(PeticionesRest.AppValePeticiones.AppClientes.GetNota parData)
        {
            try
            {
                var Cliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE PersonaID = @0", parData.PersonaID).FirstAsync();
                if (Cliente != null)
                {
                    await DBContext.Destroy();
                    return Ok(Cliente);
                }

                await DBContext.Destroy();
                return NotFound(new
                {
                    data = new { }
                });

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getOCRIne")]
        [Authorize]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetOCRIne()
        {
            try
            {
                var result = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE varName = 'INE_HABILITADA' and varValue = '1'").FirstAsync();

                var data = new ArrayList();

                if (result != null)
                {
                    await DBContext.Destroy();
                    return Ok(
                                        new
                                        {
                                            resultCode = 0,
                                            resultDesc = "OK.",
                                            data = new
                                            { OCRIne = true }
                                        });
                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new
                    {
                        OCRIne = false
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
                    data = new
                    { OCRIne = false }
                });
            }

        }

        [HttpPost]
        [Route("getsingle")]
        [Authorize]
        //[Code.TProteccionProducto]
        //  [Code.TProteccionAppVales]
        public async Task<IActionResult> GetSingle(PeticionesRest.AppValePeticiones.AppClientes.GetSingle parData, [FromHeader(Name = "ProductoID")] int producto, [FromHeader(Name = "EmpresaId")] int empresa)
        {
            try
            {

                long creditoSolicitudID = 0;
                long creditoCanjeAppID = 0;
                parData.ProductoID = producto;
                var Cliente = await DBContext.database.QueryAsync<AppClientes_VW>("WHERE (ProductoID = @ProductoID) AND (ClienteID = @ClienteID) AND (DistribuidorID = @DistribuidorID)", parData).SingleOrDefaultAsync();
                if (Cliente == null)
                {
                    Cliente = new AppClientes_VW();
                    Cliente.ClienteID = 0;
                }
                var Direcciones = await DBContext.database.QueryAsync<AppDirecciones_VW>("WHERE (PersonaID = @0)", Cliente.ClienteID).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                var Creditos = await DBContext.database.FetchAsync<AppCreditos_VW>("WHERE (ProductoID = @ProductoID) AND (ClienteID = @ClienteID) AND (DistribuidorID = @DistribuidorID) AND (EstatusID IN ('A', 'L'))", parData);
                var PersonasDatosBancarios = await DBContext.database.QueryAsync<PersonasDatosBancarios_VW>("WHERE (personaID = @ClienteID) AND (activo = 1)", Cliente).OrderByDescending(x => x.fechaRegistro).FirstOrDefaultAsync();
                var DvCliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE (PersonaID = @1) AND (DistribuidorID = @0)", parData.DistribuidorID, Cliente.ClienteID).SingleOrDefaultAsync();

                var direcciones = new ArrayList();
                var ultimaDireccion = true;

                foreach (var Direccion in Direcciones)
                {
                    if (Direccion != null)
                    {
                        direcciones.Add(new
                        {

                            Direccion.calle,
                            Direccion.numExterior,
                            numInterior = Direccion.numInterior == null ? "" : Direccion.numInterior,
                            Direccion.colonia,
                            codigoPostal = Direccion.CodigoPostal,
                            municipio = Direccion.Municipio,
                            ciudad = Direccion.Ciudad,
                            estado = Direccion.Estado,
                            ultimaDireccion
                        });
                        ultimaDireccion = false;
                    }
                    else
                    {
                        direcciones.Add(new
                        {

                            calle = "",
                            numExterior = "",
                            numInterior = "",
                            colonia = "",
                            codigoPostal = 0,
                            municipio = "",
                            ciudad = "",
                            estado = "",
                            ultimaDireccion
                        });
                        ultimaDireccion = false;
                    }

                }

                var creditos = new ArrayList();
                var solicitudesCreditos = await DBContext.database.QueryAsync<SolicitudCreditosCV>("WHERE EstatusID = 'P' AND ClienteID = @0 AND DistribuidorID = @1", Cliente.ClienteID, parData.DistribuidorID).FirstOrDefaultAsync();
                if (solicitudesCreditos != null)
                {
                    creditoSolicitudID = long.Parse(solicitudesCreditos.FolioVale);
                }
                var creditoCanjeApp = await DBContext.database.QueryAsync<CanjesValeApp>("WHERE estatus = 'P' AND ClienteID = @0 AND DistribuidorID = @1 AND Completado = 1", Cliente.ClienteID, parData.DistribuidorID).FirstOrDefaultAsync();
                if (creditoCanjeApp != null)
                {
                    creditoCanjeAppID = (long)creditoCanjeApp.Folio;
                }
                foreach (var Credito in Creditos)
                {
                    var PlanPagos = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", Credito);
                    if (Credito != null)
                    {
                        //TODO IMPLEMETAR LO DE KEVI PARA CODIGOVALEDIG Y TIENE SOLICITUD
                        creditos.Add(new
                        {
                            creditoId = Credito.CreditoID,
                            importe = Credito.ImporteTotal,
                            numVale = Credito.ValeCanje,
                            saldoPendiente = Credito.SaldoActual,
                            fInicio = Credito.FechaHoraRegistro.ToString("yyyy-MM-dd"),
                            fFinal = (Credito.UltimoVencimiento != null) ? Credito.UltimoVencimiento.Value.ToString("yyyy-MM-dd") : "",
                            plazos = Credito.Plazos,
                            plazoFaltantes = (Credito.Plazos - PlanPagos.Where(x => x.SaldoActual < 1).Count())

                        });
                    }
                    else
                    {
                        creditos.Add(new
                        {
                            creditoId = (long)0,
                            importe = decimal.Parse("0.00"),
                            numVale = (long)0,
                            saldoPendiente = decimal.Parse("0.00"),
                            fInicio = "",
                            fFinal = "",
                            plazos = 0,
                            plazoFaltantes = 0
                        });
                    }



                }

                var creditoPendiente = new ArrayList();
                creditoPendiente.Add(new
                {

                    creditoId = (int)0,
                    importe = (decimal)0,
                    numVale = 0,
                    saldoPendiente = (decimal)0,
                    fInicio = "",
                    fFinal = "",
                    plazos = 0,
                    plazoFaltantes = 0

                }
                );

                var datosBancariosCliente = new ArrayList();

                datosBancariosCliente.Add((PersonasDatosBancarios != null) ? new
                {
                    claveBanco = PersonasDatosBancarios.BancoID,
                    bancoDesc = PersonasDatosBancarios.BancoNombre,
                    numTarjeta = "**** " + PersonasDatosBancarios.datoBancario[^4..], //PersonasDatosBancarios.datoBancario,
                    PersonasDatosBancarios.personasDatosBancariosID,
                    ultimoDato = true
                } : new
                {

                    claveBanco = 0,
                    bancoDesc = "",
                    numTarjeta = "", //PersonasDatosBancarios.datoBancario,
                    personasDatosBancariosID = (long)0,
                    ultimoDato = true
                }

                );

                var data = new
                {
                    clienteId = Cliente?.ClienteID ?? 0,
                    primerNombre = Cliente?.primerNombre ?? "",
                    segundoNombre = Cliente?.segundoNombre ?? "",
                    primerApellido = Cliente?.primerApellido ?? "",
                    segundoApellido = Cliente?.segundoApellido ?? "",
                    fechaNacimiento = Cliente.FechaNacimiento.ToString("yyyy-MM-dd"),
                    curp = Cliente?.CURP ?? "",
                    rfc = Cliente?.RFC ?? "",
                    edad = Cliente?.edad ?? 0,
                    saldoActual = Creditos?.Sum(x => x.SaldoActual) ?? 0,
                    estatusId = Cliente?.PagareEstatusId ?? 0,
                    estatusDesc = Cliente?.pagareEstatusDesc ?? "",
                    telefono = Cliente?.telefono ?? "",
                    telefonoTipo = Cliente?.telefonoTipo ?? "",
                    bloqueado = DvCliente?.bloqueado ?? false,
                    direcciones,
                    creditos,
                    creditoPendiente,
                    datosBancariosCliente,
                    creditoSolicitudID,
                    creditoCanjeAppID
                };

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
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
        [Route("getdatosbancarios")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> Getdatosbancarios(PeticionesRest.AppValePeticiones.AppClientes.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                var Clientes = await DBContext.database.FetchAsync<AppClientes_VW>("WHERE (ProductoID = @ProductoID) AND (DistribuidorID = @DistribuidorID) order by ClienteID desc", parData);
                // var Direcciones = await DBContext.database.FetchAsync<AppDirecciones_VW>("WHERE (PersonaID = @0)", Clente.ClienteID);

                var data = new ArrayList();

                foreach (var Cliente in Clientes)
                {
                    var Creditos = await DBContext.database.QueryAsync<AppDistribuidoresClientesCreditos_VW>("WHERE (ProductoID = @ProductoID) AND (ClienteID = @ClienteID) AND (DistribuidorID = @DistribuidorID)", Cliente).FirstOrDefaultAsync();
                    var PersonasDatosBancarios = await DBContext.database.QueryAsync<PersonasDatosBancarios_VW>("WHERE (personaID = @ClienteID) AND (activo = 1)", Cliente).OrderByDescending(x => x.fechaRegistro).FirstOrDefaultAsync();

                    var Cliente_VW = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes_VW>("WHERE (PersonaID = @1) AND (DistribuidorID = @0)", parData.DistribuidorID, Cliente.ClienteID).SingleOrDefaultAsync();

                    var datosBancariosCliente = new ArrayList();

                    var saldoActual = (Creditos != null) ? Creditos.SaldoActual <= 0 ? 0 : Creditos.SaldoActual : 0;

                    // foreach (var DatosBancarios in PersonasDatosBancarios)
                    // {
                    //     datosBancariosCliente.Add(new
                    //     {
                    //         claveBanco = DatosBancarios.BancoID,
                    //         bancoDesc = DatosBancarios.BancoNombre,
                    //         numTarjeta = DatosBancarios.datoBancario,
                    //     });
                    // }

                    datosBancariosCliente.Add((PersonasDatosBancarios != null) ? new
                    {
                        claveBanco = PersonasDatosBancarios.BancoID,
                        bancoDesc = PersonasDatosBancarios.BancoNombre,
                        numTarjeta = "**** " + PersonasDatosBancarios.datoBancario[^4..], //PersonasDatosBancarios.datoBancario,
                        PersonasDatosBancarios.personasDatosBancariosID,
                    } : new
                    {
                        claveBanco = 0,
                        bancoDesc = "",
                        numTarjeta = "", //PersonasDatosBancarios.datoBancario,
                        personasDatosBancariosID = (long)0,
                    }

                    );

                    data.Add(new
                    {
                        clienteId = Cliente.ClienteID,
                        Cliente.primerNombre,
                        Cliente.segundoNombre,
                        Cliente.primerApellido,
                        Cliente.segundoApellido,
                        fechaNacimiento = Cliente.FechaNacimiento,
                        // Clente.curp,
                        // Clente.rfc,
                        // Clente.edad,
                        //  Cliente_VW.CanjeaVale,
                        CanjeaVale = Cliente.EsttausId,
                        saldoActual = saldoActual ?? decimal.Parse("0.00"),
                        estatusId = Cliente.PagareEstatusId,
                        estatusDesc = Cliente.pagareEstatusDesc,
                        Cliente.telefono,
                        // Clente.telefonoTipo,
                        datosBancariosCliente,
                    });
                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
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
        [Route("buscaPersona")]
        [Authorize]
        //[Code.TProteccionProducto]
        //  [Code.TProteccionAppVales]
        public async Task<IActionResult> GetPersona(PeticionesRest.Administracion.Personas.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var curpHabilitada = await DBContext.database.FirstOrDefaultAsync<VariablesGlobales>("WHERE (varName = 'CURP_HABILITADA')");

                if (curpHabilitada.varValue.ToString() != "1")
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = -1,
                        resultDesc = "En este momento no se puede realizar la consulta de CURP. Ingrese los datos manualmente.",
                        data = new { }
                    });

                }

                //Verificacion en personas
                parData.CURP = parData.CURP.ToUpper();
                var data = await DBContext.database.QueryAsync<PersonasApp_VW>("WHERE (CURP = @0)", parData.CURP).FirstOrDefaultAsync();


                if (data != null)
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = -1,
                        resultDesc = "Esta CURP ya se encuentra registrada en el sistema.",
                        data = new { }
                    });
                }



                //Validamos si la CURP esta habilitada
                var nombre = "";
                var apellidoPaterno = "";
                var apellidoMaterno = "";
                var curpConsultada = "";
                var fechaNacimiento = "";
                var sexo = "";
                var estadoNacimiento = "";

                //Verificar en CURP Consultadas
                await sqlConnection.OpenAsync();
                using SqlCommand cmdCategorias = new SqlCommand("SELECT  * FROM dbo.CurpConsultadas WHERE Curp= @CURP", sqlConnection);
                cmdCategorias.Parameters.Add("@CURP", SqlDbType.NVarChar).Value = parData.CURP;
                SqlDataReader readerCategorias = await cmdCategorias.ExecuteReaderAsync();
                if (!readerCategorias.HasRows)
                {
                    var username = "";
                    var password = "";
                    await readerCategorias.CloseAsync();
                    var urlApiRenapo = "https://curp.nubarium.com/renapo/v2/valida_curp";
                    var client = new HttpClient();

                    string queryString = "SELECT username, passwordd FROM dbo.LicenciaAPICURP;";
                    using (SqlConnection connection = new SqlConnection(Configuracion["ConnectionStrings:DBConfia_Personas"]))
                    {
                        SqlCommand command = new SqlCommand(queryString, connection);
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                username = reader[0].ToString();
                                password = reader[1].ToString();
                            }
                        }
                    }


                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic",
                    Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}")));

                    var response = await client.PostAsJsonAsync(urlApiRenapo, new { documento = "0", curp = parData.CURP });

                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<RespuestaRenapo>();
                        if (result != null)
                        {
                            if (result.estatus == "OK")
                            {
                                nombre = result.nombre;
                                apellidoPaterno = result.apellidoPaterno;
                                apellidoMaterno = result.apellidoMaterno;
                                curpConsultada = parData.CURP;
                                var cmd = new SqlCommand("INSERT INTO dbo.CurpConsultadas (estatus, codigoValidacion, " +
                                "CURP, Nombre, ApellidoPaterno, ApellidoMaterno, sexo, fechaNacimiento, paisNacimiento," +
                                " estadoNacimiento, docProbatorio, entidadRegistro, tomo, claveMunicipioRegistro, anioReg, " +
                                "claveEntidadRegistro, foja, numActa, libro, municipioRegistro, estatusCurp, codigoMensaje) VALUES (@estatus, @codigoValidacion, " +
                                "@CURP, @Nombre, @ApellidoPaterno, @ApellidoMaterno, @sexo, @fechaNacimiento, @paisNacimiento," +
                                " @estadoNacimiento, @docProbatorio, @entidadRegistro, @tomo, @claveMunicipioRegistro, @anioReg, " +
                                "@claveEntidadRegistro, @foja, @numActa, @libro, @municipioRegistro, @estatusCurp, @codigoMensaje)", sqlConnection);
                                cmd.Parameters.AddWithValue("@estatus", result.estatus);
                                cmd.Parameters.AddWithValue("@codigoValidacion", result.codigoValidacion);
                                cmd.Parameters.AddWithValue("@CURP", parData.CURP);
                                cmd.Parameters.AddWithValue("@Nombre", nombre);
                                cmd.Parameters.AddWithValue("@ApellidoPaterno", apellidoPaterno);
                                cmd.Parameters.AddWithValue("@ApellidoMaterno", apellidoMaterno);
                                cmd.Parameters.AddWithValue("@sexo", result.sexo);
                                cmd.Parameters.AddWithValue("@fechaNacimiento", result.fechaNacimiento);
                                cmd.Parameters.AddWithValue("@paisNacimiento", result.paisNacimiento);
                                cmd.Parameters.AddWithValue("@estadoNacimiento", result.estadoNacimiento);
                                cmd.Parameters.AddWithValue("@docProbatorio", result.docProbatorio);
                                cmd.Parameters.AddWithValue("@entidadRegistro", result.datosDocProbatorio.entidadRegistro);
                                cmd.Parameters.AddWithValue("@tomo", result.datosDocProbatorio.tomo);
                                cmd.Parameters.AddWithValue("@claveMunicipioRegistro", result.datosDocProbatorio.claveMunicipioRegistro);
                                cmd.Parameters.AddWithValue("@anioReg", result.datosDocProbatorio.anioReg);
                                cmd.Parameters.AddWithValue("@claveEntidadRegistro", result.datosDocProbatorio.claveEntidadRegistro);
                                cmd.Parameters.AddWithValue("@foja", result.datosDocProbatorio.foja);
                                cmd.Parameters.AddWithValue("@numActa", result.datosDocProbatorio.numActa);
                                cmd.Parameters.AddWithValue("@libro", result.datosDocProbatorio.libro);
                                cmd.Parameters.AddWithValue("@municipioRegistro", result.datosDocProbatorio.municipioRegistro);
                                cmd.Parameters.AddWithValue("@estatusCurp", result.estatusCurp);
                                cmd.Parameters.AddWithValue("@codigoMensaje", result.codigoMensaje);
                                await cmd.ExecuteNonQueryAsync();

                                await DBContext.Destroy();

                                return Ok(
                                    new
                                    {
                                        resultCode = 0,
                                        resultDesc = "OK.",
                                        data = new
                                        {

                                            RENAPO = true,
                                            CURPValida = true,
                                            persona = new AppPersonas_VW
                                            {
                                                PersonaID = 0,
                                                ClienteID = null,
                                                DistribuidorID = null,
                                                CURP = parData.CURP,
                                                RFC = "",
                                                Nombre = nombre,
                                                primerNombre = nombre,
                                                segundoNombre = "",
                                                primerApellido = apellidoPaterno,
                                                segundoApellido = apellidoMaterno,
                                                FechaNacimiento = DateTime.ParseExact(result.fechaNacimiento, "dd/MM/yyyy", null),
                                                EstadoCivilID = null,
                                                //EstadoCivil = null,
                                                IngresosMensuales = 0,
                                                TelefonoMovil = "",
                                                EscolaridadID = 0,
                                                //Escolaridad = null,
                                                NombreConyuge = "",
                                                identificacionTipoId = null,
                                                identificacionNumero = "",
                                                TelefonoDomicilio = "",
                                                CorreoElectronico = "",
                                                DependientesEconomicos = 0,
                                                Observaciones = "",
                                                edad = 0,
                                                SexoID = result.sexo == "HOMBRE" ? "M" : "F",
                                                NombreCompleto = $"{result.nombre} {result.apellidoPaterno} {result.apellidoMaterno}",
                                                PagareEstatusId = null,
                                                ProductoID = null,
                                                LugarNacimiento = result.estadoNacimiento
                                            },
                                            direcciones = new ArrayList(),
                                        }
                                    }
                                );
                            }
                            else
                            {
                                await DBContext.Destroy();
                                return Ok(new
                                {
                                    resultCode = -1,
                                    resultDesc = "No se encontraron registros",
                                    data = new { }
                                });
                            }
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return Ok(new
                            {
                                resultCode = -1,
                                resultDesc = "No se encontraron registros",
                                data = new { }
                            });
                        }
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return Ok(new
                        {
                            resultCode = -1,
                            resultDesc = "No se encontraron registros",
                            data = new { }
                        });
                    }


                }

                while (readerCategorias.Read())
                {
                    nombre = readerCategorias["Nombre"].ToString();
                    apellidoPaterno = readerCategorias["ApellidoPaterno"].ToString();
                    apellidoMaterno = readerCategorias["ApellidoMaterno"].ToString();
                    fechaNacimiento = readerCategorias["fechaNacimiento"].ToString();
                    sexo = readerCategorias["sexo"].ToString();
                    estadoNacimiento = readerCategorias["estadoNacimiento"].ToString();
                }
                await readerCategorias.CloseAsync();

                await DBContext.Destroy();

                return Ok(new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    // data = new { nombre, apellidoPaterno, apellidoMaterno }
                    data = new
                    {

                        RENAPO = true,
                        CURPValida = true,
                        persona = new AppPersonas_VW
                        {
                            PersonaID = 0,
                            ClienteID = null,
                            DistribuidorID = null,
                            CURP = parData.CURP,
                            RFC = "",
                            Nombre = nombre,
                            primerNombre = nombre,
                            segundoNombre = "",
                            primerApellido = apellidoPaterno,
                            segundoApellido = apellidoMaterno,
                            FechaNacimiento = DateTime.ParseExact(fechaNacimiento, "dd/MM/yyyy", null),
                            EstadoCivilID = null,
                            //EstadoCivil = null,
                            IngresosMensuales = 0,
                            TelefonoMovil = "",
                            EscolaridadID = 0,
                            //Escolaridad = null,
                            NombreConyuge = "",
                            identificacionTipoId = null,
                            identificacionNumero = "",
                            TelefonoDomicilio = "",
                            CorreoElectronico = "",
                            DependientesEconomicos = 0,
                            Observaciones = "",
                            edad = 0,
                            SexoID = sexo == "HOMBRE" ? "M" : "F",
                            NombreCompleto = $"{nombre} {apellidoPaterno} {apellidoMaterno}",
                            PagareEstatusId = null,
                            ProductoID = null,
                            LugarNacimiento = estadoNacimiento
                        },
                        direcciones = new ArrayList(),
                    }
                });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);

            }

        }


        [HttpPost]
        [Route("buscaPersonaINE")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetPersonaINE(PeticionesRest.Administracion.Personas.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var ine_habilitada = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE varName = 'INE_HABILITADA' and varValue = '1'").FirstAsync();
                if (ine_habilitada != null)
                {
                    var nombre = "";
                    var apellidoPaterno = "";
                    var apellidoMaterno = "";
                    var curpConsultada = "";
                    // DateTime fechaNac = new();
                    // var sexo = "";
                    // var estadoNacimiento = "";
                    // var calle = "";
                    // var colonia = "";
                    // var ciudad = "";
                    await sqlConnection.OpenAsync(); //TODO: AQUI POR SI SE NECESITA.
                    // using SqlCommand cmdINE = new SqlCommand("SELECT  * FROM dbo.OCRIne WHERE curp= @CURP", sqlConnection);
                    // cmdINE.Parameters.Add("@CURP", SqlDbType.NVarChar).Value = parData.CURP;
                    // SqlDataReader readerCategorias = await cmdINE.ExecuteReaderAsync();
                    // if (!readerCategorias.HasRows)
                    // {
                    var username = "";
                    var password = "";

                    // await readerCategorias.CloseAsync();

                    string queryString = "SELECT username, passwordd FROM dbo.LicenciaAPICURP;";
                    using (SqlConnection connection = new SqlConnection(
                               Configuracion["ConnectionStrings:DBConfia_Personas"]))
                    {
                        SqlCommand command = new SqlCommand(
                            queryString, connection);
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                username = reader[0].ToString();
                                password = reader[1].ToString();
                            }
                        }
                    }
                    var data = JsonConvert.SerializeObject(new { id = parData.frenteIne, idReverso = parData.reversoIne });
                    var client = new HttpClient();
                    var request = new HttpRequestMessage(HttpMethod.Post, "https://ocr.nubarium.com/ocr/v1/obtener_datos_id");
                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic",
                    Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}")));
                    var content = new StringContent(data, null, "application/json");
                    request.Content = content;
                    var response = await client.SendAsync(request);
                    response.EnsureSuccessStatusCode();
                    Console.WriteLine(await response.Content.ReadAsStringAsync());

                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<RespuestaNubarium>();
                        if (result != null)
                        {

                            var urlApiRenapo = "https://curp.nubarium.com/renapo/v2/valida_curp";
                            var clienteCurp = new HttpClient();
                            clienteCurp.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic",
                        Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}")));

                            var responseCURP = await clienteCurp.PostAsJsonAsync(urlApiRenapo, new { documento = "0", curp = result.curp });

                            if (responseCURP.IsSuccessStatusCode)
                            {

                                var resultCURP = await responseCURP.Content.ReadFromJsonAsync<RespuestaRenapo>();

                                if (resultCURP.estatus != "OK")
                                {
                                    await DBContext.Destroy();
                                    return Ok(new
                                    {
                                        resultCode = -1,
                                        resultDesc = "La CURP NO es valida",
                                        data = new { }
                                    });
                                }

                                nombre = result.nombres;
                                apellidoPaterno = result.primerApellido;
                                apellidoMaterno = result.segundoApellido;
                                curpConsultada = result.curp;

                                var cmd = new SqlCommand("INSERT INTO dbo.OCRIne (tipo, " +
                                "subTipo, folio, registro, claveElector, curp, estado, municipio," +
                                " localidad, seccion, emision, vigencia, primerApellido, segundoApellido, " +
                                "nombres, edad, sexo, calle, colonia, ciudad, codigoValidacion, codigoBarras, ocr, fechaNacimiento, frenteIne, reversoIne) VALUES (@tipo, " +
                                "@subTipo, @folio, @registro, @claveElector, @curp, @estado, @municipio," +
                                " @localidad, @seccion, @emision, @vigencia, @primerApellido, @segundoApellido, " +
                                "@nombres, @edad, @sexo, @calle, @colonia, @ciudad, @codigoValidacion, @codigoBarras, @ocr, @fechaNacimiento, @frenteIne, @reversoIne)", sqlConnection);
                                cmd.Parameters.AddWithValue("@tipo", result.tipo);
                                cmd.Parameters.AddWithValue("@subTipo", result.subTipo);
                                cmd.Parameters.AddWithValue("@folio", "");
                                cmd.Parameters.AddWithValue("@registro", result.registro);
                                cmd.Parameters.AddWithValue("@claveElector", result.claveElector);
                                cmd.Parameters.AddWithValue("@curp", curpConsultada);
                                cmd.Parameters.AddWithValue("@estado", result.estado);
                                cmd.Parameters.AddWithValue("@municipio", result.municipio);
                                cmd.Parameters.AddWithValue("@localidad", result.localidad);
                                cmd.Parameters.AddWithValue("@seccion", result.seccion);
                                cmd.Parameters.AddWithValue("@emision", result.emision);
                                cmd.Parameters.AddWithValue("@vigencia", result.vigencia);
                                cmd.Parameters.AddWithValue("@primerApellido", apellidoMaterno);
                                cmd.Parameters.AddWithValue("@segundoApellido", apellidoPaterno);
                                cmd.Parameters.AddWithValue("@nombres", nombre);
                                cmd.Parameters.AddWithValue("@edad", int.Parse(result.edad));
                                cmd.Parameters.AddWithValue("@sexo", result.sexo);
                                cmd.Parameters.AddWithValue("@calle", result.calle);
                                cmd.Parameters.AddWithValue("@colonia", result.colonia);
                                cmd.Parameters.AddWithValue("@ciudad", result.ciudad);
                                cmd.Parameters.AddWithValue("@codigoValidacion", result.codigoValidacion);
                                cmd.Parameters.AddWithValue("@codigoBarras", result.codigoBarras);
                                cmd.Parameters.AddWithValue("@ocr", result.ocr);
                                cmd.Parameters.AddWithValue("@fechaNacimiento", result.fechaNacimiento);
                                cmd.Parameters.AddWithValue("@frenteIne", parData.frenteIne);
                                cmd.Parameters.AddWithValue("@reversoIne", parData.reversoIne);
                                await cmd.ExecuteNonQueryAsync();
                                await DBContext.Destroy();
                                return Ok(
                                    new
                                    {
                                        resultCode = 0,
                                        resultDesc = "OK.",
                                        data = new
                                        {

                                            RENAPO = true,
                                            CURPValida = true,
                                            persona = new AppPersonas_VW
                                            {
                                                PersonaID = 0,
                                                ClienteID = null,
                                                DistribuidorID = null,
                                                CURP = curpConsultada,
                                                RFC = "",
                                                Nombre = nombre,
                                                primerNombre = nombre,
                                                segundoNombre = "",
                                                primerApellido = apellidoPaterno,
                                                segundoApellido = apellidoMaterno,
                                                FechaNacimiento = DateTime.ParseExact(result.fechaNacimiento, "dd/MM/yyyy", null),
                                                EstadoCivilID = null,
                                                //EstadoCivil = null,
                                                IngresosMensuales = 0,
                                                TelefonoMovil = "",
                                                EscolaridadID = 0,
                                                //Escolaridad = null,
                                                NombreConyuge = "",
                                                identificacionTipoId = null,
                                                identificacionNumero = "",
                                                TelefonoDomicilio = "",
                                                CorreoElectronico = "",
                                                DependientesEconomicos = 0,
                                                Observaciones = "",
                                                edad = 0,
                                                SexoID = result.sexo == "HOMBRE" ? "M" : "F",
                                                NombreCompleto = $"{nombre} {apellidoPaterno} {apellidoMaterno}",
                                                PagareEstatusId = null,
                                                ProductoID = null,
                                                LugarNacimiento = result.ciudad
                                            },
                                            direcciones = new
                                            {
                                                result.calle,
                                                result.colonia,
                                                result.ciudad
                                            },
                                        }
                                    }
                                );
                            }
                            else
                            {
                                await DBContext.Destroy();
                                return Ok(new
                                {
                                    resultCode = -1,
                                    resultDesc = "No se encontraron registros",
                                    data = new { }
                                });
                            }
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return Ok(new
                            {

                                resultCode = -1,
                                resultDesc = "No se encontraron registros",
                                data = new { }
                            });
                        }
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return Ok(new
                        {
                            resultCode = -1,
                            resultDesc = "No se encontraron registros",
                            data = new { }
                        });
                    }


                    // }

                    // if (readerCategorias.Read())
                    // {
                    //     nombre = readerCategorias["nombres"].ToString();
                    //     apellidoPaterno = readerCategorias["primerApellido"].ToString();
                    //     apellidoMaterno = readerCategorias["segundoApellido"].ToString();
                    //     sexo = readerCategorias["sexo"].ToString();
                    //     estadoNacimiento = readerCategorias["ciudad"].ToString();
                    //     fechaNac = (DateTime)readerCategorias["fechaNacimiento"];
                    //     calle = readerCategorias["calle"].ToString();
                    //     colonia = readerCategorias["colonia"].ToString();
                    //     ciudad = readerCategorias["ciudad"].ToString();

                    // }
                    // await readerCategorias.CloseAsync();

                    // return Ok(new
                    // {
                    //     resultCode = 0,
                    //     resultDesc = "OK.",
                    //     // data = new { nombre, apellidoPaterno, apellidoMaterno }
                    //     data = new
                    //     {

                    //         RENAPO = true,
                    //         CURPValida = true,
                    //         persona = new AppPersonas_VW
                    //         {
                    //             PersonaID = 0,
                    //             ClienteID = null,
                    //             DistribuidorID = null,
                    //             CURP = parData.CURP,
                    //             RFC = "",
                    //             Nombre = nombre,
                    //             primerNombre = nombre,
                    //             segundoNombre = "",
                    //             primerApellido = apellidoPaterno,
                    //             segundoApellido = apellidoMaterno,
                    //             FechaNacimiento = fechaNac,
                    //             EstadoCivilID = null,
                    //             //EstadoCivil = null,
                    //             IngresosMensuales = 0,
                    //             TelefonoMovil = "",
                    //             EscolaridadID = 0,
                    //             //Escolaridad = null,
                    //             NombreConyuge = "",
                    //             identificacionTipoId = null,
                    //             identificacionNumero = "",
                    //             TelefonoDomicilio = "",
                    //             CorreoElectronico = "",
                    //             DependientesEconomicos = 0,
                    //             Observaciones = "",
                    //             edad = 0,
                    //             SexoID = sexo == "HOMBRE" ? "M" : "F",
                    //             NombreCompleto = $"{nombre} {apellidoPaterno} {apellidoMaterno}",
                    //             PagareEstatusId = null,
                    //             ProductoID = null,
                    //             LugarNacimiento = estadoNacimiento
                    //         },
                    //         direcciones = new
                    //         {
                    //             calle,
                    //             colonia,
                    //             ciudad
                    //         },
                    //     }
                    // });



                }
                await DBContext.Destroy();
                return Ok(new
                {
                    resultCode = -1,
                    resultDesc = "No se encontraron registros",
                    data = new { }
                });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPost]
        [Route("addCliente")]
        [Authorize]
        //[Code.TProteccionProducto]
        //  [Code.TProteccionAppVales]
        public async Task<IActionResult> AddCliente(PeticionesRest.AppValePeticiones.AppClientes.AddPersona parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;

                //TODO: PREGUNTAR SOBRE ESTE APARTADO 
                //Verificar si es necesario que la curp sea valida
                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "APP_ALTA_CLIENTE_SIN_CURP_VALIDA").FirstOrDefaultAsync();
                int sinCURPValida = int.Parse(variable.varValue.ToString());

                //En caso de que la variable global exija que la curp sea valida
                if (sinCURPValida == 0)
                {
                    if (!parData.CURPValida)
                    {
                        await DBContext.Destroy();
                        return BadRequest(new
                        {
                            resultCode = -3,
                            resultDesc = "La CURP proporcionada no existe, por favor verifique los datos",
                        });
                    }
                }

                //Verificar que el cliente no sea distribuidor
                var distribuidor = await DBContext.database.QueryAsync<AppDistribuidores_VW>("WHERE (CURP = @CURP)", parData).FirstOrDefaultAsync();

                if (distribuidor != null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -2,
                        resultDesc = "El cliente proporcionado ya existe como distribuidor.",
                    });
                }

                var Client = await DBContext.database.QueryAsync<Personas>("WHERE (CURP = @CURP)", parData).FirstOrDefaultAsync();
                var param = new
                {
                    ProductoID = parData.ProductoID,
                    DistribuidorID = parData.DistribuidorID,
                    PersonaID = Client != null ? Client.PersonaID : 0

                };
                var distribuidorCliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE ProductoID = @ProductoID AND DistribuidorID = @DistribuidorID and PersonaID = @PersonaID AND EsttausId = 1", param).FirstOrDefaultAsync();

                if (distribuidorCliente != null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -2,
                        resultDesc = "El cliente proporcionado ya se dio de alta como su cliente,favor de verificar.",
                    });
                }
                //VERIFICAR SI EXISTE PERSONA
                var persona = await DBContext.database.QueryAsync<AppPersonas_VW>("WHERE (CURP = @CURP)", parData).FirstOrDefaultAsync();

                //Usuario actual
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (persona == null)
                {
                    //Generar persona
                    var Persona = new Personas()
                    {
                        Nombre = parData.Nombre?.ToUpper(),
                        ApellidoPaterno = parData.ApellidoPaterno?.ToUpper(),
                        ApellidoMaterno = parData.ApellidoMaterno?.ToUpper(),
                        FechaNacimiento = parData.FechaNacimiento,
                        CURP = parData.CURP?.ToUpper(),
                        RFC = parData.RFC?.ToUpper(),
                        SexoID = parData.SexoID,
                        EstadoCivilID = parData.EstadoCivilID,
                        EscolaridadID = parData.EscolaridadID,
                        DependientesEconomicos = parData.DependientesEconomicos,
                        TelefonoDomicilio = parData.TelefonoDomicilio,
                        TelefonoMovil = parData.TelefonoMovil,
                        LugarNacimiento = parData.LugarNacimiento,
                        CorreoElectronico = parData.CorreoElectronico?.ToUpper(),
                        NombreConyuge = parData.NombreConyuge?.ToUpper(),
                        Observaciones = parData.Observaciones ?? "",
                        identificacionTipoId = parData.identificacionTipoId,
                        identificacionNumero = parData.identificacionNumero,
                        IngresosMensuales = parData.IngresosMensuales,
                        //DATOS DE QUIEN CREA EL REGISTRO
                        CreacionPersonaID = (long)UsuarioActual.PersonaID,
                        CreacionUsuarioID = UsuarioActual.UsuarioID,
                        CreacionFecha = DateTime.Now,
                        BuroInternoEstatusID = 1
                    };

                    await DBContext.database.InsertAsync(Persona);

                    parData.PersonaID = Persona.PersonaID;

                    //Registro de datos de direccion
                    var Direccion = new Direcciones()
                    {
                        vialidadTipoId = parData.vialidadTipoId,
                        orientacionVialidadTipoId = parData.orientacionVialidadTipoId,
                        AsentamientoID = parData.AsentamientoID,
                        NombreVialidad = parData.NombreVialidad,
                        NumeroExterior = parData.NumeroExterior,
                        NumeroInterior = parData.NumeroInterior,
                        ReferenciasGeograficas = parData.ReferenciasGeograficas,
                        ViviendaTipoId = parData.viviendaTipoId,
                        CreacionFecha = DateTime.Now,
                        CreacionPersonaID = (long)UsuarioActual.PersonaID,
                        CreacionUsuarioID = UsuarioActual.UsuarioID
                    };

                    await DBContext.database.InsertAsync(Direccion);

                    // Generamos la relacion a la direccion de la persona
                    await DBContext.database.InsertAsync(new PersonasDirecciones() { PersonaID = parData.PersonaID, DireccionID = Direccion.DireccionID });
                    persona = await DBContext.database.QueryAsync<AppPersonas_VW>("WHERE (CURP = @CURP)", parData).FirstOrDefaultAsync();

                }


                //Si no es cliente, se genera el registro
                if (persona.ClienteID == null)
                {
                    var Cliente = new Clientes()
                    {
                        PersonaID = persona.PersonaID,
                        ClienteID = persona.PersonaID,
                        LineaCreditoPersonal = 0,
                        PagareEstatusId = 1,
                        CanjeaVale = true,
                        PagareCantidad = 0,
                        CreacionPersonaID = (long)UsuarioActual.PersonaID,
                        CreacionFecha = DateTime.Now,
                        IdentificadorAnterior = null,
                        FechaUltimoCredito = null,
                        CreacionUsuarioID = UsuarioActual.UsuarioID,
                        AltaEnApp = true,
                        FrenteINE = parData.FrenteIne,
                        ReversoINE = parData.ReversoIne
                    };

                    await DBContext.database.InsertAsync(Cliente);
                    persona = await DBContext.database.QueryAsync<AppPersonas_VW>("WHERE (CURP = @CURP)", parData).FirstOrDefaultAsync();

                }

                //VERIFICAR QUE NO SEA CLIENTE DE OTRO DISTRIBUIDOR
                // var res = await DBContext.database.QueryAsync<Distribuidor>("WHERE (PersonaID = @PersonaID) AND (EsttausId = 1)", parData.PersonaID).FirstOrDefaultAsync();
                Creditos_VW creditosCliente = null;

                creditosCliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos_VW>("WHERE (ClienteID = @0) AND EstatusID = 'A' AND ProductoID = @1", persona.PersonaID, parData.ProductoID).FirstOrDefaultAsync();
                if (persona.DistribuidorID != null && creditosCliente != null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -4,
                        resultDesc = "El cliente ya esta asignado a otro distribuidor y tiene crédito activo",
                    });
                }

                //Generar la relacion cliente distribuidor
                var DistribuidorCliente = new Distribuidor()
                {
                    ProductoID = producto,
                    DistribuidorID = parData.DistribuidorID,

                    //NOTE: Porque originalmente se agina el PersonaID de parData si es 0
                    //PersonaID = parData.PersonaID,
                    PersonaID = persona.PersonaID,
                    EsttausId = true,
                    AsignacionFecha = DateTime.Now,
                    bloqueado = false
                };
                var clienteDistribuidor = await DBContext.database.QueryAsync<Distribuidor>("WHERE (PersonaID = @0)  AND ProductoID = @1 AND EsttausId = 1", persona.PersonaID, producto).FirstOrDefaultAsync();
                if (clienteDistribuidor != null)
                {
                    clienteDistribuidor.EsttausId = false;
                    await DBContext.database.UpdateAsync(clienteDistribuidor);

                }
                await DBContext.database.InsertAsync(DistribuidorCliente);
                var data = await DBContext.database.QueryAsync<AppClientes_VW>("WHERE (ClienteID = @PersonaID) AND (DistribuidorID = @DistribuidorID)", parData).SingleOrDefaultAsync();

                return Ok(
                    new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data
                    }
                );
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = "Ha ocurrido un error al intentar registrar al cliente, por favor intente de nuevo más tarde",
                });
            }
        }

        [HttpPost]
        [Route("addDatosBancarios")]
        [Authorize]
        //[Code.TProteccionProducto]
        //  [Code.TProteccionAppVales]
        public async Task<IActionResult> AddDatosBancarios(PeticionesRest.General.PersonaDatosBancarios.addDatosBancarios parData)
        {
            try
            {
                // var TipoDato = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "DATO_BANCARIO_REFERENCIA_SPEI").FirstOrDefaultAsync();

                // parData.datoTipoID = Convert.ToInt32(TipoDato.varValue);

                var dataPersonasDatoBancario = await DBContext.database.QueryAsync<PersonasDatosBancarios>("WHERE (personaID = @personaID) AND (datoBancario = @datoBancario) AND (datoTipoID = @datoTipoID)", parData).SingleOrDefaultAsync();

                if (dataPersonasDatoBancario != null && !dataPersonasDatoBancario.activo)
                {
                    dataPersonasDatoBancario.activo = true;
                    await DBContext.database.UpdateAsync(dataPersonasDatoBancario);

                    var res1 = new
                    {
                        resultCode = 0,
                        resultDesc = "Ok.",
                        data = dataPersonasDatoBancario
                    };

                    await DBContext.Destroy();
                    return Ok(res1);
                }

                var PersonasDatosBancarios = new PersonasDatosBancarios()
                {
                    personaID = parData.personaID,
                    datoTipoID = parData.datoTipoID,
                    cveBancoRef = parData.cveBancoRef,
                    datoBancario = parData.datoBancario,
                    fechaRegistro = DateTime.Now,
                    activo = true
                };
                await DBContext.database.InsertAsync(PersonasDatosBancarios);
                CodigoSMSController CodSMS = new(DBContext, env);
                var clienteCard = await DBContext.database.SingleByIdAsync<Personas>(parData.personaID);
                var clienteDatoBancarioVW = await DBContext.database.QueryAsync<PersonasDatosBancarios_VW>("WHERE personasDatosBancariosID = @0", PersonasDatosBancarios.personasDatosBancariosID).LastAsync();
                String msg = clienteDatoBancarioVW.NombreCompleto + ", SE HA REGISTRADO SU " + clienteDatoBancarioVW.datoTipoDesc + " CON TERMINACIÓN " + clienteDatoBancarioVW.datoBancario.Substring(clienteDatoBancarioVW.datoBancario.Length - 4);
                SMS DataSMS = new()
                {
                    PersonaID = parData.personaID,
                    TelefonoMovil = clienteCard.TelefonoMovil,
                    MSG = msg,
                    Referencia = "ALTA DATO BANCARIO",
                };

                var r = await CodSMS.SMS(DataSMS);
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "Ok.",
                    data = PersonasDatosBancarios
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("rmDatosBancarios")]
        [Authorize]
        //[Code.TProteccionProducto]
        //  [Code.TProteccionAppVales]
        public async Task<IActionResult> rmDatosBancarios(PeticionesRest.General.PersonaDatosBancarios.rmDatosBancarios parData)
        {
            try
            {

                var PersonasDatosBancarios = await DBContext.database.QueryAsync<PersonasDatosBancarios>("WHERE (personaID = @personaID) AND (personasDatosBancariosID = @personasDatosBancariosID) AND (cveBancoRef = @cveBancoRef)", parData).SingleOrDefaultAsync();
                PersonasDatosBancarios.activo = false;
                await DBContext.database.UpdateAsync(PersonasDatosBancarios);

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "Ok.",
                    data = PersonasDatosBancarios
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("bloquearCliente")]
        [Authorize]
        //[Code.TProteccionProducto]
        //  [Code.TProteccionAppVales]
        public async Task<IActionResult> bloquearCliente(PeticionesRest.General.PersonaDatosBancarios.bloquearCliente parData)
        {
            try
            {
                var DvCliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE (PersonaID = @1) AND (DistribuidorID = @0)", parData.DistribuidorID, parData.ClienteID).SingleOrDefaultAsync();
                DvCliente.bloqueado = true;
                await DBContext.database.UpdateAsync(DvCliente);

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "Ok.",
                    data = DvCliente
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("cancelartempc")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> CancelarTempC(PeticionesRest.Distribuidores.Cliente.CancelarTempC parData)
        {
            try
            {
                var Cliente = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Clientes>(parData.Id);
                Cliente.CanjeaVale = false;
                await DBContext.database.UpdateAsync(Cliente);
                var DvCliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE (PersonaID = @0) ", parData.Id).SingleOrDefaultAsync();
                DvCliente.EsttausId = false;
                await DBContext.database.UpdateAsync(DvCliente);

                await DBContext.Destroy();
                return Ok(Cliente);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("validaTelefonoCliente")]
        [Authorize]
        public async Task<IActionResult> ValidaTelefonoCliente(ConfiaWebApi.PeticionesRest.AppValePeticiones.AppClientes.GetCodigoSMS pardata)
        {
            try
            {
                if (pardata.DistribuidorID == 104)
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = 0,
                        resultDesc = "Numero de telefono Validado",
                        data = new { }
                    });
                }

                var Distribuidor = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID = @0", pardata.DistribuidorID).SingleOrDefaultAsync();
                if (Distribuidor == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = $"No existe  la socia {pardata.Codigo}",
                        data = new { }
                    });
                }
                else
                {
                    var parms = new
                    {
                        FechaCaduca = DateTime.Now,
                        PersonaID = pardata.DistribuidorID,
                        Codigo = pardata.Codigo,
                    };

                    var CodigoSMS = await DBContext.database.QueryAsync<CodigoSMS>("WHERE (PersonaID = @PersonaID) AND (Codigo = @Codigo) AND (FechaCaduca >= @FechaCaduca) AND (Confirmado = 0)", parms).FirstOrDefaultAsync();

                    //Codigo Existe
                    if (CodigoSMS == null)
                    {
                        await DBContext.Destroy();
                        return BadRequest(new
                        {
                            resultCode = -3,
                            resultDesc = "Código Invalido",
                            data = new { }
                        });
                    }

                    //Codigo no ha sido confirmado o expirado
                    if (CodigoSMS.Confirmado || CodigoSMS.FechaCaduca < DateTime.Now)
                    {
                        await DBContext.Destroy();
                        return BadRequest(new
                        {
                            resultCode = -2,
                            resultDesc = "Código Expirado",
                            data = new { }
                        });
                    }

                    //Actualizamos el estado del codigo
                    CodigoSMS.Confirmado = true;
                    await DBContext.database.UpdateAsync(CodigoSMS);

                    await DBContext.Destroy();

                    return Ok(new
                    {
                        resultCode = 0,
                        resultDesc = "Numero de telefono Validado",
                        data = new { }
                    });

                }
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = "Ha ocurrido un error al intentar validar el telefono, por favor intente de nuevo mas tarde",
                });
            }
        }

        //Codigo de verificacion telefono cliente
        [HttpPost]
        [Route("CodigoClienteNuevo")]
        [Authorize]
        public async Task<IActionResult> CodigoNuevoCliente(PeticionesRest.AppValePeticiones.AppClientes.CodigoClienteNuevo parData)
        {
            //TODO: AGREGAR SRC A LOG DE MENSAJES
            try
            {

                //Validamos si el usuario es el Kevin
                if (parData.PersonaID == 104)
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = new CodigoSMS()
                        {
                            Id = 1,
                            Codigo = "123456",
                            FechaEnvio = DateTime.Now,
                            FechaCaduca = DateTime.Now.AddMinutes(5),
                            TipoID = 1,
                            Confirmado = false,
                            SMSId = null,
                        }
                    });

                }

                //Obtenemos el tiempo de expiracion del codigo
                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                int tiempoExp = Int32.Parse((string)variable.varValue);

                //Generamos el codigo
                Random generator = new();
                var code = generator.Next(1000000, 9999999).ToString("D6");

                //Registro de la transaccion
                var LogCelular = new LogCelular()
                {
                    PersonaID = parData.PersonaID,
                    Celular = parData.Telefono,
                    PersonaIDModifica = 1,
                    UsuarioIDModifica = 1,
                    FechaHora = DateTime.Now,
                };

                //Tipo de codigo
                var tipoCodigo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE (clave = @0)", "VER").SingleOrDefaultAsync();

                var CodigoSMS = new CodigoSMS()
                {
                    PersonaID = parData.PersonaID,
                    Codigo = code,
                    FechaEnvio = DateTime.Now,
                    FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
                    TipoID = tipoCodigo.TipoID,
                    Confirmado = false,
                    SMSId = null,
                };

                await DBContext.database.InsertAsync(CodigoSMS);

                CodigoSMSController CodSMS = new(DBContext, env);

                SMS DataSMS = new()
                {
                    PersonaID = parData.PersonaID,
                    TelefonoMovil = parData.Telefono,
                    MSG = $"{parData.src} INGRESA EL SIG. CODIGO PARA CONTINUAR TU REGISTRO. {code}.",
                    Referencia = "CODIGO",
                };

                int r = await CodSMS.SMS(DataSMS);

                if (r < 1)
                {
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "No fue posible enviar el código por SMS, intentelo de nuevo mas tarde",
                    });
                }

                CodigoSMS.SMSId = r;

                await DBContext.database.UpdateAsync(CodigoSMS);
                await DBContext.Destroy();


                return Ok(new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = CodigoSMS
                });
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                });
            }

        }
        [HttpPost]
        [Route("getReciboCliente")]
        [Authorize]
        public async Task<IActionResult> getReciboCliente(PeticionesRest.AppValePeticiones.AppClientes.getReciboCliente parData)
        {
            try
            {
                string Stored = "EXEC AppVale.getReciboCliente @DistribuidorID,@ProductoID ,@ClienteID";

                var recibo = await DBContext.database.QueryAsync<DBContext.DBConfia.Custom.AppVale.ReciboClienteResponse>(Stored, parData).ToArrayAsync();
                if (recibo == null || recibo[0].Error < 0)
                {
                    await DBContext.Destroy();

                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = recibo == null ? "No se encontraron datos" : recibo[0].msg,
                        data = new { }
                    });
                }
                await DBContext.Destroy();
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = recibo
                };
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = "ERROR AL OBTENER EL RECIBO." + ex.Message,
                });
            }

        }
    }




}