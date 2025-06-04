using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Empresas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Empresas_VW
    {
              
        
        [Column("empresaId")]
        public int empresaId { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }
      
        
        [Column("empresaRfc")]
        public string empresaRfc { get; set; }
      
        
        [Column("empresaDireccionFiscal")]
        public string empresaDireccionFiscal { get; set; }
      
        
        [Column("empresaRegistroPatronal")]
        public string empresaRegistroPatronal { get; set; }
      
        
        [Column("empresaRazonSocial")]
        public string empresaRazonSocial { get; set; }
      
        
        [Column("PrefijoApp")]
        public string PrefijoApp { get; set; }
      
        
        [Column("EsPrestaStar")]
        public bool? EsPrestaStar { get; set; }
      
        
        [Column("TipoEmpresaID")]
        public int? TipoEmpresaID { get; set; }
      
        
        [Column("TipoEmpresa")]
        public string TipoEmpresa { get; set; }


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
