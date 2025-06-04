using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.PromotorProspecto")]
    [ExplicitColumns]
    [PrimaryKey("creditoPromotorID,ProspectoID", AutoIncrement=false)]
    public class PromotorProspecto
    {
              
        
        [Column("creditoPromotorID")]
        public Int64 creditoPromotorID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("Reasignar")]
        public bool? Reasignar { get; set; }


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
