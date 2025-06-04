using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.Modulos")]
    [ExplicitColumns]
    [PrimaryKey("ModuloID")]
    public class Modulos
    {
              
        
        [Column("ModuloID")]
        public int ModuloID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Etiqueta")]
        public string Etiqueta { get; set; }
      
        
        [Column("ColorFondo")]
        public string ColorFondo { get; set; }
      
        
        [Column("ColorBorde")]
        public string ColorBorde { get; set; }
      
        
        [Column("ColorFuente")]
        public string ColorFuente { get; set; }
      
        
        [Column("Icono")]
        public string Icono { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("RequiereProducto")]
        public bool RequiereProducto { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Sistema.Pantallas>> PA__Sistema___Pantallas___ModuloID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Sistema.Pantallas>("WHERE ModuloID = @ModuloID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
