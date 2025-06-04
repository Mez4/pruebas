using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasContables_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CuentasContables_VW
    {
              
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Cuenta")]
        public string Cuenta { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }
      
        
        [Column("TipoID")]
        public int TipoID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("TipoBancoId")]
        public int? TipoBancoId { get; set; }
      
        
        [Column("Dispersa")]
        public bool? Dispersa { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("NaturalezaID")]
        public int NaturalezaID { get; set; }
      
        
        [Column("RubroID")]
        public int RubroID { get; set; }
      
        
        [Column("EmpresaID")]
        public int EmpresaID { get; set; }
      
        
        [Column("CatMonedaSatID")]
        public int CatMonedaSatID { get; set; }
      
        
        [Column("CuentaID")]
        public int CuentaID { get; set; }
      
        
        [Column("AcumulaCuentaID")]
        public int? AcumulaCuentaID { get; set; }
      
        
        [Column("NombreAcumulaCuenta")]
        public string NombreAcumulaCuenta { get; set; }
      
        
        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }


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
