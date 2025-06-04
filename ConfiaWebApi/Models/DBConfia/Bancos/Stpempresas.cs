using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.stpEmpresas")]
    [ExplicitColumns]
    [PrimaryKey("EmpresaStpID")]
    public class stpEmpresas
    {
              
        
        [Column("EmpresaStpID")]
        public int EmpresaStpID { get; set; }
      
        
        [Column("EmpresaDesc")]
        public string EmpresaDesc { get; set; }
      
        
        [Column("NumCuentaRef")]
        public string NumCuentaRef { get; set; }
      
        
        [Column("ClaveOrdenante")]
        public string ClaveOrdenante { get; set; }


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
