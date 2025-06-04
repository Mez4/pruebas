using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Reporte221_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Reporte221_VW
    {
              
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }

       [Column("UsuarioID")]
        public Int64? UsuarioID { get; set; }
        
        
        [Column("Sucursal_Nombre")]
        public string Sucursal_Nombre { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("Nombre_Zona")]
        public string Nombre_Zona { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("Socia")]
        public string Socia { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64? CoordinadorID { get; set; }
      
        
        [Column("Coordinador")]
        public string Coordinador { get; set; }
      
        
        [Column("Tipo_Nota")]
        public string Tipo_Nota { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Registro_Nota")]
        public string Registro_Nota { get; set; }
      
        
        [Column("Fecha_Registro")]
        public string Fecha_Registro { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }


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
