import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./Funciones";
import * as FnBanco from "../../../bancos/CompBancos/BancoBanco/Funciones";
import * as FnVariables from "../../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCreditCard } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../../global";
import { CForm } from "./CForm";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../../global/functions";
import { toast } from "react-toastify";
import { number } from "yup";
import { PERMISO, usePuedeAgregarDatoBancario } from "../../../../../hooks/DesabilitarInputBancos";

type CatalogosType = {

  oidc: IOidc;
  personaID?: number;
  PersonaID: number;
  cbGuardar(item: any): any;
  Listo?: boolean;
};

const PersonasDatosBancarios = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const DatosDefecto = {
    cveBancoRef: 0,
    TelefonoMovil: 0,
    telefonia: 0,
    clabe: "",
    cuenta: "",
    tarjeta: "",
    codigo: 0,
    // DatosBancarios: []
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optBancos: any[] = [];
  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    Filtro: "",
    Cargando: true,
    Error: false,
    Form: DatosDefecto,
    optBancos,
    PersonaID: props.PersonaID,
    oidc: props.oidc,
    SMS: "",
  });

  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));

    let Datos = {
      personaID: props.PersonaID,
      datoTipoID: 0,
      datoBancario: "",
    };

    Funciones.FNGet(props.oidc, Datos)
      .then((respuesta: any) => {
        let data = {
          cveBancoRef: respuesta.cveBancoRef,
          TelefonoMovil: respuesta.TelefonoMovil,
          telefonia: 0,
          clabe: "",
          cuenta: "",
          tarjeta: respuesta.datoBancario,
          codigo: 0,
        };  

        setState((s) => ({
          ...s,
          Cargando: false,
          Error: false,
          Datos: respuesta.bancos,
          Form: data,
        }));
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          Cargando: false,
          Error: true,
          Datos: [],
          Form: DatosDefecto,
        }));
      });
  };

  const FnGetBancos = () => {
    FnBanco.FNGetProd(props.oidc)
      .then((respuesta: any) => {
        var bancos = respuesta.map((valor: any) => {
          var obj = { value: valor.BancoID, label: valor.Nombre };
          return obj;
        });

        setState((s) => ({ ...s, optBancos: bancos }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optBancos: [] }));
      });
  };

  const FnGetVariable = (Id: number, varName: string) => {
    FnVariables.FNGet(props.oidc, { Id, varName })
      .then((respuesta: any) => {
        setState((s) => ({ ...s, SMS: respuesta.varValue }));
      })
      .catch(() => {
        setState((s) => ({ ...s, SMS: "" }));
      });
  };

  const FNGetPdf = (values: any) => {
    let Datos = {
      ...values,
      datoTipoID: 0,
      datoBancario: "",
    };

    // setState(s => ({ ...s, Cargando: true }))
    Funciones.FNPdf(props.oidc, Datos)
      .then((respuesta: any) => {
        const file = new Blob([respuesta], { type: "application/pdf" });

        // const fileURL = URL.createObjectURL(file);

        // window.open(fileURL);
        const fileURL = URL.createObjectURL(file);
        const enlaceTemporal = document.createElement("a");
        enlaceTemporal.href = fileURL;
        enlaceTemporal.target = "_blank";
        enlaceTemporal.style.display = "none";

        document.body.appendChild(enlaceTemporal);

        enlaceTemporal.click();

        setTimeout(() => {
          // Imprimir el documento
          // window.print();
        }, 1000);

        // if (isMounted.current === true) {
        // setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
        // }
      })
      .catch(() => {
        toast.error("Error al generar el documento");
      });
  };

