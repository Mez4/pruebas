using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.FiltrosCarteraGlobal")]
    [ExplicitColumns]
    [PrimaryKey("filtroID", AutoIncrement=false)]
    public class FiltrosCarteraGlobal
    {
              
        
        [Column("filtroID")]
        public int filtroID { get; set; }
      
        
        [Column("filtroDesc")]
        public string filtroDesc { get; set; }
      
        
        [Column("diasMin")]
        public int diasMin { get; set; }
      
        
        [Column("diasMax")]
        public int diasMax { get; set; }
      
        
        [Column("criterioText")]
        public string criterioText { get; set; }
      
        
        [Column("principal")]
        public bool principal { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }
      
        
        [Column("convenio")]
        public bool convenio { get; set; }
      
        
        [Column("convenioTipoID")]
        public int convenioTipoID { get; set; }


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
