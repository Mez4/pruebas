using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.PerfilesApp")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class PerfilesApp
    {
              
        
        [Column("id")]
        public Int64 id { get; set; }
      
        
        [Column("cobradorAsignado")]
        public string cobradorAsignado { get; set; }
      
        
        [Column("perfil")]
        public string perfil { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }
      
        
        [Column("creacionFecha")]
        public DateTime creacionFecha { get; set; }
      
        
        [Column("sucursalId")]
        public int sucursalId { get; set; }
      
        
        [Column("nombreCompleto")]
        public string nombreCompleto { get; set; }
      
        
        [Column("nivelJerarquicoApp")]
        public int nivelJerarquicoApp { get; set; }
      
        
        [Column("numeroCelular")]
        public string numeroCelular { get; set; }
      
        
        [Column("sucursalesNivel")]
        public string sucursalesNivel { get; set; }


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
