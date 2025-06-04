using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.DistribuidoresInfo")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresInfo
    {
              
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidoresEstatus")]
        public string DistribuidoresEstatus { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("DistEstColor")]
        public string DistEstColor { get; set; }
      
        
        [Column("DistribuidorNivelID2")]
        public int? DistribuidorNivelID2 { get; set; }
      
        
        [Column("DistribuidoresEstatusID2")]
        public string DistribuidoresEstatusID2 { get; set; }
      
        
        [Column("EmpresaId")]
        public int EmpresaId { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("GrupoID")]
        public int GrupoID { get; set; }
      
        
        [Column("Estatus")]
        public bool Estatus { get; set; }
      
        
        [Column("ClasificadorGrupoID")]
        public int ClasificadorGrupoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("Coordinador")]
        public string Coordinador { get; set; }


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
