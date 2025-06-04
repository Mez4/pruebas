using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.Ordenantes")]
    [ExplicitColumns]
    [PrimaryKey("OrdenanteID", AutoIncrement=false)]
    public class Ordenantes
    {
              
        
        [Column("ID")]
        public int ID { get; set; }
      
        
        [Column("OrdenanteID")]
        public string OrdenanteID { get; set; }
      
        
        [Column("Ordenante")]
        public string Ordenante { get; set; }
      
        
        [Column("EmpresaFiscalID")]
        public int EmpresaFiscalID { get; set; }


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
