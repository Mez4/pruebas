using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.EstatusMovimiento")]
    [ExplicitColumns]
    [PrimaryKey("CatEstatusMovID")]
    public class EstatusMovimiento
    {
              
        
        [Column("CatEstatusMovID")]
        public int CatEstatusMovID { get; set; }
      
        
        [Column("Caracter")]
        public string Caracter { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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
