using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.Aplicaciones_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Aplicaciones_VW
    {
              
        
        [Column("AplicacionID")]
        public Int64 AplicacionID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("FechaAplicacion")]
        public DateTime FechaAplicacion { get; set; }
      
        
        [Column("MovimientoIdPago")]
        public Int64 MovimientoIdPago { get; set; }
      
        
        [Column("MovimientoIdComision")]
        public Int64? MovimientoIdComision { get; set; }
      
        
        [Column("MovimientoIdDNI")]
        public Int64? MovimientoIdDNI { get; set; }
      
        
        [Column("ConvenioID")]
        public int? ConvenioID { get; set; }
      
        
        [Column("FechaHoraUltimoPagoAnt")]
        public DateTime? FechaHoraUltimoPagoAnt { get; set; }
      
        
        [Column("CuentaID")]
        public int? CuentaID { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioCanceloID")]
        public int? UsuarioCanceloID { get; set; }
      
        
        [Column("Sucursal")]
        public string Sucursal { get; set; }
      
        
        [Column("Distribuidor")]
        public string Distribuidor { get; set; }
      
        
        [Column("Cliente")]
        public string Cliente { get; set; }


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
