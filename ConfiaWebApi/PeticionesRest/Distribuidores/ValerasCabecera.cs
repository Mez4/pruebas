using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.ValerasCabecera
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }
    public class GetFolioInicial
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int serieId { get; set; }
    }

    public class Add
    {
        [Required]
        public int ProductoID { get; set; }
        [Required]
        public int serieId { get; set; }
        [Required]
        public int FolioInicial { get; set; }
        [Required]
        public int FolioFinal { get; set; }
        [Required]
        public string Estatus { get; set; }
        [Required]
        public DateTime RegistroFecha { get; set; }
        //[Required]
        //public int RegistroUsuarioId { get; set; }
        [Required]
        public int ValerasFraccionID { get; set; }
        public int UsuarioId { get; set; }

    }

    public class Accion
    {
        [Required]
        public int ValeraCabeceraID { get; set; }
        [Required]
        public int Evento { get; set; }
    }

    public class DownLoadFileM
    {
        [Required]
        public int ValeraCabeceraID { get; set; }
    }
}
