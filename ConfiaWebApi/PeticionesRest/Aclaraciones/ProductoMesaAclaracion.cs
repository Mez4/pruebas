using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.ProductoMesaAclaracion
{
    public class AltaProducto
    {
        [Required]
        public int ProductoID { get; set; }
        [Required]
        public string Producto { get; set; }
    }
    public class ObtenerProdMesaAclaracion
    {   
        [Required]
        public int ProductoMesaAclaracionID {get; set;}
        [Required]
        public int MesaAclaracionID {get; set;}
        [Required]
        public int ProductoID {get; set;}
        [Required]
        public bool Activo { get; set; }
    }
    public class ActualizarProdMesaAclaracion
    {
        [Required]
        public int ProductoMesaAclaracionID {get; set;}
        [Required]
        public int MesaAclaracionID {get; set;}
        [Required]
        public int ProductoID {get; set;}
        [Required]
        public bool Activo {get; set;}
    }
    public class AltaProdMesaAclaracion
    {
        [Required]
        public int MesaAclaracionID {get; set;}
        [Required]
        public int ProductoID {get; set;}
    
        [Required]
        public bool Activo {get; set;}
    }
}