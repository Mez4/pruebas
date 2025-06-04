using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.Score")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Score
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("nombreScore")]
        public string nombreScore { get; set; }
      
        
        [Column("CodigoScore")]
        public string CodigoScore { get; set; }
      
        
        [Column("ValorScore")]
        public string ValorScore { get; set; }
      
        
        [Column("CodigoError")]
        public string CodigoError { get; set; }


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
