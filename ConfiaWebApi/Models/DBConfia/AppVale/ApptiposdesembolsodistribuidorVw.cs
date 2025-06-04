using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppTiposDesembolsoDistribuidor_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppTiposDesembolsoDistribuidor_VW
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalId")]
        public int SucursalId { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int TipoDesembolsoID { get; set; }
      
        
        [Column("TipoDesembolso")]
        public string TipoDesembolso { get; set; }
      
        
        [Column("RequiereDatosBancarios")]
        public bool? RequiereDatosBancarios { get; set; }
      
        
        [Column("EsEnApp")]
        public bool? EsEnApp { get; set; }
      
        
        [Column("iconoDesembolsoTipo")]
        public string iconoDesembolsoTipo { get; set; }
      
        
        [Column("FormatoImpresionExtra")]
        public bool FormatoImpresionExtra { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("datoTipoID")]
        public int datoTipoID { get; set; }


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
