using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.Experiencia")]
    [ExplicitColumns]
    [PrimaryKey("CreditosDistribuidoresExperienciaID")]
    public class Experiencia
    {
              
        
        [Column("CreditosDistribuidoresExperienciaID")]
        public int CreditosDistribuidoresExperienciaID { get; set; }
      
        
        [Column("Compania")]
        public string Compania { get; set; }
      
        
        [Column("Antiguedad")]
        public string Antiguedad { get; set; }
      
        
        [Column("LimiteCredito")]
        public decimal LimiteCredito { get; set; }
      
        
        [Column("CreditoDisponible")]
        public decimal CreditoDisponible { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("Validado")]
        public DateTime? Validado { get; set; }
      
        
        [Column("Nivel")]
        public string Nivel { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }
      
        
        [Column("PersonaIDValido")]
        public Int64 PersonaIDValido { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }
      
        
        [Column("UsuarioIDValido")]
        public int? UsuarioIDValido { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSF884F19A(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDValido = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSC23F0FDF(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDRegistro = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_VALIDO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaIDValido = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_REGISTRO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaIDRegistro = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> CH__DISTRIBUIDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
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
