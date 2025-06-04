using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.ConveniosTabulador")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class ConveniosTabulador
    {
              
        
        [Column("Id")]
        public Int64 Id { get; set; }
      
        
        [Column("DiasAtrMin")]
        public int DiasAtrMin { get; set; }
      
        
        [Column("DiasAtrMax")]
        public int DiasAtrMax { get; set; }
      
        
        [Column("SaldoMin")]
        public decimal SaldoMin { get; set; }
      
        
        [Column("SaldoMax")]
        public decimal SaldoMax { get; set; }
      
        
        [Column("PorcQuita")]
        public decimal PorcQuita { get; set; }
      
        
        [Column("PlazosMin")]
        public int PlazosMin { get; set; }
      
        
        [Column("PlazosMax")]
        public int PlazosMax { get; set; }
      
        
        [Column("PorcPagInt")]
        public decimal? PorcPagInt { get; set; }


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
