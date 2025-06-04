using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Aplicaciones")]
    [ExplicitColumns]
    [PrimaryKey("AplicacionID")]
    public class Aplicaciones
    {
              
        
        [Column("AplicacionID")]
        public Int64 AplicacionID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("FechaAplicacion")]
        public DateTime FechaAplicacion { get; set; }
      
        
        [Column("MovimientoIdPago")]
        public Int64 MovimientoIdPago { get; set; }
      
        
        [Column("MovimientoIdComision")]
        public Int64? MovimientoIdComision { get; set; }
      
        
        [Column("MovimientoIdDNI")]
        public Int64? MovimientoIdDNI { get; set; }
      
        
        [Column("ConvenioID")]
        public int? ConvenioID { get; set; }
      
        
        [Column("FechaHoraUltimoPagoAnt")]
        public DateTime? FechaHoraUltimoPagoAnt { get; set; }
      
        
        [Column("CuentaID")]
        public int? CuentaID { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioCanceloID")]
        public int? UsuarioCanceloID { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("MotivoCancelacion")]
        public string MotivoCancelacion { get; set; }
      
        
        [Column("Pago")]
        public decimal? Pago { get; set; }
      
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("MovimientoIdCancelacion")]
        public Int64? MovimientoIdCancelacion { get; set; }
      
        
        [Column("GestorCobranzaID")]
        public Int64? GestorCobranzaID { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int? MesaCobranzaID { get; set; }
      
        
        [Column("MovimientoIdPPI")]
        public Int64? MovimientoIdPPI { get; set; }
      
        
        [Column("CreditoPPIId")]
        public Int64? CreditoPPIId { get; set; }
      
        
        [Column("MovimientoIdPPIDSM")]
        public Int64? MovimientoIdPPIDSM { get; set; }
      
        
        [Column("PagoAtrasado")]
        public bool? PagoAtrasado { get; set; }
      
        
        [Column("PagoAnticipado")]
        public bool? PagoAnticipado { get; set; }
      
        
        [Column("AbonoCliente")]
        public bool? AbonoCliente { get; set; }
      
        
        [Column("PagoOrigen")]
        public int? PagoOrigen { get; set; }
      
        
        [Column("PagoMigrado")]
        public bool? PagoMigrado { get; set; }
      
        
        [Column("IDSysFechaPago")]
        public string IDSysFechaPago { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS6C6F930A(DBConfiaContext parContext)
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

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.Abonos>> PA__Creditos___Abonos___AplicacionID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Abonos>("WHERE AplicacionID = @AplicacionID", this).ToListAsync();
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
