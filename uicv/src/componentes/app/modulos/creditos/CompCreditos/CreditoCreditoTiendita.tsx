import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CreditoCreditoTiendita/Funciones";
import * as FnVales from "./CreditoVale/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import * as FnProductos from "./CreditoProducto/Funciones";
import * as FnBancos from "../../tesoreria/CompTesoreria/BancoTipoDesembolso/Funciones";
import * as FnPersona from "../../general/CompGeneral/Empleado/Funciones";
import * as FnSucursal from "../../general/CompGeneral/Sucursal/Funciones";
// Icons
import {
  FaSearch,
  FaListAlt,
  FaFileDownload,
  FaShoppingCart,
} from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { BuscarCreditos } from "./CreditoCreditoTiendita/BuscarCredito";
import { FiltrarDatos, addOneDay } from "../../../../../global/functions";
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import { DBConfia_Creditos } from "../../../../../interfaces_db/DBConfia/Creditos";
import { CreditoVale } from "./";

import ReactTooltip from "react-tooltip";
import moment from "moment";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { SeleccionarCajaSucursal } from "../../../../selectores";
import CreditoDistribuidor from "./CreditoDistribuidor";
import CreditoEmpleados from "./CreditoEmpleados";
import { DBConfia_General } from "../../../../../interfaces_db/DBConfia/General";
import CreditoVale2 from "./CreditoVale2";
import CreditoDistribuidor2 from "./CreditoDistribuidor2";
import CreditoEmpleados2 from "./CreditoEmpleados2";
import FolioConfirmacion from "./FolioConfirmacion/FolioConfirmacion";
import { CtxCreditoTiendita } from "./CreditoTienditaSocia/CreditoTienditaContext";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
};

type EstadoTipo = {
  Producto: {
    ProductoID: number;
    EmpresaId: number;
    Producto: string;
    Activo: boolean;
    TasaTipoId: string;
    RequiereDistribuidor: boolean;
    RequiereGrupo: boolean;
    ValidaDisponible: boolean;
    Restructura: boolean;
    GeneraDesembolso: boolean;
    SeguroFinanciado: boolean;
    Canje: boolean;
    DesglosarIVA: boolean;
    EdadMinima: number;
    EdadMaxima: number;
    CapitalAlFinal: boolean;
    CargoFinanciado: boolean;
    CargoAlInicio: boolean;
    ActivaCredito: boolean;
    CreditosLiquidadosReq: boolean;
    PermisoEspecial: boolean;
    ValidarCondiciones: boolean;
    FhRegitro: string;
    FhMoficiacion: string;
    AplicaIVAInteres: boolean;
    AplicaIVASeguro: boolean;
    AplicaIVAManejoCuenta: boolean;
    Logo: string;
  };
  Datos: DBConfia_Creditos.ICreditos_VW[];
  DatosMostrar: DBConfia_Creditos.ICreditos_VW[];
  DatosMotivo: DBConfia_Creditos.ICreditos_VW[];
  DatosDetalle: DBConfia_Creditos.IPlanPagos[];
  DatosDetalleTiendita: DBConfia_Creditos.ICreditoTiendita[];
  Filtro: string;
  Cargando: boolean;
  Error: boolean;
  Validado: boolean;
  Form: {
    Mostrar: boolean;
    Motivo: boolean;
    Datos?: {
      CreditoID: number;
      ProductoId: number;
      DistribuidorId: number;
      ClienteId: number;
      SucursalId: number;
      CajaID: number;
      Folio: number;
      SerieId: number;
      Capital: number;
      Plazos: number;
      Cuenta: string;
      TipoDesembolsoID: number;
      EmpleadoId: number;
      interes: number;
      manejo: number;
      iva: number;
      Motivo: string;
      InteresVG: string;
      ManejoVG: string;
      IvaVG: string;
      datoBancario: string;
      personasDatosBancariosID: number;
      RequiereDatosBancarios: boolean;
      PrestamoPersonal: boolean;
      Principal: boolean;
      EsNomina: boolean;
      FechaExpedicion: Date;
      MvCancelacion: string;
      TipoCancelacionID: number;
      NombreBeneficiario: string;
      ApellidoPaternoBeneficiario: string;
      ApellidoMaternoBeneficiario: string;
      ParentescoBeneficiario: string;
      FechaNacimientoBeneficiario: Date | null;
    }; //DBConfia_Creditos.ICreditos
    Id?: number;
  };
  Detalle: boolean;
  DetalleTiendita: boolean;
  DistribuidorID: number;
  Distribuidor: string;
  ClienteID: number;
  Cliente: string;
  CreditoID: number;
  ShowCaja: boolean;
  CajaDefault: {
    ProductoID: number;
    SucursalID: number;
    CajaID: number;
  };
  Desembolso: {
    Desembolsar: boolean;
    CreditoID: number;
    TipoDesembolsoID: number;
  };
  optSucursales: any[];
  Sucursal?: DBConfia_General.ISucursales;
  FechaInicio: Date;
  FechaFin: Date;
  tipoUsuario: number;
};

