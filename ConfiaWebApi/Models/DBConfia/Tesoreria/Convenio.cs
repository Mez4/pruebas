using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.Convenio")]
    [ExplicitColumns]
    [PrimaryKey("ConvenioID")]
    public class Convenio
    {
              
        
        [Column("ConvenioID")]
        public int ConvenioID { get; set; }
      
        
        [Column("NombreConvenio")]
        public string NombreConvenio { get; set; }
      
        
        [Column("CodigoConvenio")]
        public string CodigoConvenio { get; set; }
      
        
        [Column("Usuario")]
        public string Usuario { get; set; }
      
        
        [Column("Contrasena")]
        public string Contrasena { get; set; }


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
