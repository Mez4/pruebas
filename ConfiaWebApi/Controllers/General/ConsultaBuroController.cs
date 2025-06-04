using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class ConsultaBuroController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public ConsultaBuroController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("ReConsultaBuro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ReConsultaBuro(ConfiaWebApi.PeticionesRest.General.ConsultaBuro.ConsultaBuro parData)
        {
            try
            { 
                
                
                var TuberiaTime = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Prospeccion.Tuberia>("WHERE PersonaID=@0 AND StatusProcesoID = 11", parData.PersonaID).FirstOrDefaultAsync();
                  
                parData.ProspectoID = parData.PersonaID;
                var result = await ConexionBD.database.QueryAsync<ReConsulta>("EXEC ReConsultarBuro @ProspectoID", new { ProspectoID = parData.ProspectoID }).ToArrayAsync();  
            
                if (TuberiaTime != null )
                {
                    TuberiaTime.TuberiaResultadoID = 1;
                    await ConexionBD.database.UpdateAsync(TuberiaTime);
                }
                await ConexionBD.Destroy();
                return Ok(TuberiaTime);

            }
            catch (Exception ex)
            {

                await ConexionBD.Destroy();
                return BadRequest(ex.Message);

            }
        }



        [HttpPost]
        [Route("ConsultaBuro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ConsultaBuro(ConfiaWebApi.PeticionesRest.General.ConsultaBuro.ConsultaBuro parData)
        {
            SqlConnection sqlConnection = null;
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var persona = await ConexionBD.database.QueryAsync<DatoActualPersona>("WHERE PersonaID = @PersonaID", parData).SingleOrDefaultAsync();
                var nombre = Regex.Replace(persona.Nombre.Split()[0], @"[^0-9a-zA-Z\ ]+", "");
                var nombreAdicional = persona.Nombre.Remove(0, persona.Nombre.Length > nombre.Length ? nombre.Length + 1 : nombre.Length);

                var msjBDVR = "";
                using (sqlConnection = new SqlConnection(Configuracion["ConnectionStrings:BDVR_ConsultaBuro"]))
                {
                    var parameters = new List<SqlParameter>
                    {
                        new SqlParameter("@error",              SqlDbType.Int)          { Value = 0,                        Direction = ParameterDirection.Output},
                        new SqlParameter("@resultado",          SqlDbType.VarChar, 512) { Value = "",                       Direction = ParameterDirection.Output},
                        new SqlParameter("@CveCliNva",          SqlDbType.VarChar, 12)  { Value = "",                       Direction = ParameterDirection.Output},
                        new SqlParameter("@XRBID",              SqlDbType.BigInt)       { Value = 0,                        Direction = ParameterDirection.Output},
                        new SqlParameter("@userID",             SqlDbType.BigInt)       { Value = $"{parData.PersonaID}",   Direction = ParameterDirection.Input},

                        new SqlParameter("@Nombre",             SqlDbType.VarChar)      { Value = nombre,                   Direction = ParameterDirection.Input},
                        new SqlParameter("@ApellidoPat",        SqlDbType.VarChar)      { Value = persona.ApellidoPaterno,  Direction = ParameterDirection.Input},
                        new SqlParameter("@ApellidoMat",        SqlDbType.VarChar)      { Value = persona.ApellidoMaterno,  Direction = ParameterDirection.Input},
                        new SqlParameter("@TelCel",             SqlDbType.VarChar)      { Value = persona.TelefonoMovil,    Direction = ParameterDirection.Input},
                        new SqlParameter("@Status",             SqlDbType.VarChar)      { Value = "A",                      Direction = ParameterDirection.Input},
                        new SqlParameter("@RFC",                SqlDbType.VarChar)      { Value = persona.RFC,              Direction = ParameterDirection.Input},
                        new SqlParameter("@fec_nac",            SqlDbType.DateTime)     { Value = persona.FechaNacimiento,  Direction = ParameterDirection.Input},
                        new SqlParameter("@Nombre_Vialidad",    SqlDbType.VarChar)      { Value = persona.NombreVialidad,   Direction = ParameterDirection.Input},
                        new SqlParameter("@No_Interior",        SqlDbType.VarChar)      { Value = persona.NumeroInterior ?? "",  Direction = ParameterDirection.Input},
                        new SqlParameter("@No_Exterior",        SqlDbType.VarChar)      { Value = persona.NumeroExterior,   Direction = ParameterDirection.Input},
                        new SqlParameter("@curp",               SqlDbType.VarChar)      { Value = persona.CURP,             Direction = ParameterDirection.Input},
                        new SqlParameter("@COD_POS",            SqlDbType.VarChar)      { Value = persona.codigoPostal,     Direction = ParameterDirection.Input},
                        new SqlParameter("@id_asentamiento",    SqlDbType.VarChar)      { Value = persona.id_asentamiento,  Direction = ParameterDirection.Input},
                        new SqlParameter("@NombreAdicional",    SqlDbType.VarChar)      { Value = nombreAdicional,          Direction = ParameterDirection.Input},
                        new SqlParameter("@Estado",             SqlDbType.VarChar)      { Value = persona.Estado,           Direction = ParameterDirection.Input},
                        new SqlParameter("@Municipio",          SqlDbType.VarChar)      { Value = persona.Municipio,        Direction = ParameterDirection.Input},
                        new SqlParameter("@Colonia",            SqlDbType.VarChar)      { Value = persona.Asentamiento,     Direction = ParameterDirection.Input},
                        new SqlParameter("@Ciudad",             SqlDbType.VarChar)      { Value = string.IsNullOrEmpty(persona.Ciudad) ? persona.Municipio : persona.Ciudad, Direction = ParameterDirection.Input},
                    };

                    await sqlConnection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("wsRegistroPersonasCVConsultaBuro", sqlConnection) { CommandType = CommandType.StoredProcedure })
                    {
                        command.Parameters.AddRange(parameters.ToArray());
                        using (SqlDataReader r = await command.ExecuteReaderAsync())
                        {
                            msjBDVR = parameters[1].Value.ToString();
                            if ((int)parameters[0].Value == 0)
                            {
                                ConexionBD.database.BeginTransaction();

                                var gPersona = await ConexionBD.database.SingleByIdAsync<Personas>(persona.PersonaID);
                                gPersona.CveCli = parameters[2].Value.ToString();
                                await ConexionBD.database.UpdateAsync(gPersona);

                                var obj = new { XmlResultBuroID = (Int64)parameters[3].Value };
                                var validaCons = await ConexionBD.database.QueryAsync<ConsultaBuro>("WHERE XmlResultBuroID = @XmlResultBuroID", obj).SingleOrDefaultAsync();
                                if (validaCons == null)
                                {
                                    var consulta = new ConsultaBuro()
                                    {
                                        PersonaID = persona.PersonaID,
                                        XmlResultBuroID = (Int64)parameters[3].Value,
                                        ResultCode = 0,
                                        ResultDesc = "",
                                        FechaRegistro = DateTime.Now,
                                        UsuarioRegistraID = UsuarioActual.UsuarioID,
                                        PersonaRegistaID = (Int64)UsuarioActual.PersonaID,
                                        EstatusConsultaBuroID = 3
                                    };
                                    await ConexionBD.database.InsertAsync<ConsultaBuro>(consulta);
                                }

                                if (persona.Prospecto == 1)
                                {
                                    var prospecto = await ConexionBD.database.SingleByIdAsync<Prospectos>(persona.PersonaID);
                                    prospecto.EstatusConsultaBuroID = 3;
                                    await ConexionBD.database.UpdateAsync(prospecto);
                                }

                                ConexionBD.database.CompleteTransaction();
                            }
                            else
                            {
                                throw new Exception(parameters[1].Value.ToString());
                            }
                        }
                    }
                }

                var res = new
                {
                    res = 1,
                    msj = $"Se ha solicitado la consulta de Buró para {persona.Nombre} {persona.ApellidoPaterno} {persona.ApellidoMaterno} ({persona.PersonaID}). En unos minutos estará disponible en su expediente.",
                    msjBDVR,
                };

                await sqlConnection.CloseAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await sqlConnection.CloseAsync();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
