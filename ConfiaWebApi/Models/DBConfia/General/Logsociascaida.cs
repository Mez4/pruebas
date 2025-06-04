using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.LogSociasCaida")]
    [ExplicitColumns]
    [PrimaryKey("LogSociasCaidaID")]
    public class LogSociasCaida
    {
              
        
        [Column("LogSociasCaidaID")]
        public int LogSociasCaidaID { get; set; }
      
        
        [Column("FechaCaida")]
        public DateTime? FechaCaida { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorOrigenID")]
        public int? DistribuidorOrigenID { get; set; }
      
        
        [Column("StatusBuroID")]
        public int? StatusBuroID { get; set; }


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
