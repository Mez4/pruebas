using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ComisionesConvenios_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ComisionesConvenios_VW
    {
              
        
        [Column("ConvenioID")]
        public int ConvenioID { get; set; }
      
        
        [Column("descripcion")]
        public string descripcion { get; set; }
      
        
        [Column("ProductoID")]
        public Int64 ProductoID { get; set; }
      
        
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
      
        
        [Column("BancoID")]
        public int BancoID { get; set; }
      
        
        [Column("ComisionesID")]
        public int ComisionesID { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }
      
        
        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("ModificaUsuarioId")]
        public int? ModificaUsuarioId { get; set; }
      
        
        [Column("ModificaFecha")]
        public DateTime? ModificaFecha { get; set; }


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
