using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Reporte191_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Reporte191_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Sucursal_Nombre")]
        public string Sucursal_Nombre { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("Nombre_Zona")]
        public string Nombre_Zona { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("Socia")]
        public string Socia { get; set; }
      
        
        [Column("Edad")]
        public int? Edad { get; set; }
      
        
        [Column("Fecha_Nacimiento")]
        public string Fecha_Nacimiento { get; set; }
      
        
        [Column("Mes_NacimientoID")]
        public int? Mes_NacimientoID { get; set; }
      
        
        [Column("Mes_Nacimiento")]
        public string Mes_Nacimiento { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64? CoordinadorID { get; set; }
      
        
        [Column("Coordinador")]
        public string Coordinador { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }


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
