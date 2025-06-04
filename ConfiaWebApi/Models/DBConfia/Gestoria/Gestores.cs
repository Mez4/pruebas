using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Gestoria
{
    [TableName("Gestoria.Gestores")]
    [ExplicitColumns]
    [PrimaryKey("GestorID", AutoIncrement=false)]
    public class Gestores
    {
              
        
        [Column("GestorID")]
        public Int64 GestorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("CarteraVencida")]
        public bool CarteraVencida { get; set; }
      
        
        [Column("ImprimirRelacionesMasivas")]
        public bool ImprimirRelacionesMasivas { get; set; }
      
        
        [Column("EstadoGestorId")]
        public string EstadoGestorId { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("CreacionPersonaId")]
        public Int64? CreacionPersonaId { get; set; }
      
        
        [Column("ModificacionFecha")]
        public DateTime? ModificacionFecha { get; set; }
      
        
        [Column("ModificacionPersonaId")]
        public Int64? ModificacionPersonaId { get; set; }
      
        
        [Column("CreacionUsuarioId")]
        public int? CreacionUsuarioId { get; set; }
      
        
        [Column("ModificacionUsuarioId")]
        public int? ModificacionUsuarioId { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS5C38C37F(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE ModificacionUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS279E685D(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE CreacionUsuarioId = @UsuarioID", this).ToListAsync();
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
