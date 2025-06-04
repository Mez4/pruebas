using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.Valeras
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
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
        [Required]
        public string RegistroUsuarioId { get; set; }
    }

    public class Update
    {
        [Required]
        public int ValeraID { get; set; }
        public int ProductoID { get; set; }
        public int serieId { get; set; }
        public int FolioInicial { get; set; }
        public int FolioFinal { get; set; }
    }

    public class UpdateSucursalM
    {
        [Required]
        public int AsignaSucursalId { get; set; }

        [Required]
        public List<int> Valeras { get; set; }
    }

    public class UpdateEnvioM
    {
        [Required]
        public List<int> Valeras { get; set; }

        [Required]
        public string EnvioSucursalNota { get; set; }
        
        public int AsignaSucursalId { get; set; }
    }

    public class UpdateReciboM
    {
        [Required]
        public List<int> Valeras { get; set; }

        [Required]
        public string ReciboSucursalNota { get; set; }
        public int AsignaSucursalId { get; set; }
    }

    public class DownLoadFileM
    {
        [Required]
        public List<int> Valeras { get; set; }
    }

    public class UpdateSucursal
    {
        [Required]
        public int ValeraID { get; set; }
        [Required]
        public int AsignaSucursalId { get; set; }

        public string AsignaSucursalUsuarioId { get; set; }
        public long AsignaSucursalPersonaID { get; set; }
    }

    public class UpdateEnviadoSucursal
    {
        [Required]
        public int ValeraID { get; set; }
        //public string ReciboSucursalUsuarioId { get; set; }
        //public long ReciboSucursalPersonaID { get; set; }
    }

    public class UpdateReciboSucursal
    {
        [Required]
        public int ValeraID { get; set; }
        public string ReciboSucursalUsuarioId { get; set; }
        public long ReciboSucursalPersonaID { get; set; }

        public int regresa { get; set; }
        public string msj { get; set; }

        public int CreditoID { get; set; }
    }

    public class UpdateDistribuidor
    {
        [Required]
        public int ValeraID { get; set; }
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int DistribuidorID { get; set; }

        //public string AsignaDistribudiorUsuarioId { get; set; }
        //public long AsignaDistribudiorPersonaID { get; set; }
    }

    public class DownLoadFile
    {
        [Required]
        public int ValeraID { get; set; }
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int DistribuidorID { get; set; }
    }

    public class UploadFile
    {
        [Required]
        public int ValeraID { get; set; }
        [Required]

        public int IdCatalogoImagen { get; set; }
        public IFormFile doc { get; set; }

        //[Required]
        //public IFormFile doc2 { get; set; }
    }

    public class CancelValera
    {
        [Required]
        public int ValeraID { get; set; }
        //public int CanceladoUsuarioId { get; set; }
        //public long CanceladoUsuarioIdPersonaID { get; set; }
    }

    public class TipoUsuarioCajera
    {
        public int usuarioID { get; set; }
        public int tipoUsuario { get; set; }
    }
}
