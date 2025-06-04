using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValeraDetalle")]
    [ExplicitColumns]
    [PrimaryKey("Folio,ValeraID", AutoIncrement=false)]
    public class ValeraDetalle
    {
              
        
        [Column("ValeraID")]
        public Int64 ValeraID { get; set; }
      
        
        [Column("Folio")]
        public Int64 Folio { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("DigitalFolio")]
        public string DigitalFolio { get; set; }
      
        
        [Column("DigitalImporte")]
        public decimal DigitalImporte { get; set; }
      
        
        [Column("DigitalPlazo")]
        public int DigitalPlazo { get; set; }
      
        
        [Column("DigitalTipoDesembolsoId")]
        public int? DigitalTipoDesembolsoId { get; set; }
      
        
        [Column("AdicProductoId")]
        public int? AdicProductoId { get; set; }
      
        
        [Column("AdicImporte")]
        public decimal AdicImporte { get; set; }
      
        
        [Column("CanjeFecha")]
        public DateTime? CanjeFecha { get; set; }
      
        
        [Column("CanceladoFecha")]
        public DateTime? CanceladoFecha { get; set; }
      
        
        [Column("CanjePersonaID")]
        public Int64? CanjePersonaID { get; set; }
      
        
        [Column("CanceladoPersonaID")]
        public Int64? CanceladoPersonaID { get; set; }
      
        
        [Column("CanceladoUsuarioId")]
        public int? CanceladoUsuarioId { get; set; }
      
        
        [Column("CanjeUsuarioId")]
        public int? CanjeUsuarioId { get; set; }
      
        
        [Column("ValeDigital")]
        public bool ValeDigital { get; set; }
      
        
        [Column("DiasCaducidad")]
        public decimal? DiasCaducidad { get; set; }
      
        
        [Column("FechaExpedicion")]
        public DateTime? FechaExpedicion { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_CANCELADO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE CanceladoPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_CANJE(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE CanjePersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS092B8520(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE CanceladoUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS3D13A9D8(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE CanjeUsuarioId = @UsuarioID", this).ToListAsync();
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
