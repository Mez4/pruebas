using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.TiposMovs_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class TiposMovs_VW
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("CveMovimientoID")]
        public string CveMovimientoID { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("Cargo")]
        public bool Cargo { get; set; }
      
        
        [Column("AceptaDepositos")]
        public bool? AceptaDepositos { get; set; }
      
        
        [Column("AceptaRetiros")]
        public bool? AceptaRetiros { get; set; }
      
        
        [Column("MovAgrupaID")]
        public int MovAgrupaID { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }
      
        
        [Column("MovAgrupa")]
        public string MovAgrupa { get; set; }
      
        
        [Column("ManejaEfectivo")]
        public bool? ManejaEfectivo { get; set; }


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
