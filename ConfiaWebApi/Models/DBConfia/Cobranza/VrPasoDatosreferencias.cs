using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.VR_Paso_DatosReferencias")]
    [ExplicitColumns]
    // No primary key detected
    public class VR_Paso_DatosReferencias
    {
              
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Referencia")]
        public int? Referencia { get; set; }
      
        
        [Column("CreditosDistribuidoresReferenciaID")]
        public int? CreditosDistribuidoresReferenciaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }
      
        
        [Column("referenciaTipoId")]
        public int? referenciaTipoId { get; set; }
      
        
        [Column("AniosDom")]
        public int? AniosDom { get; set; }
      
        
        [Column("Tel")]
        public string Tel { get; set; }
      
        
        [Column("Cel")]
        public string Cel { get; set; }
      
        
        [Column("Domicilio")]
        public string Domicilio { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public Int64? UsuarioIDRegistro { get; set; }
      
        
        [Column("Parentesco")]
        public string Parentesco { get; set; }
      
        
        [Column("Edad")]
        public int? Edad { get; set; }


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
