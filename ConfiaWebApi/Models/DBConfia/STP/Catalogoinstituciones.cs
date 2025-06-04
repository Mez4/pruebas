using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.CatalogoInstituciones")]
    [ExplicitColumns]
    [PrimaryKey("Clave", AutoIncrement=false)]
    public class CatalogoInstituciones
    {
              
        
        [Column("InstitucionID")]
        public int InstitucionID { get; set; }
      
        
        [Column("Clave")]
        public int Clave { get; set; }
      
        
        [Column("Participante")]
        public string Participante { get; set; }


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
