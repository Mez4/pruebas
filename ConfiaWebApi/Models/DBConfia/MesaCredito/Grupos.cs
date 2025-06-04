using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Grupos")]
    [ExplicitColumns]
    [PrimaryKey("GrupoID")]
    public class Grupos
    {
              
        
        [Column("GrupoID")]
        public int GrupoID { get; set; }
      
        
        [Column("NombreGrupo")]
        public string NombreGrupo { get; set; }
      
        
        [Column("Ciclos")]
        public int Ciclos { get; set; }
      
        
        [Column("CoordinadorID")]
        public int CoordinadorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ContratoValidado")]
        public bool ContratoValidado { get; set; }
      
        
        [Column("FhContratoValidado")]
        public DateTime FhContratoValidado { get; set; }
      
        
        [Column("UsuarioIdContratoValidado")]
        public int UsuarioIdContratoValidado { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Personas>> PA__General___Personas___GrupoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE GrupoID = @GrupoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.SolicitudMesaCredito>> PA__MesaCredito___SolicitudMesaCredito___GrupoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.SolicitudMesaCredito>("WHERE GrupoID = @GrupoID", this).ToListAsync();
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
