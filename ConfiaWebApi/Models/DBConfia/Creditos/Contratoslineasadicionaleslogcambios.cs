using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ContratosLineasAdicionalesLogCambios")]
    [ExplicitColumns]
    [PrimaryKey("ContratoID,fhCambio,LineaAdicionalTipoID", AutoIncrement=false)]
    public class ContratosLineasAdicionalesLogCambios
    {
              
        
        [Column("fhCambio")]
        public DateTime fhCambio { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("LineaAdicionalTipoID")]
        public int LineaAdicionalTipoID { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal? LineaCredito { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }
      
        
        [Column("dbuser")]
        public string dbuser { get; set; }
      
        
        [Column("sesionId")]
        public Int64? sesionId { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("PersonaIDCambio")]
        public Int64? PersonaIDCambio { get; set; }
      
        
        [Column("UsuarioIDCambio")]
        public int? UsuarioIDCambio { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int? UsuarioIDRegistro { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_CAMBIO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaIDCambio = @PersonaID", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.Catalogos.LineasAdicionalesTipos>> CH__LINEA_ADICIONAL_TIPO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.LineasAdicionalesTipos>("WHERE LineaAdicionalTipoID = @Id", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS71D99FDE(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDCambio = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS0DB2B52C(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionales>> CH__CONTRATO_LINEA_ADICIONAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionales>("WHERE ContratoID = @ContratoID AND LineaAdicionalTipoID = @LineaAdicionalTipoID", this).ToListAsync();
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
