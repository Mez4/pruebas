using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.RelacionProspectoDistribuidora")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class RelacionProspectoDistribuidora
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idProspecto")]
        public int idProspecto { get; set; }
      
        
        [Column("idDistribuidora")]
        public int idDistribuidora { get; set; }
      
        
        [Column("fechaActualizacion")]
        public DateTime? fechaActualizacion { get; set; }
      
        
        [Column("fechaCreacion")]
        public DateTime? fechaCreacion { get; set; }


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
