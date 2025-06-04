using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.PersonasDatosBancarios")]
    [ExplicitColumns]
    [PrimaryKey("personasDatosBancariosID")]
    public class PersonasDatosBancarios
    {


        [Column("personasDatosBancariosID")]
        public Int64 personasDatosBancariosID { get; set; }


        [Column("personaID")]
        public Int64 personaID { get; set; }


        [Column("datoTipoID")]
        public int datoTipoID { get; set; }


        [Column("cveBancoRef")]
        public int cveBancoRef { get; set; }


        [Column("datoBancario")]
        public string datoBancario { get; set; }


        [Column("fechaRegistro")]
        public DateTime fechaRegistro { get; set; }


        [Column("activo")]
        public bool activo { get; set; }

        [Column("fechaModifica")]
        public DateTime? fechaModifica { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################

        public async Task<List<DBContext.DBConfia.Catalogos.DatosBancariosTipos>> CH__DATO_BANCARIO_TIPO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.DatosBancariosTipos>("WHERE datoTipoID = @datoTipoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE personaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.CatalogoBancos>> CH__CNB(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoBancos>("WHERE cveBancoRef = @BancoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################

        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> PA__Creditos___Creditos___personasDatosBancariosID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE personasDatosBancariosID = @personasDatosBancariosID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudCreditosPersonales>> PA__Creditos___SolicitudCreditosPersonales___personaDatosBancariosID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudCreditosPersonales>("WHERE personasDatosBancariosID = @personaDatosBancariosID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################

    }
}
