using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.ConfigTipoDispersionApp")]
    [ExplicitColumns]
    [PrimaryKey("ConfigTipoDispersionAppID")]
    public class ConfigTipoDispersionApp
    {
              
        
        [Column("ConfigTipoDispersionAppID")]
        public Int64 ConfigTipoDispersionAppID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("HabilitadoParaPP")]
        public bool? HabilitadoParaPP { get; set; }


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
