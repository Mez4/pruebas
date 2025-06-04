using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.ColoresProductoApp_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ColoresProductoApp_VW
    {
              
        
        [Column("NombreColor")]
        public string NombreColor { get; set; }
      
        
        [Column("ValorColor")]
        public Int64? ValorColor { get; set; }
      
        
        [Column("TipoEmpresaId")]
        public int TipoEmpresaId { get; set; }
      
        
        [Column("EmpresaId")]
        public int EmpresaId { get; set; }


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
