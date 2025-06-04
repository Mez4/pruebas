using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.LogMensajes")]
    [ExplicitColumns]
    [PrimaryKey("LogMensajeID")]
    public class LogMensajes
    {
              
        
        [Column("LogMensajeID")]
        public int LogMensajeID { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }
      
        
        [Column("Fecha_hora")]
        public DateTime Fecha_hora { get; set; }
      
        
        [Column("AnalistaID")]
        public Int64 AnalistaID { get; set; }
      
        
        [Column("Leido")]
        public bool Leido { get; set; }
      
        
        [Column("EnviadoDesdePantalla")]
        public bool EnviadoDesdePantalla { get; set; }
      
        
        [Column("AclaracionID")]
        public int? AclaracionID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_A(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE AnalistaID = @PersonaID", this).ToListAsync();
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
