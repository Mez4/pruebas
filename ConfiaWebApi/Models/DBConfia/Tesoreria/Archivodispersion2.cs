using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArchivoDispersion2")]
    [ExplicitColumns]
    [PrimaryKey("ArchivoDispersionID")]
    public class ArchivoDispersion2
    {
              
        
        [Column("ArchivoDispersionID")]
        public int ArchivoDispersionID { get; set; }
      
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("EstatusArchivoID")]
        public int EstatusArchivoID { get; set; }
      
        
        [Column("TipoDesembolso")]
        public int TipoDesembolso { get; set; }
      
        
        [Column("Impresa")]
        public int Impresa { get; set; }
      
        
        [Column("UsuarioRealiza")]
        public int UsuarioRealiza { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS40D35DB6(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioRealiza = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

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
