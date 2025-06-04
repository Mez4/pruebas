import { useEffect, useState } from "react";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { connect } from "react-redux";
import { Card } from "../../../../global";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import GenericForm from "./SolicitudesGeneral/CForm";
import moment from "moment";
import { DataGrid, /* esES, */ GridColDef } from "@mui/x-data-grid";
import * as Funciones from "./SolicitudesGeneral/Funciones";
import { toast } from "react-toastify";

type SolicitudesGeneralType = {
  oidc: IOidc;
  ui: iUI;
};

const SolicitudesGeneral = (props: SolicitudesGeneralType) => {
  const [tab, setTab] = useState(0);

  const [state, setState] = useState({
    PrestamosPersonales: [],
    Incrementos: [],
    AumentosNivel: [],
    Convenios: [],
    loading: false,
    Error: false,
  });

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const TabPanel = (props: {
    children?: React.ReactNode;
    index: any;
    value: any;
  }) => {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  };

  const prestamoPersonalColumns: GridColDef[] = [
    {
      field: "SolicitudPrestamoPersonalID",
      headerName: "Solicitud ID",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Producto",
      headerName: "Producto",
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "NombreSucursal",
      headerName: "Sucursal",
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "CreditoID",
      headerName: "N. Credito",
      align: "center",
      headerAlign: "center",
      renderCell: (cell) => cell.row.CreditoID || "N/A",
    },
    {
      field: "ContratoID",
      headerName: "Contrato ID",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "DistribuidorID",
      headerName: "Socia ID",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "PersonaNombre",
      headerName: "Socia",
      minWidth: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "PrestamoSolicitado",
      headerName: "Préstamo  Solicitado",
      align: "center",
      minWidth: 200,
      headerAlign: "center",
      renderCell: (cell: any) =>
        cell.row.PrestamoSolicitado !== null &&
        cell.row.PrestamoSolicitado !== undefined
          ? `${cell.row.PrestamoSolicitado.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}`
          : "N/A",
    },
    {
      field: "PlazoSolicitado",
      headerName: "Plazos",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Observaciones",
      headerName: "Observaciones",
      align: "center",
      minWidth: 400,
      headerAlign: "center",
    },
    {
      field: "PrestamoAutorizado",
      headerName: "Préstamo Autorizado",
      align: "center",
      headerAlign: "center",
      renderCell: (cell: any) =>
        cell.row.PrestamoAutorizado !== null &&
        cell.row.PrestamoAutorizado !== undefined
          ? `${cell.row.PrestamoAutorizado.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}`
          : "N/A",
    },
    {
      field: "UsuarioSolicito",
      headerName: "Usuario Solicito",
      align: "center",
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "FechaSolicitud",
      headerName: "Fecha Solicito",
      align: "center",
      headerAlign: "center",
      renderCell: (cell: any) =>
        moment(cell.row.FechaSolicitud).format("DD/MM/YYYY"),
    },
    {
      field: "MotivoCancelacion",
      headerName: "Motivo Cancelacion",
      align: "center",
      minWidth: 300,
      headerAlign: "center",
    },
  ];

  const incrementosColumns: GridColDef[] = [
    {
      field: "SolicitudID",
      headerName: "Id",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Producto",
      headerName: "Producto",
      align: "center",
      minWidth: 150,
      headerAlign: "center",
    },
    {
      field: "NombreSucursal",
      headerName: "Sucursal",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
      renderCell: (cell: any) => cell.row.NombreSucursal,
    },
    {
      field: "ContratoID",
      headerName: "Id Contrato",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "PersonaNombre",
      headerName: "Socia",
      align: "center",
      headerAlign: "center",
      minWidth: 300,
      renderCell: (cell: any) => cell.row.PersonaNombre,
    },
    {
      field: "IncrementoSolicitado",
      headerName: "Incremento Solicitado",
      align: "center",
      minWidth: 150,
      headerAlign: "center",
    },
    {
      field: "IncrementoAutorizado",
      headerName: "Incremento Autorizado",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      renderCell: (cell: any) =>
        cell.row.EstatusID == 3
          ? "CANCELADO"
          : cell.row.IncrementoAutorizado != undefined
          ? cell.row.IncrementoAutorizado
          : "Pendiente Autorización",
    },
    {
      field: "Observaciones",
      headerName: "Observaciones",
      align: "center",
      headerAlign: "center",
      minWidth: 300,
      renderCell: (cell: any) =>
        cell.row.Observaciones ? cell.row.Observaciones : "Sin Observaciones",
    },
    {
      field: "UsuarioSolicito",
      headerName: "Usuario Solicito",
      align: "center",
      headerAlign: "center",
      minWidth: 300,
      renderCell: (cell: any) => cell.row.UsuarioSolicito,
    },
    {
      field: "FechaSolicitud",
      headerName: "Fecha Solicito",
      align: "center",
      headerAlign: "center",
      minWidth: 110,
      renderCell: (cell: any) =>
        moment(cell.row.FechaSolicitud).format("DD/MM/YYYY"),
    },
    {
      field: "UsuarioAutorizo",
      headerName: "Usuario Autoriza",
      align: "center",
      headerAlign: "center",
      minWidth: 300,
      renderCell: (cell: any) =>
        cell.row.UsuarioAutorizo ? cell.row.UsuarioAutorizo : "N/A",
    },
    {
      field: "FechaAutorizacion",
      headerName: "Fecha Autorización",
      align: "center",
      headerAlign: "center",
      minWidth: 110,
      renderCell: (cell: any) =>
        moment(cell.row.FechaSolicitud).format("DD/MM/YYYY"),
    },
    {
      field: "UsuarioModifica",
      headerName: "Usuario Modifica",
      align: "center",
      headerAlign: "center",
      minWidth: 300,
      renderCell: (cell: any) =>
        cell.row.UsuarioModifica ? cell.row.UsuarioModifica : "N/A",
    },
    {
      field: "FechaModifica",
      headerName: "Fecha Modificación",
      align: "center",
      headerAlign: "center",
      minWidth: 110,
      renderCell: (cell: any) =>
        cell.row.FechaModifica == undefined
          ? "N/A"
          : moment(cell.row.FechaModifica).format("DD/MM/YYYY"),
    },
    {
      field: "UsuarioCancelo",
      headerName: "Usuario Cancela",
      align: "center",
      headerAlign: "center",
      minWidth: 300,
      renderCell: (cell: any) =>
        cell.row.UsuarioCancelo ? cell.row.UsuarioCancelo : "N/A",
    },
    {
      field: "FechaCancelacion",
      headerName: "Fecha Cancelación",
      align: "center",
      headerAlign: "center",
      minWidth: 110,
      renderCell: (cell: any) =>
        cell.row.FechaCancelacion == undefined
          ? "N/A"
          : moment(cell.row.FechaCancelacion).format("DD/MM/YYYY"),
    },
    {
      field: "MotivoCancelacion",
      headerName: "Motivo Cancelación",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      renderCell: (cell: any) =>
        cell.row.MotivoCancelacion ? cell.row.MotivoCancelacion : "Sin Motivo",
    },
    {
      field: "Estatus",
      headerName: "Estatus",
      align: "center",
      headerAlign: "center",
      minWidth: 115,
      renderCell: (cell: any) => cell.row.Estatus,
    },
  ];

  const aumentosNivelColumns: GridColDef[] = [
    {
      field: "SolicitudAumentoNivID",
      headerName: "Id",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "UsuarioSolicita",
      headerName: "Distribuidor",
      align: "center",
      headerAlign: "center",
      minWidth: 300,
    },
    {
      field: "Sucursal",
      headerName: "Sucursal",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      renderCell: (cell: any) => cell.row.Sucursal,
    },
    {
      field: "Estatus",
      headerName: "Estatus",
      align: "center",
      headerAlign: "center",
      minWidth: 115,
    },
    {
      field: "Observaciones",
      headerName: "Observaciones",
      align: "center",
      headerAlign: "center",
      minWidth: 500,
      renderCell: (cell: any) =>
        cell.row.Observaciones ? cell.row.Observaciones : "Sin Observaciones",
    },
    {
      field: "FechaSolicitud",
      headerName: "Fecha Solicito",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      renderCell: (cell: any) =>
        cell.row.FechaSolicitud
          ? moment(cell.row.FechaSolicitud).format("DD/MM/YYYY HH:mm:ss")
          : "N/A",
    },
    {
      field: "UsuarioResponde",
      headerName: "Usuario Autoriza",
      align: "center",
      headerAlign: "center",
      minWidth: 300,
      renderCell: (cell: any) =>
        cell.row.UsuarioResponde ? cell.row.UsuarioResponde : "N/A",
    },
    {
      field: "FechaRespuesta",
      headerName: "Fecha Autorización",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      renderCell: (cell: any) =>
        cell.row.FechaRespuesta
          ? moment(cell.row.FechaRespuesta).format("DD/MM/YYYY HH:mm:ss")
          : "N/A",
    },
    {
      field: "MotivoCancelacion",
      headerName: "Motivo Cancelación",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      renderCell: (cell: any) =>
        cell.row.MotivoCancelacion ? cell.row.MotivoCancelacion : "Sin Motivo",
    },
    {
      field: "SaldoActual",
      headerName: "Saldo Actual",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
      renderCell: (cell: any) =>
        cell.row.SaldoActual
          ? `${cell.row.SaldoActual.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}`
          : " - ",
    },
  ];

  const conveniosColumns: GridColDef[] = [
    {
      field: "Estatus",
      headerName: "Estatus",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 200,
      renderCell: (params) => params.row.Descripcion,
    },
    {
      field: "Sucursal_Nombre",
      headerName: "Sucursal",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 140,
      renderCell: (params) => params.row.Sucursal_Nombre,
    },
    {
      field: "DistribuidorID",
      headerName: "Distribuidor ID",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 120,
      renderCell: (params) => params.row.DistribuidorID,
    },
    {
      field: "PersonaNombre",
      headerName: "Nombre Distribuidor",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 300,
      renderCell: (params) => params.row.PersonaNombre,
    },
    {
      field: "Accion",
      headerName: "Herramienta Rescate",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      sortable: true,
      renderCell: (params) => {
        switch (params.row.Accion) {
          case 1:
            return "Convenio de Salida";
          case 2:
            return "Reestructura";
          case 3:
            return "Reestructura de Salida";
          case 4:
            return "Reestructura Cliente F.";
          case 5:
            return "Reconvenio";
          default:
            return "Sin herramienta";
        }
      },
    },
    {
      field: "TipoReestructura",
      headerName: "Tipo Reestructura",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 150,
      renderCell: (params) => params.row.TipoReestructura || "NO APLICA",
    },
    {
      field: "Motivo",
      headerName: "Motivo",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 500,
      renderCell: (params) => params.row.Motivo,
    },
    {
      field: "Quincenas",
      headerName: "Plazos",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 100,
      renderCell: (params) =>
        params.row.Quincenas ? params.row.Quincenas : "",
    },
    {
      field: "SaldoActual",
      headerName: "Saldo Actual",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 150,
      renderCell: (params) =>
        params.row.SaldoActual != null
          ? params.row.SaldoActual.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })
          : "",
    },
    {
      field: "SaldoAtrasado",
      headerName: "Saldo Atrasado",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 150,
      renderCell: (params) =>
        params.row.SaldoAtrasado != null
          ? params.row.SaldoAtrasado.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })
          : "",
    },
    {
      field: "PorcientoQuita",
      headerName: "Porcentaje Quita",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 150,
      renderCell: (params) =>
        params.row.PorcientoQuita != null
          ? `%${params.row.PorcientoQuita}`
          : "NO APLICA",
    },
    {
      field: "Nombre",
      headerName: "Persona Registra",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 250,
      renderCell: (params) => params.row.Nombre,
    },
    {
      field: "FechaRegistro",
      headerName: "Fecha Registro",
      headerAlign: "center",
      align: "center",
      sortable: true,
      minWidth: 150,
      renderCell: (params) =>
        params.row.FechaRegistro
          ? moment(params.row.FechaRegistro).format("DD/MM/YYYY")
          : "",
    },
  ];

  const fnGetSolicitudesPrestamoPersonal = (values: any) => {
    setState((s) => ({
      ...s,
      loading: true,
    }));
    let fechaInicio = new Date(values.FechaInicio);
    fechaInicio.setMinutes(
      fechaInicio.getMinutes() - fechaInicio.getTimezoneOffset()
    );
    let fechaFin = new Date(values.FechaFin);
    fechaFin.setMinutes(fechaFin.getMinutes() - fechaFin.getTimezoneOffset());

    Funciones.FNGetSolicitudesPrestamoPersonal(props.oidc, {
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
    })
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          setState((s) => ({
            ...s,
            Error: false,
            PrestamosPersonales: respuesta,
            loading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            Error: false,
            PrestamosPersonales: [],
            loading: false,
          }));
          toast.warning("No se encontraron datos para mostrar");
        }
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          Error: true,
          PrestamosPersonales: [],
          loading: false,
        }));
        toast.error("Hubo un error al obtener los datos");
      });
  };

  const fnGetSolicitudesIncrementos = (values: any) => {
    setState((s) => ({
      ...s,
      loading: true,
    }));
    let fechaInicio = new Date(values.FechaInicio);
    fechaInicio.setMinutes(
      fechaInicio.getMinutes() - fechaInicio.getTimezoneOffset()
    );
    let fechaFin = new Date(values.FechaFin);
    fechaFin.setMinutes(fechaFin.getMinutes() - fechaFin.getTimezoneOffset());

    Funciones.FNGetSolicitudesIncrementos(props.oidc, {
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
    })
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          setState((s) => ({
            ...s,
            Error: false,
            Incrementos: respuesta,
            loading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            Error: false,
            Incrementos: [],
            loading: false,
          }));
          toast.warning("No se encontraron datos para mostrar");
        }
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          Error: true,
          Incrementos: [],
          loading: false,
        }));
        toast.error("Hubo un error al obtener los datos");
      });
  };

  const fnGetSolicitudesAumentoNivel = (values: any) => {
    setState((s) => ({
      ...s,
      loading: true,
    }));
    let fechaInicio = new Date(values.FechaInicio);
    fechaInicio.setMinutes(
      fechaInicio.getMinutes() - fechaInicio.getTimezoneOffset()
    );
    let fechaFin = new Date(values.FechaFin);
    fechaFin.setMinutes(fechaFin.getMinutes() - fechaFin.getTimezoneOffset());

    Funciones.FNGetSolicitudesAumentoNivel(props.oidc, {
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
    })
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          setState((s) => ({
            ...s,
            Error: false,
            AumentosNivel: respuesta,
            loading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            Error: false,
            AumentosNivel: [],
            loading: false,
          }));
          toast.warning("No se encontraron datos para mostrar");
        }
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          Error: true,
          AumentosNivel: [],
          loading: false,
        }));
        toast.error("Hubo un error al obtener los datos");
      });
  };

  const fnGetSolicitudesConvenioCartera = (values: any) => {
    setState((s) => ({
      ...s,
      loading: true,
    }));
    let fechaInicio = new Date(values.FechaInicio);
    fechaInicio.setMinutes(
      fechaInicio.getMinutes() - fechaInicio.getTimezoneOffset()
    );
    let fechaFin = new Date(values.FechaFin);
    fechaFin.setMinutes(fechaFin.getMinutes() - fechaFin.getTimezoneOffset());

    Funciones.FNGetSolicitudesConvenioCartera(props.oidc, {
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
    })
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          setState((s) => ({
            ...s,
            Error: false,
            Convenios: respuesta,
            loading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            Error: false,
            Convenios: [],
            loading: false,
          }));
          toast.warning("No se encontraron datos para mostrar");
        }
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          Error: true,
          Convenios: [],
          loading: false,
        }));
        toast.error("Hubo un error al obtener los datos");
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Card Title={"SOLICITUDES GENERAL"}>
            <Card.Body>
              <Card.Body.Content>
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="SOLICITUDES DE PRÉSTAMOS PERSONALES" />
                  <Tab label="SOLICITUDES DE INCREMENTOS" />
                  <Tab label="SOLICITUDES DE AUMENTO DE NIVEL" />
                  <Tab label="SOLICITUDES DE CONVENIOS Y REESTRUCTURAS" />
                </Tabs>
                <TabPanel value={tab} index={0}>
                  <GenericForm
                    onSubmit={fnGetSolicitudesPrestamoPersonal}
                    loading={state.loading}
                    storageKey={"PRESTAMO_PERSONAL"}
                  />
                  <DataGrid
                    rows={state.PrestamosPersonales}
                    columns={prestamoPersonalColumns}
                    // localeText={
                    //   esES.components.MuiDataGrid.defaultProps.localeText
                    // }
                    className="mt-3"
                    getRowId={(row) => crypto.randomUUID()}
                    pageSizeOptions={[15, 20, 50, 100]}
                    rowSelection={false}
                    rowHeight={40}
                    columnHeaderHeight={40}
                    loading={state.loading}
                    sx={{
                      "& .MuiToolbar-root": {
                        // margin: 0,
                        maxHeight: "0.5rem",
                      },
                      "& .MuiTablePagination-selectLabel": {
                        margin: 0,
                        minHeight: "1.3rem",
                      },
                      "& .MuiDataGrid-footerContainer": {
                        margin: 0,
                        minHeight: "1.3rem",
                      },
                      "& .MuiTablePagination-displayedRows": {
                        margin: 0,
                      },
                      "& .MuiButtonBase-root": {
                        padding: "0",
                      },
                    }}
                  />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <GenericForm
                    onSubmit={fnGetSolicitudesIncrementos}
                    loading={state.loading}
                    storageKey={"SOLICITUDES_INCREMENTOS"}
                  />
                  <DataGrid
                    rows={state.Incrementos}
                    columns={incrementosColumns}
                    // localeText={
                    //   esES.components.MuiDataGrid.defaultProps.localeText
                    // }
                    className="mt-3"
                    getRowId={(row) => crypto.randomUUID()}
                    pageSizeOptions={[15, 20, 50, 100]}
                    rowSelection={false}
                    rowHeight={42}
                    columnHeaderHeight={36}
                    loading={state.loading}
                    sx={{
                      "& .MuiTablePagination-selectLabel": {
                        margin: 0,
                        minHeight: "1.3rem",
                      },
                      "& .MuiDataGrid-footerContainer": {
                        margin: 0,
                        minHeight: "1.3rem",
                      },
                      "& .MuiTablePagination-displayedRows": {
                        margin: 0,
                      },
                      "& .MuiButtonBase-root": {
                        padding: "0",
                      },
                    }}
                  />
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  <GenericForm
                    onSubmit={fnGetSolicitudesAumentoNivel}
                    loading={state.loading}
                    storageKey={"SOLICITUDES_AUMENTO_NIVEL"}
                  />
                  <DataGrid
                    rows={state.AumentosNivel}
                    columns={aumentosNivelColumns}
                    // localeText={
                    //   esES.components.MuiDataGrid.defaultProps.localeText
                    // }
                    className="mt-3"
                    getRowId={(row) => crypto.randomUUID()}
                    pageSizeOptions={[15, 20, 50, 100]}
                    rowSelection={false}
                    rowHeight={42}
                    columnHeaderHeight={36}
                    loading={state.loading}
                    sx={{
                      "& .MuiTablePagination-selectLabel": {
                        margin: 0,
                        minHeight: "1.3rem",
                      },
                      "& .MuiDataGrid-footerContainer": {
                        margin: 0,
                        minHeight: "1.3rem",
                      },
                      "& .MuiTablePagination-displayedRows": {
                        margin: 0,
                      },
                      "& .MuiButtonBase-root": {
                        padding: "0",
                      },
                    }}
                  />
                </TabPanel>
                <TabPanel value={tab} index={3}>
                  <GenericForm
                    onSubmit={fnGetSolicitudesConvenioCartera}
                    loading={state.loading}
                    storageKey={"SOLICITUDES_CONVENIOS"}
                  />
                  <DataGrid
                    rows={state.Convenios}
                    columns={conveniosColumns}
                    // localeText={
                    //   esES.components.MuiDataGrid.defaultProps.localeText
                    // }
                    className="mt-3"
                    getRowId={(row) => crypto.randomUUID()}
                    pageSizeOptions={[15, 20, 50, 100]}
                    rowSelection={false}
                    rowHeight={42}
                    columnHeaderHeight={36}
                    loading={state.loading}
                    sx={{
                      "& .MuiTablePagination-selectLabel": {
                        margin: 0,
                      },
                      "& .MuiDataGrid-footerContainer": {
                        margin: 0,
                      },
                      "& .MuiTablePagination-displayedRows": {
                        margin: 0,
                      },
                      "& .MuiButtonBase-root": {
                        padding: "0",
                      },
                    }}
                  />
                </TabPanel>
              </Card.Body.Content>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(SolicitudesGeneral);
