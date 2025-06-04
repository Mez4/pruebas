import React from "react";
import { MostrarMenu } from "../../../../global/functions";
import { IOidc } from "../../../../interfaces/oidc/IOidc";
import { IMenu } from "../../../../interfaces/ui/IMenu";
import { iUI } from "../../../../interfaces/ui/iUI";

type HeaderType = {
  oidc: IOidc;
  ui: iUI;
  pathname: string;
};

export const Header = (props: HeaderType) => {
  return (
    <MostrarMenu
      Sidebar={props.ui.Sidebar}
      oidc={props.oidc}
      Path={props.pathname}
      Menus={[
        {
          label: <span>MESA DE ACLARACIONES</span>,
          Funcion: (par) => alert(par.Det),
          Parametros: { Det: "DO" },
          Href: "",
        },
      ]}
    />
  );
};

export const MesaDeAclaraciones_menu: IMenu[] = [
  {
    label: "MESA DE ACLARACIONES",
    items: [
      {
        label: "CATÁLOGOS",
        icon: "pi pi-table",
        items: [
          {
            label: "TIPOS DE SOLICITUDES",
            icon: "fa fa-file",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoTipoSolicitud",
          },
          {
            label: "ESTATUS",
            icon: "fa fa-check-circle",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoEstatus",
          },
          {
            label: "BONIFICACIONES",
            icon: "fa fa-dollar-sign",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoBonificacion",
          },
          {
            label: "TIPOS DE MOVIMIENTOS",
            icon: "fa fa-tasks",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoTipoMovimiento",
          },
          {
            label: "TURNOS",
            icon: "pi pi-info-circle",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoTurno",
          },
        ],
      },
      {
        label: "ANALISTAS",
        icon: "pi pi-users",
        items: [
          {
            label: "ANALISTAS",
            icon: "fa fa-user-tie",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoAnalistas",
          },
          {
            label: "ANALISTAS / SUCURSAL",
            icon: "fa fa-house-user",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoAnalistaSucursal",
          },
          {
            label: "ENCARGADOS",
            icon: "fa fa-users",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoEncargados",
          },
        ],
      },
      {
        label: "ACLARACIONES",
        icon: "fa fa-question-circle",
        items: [
          {
            label: "ACLARACIONES",
            icon: "fa fa-tasks",
            to: "/app/:productoId/mesadeaclaraciones/CatalogoAclaracion",
          },
          {
            label: "BITACORA",
            icon: "fa fa-file",
            to: "/app/:productoId/mesadeaclaraciones/Bitacora",
          },
        ],
      },
      {
        label: "PAGOS",
        icon: "fa fa-file-invoice",
        items: [
          {
            label: "T.Códigos autorización",
            icon: "fa fa-qrcode",
            to: "/app/:productoId/mesadeaclaraciones/Pago/AutorizacionesTipos",
          },
          {
            label: "Códigos autorización",
            icon: "fa fa-check-circle",
            to: "/app/:productoId/mesadeaclaraciones/Pago/CodigosAutorizacion",
          },
        ],
      },
    ],
  },
];
