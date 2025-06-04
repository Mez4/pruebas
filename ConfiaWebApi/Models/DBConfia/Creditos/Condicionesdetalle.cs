using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CondicionesDetalle")]
    [ExplicitColumns]
    // No primary key detected
    public class CondicionesDetalle
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("CondicionesID")]
        public int CondicionesID { get; set; }
      
        
        [Column("RenglonId")]
        public int RenglonId { get; set; }
      
        
        [Column("DistribuidorNivelId")]
        public int DistribuidorNivelId { get; set; }
      
        
        [Column("DistribuidorNivelIdOri")]
        public int DistribuidorNivelIdOri { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("PlazosMinimos")]
        public int PlazosMinimos { get; set; }
      
        
        [Column("PlazosMaximos")]
        public int PlazosMaximos { get; set; }
      
        
        [Column("ImporteMinimo")]
        public decimal ImporteMinimo { get; set; }
      
        
        [Column("ImporteMaximo")]
        public decimal ImporteMaximo { get; set; }
      
        
        [Column("ImporteMaximo1erCanje")]
        public decimal ImporteMaximo1erCanje { get; set; }
      
        
        [Column("ImporteMaximo2doCanje")]
        public decimal ImporteMaximo2doCanje { get; set; }
      
        
        [Column("PorcTasaPlazo")]
        public decimal PorcTasaPlazo { get; set; }
      
        
        [Column("SeguroPlazo")]
        public decimal SeguroPlazo { get; set; }
      
        
        [Column("PorcIVA")]
        public decimal PorcIVA { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }
      
        
        [Column("PlazosFijos")]
        public int PlazosFijos { get; set; }
      
        
        [Column("PorcTasaMensual")]
        public decimal PorcTasaMensual { get; set; }
      
        
        [Column("PorcTasaAnual")]
        public decimal PorcTasaAnual { get; set; }
      
        
        [Column("PagoXMilMinimo")]
        public decimal PagoXMilMinimo { get; set; }
      
        
        [Column("PagoXMilMaximo")]
        public decimal PagoXMilMaximo { get; set; }
      
        
        [Column("PorcCreditosActivosMax")]
        public decimal PorcCreditosActivosMax { get; set; }
      
        
        [Column("PlazosEspeciales")]
        public bool PlazosEspeciales { get; set; }
      
        
        [Column("CapitalCorte")]
        public decimal? CapitalCorte { get; set; }
      
        
        [Column("UsuarioRegistro")]
        public int? UsuarioRegistro { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("UsuarioModifico")]
        public int? UsuarioModifico { get; set; }
      
        
        [Column("fhModificacion")]
        public DateTime? fhModificacion { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("ImporteMaximo3erCanje")]
        public decimal? ImporteMaximo3erCanje { get; set; }
      
        
        [Column("CostoAnualTotal")]
        public decimal? CostoAnualTotal { get; set; }
      
        
        [Column("ImporteMinimo1erCanje")]
        public decimal? ImporteMinimo1erCanje { get; set; }
      
        
        [Column("ImporteMinimo2doCanje")]
        public decimal? ImporteMinimo2doCanje { get; set; }
      
        
        [Column("ImporteMinimo3erCanje")]
        public decimal? ImporteMinimo3erCanje { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS8AB59D71(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioModifico = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSF6388494(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioRegistro = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Condiciones>> CH__CONDICIONES(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Condiciones>("WHERE CondicionesID = @CondicionesID AND ProductoID = @ProductoID", this).ToListAsync();
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
