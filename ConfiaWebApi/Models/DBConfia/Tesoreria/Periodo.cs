using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.Periodo")]
    [ExplicitColumns]
    [PrimaryKey("PeriodoID")]
    public class Periodo
    {
              
        
        [Column("PeriodoID")]
        public int PeriodoID { get; set; }
      
        
        [Column("NumeroPeriodo")]
        public int NumeroPeriodo { get; set; }
      
        
        [Column("FechaApertura")]
        public DateTime FechaApertura { get; set; }
      
        
        [Column("FechaCierre")]
        public DateTime? FechaCierre { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("Ejercicio")]
        public string Ejercicio { get; set; }
      
        
        [Column("AgrupacionID")]
        public int AgrupacionID { get; set; }
      
        
        [Column("UsuarioIDApertura")]
        public int UsuarioIDApertura { get; set; }
      
        
        [Column("UsuarioIDCierre")]
        public int? UsuarioIDCierre { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS948A6C16(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDCierre = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS3C6EA1D9(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDApertura = @UsuarioID", this).ToListAsync();
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
