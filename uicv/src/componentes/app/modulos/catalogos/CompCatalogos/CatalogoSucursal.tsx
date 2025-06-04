import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CatalogoSucursal/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from "react-icons/fa";

// Custom components
import { Card, Spinner, Acordion } from "../../../../global";
import { CForm } from "./CatalogoSucursal/CForm";
import { ContratoCIE } from "./CatalogoSucursal/ContratoCIE";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import * as FnPersona from "../../personas/CompAdministracion/CompPersona/Funciones";
import { iUI } from "../../../../../interfaces/ui/iUI";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
};

const CatalogoSucursal = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const DatosDefecto = {
    Nombre: "",
    distribuidorIdMin: 0,
    distribuidorIdMax: 0,
    importeLimiteCreditoDefault: 0,
    tabuladorTipoID: 0,
    empresaId: 0,
    ZonaID: 0,
    ProductoID: 0,
    SucursalFisicaID: 0,
    ProductosIds: [],
    NombreCompleto: "",
    PersonaResponsableId: 0,
    SucursalOrigenID: 0,
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const DatosContrato = {
    ProductoID: 0,
    SucursalID: 0,
    Sucursal: "",
    Producto: "",
    ContratoCIE: "",
  };
  const optPersona: any[] = [];
  const optSucOrigen: any[] = [];
  const Personas: any[] = [];
  const DatosPersona: {} = {};
  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    Filtro: "",
    Cargando: true,
    Error: false,
    Form: {
      Mostrar: false,
      Datos: DatosDefecto,
      Id: undefined,
    },
    ShowContrato: false,
    DatosContrato,
    optPersona,
    optSucOrigen: optSucOrigen,
    Personas,
    DatosPersona,
    personaID: 0,
  });

  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGet(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Cargando: false,
          Error: false,
          Datos: respuesta,
        }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        // }
      });
  };

  const fnGetPersona = (
    PersonaID: number,
    NombreCompleto: string,
    isSucursal: boolean,
    callback: any
  ) => {
    let Datos = { PersonaID, NombreCompleto, isSucursal };

    FnPersona.FNObtenerPersonaSAC(props.oidc, Datos)
      .then((respuesta: any) => {
        var personas = respuesta.map((valor: any) => {
          var obj = { value: valor.PersonaID, label: valor.NombreCompleto };
          return obj;
        });
        setState((s) => ({ ...s, optPersona: personas, Personas: respuesta }));
        callback(personas);
      })
      .catch(() => {
        setState((s) => ({ ...s, optPersona: [], Personas: [] }));

        callback([]);
      });
  };

  const fnGetDatosPersona = (PersonaID?: number) => {
    let persona = state.Personas.find((Dato) => Dato.PersonaID === PersonaID);
    setState((s) => ({
      ...s,
      DatosPersona: persona ? persona : {},
      PersonaID: PersonaID as number,
    }));
  };

  useEffect(() => {
    fnGetDatosPersona(state.Form.Datos.PersonaResponsableId);
  }, [state.Form.Datos.PersonaResponsableId]);

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { 
        name: "Nombre", 
        selector: "Nombre", 
        sortable: true, 
        minWidth: "150px",
        wrap: true,
      },
      // { name: 'Empresa', selector: 'empresaNombre', sortable: true, minWidth: '200px' },
      {
        name: "Sucursal Fisica",
        selector: "SucursalFisica",
        sortable: true,
        minWidth: "150px",
        wrap: true,
        center: true,
      },
      {
        name: "Zona",
        selector: "ZonaNombre",
        sortable: true,
        minWidth: "60px",
        wrap: true,
      },
      {
        name: "Socia Min",
        selector: "distribuidorIdMin",
        sortable: true,
        minWidth: "60px",
        wrap: true, 
      },
      {
        name: "Socia Max",
        selector: "distribuidorIdMax",
        sortable: true,
        minWidth: "90px",
        wrap: true,
      },
      {
        name: "Limite Credito",
        selector: "importeLimiteCreditoDefault",
        sortable: true,
        minWidth: "90px",
        wrap: true, 
        center: true,
      },
      { 
        name: "Tipo Tabulador", 
        selector: "tabuladorTipoDesc", 
        sortable: true,
        minWidth: "110px",
        wrap: true, 
        center: true,
      },
      {
        name: "Encargado",
        selector: "NombreCompleto",
        sortable: true,
        minWidth: "150px",
        wrap: true, 
        center: true,
      },
      {
        name: "Empresa OrigenID",
        selector: "id_empresa",
        sortable: true,
        minWidth: "90px",
        wrap: true,
        center: true,
        cell: (props) => <span>{props.id_empresa == null ? 'N/A' : props.id_empresa}</span>
      },
      {
        name: "Sucursal OrigenID",
        selector: "id_sucursal",
        sortable: true,
        minWidth: "90px",
        wrap: true,
        center: true,
        cell: (props) => <span>{props.id_sucursal == null ? 'N/A' : props.id_sucursal}</span>
      },
      {
        name: "OrigenID",
        selector: "id_origen",
        sortable: true,
        minWidth: "90px",
        wrap: true,
        center: true,
        cell: (props) => <span>{props.id_origen == null ? 'N/A' : props.id_origen}</span>
      },
      {
        name: "Sistema Origen",
        selector: "sistema",
        sortable: true,
        minWidth: "90px",
        wrap: true,
        center: true,
        cell: (props) => <span>{props.sistema == null ? 'N/A' : props.sistema}</span>
      },
      {
        name: "Permiso Rango Fechas",
        selector: "PermisoRangoFecha",
        sortable: true,
        minWidth: "100px",
        wrap: true,
        center: true,
        cell: (props) => <span>{props.PermisoRangoFecha == null ? 'N/A' : props.PermisoRangoFecha}</span>
      },
      {
        name: "Productos",
        selector: "Productos",
        sortable: true,
        minWidth: "260px",
        center: true,
        cell: (props) => (
          <Acordion TabSelecionado={""}>
            <Acordion.Tab
              key={"prod_" + props.SucursalID}
              Identificador={"prod_" + props.SucursalID}
              Titulo={"Mostrar "}
            >
              <div>
                {props.Productos.length < 1 && "Sin Productos"}
                <ul className="list-group list-group-flush">
                  {props.Productos.length > 0 && (
                    <li className="list-group">
                      <div className="columns">
                        <div className="column is-6">
                          <strong>Descripción</strong>
                        </div>
                        <div className="column is-6">
                          <strong>Contrato</strong>
                        </div>
                      </div>
                    </li>
                  )}
                  {props.Productos.map((d: any, dId: any) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="columns">
                        <div className="column is-6">{d.Producto}</div>
                        <div className="column is-5">{d.ContratoCIE}</div>
                        <div className="column is-1">
                          <button
                            className="asstext"
                            type={"button"}
                            onClick={() => {
                              console.log("ProductoID: ", d.ProductoID);

                              setState((s) => ({
                                ...s,
                                ShowContrato: true,
                                DatosContrato: {
                                  ProductoID: d.ProductoID,
                                  SucursalID: props.SucursalID,
                                  Sucursal: props.Nombre,
                                  Producto: d.Producto,
                                  ContratoCIE: d.ContratoCIE,
                                },
                              }));
                            }}
                          >
                            <FaPencilAlt />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Acordion.Tab>
          </Acordion>
        ),
      },
      {
        name: "Acciones",
        sortable: false,
        minWidth: "70px",
        center: true,
        cell: (props) => (
          <button
            className="asstext"
            type={"button"}
            onClick={() => {
              console.log("props: ", props);

              setState((s) => ({
                ...s,
                Form: {
                  ...s.Form,
                  Mostrar: true,
                  Datos: {
                    Nombre: props.Nombre,
                    distribuidorIdMin: props.distribuidorIdMin,
                    distribuidorIdMax: props.distribuidorIdMax,
                    importeLimiteCreditoDefault:
                      props.importeLimiteCreditoDefault,
                    tabuladorTipoID: props.tabuladorTipoID,
                    empresaId: props.empresaId,
                    ZonaID: props.ZonaID,
                    ProductoID: props.ProductoID,
                    SucursalFisicaID: props.SucursalFisicaID,
                    ProductosIds: props.ProductosIds,
                    NombreCompleto: props.NombreCompleto,
                    PersonaResponsableId: props.PersonaResponsableId,
                    PermisoRangoFecha: props.PermisoRangoFecha,
                    SucursalOrigenID: props.SucursalOrigenID,
                  },
                  Id: props.SucursalID,
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
          Nombre: "",
          distribuidorIdMin: 0,
          distribuidorIdMax: 0,
          importeLimiteCreditoDefault: 0,
          tabuladorTipoID: 0,
          empresaId: 0,
          ZonaID: 0,
          ProductoID: 0,
          SucursalFisicaID: 0,
          ProductosIds: [],
          NombreCompleto: "",
          PersonaResponsableId: 0,
          SucursalOrigenID: 0,
        },
      },
    });

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.SucursalID === item.SucursalID ? item : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          Nombre: "",
          distribuidorIdMin: 0,
          distribuidorIdMax: 0,
          importeLimiteCreditoDefault: 0,
          tabuladorTipoID: 0,
          empresaId: 0,
          ZonaID: 0,
          ProductoID: 0,
          SucursalFisicaID: 0,
          ProductosIds: [],
          NombreCompleto: "",
          PersonaResponsableId: 0,
          SucursalOrigenID: 0,
        },
      },
    });

  const cbContratoCIE = (item: any) =>
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.SucursalID === item.SucursalID ? item : Dato
      ),
      ShowContrato: false,
      DatosContrato: DatosContrato,
    });

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  const fnCancelarContratoCIE = () =>
    setState({ ...state, ShowContrato: false, DatosContrato: DatosContrato });

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Administrar Sucursales">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  {/* <div className="text-end">
                                        <button type="button" className="btn btn-secondary btn-sm mb-2"
                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                        >
                                            Agregar
                                        </button>
                                    </div> */}
                  <DataTable
                    subHeader
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar Sucursal"
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
                    keyField={"SucursalID"}
                    defaultSortField={"SucursalID"}
                    columns={Columns}
                  />
                  <ModalWin open={state.Form.Mostrar}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {state.Form.Id ? "Editar Sucursal" : "Agregar Sucursal"}
                      </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      <CForm
                        oidc={props.oidc}
                        ui={props.ui}
                        initialValues={state.Form.Datos}
                        Id={state.Form.Id}
                        cbActualizar={cbActualizar}
                        cbGuardar={cbAgregar}
                        fnCancelar={fnCancelar}
                        optPersona={state.optPersona}
                       // gnGetSucOrigen={fnGetSucursalOrigen}
                        fnGetPersona={fnGetPersona}
                        DatosPersona={state.DatosPersona}
                      />
                    </ModalWin.Body>
                  </ModalWin>

                  <ModalWin open={state.ShowContrato}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {"Editar Contrato CIE"}
                      </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      <ContratoCIE
                        oidc={props.oidc}
                        initialValues={state.DatosContrato}
                        // Id={state.Form.Id}
                        cbActualizar={cbContratoCIE}
                        // cbGuardar={cbAgregar}
                        fnCancelar={fnCancelarContratoCIE}
                      />
                    </ModalWin.Body>
                  </ModalWin>
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
  ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoSucursal);
