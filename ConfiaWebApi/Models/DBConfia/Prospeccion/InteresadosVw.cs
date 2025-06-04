using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.Interesados_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Interesados_VW
    {
              
        
        [Column("InteresadosID")]
        public Int64 InteresadosID { get; set; }
      
        
        [Column("NombreInteresado")]
        public string NombreInteresado { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("NombreUsuario")]
        public string NombreUsuario { get; set; }
      
        
        [Column("InicioProceso")]
        public bool InicioProceso { get; set; }
      
        
        [Column("CreacionPersonaID")]
        public Int64 CreacionPersonaID { get; set; }
      
        
        [Column("CreacionUsuarioID")]
        public int CreacionUsuarioID { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("calle")]
        public string calle { get; set; }
      
        
        [Column("localidad")]
        public string localidad { get; set; }
      
        
        [Column("numeroExterior")]
        public string numeroExterior { get; set; }
      
        
        [Column("FechaDescarte")]
        public DateTime? FechaDescarte { get; set; }
      
        
        [Column("ObservacionesDescartado")]
        public string ObservacionesDescartado { get; set; }
      
        
        [Column("Descartado")]
        public bool? Descartado { get; set; }


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
