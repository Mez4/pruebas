using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.logCambioDireccion")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class logCambioDireccion
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("Usuario_Logueado")]
        public int? Usuario_Logueado { get; set; }
      
        
        [Column("Persona_Logueada")]
        public int? Persona_Logueada { get; set; }
      
        
        [Column("DireccionID_Antigua")]
        public int? DireccionID_Antigua { get; set; }
      
        
        [Column("DireccionID_Nueva")]
        public int? DireccionID_Nueva { get; set; }
      
        
        [Column("Nota")]
        public string Nota { get; set; }
      
        
        [Column("Fecha_Registro")]
        public DateTime? Fecha_Registro { get; set; }


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