const CreditoCreditoTiendita = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

  const MySwal = withReactContent(Swal);

  const [ArticulosCarrito, setArticulosCarrito] = useState([]);
  const [showFolio, setShowFolio] = useState(false);
  const [creditoSeleccionado, setCreditoSeleccionado] =
    useState<DBConfia_Creditos.ICreditos_VW>();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [state, setState] = React.useState<EstadoTipo>({
    Producto: {
      ProductoID: 0,
      EmpresaId: 0,
      Producto: "",
      Activo: false,
      TasaTipoId: "",
      RequiereDistribuidor: false,
      RequiereGrupo: false,
      ValidaDisponible: false,
      Restructura: false,
      GeneraDesembolso: false,
      SeguroFinanciado: false,
      Canje: false,
      DesglosarIVA: false,
      EdadMinima: 0,
      EdadMaxima: 0,
      CapitalAlFinal: false,
      CargoFinanciado: false,
      CargoAlInicio: false,
      ActivaCredito: false,
      CreditosLiquidadosReq: false,
      PermisoEspecial: false,
      ValidarCondiciones: false,
      FhRegitro: "",
      FhMoficiacion: "",
      AplicaIVAInteres: false,
      AplicaIVASeguro: false,
      AplicaIVAManejoCuenta: false,
      Logo: "",
    },
    Datos: [],
    DatosMostrar: [],
    DatosMotivo: [],
    DatosDetalle: [],
    DatosDetalleTiendita: [],
    Filtro: "",
    Cargando: false,
    Error: false,
    Validado: false,
    Form: {
      Mostrar: false,
      Motivo: false,
      Datos: {
        CreditoID: 0,
        ProductoId: 0,
        DistribuidorId: 0,
        ClienteId: 0,
        SucursalId: 0,
        CajaID: 0,
        Folio: 0,
        SerieId: 0,
        Capital: 0,
        Plazos: 0,
        Cuenta: "",
        TipoDesembolsoID: 0,
        EmpleadoId: 0,
        interes: 0,
        manejo: 0,
        iva: 0,
        Motivo: "",
        InteresVG: "",
        ManejoVG: "",
        IvaVG: "",
        datoBancario: "",
        personasDatosBancariosID: 0,
        RequiereDatosBancarios: false,
        PrestamoPersonal: false,
        Principal: false,
        EsNomina: false,
        FechaExpedicion: new Date(),
        MvCancelacion: "",
        TipoCancelacionID: 0,
        NombreBeneficiario: "",
        ApellidoPaternoBeneficiario: "",
        ApellidoMaternoBeneficiario: "",
        ParentescoBeneficiario: "",
        FechaNacimientoBeneficiario: null,
      },
      Id: undefined,
    },
    Detalle: false,
    DetalleTiendita: false,
    DistribuidorID: 0,
    Distribuidor: "",
    ClienteID: 0,
    Cliente: "",
    CreditoID: 0,
    ShowCaja: false,
    CajaDefault: {
      ProductoID: 0,
      SucursalID: 0,
      CajaID: 0,
    },
    Desembolso: {
      Desembolsar: false,
      CreditoID: 0,
      TipoDesembolsoID: 0,
    },
    optSucursales: [],
    Sucursal: undefined,
    FechaInicio: moment().add(-10, "d").toDate(),
    FechaFin: new Date(),
    tipoUsuario: 0,
  });

  const FnGetProducto = () => {
    FnProductos.FNGetbyHead(props.oidc)
      .then((respuesta: any) => {
        setState((s) => ({ ...s, Producto: respuesta }));
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          Producto: {
            ProductoID: 0,
            EmpresaId: 0,
            Producto: "",
            Activo: false,
            TasaTipoId: "",
            RequiereDistribuidor: false,
            RequiereGrupo: false,
            ValidaDisponible: false,
            Restructura: false,
            GeneraDesembolso: false,
            SeguroFinanciado: false,
            Canje: false,
            DesglosarIVA: false,
            EdadMinima: 0,
            EdadMaxima: 0,
            CapitalAlFinal: false,
            CargoFinanciado: false,
            CargoAlInicio: false,
            ActivaCredito: false,
            CreditosLiquidadosReq: false,
            PermisoEspecial: false,
            ValidarCondiciones: false,
            FhRegitro: "",
            FhMoficiacion: "",
            AplicaIVAInteres: false,
            AplicaIVASeguro: false,
            AplicaIVAManejoCuenta: false,
            Logo: "",
          },
        }));
      });
  };
  const cbCerrarMotivo = () => {
    //set false state.Form.Motivo
    setState((s) => ({ ...s, Form: { ...s.Form, Motivo: false } }));
  };
  const FnGetTipoUsuario = () => {
    Funciones.FNGetTipoUsuario(props.oidc)
      .then((res: any) => {
        setState((s) => ({ ...s, tipoUsuario: res.tipoUsuario }));
      })
      .catch(() => {
        setState((s) => ({ ...s, tipoUsuario: 0 }));
      });
  };

  const FnGetSucursalEmpleado = () => {
    FnPersona.FNGetById(props.oidc)
      .then((res: any) => {
        if (res.length > 0)
          FnSucursal.FNGetById(props.oidc, res[0].SucursalID)
            .then((Sucursal: any) => {
              console.log("Sucursal: ", Sucursal);
              setState((s) => ({ ...s, Sucursal }));
            })
            .catch(() => {
              setState((s) => ({ ...s, Sucursal: undefined }));
            });
        else setState((s) => ({ ...s, Sucursal: undefined }));
      })
      .catch(() => {
        setState((s) => ({ ...s, Sucursal: undefined }));
      });
  };

  const FNGetDetalle = (CreditoID: number, data: any) => {
    Funciones.FNGetPlanPagos(props.oidc, CreditoID)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Detalle: true,
          DatosDetalle: respuesta,
          DistribuidorID: data.DistribuidorID,
          Distribuidor: data.Distribuidor,
          ClienteID: data.ClienteID,
          Cliente: data.NombreCompleto,
          CreditoID,
        }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Detalle: false,
          DatosDetalle: [],
          DistribuidorID: 0,
          Distribuidor: "",
          ClienteID: 0,
          Cliente: "",
          CreditoID: 0,
        }));
        // }
      });
  };

  const FNGetDetalleTiendita = (CreditoID: number, data: any) => {
    console.log('aqui')
    Funciones.FNGetTiendita(props.oidc, CreditoID)
      .then((respuesta: any) => {
        console.log('aqui2')
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          DetalleTiendita: true,
          DatosDetalleTiendita: respuesta,
          DistribuidorID: data.DistribuidorID,
          Distribuidor: data.Distribuidor,
          ClienteID: data.ClienteID,
          Cliente: data.NombreCompleto,
          CreditoID,
        }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          DetalleTiendita: false,
          DatosDetalleTiendita: [],
          DistribuidorID: 0,
          Distribuidor: "",
          ClienteID: 0,
          Cliente: "",
          CreditoID: 0,
        }));
        // }
      });
  };

  const filtroStyle = (row: any) => {
    return [
      {
        when: (row) => row.isCred,
        style: { backgroundColor: "#7fbfff", fontWeight: "bold" },
      },
      {
        when: (row) => row.SaldoAtrasado > 0,
        style: {
          color: "red",
        },
      },
    ];
  };

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Producto",
        selector: "Producto",
        sortable: false,
        // hide: "sm" || "md",
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "N° Crédito",
        selector: "CreditoID",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Id Cliente",
        selector: "ClienteID",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
      // { name: 'Nombre Cliente', selector: 'NombreCompleto', sortable: true, },
      {
        name: "Nombre Cliente",
        width: "250px",
        selector: "NombreCompleto",
        sortable: false,
        cell: (props) => (
          <>
            <span data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>
              {props.NombreCompleto}
            </span>
            <ReactTooltip
              id={`NombreCompletoTooltip${props.CreditoID}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.NombreCompleto}
            </ReactTooltip>
          </>
        ),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Sucursal Socia",
        width: "250px",
        selector: "SucursalNombre",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Sucursal Canje",
        width: "250px",
        selector: "SucursalOrigen",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Capital",
        selector: "Capital",
        sortable: false,
        format: (row) => formatter.format(row.Capital),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Interés",
        selector: "Interes",
        sortable: false,
        format: (row) => formatter.format(row.Interes),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Tiendita",
        selector: "Tiendita",
        sortable: false,
        format: (row) => formatter.format(row.Tiendita),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Seguro",
        selector: "Seguro",
        sortable: false,
        format: (row) => formatter.format(row.Seguro),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Cargo",
        selector: "Cargo",
        sortable: false,
        format: (row) => formatter.format(row.Cargo),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "IVA",
        selector: "IVA",
        sortable: false,
        format: (row) => formatter.format(row.IVA),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Total",
        selector: "ImporteTotal",
        sortable: false,
        format: (row) => formatter.format(row.ImporteTotal),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Abonos",
        selector: "Abonos",
        sortable: false,
        format: (row) => formatter.format(row.Abonos),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Saldo",
        selector: "SaldoActual",
        sortable: false,
        format: (row) => formatter.format(row.SaldoActual),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Atrasado",
        selector: "SaldoAtrasado",
        sortable: false,
        format: (row) => formatter.format(row.SaldoAtrasado),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Días Atraso",
        selector: "DiasAtraso",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Fecha Registro",
        width: "110px",
        selector: "FechaHoraRegistro",
        sortable: false,
        cell: (props) => (
          <span>{moment(props.FechaHoraRegistro).format("DD/MM/YYYY")}</span>
        ),
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Vale",
        selector: "ValeCanje",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Estatus",
        width: "110px",
        selector: "EstatusNombre",
        sortable: false,
        cell: (props) => <span>{props.EstatusNombre}</span>,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Motivo Cancelación",
        width: "100px",
        selector: "MvCancelacion",
        sortable: false,
        center: true,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Desembolsado",
        selector: "MovimientoID",
        sortable: false,
        cell: (props) => <span>{props.MovimientoID ? "SI" : "No"}</span>,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Tipo Desembolso",
        selector: "TipoDesembolso",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Movimiento",
        selector: "MovimientoID",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Persona Registró",
        selector: "NombreCompletoRegistra",
        sortable: false,
        center: true,
        conditionalCellStyles: filtroStyle(props),
      },
      {
        name: "Id Venta",
        selector: "VentaId",
        sortable: false,
        conditionalCellStyles: filtroStyle(props),
      },
    ];
    return colRet;
  }, []);

  const DetailColumns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { name: "# Pago", width: "95px", selector: "NoPago", sortable: true },
      {
        name: "Fecha Vencimiento",
        width: "110px",
        selector: "FechaVencimientoClienteFinal",
        sortable: true,
        cell: (props) => (
          <span>
            {moment(
              addOneDay(new Date(props.FechaVencimientoClienteFinal))
            ).format("DD/MM/YYYY")}
          </span>
        ),
      },
      {
        name: "Importe",
        width: "150px",
        selector: "ImporteTotal",
        sortable: true,
        format: (row) => formatter.format(row.ImporteTotal),
      },
      {
        name: "Abono",
        width: "150px",
        selector: "Abonos",
        sortable: true,
        format: (row) => formatter.format(row.Abonos),
      },
      {
        name: "Saldo",
        width: "150px",
        selector: "SaldoActual",
        sortable: true,
        format: (row) => formatter.format(row.SaldoActual),
      },
      {
        name: "Comisión",
        width: "150px",
        selector: "Comision",
        sortable: true,
        format: (row) => formatter.format(row.Comision),
      },
      {
        name: "Fecha Liquidación",
        width: "110px",
        selector: "FechaLiquidacion",
        sortable: true,
        cell: (props) => (
          <span>
            {props.FechaLiquidacion
              ? moment(addOneDay(new Date(props.FechaLiquidacion))).format(
                "DD/MM/YYYY"
              )
              : ""}
          </span>
        ),
      },
      { name: "Días Atraso", selector: "DiasAtraso", sortable: true },
    ];
    return colRet;
  }, []);

  const DetailColumnsTiendita = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "SKU",
        width: "100px",
        selector: "SKU",
        center: true,
      },
      {
        name: "Precio Unitario",
        width: "150px",
        selector: "PrecioUnitario",
        center: true,
        format: (row) => formatter.format(row.PrecioUnitario),
      },
      {
        name: "Unidades",
        width: "70px",
        selector: "Unidades",
        center: true,
      },
      {
        name: "Descripcion",
        width: "500px",
        selector: "Descripcion",
        center: true,
      },
      {
        name: "ImporteTotal",
        width: "100px",
        selector: "ImporteTotal",
        center: true,
        format: (row) => formatter.format(row.ImporteTotal),
      },
      {
        name: "Fecha Compra",
        width: "110px",
        selector: "FechaRegistra",
        center: true,
        cell: (props) => (
          <span>
            {props.FechaRegistra
              ? moment(addOneDay(new Date(props.FechaRegistra))).format(
                "DD/MM/YYYY"
              )
              : ""}
          </span>
        ),
      },
    ];
    return colRet;
  }, []);

  const HiddenColumns: IDataTableColumn[] = [
    {
      name: "Acciones",
      sortable: false,
      wrap: true,
      cell: (data) => (
        <div
          style={{
            width: "40%",
            overflowX: "auto",
            whiteSpace: "nowrap",
            overflow: "inherit",
          }}
        >
          {console.log("dataaaaaaaaaaa", data)}

          <button
            title="Detalle"
            data-tip
            data-for={`DetalleTooltip${data.CreditoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "10%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type="button"
            onClick={() => {
              FNGetDetalle(data.CreditoID, data);
            }}
          >
            <FaListAlt />
          </button>
          <ReactTooltip
            id={`DetalleTooltip${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Detalle Crédito
          </ReactTooltip>
          
          <button
            data-tip="true"
            disabled={data.EstatusID != "A" ? true : false}
            data-for={`DetalleMovimientoTooltip${data.CreditoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "10%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type="button"
            onClick={() => {
              MySwal.fire({
                title: "<strong>Descargar Detalle de Movimiento</strong>",
                icon: "question",
                html: (
                  <div className="text-center">
                    Se descargara el Detalle de Movimiento ¿Desea continuar?
                  </div>
                ),
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                focusConfirm: false,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                confirmButtonAriaLabel: "Aceptar",
                cancelButtonAriaLabel: "",
              }).then((result) => {
                if (result.isConfirmed) {
                  FnVales.FNPdf(props.oidc, {
                    ProductoID: 1,
                    CreditoID: data.CreditoID,
                    CreditoID_2: 0,
                    SoloFormatoExtra: true,
                  })
                    .then((pdf: any) => {
                      const file = new Blob([pdf], {
                        type: "application/pdf",
                      });
                      var url = window.URL.createObjectURL(file);
                      const fileURL = URL.createObjectURL(file);
                      const enlaceTemporal = document.createElement("a");
                      enlaceTemporal.href = fileURL;
                      enlaceTemporal.target = "_blank";
                      enlaceTemporal.style.display = "none";
                      document.body.appendChild(enlaceTemporal);
                      enlaceTemporal.click();
                    })
                    .catch((error: any) => {
                      console.log(JSON.stringify(error));

                      toast.error(
                        "Error al descargar el archivo, intente descargar nuevamente el archivo o reportarlo a sistemas"
                      );
                    });
                }
              });
            }}
          >
            <FaFileDownload />
          </button>
          <ReactTooltip
            id={`DetalleMovimientoTooltip${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Descargar Detalle de Movimiento
          </ReactTooltip>
          <button
            data-tip="true"
            data-for={`CartaCartaResponsiva${data.CreditoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "10%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type="button"
            onClick={() => {
              MySwal.fire({
                title: "<strong>Descargar Carta Responsiva</strong>",
                icon: "question",
                html: (
                  <div className="text-center">
                    Se descargara la Carta Responsiva ¿Desea continuar?
                  </div>
                ),
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                focusConfirm: false,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                confirmButtonAriaLabel: "Aceptar",
                cancelButtonAriaLabel: "",
              }).then((result) => {
                if (result.isConfirmed) {
                  FnVales.FNPdf(props.oidc, {
                    ProductoID: data.ProductoID,
                    CreditoID: data.CreditoID,
                    CreditoID_2: 0,
                    Reimpresion: true,
                  })
                    .then((pdf: any) => {
                      const file = new Blob([pdf], {
                        type: "application/pdf",
                      });

                      var url = window.URL.createObjectURL(file);
                      var anchor = document.createElement("a");
                      anchor.download = "myfile.pdf";
                      anchor.href = url;
                      anchor.click();
                    })
                    .catch((error: any) => {
                      console.log(JSON.stringify(error));

                      toast.error(
                        "Error al descargar el archivo, intente descargar el archivo nuevamente o reportarlo a sistemas"
                      );
                    });
                }
              });
            }}
          >
            <FaFileDownload />
          </button>
          <ReactTooltip
            id={`CartaCartaResponsiva${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Descargar Carta Responsiva
          </ReactTooltip>
          <button
            title="DetalleTiendita"
            data-tip
            data-for={`DetalleTienditaTooltip${data.CreditoID}`}
            disabled={!data.Tiendita}
            className="asstext"
            style={{
              margin: ".15em",
              width: "10%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type="button"
            onClick={() => {
              FNGetDetalleTiendita(data.CreditoID, data);
            }}
          >
            <FaShoppingCart />
          </button>
          <ReactTooltip
            id={`DetalleTienditaTooltip${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Productos Tiendita
          </ReactTooltip>
          <button
            title="Plan de pago"
            data-tip
            data-for={`DetallePlanPagosTooltip${data.CreditoID}`}
            disabled={data.EstatusID.includes("C")}
            className="asstext"
            style={{
              margin: ".15em",
              width: "10%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type="button"
            onClick={() => {
              MySwal.fire({
                title: "<strong>Descargar Plan de Pagos</strong>",
                icon: "question",
                html: (
                  <div className="text-center">
                    Se descargara la Plan de Pagos ¿Desea continuar?
                  </div>
                ),
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                focusConfirm: false,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                confirmButtonAriaLabel: "Aceptar",
                cancelButtonAriaLabel: "",
              }).then((result) => {
                if (result.isConfirmed) {
                  FnVales.FNGetPlanPagoPDF(props.oidc, {
                    CreditoID: data.CreditoID,
                  })
                    .then((pdf: any) => {
                      const file = new Blob([pdf], {
                        type: "application/pdf",
                      });

                      var url = window.URL.createObjectURL(file);
                      var anchor = document.createElement("a");
                      anchor.download = "myfile.pdf";
                      anchor.href = url;
                      anchor.click();
                    })
                    .catch((error: any) => {
                      console.log(JSON.stringify(error));

                      toast.error(
                        "Error al descargar el archivo, intente descargar el archivo nuevamente o reportarlo a sistemas"
                      );
                    });
                }
              });
            }}
          >
            <FaFileDownload />
          </button>
          <ReactTooltip
            id={`DetallePlanPagosTooltip${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Plan de pago
          </ReactTooltip>
        </div>
      ),
    },
  ];
  // return col
  // }, [])

  const HiddenData = (data: any) => {
    const Datos = [data.data];
    // console.log(Datos)
    return (
      <DataTable
        data={Datos}
        striped
        noHeader
        noTableHead
        responsive
        keyField={"CreditoID"}
        defaultSortField={"CreditoID"}
        columns={HiddenColumns}
      />
    );
  };

  React.useEffect(() => {
    if (isMounted.current === true) {
      // FNGetLocal()
      FnGetTipoUsuario();
      FnGetProducto();
      FnGetSucursalEmpleado();
      fnGetSucursalesCaja();
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);


  /** funcion Callback al agregar un item */
  const cbRespuesta = (Datos: any, CreditoID: number) => {
    if (CreditoID > 0) {
      var k = 1;
      for (var i = 0; i < Datos.length; i++) {
        Datos[i].isCred = true;
        k++;
      }
      setState((s) => ({ ...s, Datos: Datos }));
    } else {
      setState((s) => ({ ...s, Datos: Datos }));
    }
  };

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.CreditoID === item.CreditoID ? item : Dato
      ),
      Form: { ...state.Form, Mostrar: false, Datos: undefined },
    });

  /** funcion para cancelar la forma */
  const fnCerrar = () => {
    setState({
      ...state,
      Form: { ...state.Form, Mostrar: false, Motivo: false },
    });
  };

  const fnCerrarModalVerificacionFolio = () => {
    setShowFolio(false);
  };

  const fnSetearArticuloValidado = () => {
    setState((s) => ({ ...s, Validado: true }));
    setShowFolio(false);
  };


  const cbDatosBancarios = () => {
    console.log("FUNCION QUE NO HACE NADA cbDatosBancarios");
  };

  const fnGetSucursalesCaja = () => {
    FnCajas.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        var sucursales = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.Sucursal };
          return obj;
        });

        setState((s) => ({ ...s, optSucursales: sucursales }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optSucursales: [] }));
      });
  };

  const fnSetSucCaja = (Data: any) => {
    setState((s) => ({
      ...s,
      CajaDefault: {
        ProductoID: Data.ProductoID,
        SucursalID: Data.SucursalID,
        CajaID: Data.CajaID,
      },
      ShowCaja: false,
    }));
  };



  return (
    <CtxCreditoTiendita.Provider
      value={{
        DistribuidorID: creditoSeleccionado?.DistribuidorID || 0,
        ClienteID: creditoSeleccionado?.ClienteID || 0,
        avoidCodigo: true,
        Oidc: props.oidc,
        ArticulosCarrito,
        setArticulosCarrito,
      }}
    >
      <div className="row">
        <div className="col-12">
          <Card Title="Créditos Tiendita">
            <Card.Body>
              <Card.Body.Content>
                {state.Cargando && <Spinner />}
                {state.Error && <span>Error al cargar los datos...</span>}
                {!state.Cargando && !state.Error && (
                  <div>
                    <BuscarCreditos
                      oidc={props.oidc}
                      ui={props.ui}
                      initialValues={{
                        CreditoID: 0,
                        ProductoID: 0,
                        ClienteID: 0,
                        SucursalID: 0,
                        CajaID: 0,
                        ZonaID: 0,
                        EmpresaID: 0,
                        DistribuidorID: 0,
                        CoordinadorID: 0,
                        ContratoID: 0,
                        EstatusID: "P",
                        DistribuidorNivelID: 0,
                        FechaInicio: state.FechaInicio,
                        FechaFin: state.FechaFin,
                      }}
                      cbRespuesta={cbRespuesta}
                      Sucursal={state.Sucursal}
                    />{" "}
                    <DataTable
                      subHeader
                      subHeaderComponent={
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar crédito"
                                value={state.Filtro}
                                onChange={(e) =>
                                  setState((s) => ({
                                    ...s,
                                    Filtro: e.target.value,
                                  }))
                                }
                              />
                              <span className="input-group-text">
                                <FaSearch />{" "}
                              </span>
                          
                            </div>
                          </div>
                        </div>
                      }
                      data={state.DatosMostrar}
                      striped
                      pagination
                      dense
                      // noHeader
                      responsive
                      keyField={"CreditoID"}
                      defaultSortField={"CreditoID"}
                      columns={Columns}
                      expandableRows
                      // expandOnRowClicked
                      onRowExpandToggled={(res: any) => {
                        HiddenData(res);
                      }}
                      expandableRowsComponent={<HiddenData />}
                    // actions={actionsMemo}
                    />
                    {state.Form.Mostrar && (
                      <ModalWin
                        open={state.Form.Mostrar}
                        xlarge
                        scrollable
                        zIndex={1000}
                      >
                        <ModalWin.Header>
                          <h5 className={MODAL_TITLE_CLASS}>
                            {state.Form.Id
                              ? "Modificar Crédito"
                              : "Nuevo Crédito"}
                          </h5>
                          <button
                            title="Cerrar"
                            type="button"
                            className="delete"
                            onClick={() => fnCerrar()}
                          />
                        </ModalWin.Header>
                        <ModalWin.Body>
                          {state.Form.Datos!.Principal && (
                            <CreditoVale
                              DatosForm={state.Form.Datos}
                              callBack={cbActualizar}
                            />
                          )}
                          {state.Form.Datos!.PrestamoPersonal && (
                            <CreditoDistribuidor
                              ProductoID={state.Producto.ProductoID}
                              DistribuidorID={state.Form.Datos!.DistribuidorId}
                              SucursalId={state.Form.Datos!.SucursalId}
                              CajaID={state.Form.Datos!.CajaID}
                              CreditoID={state.Form.Id!}
                              Plazos={state.Form.Datos!.Plazos}
                              TipoDesembolsoID={
                                state.Form.Datos!.TipoDesembolsoID
                              }
                              personasDatosBancariosID={
                                state.Form.Datos!.personasDatosBancariosID
                              }
                              RequiereDatosBancarios={
                                state.Form.Datos!.RequiereDatosBancarios
                              }
                              Capital={state.Form.Datos!.Capital}
                              optSucursales={state.optSucursales}
                              ProdPresPersonal={state.Form.Datos!.ProductoId}
                              fnCancelar={cbActualizar}
                            />
                          )}
                          {state.Form.Datos!.EsNomina && (
                            <CreditoEmpleados
                              DatosForm={state.Form.Datos}
                              callBack={cbActualizar}
                            />
                          )}
                        </ModalWin.Body>
                      </ModalWin>
                    )}
                    {state.Form.Mostrar && (
                      <ModalWin
                        open={state.Form.Mostrar}
                        xlarge
                        scrollable
                        zIndex={1000}
                      >
                        <ModalWin.Header>
                          <h5 className={MODAL_TITLE_CLASS}>
                            {state.Form.Id
                              ? "Modificar Crédito"
                              : "Nuevo Crédito"}
                          </h5>
                          <button
                            title="Cerrar"
                            type="button"
                            className="delete"
                            onClick={() => fnCerrar()}
                          />
                        </ModalWin.Header>
                        <ModalWin.Body>
                          {state.Form.Datos!.Principal && (
                            <CreditoVale
                              DatosForm={state.Form.Datos}
                              callBack={cbActualizar}
                            />
                          )}
                          {state.Form.Datos!.PrestamoPersonal && (
                            <CreditoDistribuidor
                              ProductoID={state.Producto.ProductoID}
                              DistribuidorID={state.Form.Datos!.DistribuidorId}
                              SucursalId={state.Form.Datos!.SucursalId}
                              CajaID={state.Form.Datos!.CajaID}
                              CreditoID={state.Form.Id!}
                              Plazos={state.Form.Datos!.Plazos}
                              TipoDesembolsoID={
                                state.Form.Datos!.TipoDesembolsoID
                              }
                              personasDatosBancariosID={
                                state.Form.Datos!.personasDatosBancariosID
                              }
                              RequiereDatosBancarios={
                                state.Form.Datos!.RequiereDatosBancarios
                              }
                              Capital={state.Form.Datos!.Capital}
                              optSucursales={state.optSucursales}
                              ProdPresPersonal={state.Form.Datos!.ProductoId}
                              fnCancelar={cbActualizar}
                            />
                          )}
                          {state.Form.Datos!.EsNomina && (
                            <CreditoEmpleados
                              DatosForm={state.Form.Datos}
                              callBack={cbActualizar}
                            />
                          )}
                        </ModalWin.Body>
                      </ModalWin>
                    )}
                    {state.Form.Motivo && (
                      <ModalWin open={state.Form.Motivo} large center>
                        <ModalWin.Header>
                          <h5 className={MODAL_TITLE_CLASS}>
                            {"Cancelación de Crédito"}
                          </h5>
                          <button
                            title="Cerrar"
                            type="button"
                            className="delete"
                            onClick={() => fnCerrar()}
                          />
                        </ModalWin.Header>
                        <ModalWin.Body>
                          {state.Form.Datos!.Principal && (
                            <CreditoVale2
                              cbCerrarMotivo={cbCerrarMotivo}
                              DatosForm={state.Form.Datos}
                              callBack={cbActualizar}
                            />
                          )}
                          {state.Form.Datos!.PrestamoPersonal && (
                            <CreditoDistribuidor2
                              ProductoID={state.Producto.ProductoID}
                              DistribuidorID={state.Form.Datos!.DistribuidorId}
                              SucursalId={state.Form.Datos!.SucursalId}
                              CajaID={state.Form.Datos!.CajaID}
                              CreditoID={state.Form.Id!}
                              Plazos={state.Form.Datos!.Plazos}
                              TipoDesembolsoID={
                                state.Form.Datos!.TipoDesembolsoID
                              }
                              personasDatosBancariosID={
                                state.Form.Datos!.personasDatosBancariosID
                              }
                              RequiereDatosBancarios={
                                state.Form.Datos!.RequiereDatosBancarios
                              }
                              Capital={state.Form.Datos!.Capital}
                              optSucursales={state.optSucursales}
                              ProdPresPersonal={state.Form.Datos!.ProductoId}
                              fnCancelar={cbActualizar}
                            />
                          )}
                          {state.Form.Datos!.EsNomina && (
                            <CreditoEmpleados2
                              DatosForm={state.Form.Datos}
                              callBack={cbActualizar}
                            />
                          )}
                        </ModalWin.Body>
                      </ModalWin>
                    )}
                    <ModalWin open={state.Detalle} xlarge scrollable>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          {"Plan de Pagos"} <br />
                          {"Socia: " +
                            state.DistribuidorID +
                            " - " +
                            state.Distribuidor}{" "}
                          <br />
                          {"Cliente: " +
                            state.ClienteID +
                            " - " +
                            state.Cliente}{" "}
                          <br />
                          {"N°Crédito: "}
                          {state.CreditoID}
                        </h5>
                        <button
                          title="Cerrar"
                          type="button"
                          className="delete"
                          onClick={() => setState({ ...state, Detalle: false })}
                        />
                      </ModalWin.Header>
                      <ModalWin.Body>
                        <DataTable
                          data={state.DatosDetalle}
                          striped
                          // pagination
                          dense
                          noHeader
                          responsive
                          keyField={"NoPago"}
                          defaultSortField={"NoPago"}
                          columns={DetailColumns}
                        />
                      </ModalWin.Body>
                    </ModalWin>
                    <ModalWin open={state.DetalleTiendita} xlarge scrollable>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          {"Productos Tiendita"} <br />
                          {"Socia: " +
                            state.DistribuidorID +
                            " - " +
                            state.Distribuidor}{" "}
                          <br />
                          {"N°Crédito: "}
                          {state.CreditoID}
                        </h5>
                        <button
                          title="Cerrar"
                          type="button"
                          className="delete"
                          onClick={() =>
                            setState({ ...state, DetalleTiendita: false })
                          }
                        />
                      </ModalWin.Header>
                      <ModalWin.Body>
                        <DataTable
                          data={state.DatosDetalleTiendita}
                          striped
                          // pagination
                          dense
                          noHeader
                          responsive
                          keyField={"NoPago"}
                          defaultSortField={"NoPago"}
                          columns={DetailColumnsTiendita}
                        />
                      </ModalWin.Body>
                    </ModalWin>
                    {state.ShowCaja && (
                      <ModalWin open={state.ShowCaja} large scrollable>
                        <ModalWin.Header>
                          <h5 className={MODAL_TITLE_CLASS}>
                            Selección de Caja
                          </h5>
                        </ModalWin.Header>
                        <ModalWin.Body>
                          {state.ShowCaja && (
                            <SeleccionarCajaSucursal
                              optSucursales={state.optSucursales}
                              initialValues={state.CajaDefault}
                              cbAceptar={fnSetSucCaja}
                            />
                          )}
                        </ModalWin.Body>
                      </ModalWin>
                    )}
                  </div>
                )}
                {showFolio && (
                  <ModalWin open={showFolio} scrollable>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>Validar Folio</h5>
                      <button
                        title="Cerrar"
                        type="button"
                        className="delete"
                        onClick={() => fnCerrarModalVerificacionFolio()}
                      />
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {showFolio && (
                        <FolioConfirmacion
                          PersonaID={creditoSeleccionado!.DistribuidorID}
                          cbGuardar={cbDatosBancarios}
                          fnGenerarCredito={fnSetearArticuloValidado}
                          fnCerrar={fnCerrarModalVerificacionFolio}
                        />
                      )}
                    </ModalWin.Body>
                  </ModalWin>
                )}
              </Card.Body.Content>
            </Card.Body>
          </Card>
        </div>
      </div>
    </CtxCreditoTiendita.Provider>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreditoCreditoTiendita);
