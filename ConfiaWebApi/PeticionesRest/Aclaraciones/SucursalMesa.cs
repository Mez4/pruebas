using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.SucursalMesa
{
    public class BusquedaSucursal
    {
        public string Nombre { get; set; }
    }
    public class obtenerSucursal
    {
        public int SucursalID { get; set; }
    }
    public class ObtenerSucursalMesa
    {
        public int MesaSucursalID { get; set; }
    }
    public class SucursalesAsignadas
    {
        public bool ELiminado { get; set; }
        public bool Existe { get; set; }
        public bool Nueva { get; set; }
        public int MesaAclaracionID { get; set; }
        public int SucursalID { get; set; }
    }
    public class ActualizarSucursalMesa
    {
        public int MesaSucursalID { get; set; }
        public int MesaAclaracionID { get; set; }
        public int SucursalID { get; set; }
        public bool Activa { get; set;}
        public List<SucursalesAsignadas> SucursalesAsignadas { get; set; }
    }
    public class AltaSucursalMesa
    {
        public int MesaSucursalID { get; set; }
        public int MesaAclaracionID { get; set; }
        public int SucursalID { get; set; }
        public bool Activa { get; set;}
        public List<SucursalesAsignadas> SucursalesAsignadas { get; set; }
    }
}