//Permisos
  const puedeAgregar = props.personaID ? usePuedeAgregarDatoBancario(PERMISO.InputBancosPerfilSocia, props.personaID) : false;
  // const deshabilitar = !puedeAgregar;


  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { name: "Banco", selector: "Nombre", sortable: true },
      {
        name: "Acciones",
        sortable: false,
        cell: (props) => (
          <button
            title="Editar"
            className="asstext"
            type={"button"}
            onClick={() => {
              let data = {
                cveBancoRef: props.BancoID,
                telefonia: 0,
                clabe: "",
                cuenta: "",
                tarjeta: "",
                codigo: 0,
              };

              let Datos = {
                personaID: state.PersonaID,
                cveBancoRef: props.BancoID,
                datoTipoID: 0,
                datoBancario: "",
              };

              Funciones.FNGet(state.oidc, Datos)
                .then((respuesta: any) => {
                  respuesta.map((valor: any) => {
                    if (valor.datoTipoID == 1) data.clabe = valor.datoBancario;
                    if (valor.datoTipoID == 2)
                      data.tarjeta = valor.datoBancario;
                    if (valor.datoTipoID == 3) data.cuenta = valor.datoBancario;
                  });

                  setState((s) => ({
                    ...s,
                    Form: { ...data, TelefonoMovil: s.Form.TelefonoMovil },
                  }));
                })
                .catch(() => {
                  setState((s) => ({
                    ...s,
                    Form: { ...data, TelefonoMovil: 0 },
                  }));
                });
            }}
          >
           {/* {!puedeAgregar && (
            <FaPencilAlt />
          )} */}
          </button>
        ),
      },
    ];
    return colRet;
  }, [puedeAgregar]);

  React.useEffect(() => {
    if (isMounted.current === true) {
      FNGetLocal();
      FnGetVariable(0, "DATOS_BANCARIOS_REQUIERE_SMS");
    }
    FnGetBancos();
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
  // const cbAgregar = (item: any) =>
  //     setState({
  //         ...state, Datos: [...state.Datos, item], Form: {
  //             ...state.Form, Mostrar: false,
  //             Datos: DatosDefecto
  //         }
  //     })

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState((s) => ({
      ...s,
      Datos: state.Datos.map((Dato) =>
        Dato.ProductoID === item.ProductoID &&
          Dato.SucursalId === item.SucursalId
          ? item
          : Dato
      ),
      Form: DatosDefecto,
    }));

  /** funcion para cancelar la forma */
  const fnCancelar = () => setState((s) => ({ ...s, Form: DatosDefecto }));

  
  return (
    <Card Title="">
      <Card.Body>
        <Card.Body.Content>
          {/* {state.Cargando && <Spinner />}
                    {state.Error && <span>Error al cargar los datos...</span>}
                    {!state.Cargando && !state.Error && */}
          <div>
            <DataTable
              // subHeader
              // subHeaderComponent=
              // {
              //     <div className="row">
              //         <div className="col-sm-12">
              //             <div className="input-group mb-3">
              //                 <input type="text" className="form-control" placeholder="Buscar sucursal condición" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
              //                 <span className="input-group-text"><FaSearch /> </span>
              //                 <button className="btn btn-outline-secondary" type="button"
              //                     onClick={() => {
              //                         setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, ProductoID: undefined, SucursalId: undefined }})
              //                     }
              //                 }
              //                 ><FaPlus /></button>
              //                 <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
              //             </div>
              //         </div>
              //     </div>
              // }
              data={state.DatosMostrar}
              striped
              // pagination
              dense
              noHeader
              responsive
              keyField={"BancoID"}
              defaultSortField={"BancoID"}
              columns={Columns}
            />
            <br />
            {/* <ModalWin open={state.Form.Mostrar} large={true}>
                                <ModalWin.Header>
                                    <h5 className={MODAL_TITLE_CLASS}>
                                        {(state.Form.ProductoID  && state.Form.SucursalId) ? "Editar Relación Sucursal - Condición" : "Agregar Relación Sucursal - Condición"}
                                    </h5>
                                </ModalWin.Header>
                                <ModalWin.Body> */}

            <CForm
              oidc={props.oidc}
              personaID={props.PersonaID}
              initialValues={state.Form}
              optBancos={state.optBancos}
              optTelefonia={[
                { value: 1, label: "TELCEL" },
                { value: 2, label: "MOVISTAR" },
                { value: 3, label: "AT&T" },
              ]}
              // cbActualizar={cbActualizar}
              cbGuardar={props.cbGuardar}
              fnGetPdf={FNGetPdf}
              fnCancelar={fnCancelar}
              SMS={state.SMS}
              Listo={props.Listo}
            />
            {/* </ModalWin.Body>
                            </ModalWin> */}
          </div>
        </Card.Body.Content>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonasDatosBancarios);
