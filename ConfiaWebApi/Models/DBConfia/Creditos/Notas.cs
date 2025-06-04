using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Notas")]
    [ExplicitColumns]
    [PrimaryKey("CreditoNotaId")]
    public class Notas
    {
              
        
        [Column("CreditoNotaId")]
        public Int64 CreditoNotaId { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("FHRegistro")]
        public DateTime? FHRegistro { get; set; }
      
        
        [Column("Nota")]
        public string Nota { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS00942A02(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> CH__CREDITO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", this).ToListAsync();
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
