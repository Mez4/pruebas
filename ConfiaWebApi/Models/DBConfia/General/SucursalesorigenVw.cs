using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.SucursalesOrigen_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SucursalesOrigen_VW
    {
              
        
        [Column("id_empresa")]
        public int id_empresa { get; set; }
      
        
        [Column("id_sucursal")]
        public int id_sucursal { get; set; }
      
        
        [Column("id_origen")]
        public string id_origen { get; set; }
      
        
        [Column("sw_CV")]
        public bool? sw_CV { get; set; }
      
        
        [Column("sistema")]
        public string sistema { get; set; }
      
        
        [Column("sw_estatus")]
        public bool? sw_estatus { get; set; }
      
        
        [Column("SucursalOrigenID")]
        public Int64? SucursalOrigenID { get; set; }


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
