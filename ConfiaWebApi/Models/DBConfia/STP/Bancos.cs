using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.Bancos")]
    [ExplicitColumns]
    [PrimaryKey("BancoID")]
    public class Bancos
    {
              
        
        [Column("BancoID")]
        public int BancoID { get; set; }
      
        
        [Column("Clave")]
        public int Clave { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }


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
