import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CreditoProducto/Funciones";
import * as FnTasasTipos from "./CreditoTasaTipo/Funciones";
import * as FnEmpresas from "../../general/CompGeneral/Empresa/Funciones";
import * as FnAgrupacion from "../../bancos/CompBancos/BancoAgrupacion/Funciones";
import * as FnCuentasContables from "../../tesoreria/CompTesoreria/CatalogoCuentasContables/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from "react-icons/fa";

// Custom components
import { Card, Spinner, ImgViewer } from "../../../../global";
import { CForm } from "./CreditoProducto/CForm";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import * as FnPersona from "../../catalogos/CompCatalogos/CatalogoDirectores/Funciones";
import { DescripcionDistribuidor } from "../../../../../global/variables";

type CatalogosType = {
  oidc: IOidc;
};

const CreditoProducto = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const DatosDefecto = {
    EmpresaId: 0,
    Producto: "",
    Activo: false,
    EsOperativo: false,
    TasaTipoId: "",
    TipoProductoID: 0,
    DiasPago: "",
    DiaParaCorte: 0,
    PrioridadCobranza: 0,
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
    AplicaIVAInteres: false,
    AplicaIVASeguro: false,
    AplicaIVAManejoCuenta: false,
    AdicProductoId: "",
    CuentaMaestraId: 0,
    CtaCapitalId: "",
    CtaInteresNormalId: "",
    CtaInteresMoraId: "",
    CtaIvaId: "",
    CtaInteresNormDeudorId: "",
    CtaInteresNormAcreedorId: "",
    CtaInteresMoraDeudorId: "",
    CtaInteresMoraAcreedorId: "",
    Logo: "",
    file: null,
    NombreCompleto: "",
    PersonaResponsableId: 0,
    DiasCaducidadVale: 0,
    DiasCaducidadFolio: 0,
    AplicaComision: false,
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optEmpresas: any[] = [];
  const optTiposTasas: any[] = [];
  const optTiposProductos: any[] = [];
  const optProductos: any[] = [];
  const optAgrupaciones: any[] = [];
  const optCuentasContables: any[] = [];
  const optPersona: any[] = [];
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
    optProductos,
    optEmpresas,
    optTiposTasas,
    optTiposProductos,
    optAgrupaciones,
    optCuentasContables,

    isUpdate: false,
    optPersona,
    Personas,
    DatosPersona,
    DirectorID: 0,
  });

  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGet(props.oidc)
      .then((respuesta: any) => {
        console.log(respuesta);
        // if (isMounted.current === true) {
        var productos = respuesta.map((valor: any) => {
          var obj = { value: valor.ProductoID, label: valor.Producto };
          return obj;
        });

        setState((s) => ({
          ...s,
          Cargando: false,
          Error: false,
          Datos: respuesta,
          optProductos: productos,
        }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Cargando: false,
          Error: true,
          Datos: [],
          optProductos: [],
        }));
        // }
      });
  };

  const FnGetTasasTipos = () => {
    FnTasasTipos.FNGet(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var tasatipo = respuesta.map((valor: any) => {
          var obj = { value: valor.TasaTipoId, label: valor.TasaTipo };
          return obj;
        });

        setState((s) => ({ ...s, optTiposTasas: tasatipo }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, optTiposTasas: [] }));
        // }
      });
  };

  const FnGetProductosTipos = () => {
    Funciones.FNGetProductosTipos(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var productostipo = respuesta.map((valor: any) => {
          var obj = { value: valor.TipoProductoID, label: valor.TipoProducto };
          return obj;
        });

        setState((s) => ({ ...s, optTiposProductos: productostipo }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, optTiposProductos: [] }));
        // }
      });
  };

  const FnGetEmpresas = () => {
    FnEmpresas.FNGet(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var empresas = respuesta.map((valor: any) => {
          var obj = { value: valor.empresaId, label: valor.empresaNombre };
          return obj;
        });

        setState((s) => ({ ...s, optEmpresas: empresas }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, optEmpresas: [] }));
        // }
      });
  };

  const FnGetAgrupacion = () => {
    FnAgrupacion.FNGet(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var agrupaciones = respuesta.map((valor: any) => {
          var obj = { value: valor.AgrupacionID, label: valor.Descripcion };
          return obj;
        });

        setState((s) => ({ ...s, optAgrupaciones: agrupaciones }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, optAgrupaciones: [] }));
        // }
      });
  };

  const FnGetCuentasContables = () => {
    FnCuentasContables.FNGetContable(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var CuentasContables = respuesta.map((valor: any) => {
          var obj = { value: valor.CuentaID, label: valor.Nombre };
          return obj;
        });

        setState((s) => ({ ...s, optCuentasContables: CuentasContables }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, optCuentasContables: [] }));
        // }
      });
  };

  const fnGetPersona = (
    PersonaID: number,
    NombreCompleto: string,
    callback: any
  ) => {
    let Datos = { PersonaID, NombreCompleto };
    FnPersona.getByNameProd(props.oidc, Datos)
      .then((respuesta: any) => {
        var personas = respuesta.map((valor: any) => {
          var obj = { value: valor.DirectorID, label: valor.NombreCompleto };
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

  const fnGetDatosPersona = (DirectorID?: number) => {
    let persona = state.Personas.find((Dato) => Dato.DirectorID === DirectorID);
    setState((s) => ({
      ...s,
      DatosPersona: persona ? persona : {},
      DirectorID: DirectorID as number,
    }));
  };

  useEffect(() => {
    fnGetDatosPersona(state.Form.Datos.PersonaResponsableId);
  }, [state.Form.Datos.PersonaResponsableId]);

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { name: "Id", selector: "ProductoID", sortable: true },
      { name: "Producto", selector: "Producto", sortable: true, wrap: true },
      {
        name: "Empresa",
        selector: "Empresa.empresaNombre",
        sortable: true,
        wrap: true,
      },
      {
        name: "Activo",
        selector: "Activo",
        sortable: true,
        cell: (props) => <span>{props.Activo ? "SI" : "No"}</span>,
      },
      { name: "Tipo de Tasa", selector: "TasaTipo.TasaTipo", sortable: true },
      { name: "Dias de Pago", selector: "DiasPago", sortable: true },
      { name: "Dia Para Corte", selector: "DiaParaCorte", sortable: true },
      {
        name: "Prioridad Cobranza",
        selector: "PrioridadCobranza",
        sortable: true,
      },
      {
        name: `Requiere ${DescripcionDistribuidor(1)}`,
        selector: "RequiereDistribuidor",
        sortable: true,
        cell: (props) => (
          <span>{props.RequiereDistribuidor ? "SI" : "No"}</span>
        ),
      },
      {
        name: "Requiere Grupo",
        selector: "RequiereGrupo",
        sortable: true,
        cell: (props) => <span>{props.RequiereGrupo ? "SI" : "No"}</span>,
      },
      {
        name: "Valida Disponible",
        selector: "ValidaDisponible",
        sortable: true,
        cell: (props) => <span>{props.ValidaDisponible ? "SI" : "No"}</span>,
      },
      {
        name: "Restructura",
        selector: "Restructura",
        sortable: true,
        cell: (props) => <span>{props.Restructura ? "SI" : "No"}</span>,
      },
      {
        name: "Genera Desembolso",
        selector: "Genera Desembolso",
        sortable: true,
        cell: (props) => <span>{props.GeneraDesembolso ? "SI" : "No"}</span>,
      },
      {
        name: "Seguro Financiado",
        selector: "SeguroFinanciado",
        sortable: true,
        cell: (props) => <span>{props.SeguroFinanciado ? "SI" : "No"}</span>,
      },
      {
        name: "Canje",
        selector: "Canje",
        sortable: true,
        cell: (props) => <span>{props.Canje ? "SI" : "No"}</span>,
      },
      {
        name: "Desglosar IVA",
        selector: "DesglosarIVA",
        sortable: true,
        cell: (props) => <span>{props.DesglosarIVA ? "SI" : "No"}</span>,
      },
      { name: "Edad Mínima", selector: "EdadMinima", sortable: true },
      { name: "Edad Máxima", selector: "EdadMaxima", sortable: true },
      {
        name: "Capital al Final",
        selector: "CapitalAlFinal",
        sortable: true,
        cell: (props) => <span>{props.CapitalAlFinal ? "SI" : "No"}</span>,
      },
      {
        name: "Cargo Financiado",
        selector: "CargoFinanciado",
        sortable: true,
        cell: (props) => <span>{props.CargoFinanciado ? "SI" : "No"}</span>,
      },
      {
        name: "Cargo al Inicio",
        selector: "CargoAlInicio",
        sortable: true,
        cell: (props) => <span>{props.CargoAlInicio ? "SI" : "No"}</span>,
      },
      {
        name: "Activa Crédito",
        selector: "ActivaCredito",
        sortable: true,
        cell: (props) => <span>{props.ActivaCredito ? "SI" : "No"}</span>,
      },
      {
        name: "Créditos Liquidados",
        selector: "CreditosLiquidadosReq",
        sortable: true,
        cell: (props) => (
          <span>{props.CreditosLiquidadosReq ? "SI" : "No"}</span>
        ),
      },
      {
        name: "Permiso Especial",
        selector: "PermisoEspecial",
        sortable: true,
        cell: (props) => <span>{props.PermisoEspecial ? "SI" : "No"}</span>,
      },
      {
        name: "Validar Condiciones",
        selector: "ValidarCondiciones",
        sortable: true,
        cell: (props) => <span>{props.ValidarCondiciones ? "SI" : "No"}</span>,
      },
      { name: "Fecha Registro", selector: "FhRegitro", sortable: true },
      { name: "Fecha Modificación", selector: "FhMoficiacion", sortable: true },
      {
        name: "Aplica IVA Interes",
        selector: "AplicaIVAInteres",
        sortable: true,
        cell: (props) => <span>{props.AplicaIVAInteres ? "SI" : "No"}</span>,
      },
      {
        name: "Aplica IVA Seguro",
        selector: "AplicaIVASeguro",
        sortable: true,
        cell: (props) => <span>{props.AplicaIVASeguro ? "SI" : "No"}</span>,
      },
      {
        name: "Aplica IVA Manejo Cuenta",
        selector: "AplicaIVAManejoCuenta",
        sortable: true,
        cell: (props) => (
          <span>{props.AplicaIVAManejoCuenta ? "SI" : "No"}</span>
        ),
      },
      {
        name: "Encargado",
        selector: "NombreCompleto",
        sortable: true,
        minWidth: "300px",
      },
      {
        name: "Dias cad vale",
        selector: "DiasCaducidadVale",
        sortable: true,
        minWidth: "200px",
        cell: (props) => (
          <span>
            {
              //props.DiasCaducidadVale == 29 && (
              <span>{Math.round(props.DiasCaducidadVale)}</span>
              //)
            }
          </span>
        ),
      },
      {
        name: "Dias cad folio",
        selector: "DiasCaducidadFolio",
        sortable: true,
        minWidth: "200px",
        cell: (props) => (
          <span>
            {
              //props.DiasCaducidadFolio > 0 && (
              <span>{Math.round(props.DiasCaducidadFolio)}</span>
              //)
            }
          </span>
        ),
      },
      {
        name: "Logo",
        selector: "Logo",
        cell: (props) => (
          <ImgViewer
            imgSrc={props.Logo}
            noToolbar={true}
            zIndex={1500}
            typeByte={true}
            maxWidth={40}
            maxHeight={50}
          />
        ),
        // <input type="image" alt='' style={{ maxWidth: 40, maxHeight: 50 }} src={props.LogoImg} onClick={() => { setState(s => ({ ...s, openImg: true, imgSrc: props.LogoImg })) }} />
      },
      {
        name: "Acciones",
        sortable: false,
        cell: (props) => (
          <button
            title="Editar"
            className="asstext"
            type={"button"}
            onClick={() => {
              console.log(props);
              setState((s) => ({
                ...s,
                Form: {
                  ...s.Form,
                  Mostrar: true,
                  Datos: {
                    EmpresaId: props.EmpresaId,
                    Producto: props.Producto,
                    Activo: props.Activo,
                    EsOperativo: props.EsOperativo,
                    AplicaComision: props.AplicaComision,
                    TasaTipoId: props.TasaTipoId,
                    TipoProductoID: props.TipoProductoID,
                    DiasPago: props.DiasPago,
                    DiaParaCorte: props.DiaParaCorte,
                    PrioridadCobranza: props.PrioridadCobranza,
                    RequiereDistribuidor: props.RequiereDistribuidor,
                    RequiereGrupo: props.RequiereGrupo,
                    ValidaDisponible: props.ValidaDisponible,
                    Restructura: props.Restructura,
                    GeneraDesembolso: props.GeneraDesembolso,
                    SeguroFinanciado: props.SeguroFinanciado,
                    Canje: props.Canje,
                    DesglosarIVA: props.DesglosarIVA,
                    EdadMinima: props.EdadMinima,
                    EdadMaxima: props.EdadMaxima,
                    CapitalAlFinal: props.CapitalAlFinal,
                    CargoFinanciado: props.CargoFinanciado,
                    CargoAlInicio: props.CargoAlInicio,
                    ActivaCredito: props.ActivaCredito,
                    CreditosLiquidadosReq: props.CreditosLiquidadosReq,
                    PermisoEspecial: props.PermisoEspecial,
                    ValidarCondiciones: props.ValidarCondiciones,
                    AplicaIVAInteres: props.AplicaIVAInteres,
                    AplicaIVASeguro: props.AplicaIVASeguro,
                    AplicaIVAManejoCuenta: props.AplicaIVAManejoCuenta,
                    AdicProductoId: props.AdicProductoId
                      ? props.AdicProductoId
                      : "",
                    CuentaMaestraId: props.CuentaMaestraId,
                    CtaCapitalId: props.CtaCapitalId ? props.CtaCapitalId : "",
                    CtaInteresNormalId: props.CtaInteresNormalId
                      ? props.CtaInteresNormalId
                      : "",
                    CtaInteresMoraId: props.CtaInteresMoraId
                      ? props.CtaInteresMoraId
                      : "",
                    CtaIvaId: props.CtaIvaId ? props.CtaIvaId : "",
                    CtaInteresNormDeudorId: props.CtaInteresNormDeudorId
                      ? props.CtaInteresNormDeudorId
                      : "",
                    CtaInteresNormAcreedorId: props.CtaInteresNormAcreedorId
                      ? props.CtaInteresNormAcreedorId
                      : "",
                    CtaInteresMoraDeudorId: props.CtaInteresMoraDeudorId
                      ? props.CtaInteresMoraDeudorId
                      : "",
                    CtaInteresMoraAcreedorId: props.CtaInteresMoraAcreedorId
                      ? props.CtaInteresMoraAcreedorId
                      : "",
                    Logo: props.Logo,
                    DiasCaducidadVale: props.DiasCaducidadVale,
                    DiasCaducidadFolio: props.DiasCaducidadFolio,

                    file: null,
                    NombreCompleto: props.NombreCompleto,
                    PersonaResponsableId: props.PersonaResponsableId,
                  },
                  Id: props.ProductoID,
                },
                isUpdate: true,
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
    if (isMounted.current === true) {
      FNGetLocal();
      FnGetTasasTipos();
      FnGetProductosTipos();
      FnGetEmpresas();
      FnGetAgrupacion();
      FnGetCuentasContables();
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
  const cbAgregar = (item: any) =>
    setState({
      ...state,
      Datos: [...state.Datos, item],
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: DatosDefecto,
      },
      isUpdate: false,
    });

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState((s) => ({
      ...s,
      Datos: state.Datos.map((Dato) =>
        Dato.ProductoID === item.ProductoID ? item : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: DatosDefecto,
      },
      isUpdate: false,
    }));

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState((s) => ({
      ...s,
      Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto },
      isUpdate: false,
    }));

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Administrar Productos">
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
                              placeholder="Buscar productos"
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
                              title="Nuevo"
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => {
                                setState({
                                  ...state,
                                  Form: {
                                    Mostrar: true,
                                    Datos: DatosDefecto,
                                    Id: undefined,
                                  },
                                  isUpdate: false,
                                });
                              }}
                            >
                              <FaPlus />
                            </button>
                            <button
                              title="Refrescar"
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
                    keyField={"ProductoID"}
                    defaultSortField={"ProductoID"}
                    columns={Columns}
                  />
                  <ModalWin open={state.Form.Mostrar} xlarge={true}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {state.Form.Id ? "Editar Producto" : "Agregar Producto"}
                      </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      <CForm
                        oidc={props.oidc}
                        initialValues={state.Form.Datos}
                        Id={state.Form.Id}
                        optEmpresas={state.optEmpresas}
                        optTiposTasas={state.optTiposTasas}
                        optTiposProductos={state.optTiposProductos}
                        optProductos={state.optProductos}
                        optAgrupaciones={state.optAgrupaciones}
                        optCuentasContables={state.optCuentasContables}
                        cbActualizar={cbActualizar}
                        cbGuardar={cbAgregar}
                        fnCancelar={fnCancelar}
                        optPersona={state.optPersona}
                        fnGetPersona={fnGetPersona}
                        DatosPersona={state.DatosPersona}
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
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreditoProducto);
