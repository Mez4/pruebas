using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.MatrizProcesosDetalle")]
    [ExplicitColumns]
    [PrimaryKey("MatrizProcesosDetalleID")]
    public class MatrizProcesosDetalle
    {
              
        
        [Column("MatrizProcesosDetalleID")]
        public int MatrizProcesosDetalleID { get; set; }
      
        
        [Column("MatrizProcesosID")]
        public int MatrizProcesosID { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64 StatusProcesoID { get; set; }
      
        
        [Column("CapturaObligatoria")]
        public bool CapturaObligatoria { get; set; }
      
        
        [Column("Notificacion")]
        public bool Notificacion { get; set; }
      
        
        [Column("NotaObligatoria")]
        public bool NotaObligatoria { get; set; }
      
        
        [Column("DictamenObligatorio")]
        public bool DictamenObligatorio { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Prospeccion.StatusProceso>> CH__STATUS_PROCESO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.StatusProceso>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.MatrizProcesos>> CH__MATRIZPROCESO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.MatrizProcesos>("WHERE MatrizProcesosID = @MatrizProcesosID", this).ToListAsync();
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
