using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.Aclaraciones")]
    [ExplicitColumns]
    [PrimaryKey("AclaracionID")]
    public class Aclaraciones
    {
              
        
        [Column("AclaracionID")]
        public int AclaracionID { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("DescripcionAclaracion")]
        public string DescripcionAclaracion { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("NotasTesoreria")]
        public string NotasTesoreria { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("DocumentoID")]
        public int? DocumentoID { get; set; }
      
        
        [Column("MesaAclaracionID")]
        public int? MesaAclaracionID { get; set; }
      
        
        [Column("BonificacionID")]
        public int? BonificacionID { get; set; }
      
        
        [Column("SolicitaID")]
        public int? SolicitaID { get; set; }
      
        
        [Column("FechaAsignacion")]
        public DateTime? FechaAsignacion { get; set; }
      
        
        [Column("AnalistaID")]
        public Int64? AnalistaID { get; set; }
      
        
        [Column("GerenteID")]
        public Int64? GerenteID { get; set; }
      
        
        [Column("Asiganada")]
        public bool? Asiganada { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("TipoSolicitudID")]
        public int? TipoSolicitudID { get; set; }
      
        
        [Column("FechaAperturaSolicitud")]
        public DateTime? FechaAperturaSolicitud { get; set; }
      
        
        [Column("FechaFinalizacionSolicitud")]
        public DateTime? FechaFinalizacionSolicitud { get; set; }
      
        
        [Column("FechaInicioAsignacion")]
        public DateTime? FechaInicioAsignacion { get; set; }
      
        
        [Column("TiempoTotalSolicitud")]
        public int? TiempoTotalSolicitud { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Aclaraciones.TipoSolicitud>> CH__Aclaracio(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.TipoSolicitud>("WHERE TipoSolicitudID = @TipoSolicitudID", this).ToListAsync();
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
