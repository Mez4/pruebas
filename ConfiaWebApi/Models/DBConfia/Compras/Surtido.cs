using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Surtido")]
    [ExplicitColumns]
    [PrimaryKey("SurtidoID")]
    public class Surtido
    {
              
        
        [Column("SurtidoID")]
        public int SurtidoID { get; set; }
      
        
        [Column("SolicitudID")]
        public int? SolicitudID { get; set; }
      
        
        [Column("AutorizaID")]
        public int? AutorizaID { get; set; }
      
        
        [Column("SurteID")]
        public int? SurteID { get; set; }
      
        
        [Column("CancelaID")]
        public int? CancelaID { get; set; }
      
        
        [Column("FechaAutorizado")]
        public DateTime? FechaAutorizado { get; set; }
      
        
        [Column("FechaSurtido")]
        public DateTime? FechaSurtido { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Cancelada")]
        public bool Cancelada { get; set; }
      
        
        [Column("ReOrden")]
        public bool ReOrden { get; set; }
      
        
        [Column("OrdenID")]
        public int? OrdenID { get; set; }
      
        
        [Column("ReOrdenID")]
        public int? ReOrdenID { get; set; }
      
        
        [Column("ComprobanteDoc")]
        public string ComprobanteDoc { get; set; }
      
        
        [Column("DocumentoID")]
        public int? DocumentoID { get; set; }
      
        
        [Column("ComprobanteFirma")]
        public string ComprobanteFirma { get; set; }
      
        
        [Column("FirmaDocID")]
        public int? FirmaDocID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Pendientes")]
        public bool Pendientes { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Compras.DocumentosUniformes>> PA__Compras___DocumentosUniformes___SurtidoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Compras.DocumentosUniformes>("WHERE SurtidoID = @SurtidoID", this).ToListAsync();
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
