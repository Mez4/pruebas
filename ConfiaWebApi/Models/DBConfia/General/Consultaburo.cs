using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.ConsultaBuro")]
    [ExplicitColumns]
    [PrimaryKey("ConsultaBuroID")]
    public class ConsultaBuro
    {
              
        
        [Column("ConsultaBuroID")]
        public Int64 ConsultaBuroID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("XmlResultBuroID")]
        public Int64 XmlResultBuroID { get; set; }
      
        
        [Column("ResultCode")]
        public int ResultCode { get; set; }
      
        
        [Column("ResultDesc")]
        public string ResultDesc { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("PersonaRegistaID")]
        public Int64 PersonaRegistaID { get; set; }
      
        
        [Column("FechaConsulta")]
        public DateTime? FechaConsulta { get; set; }
      
        
        [Column("EstatusConsultaBuroID")]
        public int EstatusConsultaBuroID { get; set; }
      
        
        [Column("url")]
        public string url { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_REGISTRA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaRegistaID = @PersonaID", this).ToListAsync();
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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.EstatusConsultaBuro>> CH__ESTATUS_CONSULTA_BURO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EstatusConsultaBuro>("WHERE EstatusConsultaBuroID = @EstatusConsultaBuroID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__USUARIO_REGISTRA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioRegistraID = @UsuarioID", this).ToListAsync();
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
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
