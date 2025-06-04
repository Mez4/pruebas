using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.catalogoImagen")]
    [ExplicitColumns]
    [PrimaryKey("IdCatalogoImagen")]
    public class catalogoImagen
    {
              
        
        [Column("IdCatalogoImagen")]
        public int IdCatalogoImagen { get; set; }
      
        
        [Column("NombreImagen")]
        public string NombreImagen { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("ValeraID")]
        public int? ValeraID { get; set; }


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
