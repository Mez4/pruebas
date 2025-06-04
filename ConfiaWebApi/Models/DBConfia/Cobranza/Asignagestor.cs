using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.AsignaGestor")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class AsignaGestor
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("AsignaGestorID")]
        public int AsignaGestorID { get; set; }
      
        
        [Column("EstatusValidacionID")]
        public int EstatusValidacionID { get; set; }


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
