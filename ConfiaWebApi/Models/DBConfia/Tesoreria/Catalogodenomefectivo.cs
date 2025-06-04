using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CatalogoDenomEfectivo")]
    [ExplicitColumns]
    [PrimaryKey("CatDenomEfectivoID")]
    public class CatalogoDenomEfectivo
    {
              
        
        [Column("CatDenomEfectivoID")]
        public int CatDenomEfectivoID { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Concepto")]
        public string Concepto { get; set; }
      
        
        [Column("ValorMonetario")]
        public decimal ValorMonetario { get; set; }


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
