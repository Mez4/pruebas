using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CajaTipoOperacion")]
    [ExplicitColumns]
    [PrimaryKey("CajaTipoOperacionID")]
    public class CajaTipoOperacion
    {
              
        
        [Column("CajaTipoOperacionID")]
        public int CajaTipoOperacionID { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }
      
        
        [Column("Activa")]
        public bool? Activa { get; set; }
      
        
        [Column("CuentaBancoId")]
        public int? CuentaBancoId { get; set; }
      
        
        [Column("PuedeSacar")]
        public bool? PuedeSacar { get; set; }
      
        
        [Column("PuedeRecibir")]
        public bool? PuedeRecibir { get; set; }


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
