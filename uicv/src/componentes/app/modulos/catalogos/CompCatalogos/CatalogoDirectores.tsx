import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CatalogoDirectores/Funciones";
import { AgregarDirector } from "./CatalogoDirectores/AgregarDirector";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
// Icons
import { FaPencilAlt, FaPlus, FaSearch } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
// import { CForm } from "./CatalogoDirectores/CForm";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { toast } from "react-toastify";
import { now } from "moment";
import { EditarDirector } from "./CatalogoDirectores/EditarDirector";

type CatalogosType = {
  oidc: IOidc;
};

const CatalogoDirectores = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const DatosDefecto = {
    DirectorID: 0,
    Nombre: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    NombreCompleto: "",
    FechaNacimiento: Date.now.toString(),
    LugarNacimiento: "",
    CURP: "",
    RFC: "",
    SexoID: "",
    EstadoCivilID: "",
    EscolaridadID: "",
    DependientesEconomicos: "",
    TelefonoDomicilio: "",
    TelefonoMovil: "",
    CorreoElectronico: "",
    NombreConyuge: "",
    Observaciones: "",
    identificacionTipoId: 0,
    identificacionNumero: "",
    // AsentamientoID: 0,
    // NombreVialidad: "",
    // NumeroInterior: "",
    // NumeroExterior: "",
    // vialidadTipoId: 0,
    // orientacionVialidadTipoId: 0,
    // viviendaTipoId: 0,
    // ReferenciasGeograficas: "",
    // Empresa: "",
    // Puesto: 0,
    // OcupacionID: 0,
    // Telefono: "",
    // FechaIngreso: "1900/01/01",
    // FechaTermino: "1900/01/01",
    // SueldoMensual: 0.0,
    // vialidadTipoIdEmpleo: 0,
    // NombreVialidadEmpleo: "",
    // orientacionVialidadTipoIdEmpleo: 0,
    // NumeroExteriorEmpleo: "",
    // NumeroInteriorEmpleo: "",
    // ReferenciasGeograficasEmpleo: "",
    // AsentamientoIDEmpleo: 0,
    // viviendaTipoIdEmpleo: 0,
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    Filtro: "",
    Cargando: true,
    Error: false,
    Form: {
      Mostrar: false,
      Editar: false,
      Datos: DatosDefecto,
      Id: undefined,
    },
  });

  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));
 
    Funciones.FNGet(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Datos: respuesta,
            // Form:{...s.Form,Datos:respuesta}
          }));
          console.log(respuesta);
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const cbAgregarDirector = (item: any) => {
    console.log("item: ", item);
    if (item.res == 1) {
      toast.success(item.msj);
    }
    if (item.res == 2) {
      toast.warning(item.msj);
    }
    setState((s) => ({
      ...s,
      Form: { ...s.Form, Mostrar: false,Editar:false },
    }));
    FNGetLocal();
  };

  const cbActualizarDirector = (item: any) => {
    console.log("item: ", item);
    if (item) {
      console.log("toast");
      toast.success("El director se actualizo correctamente!");
    }
    else {
      toast.warning(item.msj);
    }
    setState((s) => ({
      ...s,
      Form: { ...s.Form, Mostrar: false,Editar:false },
    }));
    FNGetLocal();
  };

  const cbCancelarCliente = () => {
    setState((s) => ({
      ...s,
      Form: { ...s.Form, Mostrar: false,Editar:false },
    }));
  };



  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { name: "Id", selector: "DirectorID", sortable: true },
      { name: "Nombre", selector: "NombreCompleto", sortable: true },
      { name: "RFC", selector: "RFC", sortable: true },
      {
        name: "Acciones",
        sortable: false,
        cell: (props) => (
          <button
            className="asstext"
            type={"button"}
            onClick={() => {
              setState((s) => ({
                ...s,
                Form: {
                  ...s.Form,
                  Mostrar: false,
                  Editar: true,
                  Datos: {
                    DirectorID: props.DirectorID,
                    Nombre: props.Nombre,
                    ApellidoPaterno: props.ApellidoPaterno,
                    ApellidoMaterno: props.ApellidoMaterno,
                    NombreCompleto: props.NombreCompleto,
                    FechaNacimiento: props.FechaNacimiento,
                    LugarNacimiento: props.LugarNacimiento,
                    CURP: props.CURP,
                    RFC: props.RFC,
                    SexoID: props.SexoID,
                    EstadoCivilID: props.EstadoCivilID,
                    EscolaridadID: props.EscolaridadID,
                    DependientesEconomicos: props.DependientesEconomicos,
                    TelefonoDomicilio: props.TelefonoDomicilio,
                    TelefonoMovil: props.TelefonoMovil,
                    CorreoElectronico: props.CorreoElectronico,
                    NombreConyuge: props.NombreConyuge,
                    Observaciones: props.Observaciones,
                    identificacionTipoId: props.identificacionTipoId,
                    identificacionNumero: props.identificacionNumero,
                    // AsentamientoID: props.AsentamientoID,
                    // NombreVialidad: props.NombreVialidad,
                    // NumeroInterior: props.NumeroInterior,
                    // NumeroExterior: props.NumeroExterior,
                    // vialidadTipoId: props.vialidadTipoId,
                    // orientacionVialidadTipoId: props.orientacionVialidadTipoId,
                    // viviendaTipoId: props.viviendaTipoId,
                    // ReferenciasGeograficas: props.ReferenciasGeograficas,
                    // Empresa: props.Empresa,
                    // Puesto: props.Puesto,
                    // OcupacionID: props.OcupacionID,
                    // Telefono: props.Telefono,
                    // FechaIngreso: props.FechaIngreso,
                    // FechaTermino: props.FechaTermino,
                    // SueldoMensual: props.SueldoMensual,
                    // vialidadTipoIdEmpleo: props.vialidadTipoIdEmpleo,
                    // NombreVialidadEmpleo: props.NombreVialidadEmpleo,
                    // orientacionVialidadTipoIdEmpleo:
                    //   props.orientacionVialidadTipoIdEmpleo,
                    // NumeroExteriorEmpleo: props.NumeroExteriorEmpleo,
                    // NumeroInteriorEmpleo: props.NumeroInteriorEmpleo,
                    // ReferenciasGeograficasEmpleo:
                    //   props.ReferenciasGeograficasEmpleo,
                    // AsentamientoIDEmpleo: props.AsentamientoIDEmpleo,
                    // viviendaTipoIdEmpleo: props.viviendaTipoIdEmpleo,
                  },
                  Id: props.DirectorID,
                },
              }));
            }}
          >
            <FaPencilAlt />
          </button>
        ),
      },
    ];
    return colRet;
  }, []);

  React.useEffect(() => {
    FNGetLocal();
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
  const cbAgregar = (item: any) =>
    setState({
      ...state,
      Datos: [...state.Datos, item],
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          DirectorID: 0,
          Nombre: "",
          ApellidoPaterno: "",
          ApellidoMaterno: "",
          NombreCompleto: "",
          FechaNacimiento: "1900/01/01",
          LugarNacimiento: "",
          CURP: "",
          RFC: "",
          SexoID: "",
          EstadoCivilID: "",
          EscolaridadID: "",
          DependientesEconomicos: "",
          TelefonoDomicilio: "",
          TelefonoMovil: "",
          CorreoElectronico: "",
          NombreConyuge: "",
          Observaciones: "",
          identificacionTipoId: 0,
          identificacionNumero: "",
          // AsentamientoID: 0,
          // NombreVialidad: "",
          // NumeroInterior: "",
          // NumeroExterior: "",
          // vialidadTipoId: 0,
          // orientacionVialidadTipoId: 0,
          // viviendaTipoId: 0,
          // ReferenciasGeograficas: "",
          // Empresa: "",
          // Puesto: 0,
          // OcupacionID: 0,
          // Telefono: "",
          // FechaIngreso: "1900/01/01",
          // FechaTermino: "1900/01/01",
          // SueldoMensual: 0.0,
          // vialidadTipoIdEmpleo: 0,
          // NombreVialidadEmpleo: "",
          // orientacionVialidadTipoIdEmpleo: 0,
          // NumeroExteriorEmpleo: "",
          // NumeroInteriorEmpleo: "",
          // ReferenciasGeograficasEmpleo: "",
          // AsentamientoIDEmpleo: 0,
          // viviendaTipoIdEmpleo: 0,
        },
      },
    });

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.DirectorID === item.DirectorID ? item : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          DirectorID: 0,
          Nombre: "",
          ApellidoPaterno: "",
          ApellidoMaterno: "",
          NombreCompleto: "",
          FechaNacimiento:"1900/01/01",
          LugarNacimiento: "",
          CURP: "",
          RFC: "",
          SexoID: "",
          EstadoCivilID: "",
          EscolaridadID: "",
          DependientesEconomicos: "",
          TelefonoDomicilio: "",
          TelefonoMovil: "",
          CorreoElectronico: "",
          NombreConyuge: "",
          Observaciones: "",
          identificacionTipoId: 0,
          identificacionNumero: "",
          // AsentamientoID: 0,
          // NombreVialidad: "",
          // NumeroInterior: "",
          // NumeroExterior: "",
          // vialidadTipoId: 0,
          // orientacionVialidadTipoId: 0,
          // viviendaTipoId: 0,
          // ReferenciasGeograficas: "",
          // Empresa: "",
          // Puesto: 0,
          // OcupacionID: 0,
          // Telefono: "",
          // FechaIngreso: "1900/01/01",
          // FechaTermino: "1900/01/01",
          // SueldoMensual: 0.0,
          // vialidadTipoIdEmpleo: 0,
          // NombreVialidadEmpleo: "",
          // orientacionVialidadTipoIdEmpleo: 0,
          // NumeroExteriorEmpleo: "",
          // NumeroInteriorEmpleo: "",
          // ReferenciasGeograficasEmpleo: "",
          // AsentamientoIDEmpleo: 0,
          // viviendaTipoIdEmpleo: 0,
        },
      },
    });

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Administrar Directores">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <DataTable
                    subHeader
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar Directores"
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
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() =>
                                setState({
                                  ...state,
                                  Form: {
                                    Mostrar: true,
                                    Editar:false,
                                    Datos: DatosDefecto,
                                    Id: undefined,
                                  },
                                })
                              }
                            >
                              <FaPlus />
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => FNGetLocal()}
                            >
                              <FiRefreshCcw />
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                    data={state.DatosMostrar}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    keyField={"DirectorID"}
                    defaultSortField={"DirectorID"}
                    columns={Columns}
                  />

                  {state.Form.Mostrar && (
                    <AgregarDirector
                      oidc={props.oidc}
                      cbActualizar={() => {}}
                      cbGuardar={cbAgregarDirector}
                      fnCancelar={cbCancelarCliente}
                      mostrar={state.Form.Mostrar}
                      datos={state.Form.Datos}
                    />
                  )}
                   {state.Form.Editar && (
                    <EditarDirector
                      oidc={props.oidc}
                      cbActualizar={() => {}}
                      cbGuardar={cbActualizarDirector}
                      fnCancelar={cbCancelarCliente}
                      mostrar={state.Form.Editar}
                      datos={state.Form.Datos}
                    />
                  )}
                </div>
              )}
            </Card.Body.Content>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoDirectores);
