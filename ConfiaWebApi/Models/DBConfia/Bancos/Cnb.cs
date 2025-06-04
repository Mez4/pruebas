using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CNB")]
    [ExplicitColumns]
    [PrimaryKey("CveBancoRef", AutoIncrement=false)]
    public class CNB
    {
              
        
        [Column("CveBancoRef")]
        public int CveBancoRef { get; set; }
      
        
        [Column("NombreBanco")]
        public string NombreBanco { get; set; }


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
