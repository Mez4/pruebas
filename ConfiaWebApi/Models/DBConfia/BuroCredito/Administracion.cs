using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.Administracion")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Administracion
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("clave")]
        public string clave { get; set; }
      
        
        [Column("version")]
        public int version { get; set; }
      
        
        [Column("numeroReferenciaOperador")]
        public string numeroReferenciaOperador { get; set; }
      
        
        [Column("productoRequerido")]
        public string productoRequerido { get; set; }
      
        
        [Column("clavePais")]
        public string clavePais { get; set; }
      
        
        [Column("identificadorBuro")]
        public string identificadorBuro { get; set; }
      
        
        [Column("claveUsuario")]
        public string claveUsuario { get; set; }
      
        
        [Column("password")]
        public string password { get; set; }
      
        
        [Column("tipoConsulta")]
        public string tipoConsulta { get; set; }
      
        
        [Column("tipoContrato")]
        public string tipoContrato { get; set; }
      
        
        [Column("claveUnidadMonetaria")]
        public string claveUnidadMonetaria { get; set; }
      
        
        [Column("idioma")]
        public string idioma { get; set; }
      
        
        [Column("tipoSalida")]
        public string tipoSalida { get; set; }


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
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
