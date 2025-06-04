using ConfiaWebApi.Code;
using ConfiaWebApi.ModlesSP.Prospeccion;
using ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudIncrementos;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Seguridad;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class RenapoController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public RenapoController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("buscaCurp")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCURP(PeticionesRest.General.Renapo.Get parData)
        {
            int ProductoID = 9999;
            int.TryParse(Request.Headers["ProductoID"], out ProductoID);
            try
            {

                var sqlLine = "SELECT  * FROM dbo.CurpConsultadas WHERE Curp= @CURP";
                string queryString = "SELECT username, passwordd FROM dbo.LicenciaAPICURP;";
                using (SqlConnection sqlConnection1 = new SqlConnection(Configuracion["ConnectionStrings:DBConfia_Personas"]))
                {
                    await sqlConnection1.OpenAsync();
                    using (SqlCommand cmdCategorias = new SqlCommand(sqlLine, sqlConnection1))
                    {
                        //Leer los campos de la consulta de la base de datos
                        cmdCategorias.Parameters.Add("@CURP", SqlDbType.NVarChar).Value = parData.CURP;
                        SqlDataReader readerCategorias = await cmdCategorias.ExecuteReaderAsync();

                        var list = new List<Dictionary<string, object>>();
                        var names = Enumerable.Range(0, readerCategorias.FieldCount).Select(readerCategorias.GetName).ToList();
                        // SI NO HAY REGISTROS
                        if (!readerCategorias.HasRows && parData.status == true)
                        {
                            var nombre = "";
                            var apellidoPaterno = "";
                            var apellidoMaterno = "";
                            var curpConsultada = "";
                            // var fechaNacimiento = "";
                            // var sexo = "";
                            // var estadoNacimiento = "";
                            var username = "";
                            var password = "";
                            await readerCategorias.CloseAsync();
                            var urlApiRenapo = "https://curp.nubarium.com/renapo/v2/valida_curp";
                            var client = new HttpClient();
                            SqlCommand credenciales = new SqlCommand(queryString, sqlConnection1);
                            using (SqlDataReader reader = credenciales.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    username = reader[0].ToString();
                                    password = reader[1].ToString();
                                }
                            }

                            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic",
                            Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}")));

                            var response = await client.PostAsJsonAsync(urlApiRenapo, new { curp = parData.CURP });
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
                                         switch (apellidoPaterno.Length)
                                        {
                                            case 2:
                                                apellidoPaterno += ".";
                                                break;
                                            case 0:
                                                apellidoPaterno += "N/A";
                                                break;
                                        }
                                        switch (apellidoMaterno.Length)
                                        {
                                            case 2:
                                                apellidoMaterno += ".";
                                                break;
                                            case 0:
                                                apellidoMaterno += "N/A";
                                                break;
                                        }
                                        curpConsultada = parData.CURP;
                                        var cmd = new SqlCommand("INSERT INTO dbo.CurpConsultadas (estatus, codigoValidacion, " +
                                        "CURP, Nombre, apellidoPaterno, apellidoMaterno, sexo, fechaNacimiento, paisNacimiento," +
                                        " estadoNacimiento, docProbatorio, entidadRegistro, tomo, claveMunicipioRegistro, anioReg, " +
                                        "claveEntidadRegistro, foja, numActa, libro, municipioRegistro, estatusCurp, codigoMensaje) VALUES (@estatus, @codigoValidacion, " +
                                        "@CURP, @Nombre, @apellidoPaterno, @apellidoMaterno, @sexo, @fechaNacimiento, @paisNacimiento," +
                                        " @estadoNacimiento, @docProbatorio, @entidadRegistro, @tomo, @claveMunicipioRegistro, @anioReg, " +
                                        "@claveEntidadRegistro, @foja, @numActa, @libro, @municipioRegistro, @estatusCurp, @codigoMensaje)", sqlConnection1);
                                        cmd.Parameters.AddWithValue("@estatus", result.estatus);
                                        cmd.Parameters.AddWithValue("@codigoValidacion", result.codigoValidacion);
                                        cmd.Parameters.AddWithValue("@CURP", parData.CURP);
                                        cmd.Parameters.AddWithValue("@Nombre", nombre);
                                        cmd.Parameters.AddWithValue("@apellidoPaterno", apellidoPaterno);
                                        cmd.Parameters.AddWithValue("@apellidoMaterno", apellidoMaterno);
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

                                        await readerCategorias.CloseAsync();
                                        await ConexionBD.Destroy();
                                        // RETORNAR LOS DATOS
                                        return Ok(new
                                        {
                                            resultCode = 0,
                                            resultDesc = "OK.",
                                            data = new
                                            {
                                                Nombre = nombre,
                                                ApellidoPaterno = apellidoPaterno,
                                                ApellidoMaterno = apellidoMaterno,
                                                FechaNacimiento = DateTime.Parse(result.fechaNacimiento),
                                                SexoID = result.sexo == "MUJER" ? "F" : result.sexo == "HOMBRE" ? "M" : "I",
                                                LugarNacimiento = result.estadoNacimiento,
                                                CURP = parData.CURP,
                                                estatus = result.estatus,
                                                codigoValidacion = result.codigoValidacion,
                                                paisNacimiento = result.paisNacimiento,
                                                docProbatorio = result.docProbatorio,
                                                entidadRegistro = result.datosDocProbatorio.entidadRegistro,
                                                tomo = result.datosDocProbatorio.tomo,
                                                claveMunicipioRegistro = result.datosDocProbatorio.claveMunicipioRegistro,
                                                anioReg = result.datosDocProbatorio.anioReg,
                                                claveEntidadRegistro = result.datosDocProbatorio.claveEntidadRegistro,
                                                foja = result.datosDocProbatorio.foja,
                                                numActa = result.datosDocProbatorio.numActa,
                                                libro = result.datosDocProbatorio.libro,
                                                localidad = result.datosDocProbatorio.municipioRegistro,
                                                estatusCurp = result.estatusCurp,
                                                codigoMensaje = result.codigoMensaje
                                            }
                                        });


                                    }
                                    else
                                    {
                                        await readerCategorias.CloseAsync();
                                        await ConexionBD.Destroy();
                                        return BadRequest(new
                                        {
                                            resultCode = -1,
                                            msg = "No se encontraron registros"
                                        }
                                        );

                                    }
                                }
                                else
                                {

                                    await readerCategorias.CloseAsync();
                                    await ConexionBD.Destroy();
                                    return BadRequest(new
                                    {
                                        resultCode = -1,
                                        msg = "No se encontraron registros"
                                    }
                                    );

                                }
                            }
                            else
                            {
                                await ConexionBD.Destroy();
                                await readerCategorias.CloseAsync();
                                return BadRequest(new
                                {
                                    resultCode = -1,
                                    msg = "No se encontraron registros"
                                }
                                );
                            }
                            //aaa

                        }
                        else
                        {
                            if (!readerCategorias.HasRows && parData.status == false)
                            {
                                var nombre = "";
                                var apellidoPaterno = "";
                                var apellidoMaterno = "";
                                var fechaNacimiento = DateTime.Now;
                                var sexo = "";
                                var estadoNacimiento = "";
                                var curpConsultada = "";
                                var estatus = "";
                                var codigoValidacion = "";
                                var paisNacimiento = "";
                                var docProbatorio = "";
                                var entidadRegistro = "";
                                var tomo = "";
                                var claveMunicipioRegistro = "";
                                var anioReg = "";
                                var claveEntidadRegistro = "";
                                var foja = "";
                                var numActa = "";
                                var libro = "";
                                var municipioRegistro = "";
                                var estatusCurp = "";
                                var codigoMensaje = "";
                                //añadirlos a la lista
                                list.Add(new Dictionary<string, object> {
                                { "Nombre", nombre },
                                { "ApellidoPaterno", apellidoPaterno },
                                { "ApellidoMaterno", apellidoMaterno },
                                { "FechaNacimiento", fechaNacimiento },
                                { "SexoID", sexo },
                                { "LugarNacimiento", estadoNacimiento },
                                { "CURP", parData.CURP },
                                { "estatus", estatus },
                                { "codigoValidacion", codigoValidacion },
                                { "paisNacimiento", paisNacimiento },
                                { "docProbatorio", docProbatorio },
                                { "entidadRegistro", entidadRegistro },
                                { "tomo", tomo },
                                { "claveMunicipioRegistro", claveMunicipioRegistro },
                                { "anioReg", anioReg },
                                { "claveEntidadRegistro", claveEntidadRegistro },
                                { "foja", foja },
                                { "numActa", numActa },
                                { "libro", libro },
                                { "municipioRegistro", municipioRegistro },
                                { "estatusCurp", estatusCurp },
                                { "codigoMensaje", codigoMensaje }
                                });

                            }
                            else
                            {
                                while (await readerCategorias.ReadAsync())
                                {
                                    // list.Add(names.ToDictionary(name => name, name => readerCategorias[name]));
                                    //Acceder al dictorario de la lista y mandar los datos en un nuevo objeto
                                    var nombre = readerCategorias["Nombre"].ToString();
                                    var apellidoPaterno = readerCategorias["ApellidoPaterno"].ToString();
                                    var apellidoMaterno = readerCategorias["ApellidoMaterno"].ToString();
                                    var fechaNacimiento = readerCategorias["fechaNacimiento"].ToString();
                                    var sexo = readerCategorias["sexo"].ToString() == "MUJER" ? "F" : readerCategorias["sexo"].ToString() == "HOMBRE" ? "M" : "I";
                                    var estadoNacimiento = readerCategorias["estadoNacimiento"].ToString();
                                    var curpConsultada = readerCategorias["Curp"].ToString();
                                    var estatus = readerCategorias["estatus"].ToString();
                                    var codigoValidacion = readerCategorias["codigoValidacion"].ToString();
                                    var paisNacimiento = readerCategorias["paisNacimiento"].ToString();
                                    var docProbatorio = readerCategorias["docProbatorio"].ToString();
                                    var entidadRegistro = readerCategorias["entidadRegistro"].ToString();
                                    var tomo = readerCategorias["tomo"].ToString();
                                    var claveMunicipioRegistro = readerCategorias["claveMunicipioRegistro"].ToString();
                                    var anioReg = readerCategorias["anioReg"].ToString();
                                    var claveEntidadRegistro = readerCategorias["claveEntidadRegistro"].ToString();
                                    var foja = readerCategorias["foja"].ToString();
                                    var numActa = readerCategorias["numActa"].ToString();
                                    var libro = readerCategorias["libro"].ToString();
                                    var municipioRegistro = readerCategorias["municipioRegistro"].ToString();
                                    var estatusCurp = readerCategorias["estatusCurp"].ToString();
                                    var codigoMensaje = readerCategorias["codigoMensaje"].ToString();
                                    //añadirlos a la lista
                                    list.Add(new Dictionary<string, object> {
                                    { "Nombre", nombre },
                                    { "ApellidoPaterno", apellidoPaterno },
                                    { "ApellidoMaterno", apellidoMaterno },
                                    { "FechaNacimiento", DateTime.ParseExact(fechaNacimiento, "dd/MM/yyyy", CultureInfo.InvariantCulture) },
                                    { "SexoID", sexo },
                                    { "LugarNacimiento", estadoNacimiento },
                                    { "CURP", curpConsultada },
                                    { "estatus", estatus },
                                    { "codigoValidacion", codigoValidacion },
                                    { "paisNacimiento", paisNacimiento },
                                    { "docProbatorio", docProbatorio },
                                    { "entidadRegistro", entidadRegistro },
                                    { "tomo", tomo },
                                    { "claveMunicipioRegistro", claveMunicipioRegistro },
                                    { "anioReg", anioReg },
                                    { "claveEntidadRegistro", claveEntidadRegistro },
                                    { "foja", foja },
                                    { "numActa", numActa },
                                    { "libro", libro },
                                    { "municipioRegistro", municipioRegistro },
                                    { "estatusCurp", estatusCurp },
                                    { "codigoMensaje", codigoMensaje }
                                });

                                }
                            }


                            // Cerrar conexion
                            await readerCategorias.CloseAsync();
                            return Ok(new { resultCode = 0, resultDesc = "OK.", data = list[0] });
                        }


                    };
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    resultCode = -1,
                    msg = ex.Message
                });
            }
        }





        [HttpGet]
        [Route("ObtenerEstatusCurp")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetStatusCurp()
        {
            try
            {
                var status = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE varName = 'Curp_Formulario_Desabilitar'").SingleOrDefaultAsync();
                if (status.varValue == null)
                {
                    await ConexionBD.Destroy();
                    return BadRequest(new { status = false, msj = "Error al consultar status" });
                }
                else
                {
                    await ConexionBD.Destroy();
                    return Ok(status.varValue);
                }

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


    }
}