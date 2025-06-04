using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.ScoreCodigoRazon")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class ScoreCodigoRazon
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idScore")]
        public int idScore { get; set; }
      
        
        [Column("codigoRazon")]
        public int codigoRazon { get; set; }


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
