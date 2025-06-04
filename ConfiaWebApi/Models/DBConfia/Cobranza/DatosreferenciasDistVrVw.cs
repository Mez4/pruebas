using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.DatosReferencias_Dist_VR_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DatosReferencias_Dist_VR_VW
    {
              
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Referencia")]
        public int? Referencia { get; set; }
      
        
        [Column("CorresponsalID")]
        public int? CorresponsalID { get; set; }
      
        
        [Column("Corresponsal")]
        public string Corresponsal { get; set; }
      
        
        [Column("estatus")]
        public bool? estatus { get; set; }
      
        
        [Column("ReferenciaPago")]
        public string ReferenciaPago { get; set; }
      
        
        [Column("Comision")]
        public decimal? Comision { get; set; }
      
        
        [Column("Mecanica")]
        public string Mecanica { get; set; }


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
