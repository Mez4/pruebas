using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.Clientes")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorID,PersonaID", AutoIncrement=false)]
    public class Clientes
    {
              
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("EsttausId")]
        public bool? EsttausId { get; set; }
      
        
        [Column("AsignacionFecha")]
        public DateTime? AsignacionFecha { get; set; }
      
        
        [Column("bloqueado")]
        public bool? bloqueado { get; set; }
      
        
        [Column("CreditosActivos")]
        public int? CreditosActivos { get; set; }
      
        
        [Column("CreditosTotales")]
        public int? CreditosTotales { get; set; }
      
        
        [Column("Nota")]
        public string Nota { get; set; }


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
