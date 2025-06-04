using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.RelacionMesaProducto_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionMesaProducto_VW
    {
              
        
        [Column("idRelMesaCredProd")]
        public int idRelMesaCredProd { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("DirectorMesaCobranzaID")]
        public Int64 DirectorMesaCobranzaID { get; set; }
      
        
        [Column("NombreDirector")]
        public string NombreDirector { get; set; }
      
        
        [Column("idTabMora")]
        public int idTabMora { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }
      
        
        [Column("MesaCobranzaDesc")]
        public string MesaCobranzaDesc { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("limInferiorDias")]
        public int limInferiorDias { get; set; }
      
        
        [Column("limSuperiorDias")]
        public int limSuperiorDias { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("verifDom")]
        public bool verifDom { get; set; }
      
        
        [Column("Monitoreo")]
        public bool Monitoreo { get; set; }
      
        
        [Column("Cobranza")]
        public bool Cobranza { get; set; }
      
        
        [Column("Legal")]
        public bool Legal { get; set; }
      
        
        [Column("Coordinador")]
        public bool Coordinador { get; set; }


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
