using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.GpoDistribuidorCoordinador")]
    [ExplicitColumns]
    // View, no primary key needed
    public class GpoDistribuidorCoordinador
    {
              
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("ClasificadorGrupoID")]
        public int ClasificadorGrupoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


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
