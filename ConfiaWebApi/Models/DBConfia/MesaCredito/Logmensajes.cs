using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.LogMensajes")]
    [ExplicitColumns]
    [PrimaryKey("MensajeID")]
    public class LogMensajes
    {
              
        
        [Column("MensajeID")]
        public int MensajeID { get; set; }
      
        
        [Column("mensaje")]
        public string mensaje { get; set; }
      
        
        [Column("EstatusMesaID")]
        public int EstatusMesaID { get; set; }
      
        
        [Column("fecha_hora")]
        public DateTime fecha_hora { get; set; }
      
        
        [Column("ValidacionMesaID")]
        public int ValidacionMesaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS9C4FECE0(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.MesaCredito.ValidacionMesa>> CH__LogMensaj(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.ValidacionMesa>("WHERE ValidacionMesaID = @ValidacionMesaID", this).ToListAsync();
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
