using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.TotalEfectivoCaja")]
    [ExplicitColumns]
    [PrimaryKey("TotalEfectivoCajaID")]
    public class TotalEfectivoCaja
    {
              
        
        [Column("TotalEfectivoCajaID")]
        public int TotalEfectivoCajaID { get; set; }
      
        
        [Column("CatDenomEfectivoID")]
        public int CatDenomEfectivoID { get; set; }
      
        
        [Column("Cantidad")]
        public int Cantidad { get; set; }
      
        
        [Column("TotalXEfectivo")]
        public decimal? TotalXEfectivo { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("ArqueoID")]
        public int? ArqueoID { get; set; }


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
