using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CatalogoDenomEfectivo_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CatalogoDenomEfectivo_VW
    {
              
        
        [Column("CatDenomEfectivoID")]
        public int CatDenomEfectivoID { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Concepto")]
        public string Concepto { get; set; }
      
        
        [Column("ValorMonetario")]
        public decimal ValorMonetario { get; set; }
      
        
        [Column("Total")]
        public int Total { get; set; }
      
        
        [Column("Cantidad")]
        public int Cantidad { get; set; }


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
