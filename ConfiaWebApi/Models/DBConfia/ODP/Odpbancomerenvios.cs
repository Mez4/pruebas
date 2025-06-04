using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.ODP
{
    [TableName("ODP.ODPBancomerEnvios")]
    [ExplicitColumns]
    [PrimaryKey("ODPBancomerEnvioID")]
    public class ODPBancomerEnvios
    {
              
        
        [Column("ODPBancomerEnvioID")]
        public int ODPBancomerEnvioID { get; set; }
      
        
        [Column("FechaEnvio")]
        public DateTime? FechaEnvio { get; set; }
      
        
        [Column("ConsecutivoDia")]
        public int? ConsecutivoDia { get; set; }
      
        
        [Column("CuentaCargo")]
        public string CuentaCargo { get; set; }
      
        
        [Column("Tipo")]
        public string Tipo { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("FHRegistro")]
        public DateTime FHRegistro { get; set; }
      
        
        [Column("NoBalance")]
        public int NoBalance { get; set; }
      
        
        [Column("Convenio")]
        public string Convenio { get; set; }
      
        
        [Column("Archivo")]
        public string Archivo { get; set; }
      
        
        [Column("Vencimiento")]
        public DateTime Vencimiento { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }


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
