using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CatalogoBancos")]
    [ExplicitColumns]
    [PrimaryKey("BancoID")]
    public class CatalogoBancos
    {
              
        
        [Column("BancoID")]
        public int BancoID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("ArchivoDispersionID")]
        public int ArchivoDispersionID { get; set; }
      
        
        [Column("Logo")]
        public byte[] Logo { get; set; }
      
        
        [Column("TipoBancoId")]
        public int TipoBancoId { get; set; }
      
        
        [Column("Desembolso")]
        public bool? Desembolso { get; set; }
      
        
        [Column("Cobranza")]
        public bool? Cobranza { get; set; }
      
        
        [Column("BancoStpID")]
        public int? BancoStpID { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.PersonasDatosBancarios>> PA__General___PersonasDatosBancarios___cveBancoRef(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDatosBancarios>("WHERE BancoID = @cveBancoRef", this).ToListAsync();
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
