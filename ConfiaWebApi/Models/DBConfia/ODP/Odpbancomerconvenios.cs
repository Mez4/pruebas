using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.ODP
{
    [TableName("ODP.odpBancomerConvenios")]
    [ExplicitColumns]
    [PrimaryKey("balance,convenio", AutoIncrement=false)]
    public class odpBancomerConvenios
    {
              
        
        [Column("OdpBancomerConvenioID")]
        public int OdpBancomerConvenioID { get; set; }
      
        
        [Column("descripcion")]
        public string descripcion { get; set; }
      
        
        [Column("balance")]
        public Int64 balance { get; set; }
      
        
        [Column("convenio")]
        public string convenio { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("nombreComercialEmpresa")]
        public string nombreComercialEmpresa { get; set; }
      
        
        [Column("cuentaBancaria")]
        public string cuentaBancaria { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }


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
