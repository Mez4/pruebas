using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Coordinadores_Distribuidores__EstatusVW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Coordinadores_Distribuidores__EstatusVW
    {
              
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("CarteraVencida")]
        public bool CarteraVencida { get; set; }
      
        
        [Column("ImprimirRelacionesMasivas")]
        public bool ImprimirRelacionesMasivas { get; set; }
      
        
        [Column("EstadoCoordinadorId")]
        public string EstadoCoordinadorId { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("CreacionPersonaId")]
        public Int64? CreacionPersonaId { get; set; }
      
        
        [Column("ModificacionFecha")]
        public DateTime? ModificacionFecha { get; set; }
      
        
        [Column("ModificacionPersonaId")]
        public Int64? ModificacionPersonaId { get; set; }
      
        
        [Column("CreacionUsuarioId")]
        public int? CreacionUsuarioId { get; set; }
      
        
        [Column("ModificacionUsuarioId")]
        public int? ModificacionUsuarioId { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
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
