using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.SucursalesSinMesas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SucursalesSinMesas_VW
    {
              
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("distribuidorIdMin")]
        public Int64 distribuidorIdMin { get; set; }
      
        
        [Column("distribuidorIdMax")]
        public Int64 distribuidorIdMax { get; set; }
      
        
        [Column("importeLimiteCreditoDefault")]
        public decimal importeLimiteCreditoDefault { get; set; }
      
        
        [Column("tabuladorTipoID")]
        public int tabuladorTipoID { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("SucursalFisicaID")]
        public int SucursalFisicaID { get; set; }
      
        
        [Column("DiasDeEntregaAprox")]
        public int? DiasDeEntregaAprox { get; set; }
      
        
        [Column("PersonaResponsableID")]
        public int? PersonaResponsableID { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime? CreacionFecha { get; set; }
      
        
        [Column("PermisoRangoFechas")]
        public bool? PermisoRangoFechas { get; set; }
      
        
        [Column("ConvenioID")]
        public int? ConvenioID { get; set; }
      
        
        [Column("id_sucursal")]
        public int? id_sucursal { get; set; }
      
        
        [Column("id_origen")]
        public string id_origen { get; set; }
      
        
        [Column("id_empresa")]
        public int? id_empresa { get; set; }
      
        
        [Column("sistema")]
        public string sistema { get; set; }
      
        
        [Column("CostoPagoCanalesdePago ")]
        public decimal? CostoPagoCanalesdePago  { get; set; }
      
        
        [Column("IDEXterno")]
        public Int64? IDEXterno { get; set; }
      
        
        [Column("Eslogan")]
        public string Eslogan { get; set; }


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
