using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.EstatusArchivoDispersion")]
    [ExplicitColumns]
    [PrimaryKey("EstatusArchivoID")]
    public class EstatusArchivoDispersion
    {
              
        
        [Column("EstatusArchivoID")]
        public int EstatusArchivoID { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
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
