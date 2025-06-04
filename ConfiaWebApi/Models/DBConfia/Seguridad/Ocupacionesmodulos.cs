using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.OcupacionesModulos")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class OcupacionesModulos
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("OcupacionId")]
        public int OcupacionId { get; set; }
      
        
        [Column("RolID")]
        public int RolID { get; set; }
      
        
        [Column("CreacionUsuarioID")]
        public int CreacionUsuarioID { get; set; }
      
        
        [Column("CreacionPersonaID")]
        public Int64 CreacionPersonaID { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }


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
