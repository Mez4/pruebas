﻿using NPoco;
using System;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class SolicitudReestructuraSP
    {
        [Column("regresa")]

        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }


        [Column("Distribuidor")]
        public string Distribuidor { get; set; }


        [Column("Concepto")]
        public string Concepto { get; set; }


        [Column("Analista")]
        public string Analista { get; set; }


        [Column("Estatus")]
        public string Estatus { get; set; }


        [Column("Clave")]
        public string Clave { get; set; }


        [Column("Tipo")]
        public string Tipo { get; set; }


        [Column("Sucursal")]
        public string Sucursal { get; set; }


        [Column("SolicitudReestructuraID")]
        public Int64 SolicitudReestructuraID { get; set; }


        [Column("ProductoID")]
        public int ProductoID { get; set; }


        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


        [Column("Plazos")]
        public int Plazos { get; set; }


        [Column("AltaUsuarioID")]
        public int AltaUsuarioID { get; set; }


        [Column("AltaPersonaID")]
        public Int64 AltaPersonaID { get; set; }


        [Column("Fecha")]
        public DateTime Fecha { get; set; }


        [Column("ConceptoReestructuraID")]
        public int ConceptoReestructuraID { get; set; }


        [Column("SolicitudFilePath")]
        public string SolicitudFilePath { get; set; }


        [Column("MachoteFilePath")]
        public string MachoteFilePath { get; set; }


        [Column("AnalistaUsuarioID")]
        public int? AnalistaUsuarioID { get; set; }


        [Column("AnalistaPersonaID")]
        public Int64? AnalistaPersonaID { get; set; }


        [Column("EstatusReestructuraID")]
        public int EstatusReestructuraID { get; set; }


        [Column("TipoReestructuraID")]
        public int TipoReestructuraID { get; set; }


        [Column("SaldoAReestructurar")]
        public decimal SaldoAReestructurar { get; set; }


        [Column("IneFrente")]
        public string IneFrente { get; set; }


        [Column("IneReverso")]
        public string IneReverso { get; set; }


        [Column("SucursalID")]
        public int? SucursalID { get; set; }
    }
}
