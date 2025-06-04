using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CatalogoCajasUsuarios")]
    [ExplicitColumns]
    [PrimaryKey("CajaID,UsuarioID", AutoIncrement=false)]
    public class CatalogoCajasUsuarios
    {
              
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioRegistroID")]
        public int UsuarioRegistroID { get; set; }
      
        
        [Column("FechaModifico")]
        public DateTime? FechaModifico { get; set; }
      
        
        [Column("UsuarioModificoID")]
        public int? UsuarioModificoID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("PuedeDesembolsar")]
        public bool PuedeDesembolsar { get; set; }


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
