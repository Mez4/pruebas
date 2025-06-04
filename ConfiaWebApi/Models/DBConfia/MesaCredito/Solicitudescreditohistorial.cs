using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.SolicitudesCreditoHistorial")]
    [ExplicitColumns]
    // No primary key detected
    public class SolicitudesCreditoHistorial
    {
              
        
        [Column("ID")]
        public int ID { get; set; }
      
        
        [Column("SolicitudCreditoID")]
        public int? SolicitudCreditoID { get; set; }
      
        
        [Column("EstatusValidacionID")]
        public int? EstatusValidacionID { get; set; }
      
        
        [Column("ValidacionMesaID")]
        public int ValidacionMesaID { get; set; }
      
        
        [Column("DocumentoID")]
        public int DocumentoID { get; set; }
      
        
        [Column("Comentarios")]
        public string Comentarios { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS15F03EC4(DBConfiaContext parContext)
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
