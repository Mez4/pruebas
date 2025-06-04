using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Estatus")]
    [ExplicitColumns]
    [PrimaryKey("EstatusID", AutoIncrement=false)]
    public class Estatus
    {
              
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("EstatusNombre")]
        public string EstatusNombre { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }


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
