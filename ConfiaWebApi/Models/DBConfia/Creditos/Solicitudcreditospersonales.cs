using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.SolicitudCreditosPersonales")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudCreditosPersonalesID")]
    public class SolicitudCreditosPersonales
    {
              
        
        [Column("SolicitudCreditosPersonalesID")]
        public int SolicitudCreditosPersonalesID { get; set; }
      
        
        [Column("ProductoId")]
        public int ProductoId { get; set; }
      
        
        [Column("SucursalId")]
        public int SucursalId { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("DistribuidorId")]
        public Int64 DistribuidorId { get; set; }
      
        
        [Column("CreditoId")]
        public int? CreditoId { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int TipoDesembolsoID { get; set; }
      
        
        [Column("Estatus")]
        public bool? Estatus { get; set; }
      
        
        [Column("UsuarioSolicitaID")]
        public int UsuarioSolicitaID { get; set; }
      
        
        [Column("PersonaSolicitaID")]
        public Int64 PersonaSolicitaID { get; set; }
      
        
        [Column("FechaSolicita")]
        public DateTime FechaSolicita { get; set; }
      
        
        [Column("UsuarioEstatusID")]
        public int? UsuarioEstatusID { get; set; }
      
        
        [Column("PersonaEstatusID")]
        public Int64? PersonaEstatusID { get; set; }
      
        
        [Column("FechaEstatus")]
        public DateTime? FechaEstatus { get; set; }
      
        
        [Column("personaDatosBancariosID")]
        public Int64? personaDatosBancariosID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.PersonasDatosBancarios>> CH__SolicitudCreditosPersonales_PersonaDatosBancarios(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDatosBancarios>("WHERE personaDatosBancariosID = @personasDatosBancariosID", this).ToListAsync();
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
