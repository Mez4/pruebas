import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CustomFieldText, Spinner, Card } from "../../../../../global";
import * as Funciones from "./Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import { toast } from "react-toastify";

import DataTable, { IDataTableColumn } from "react-data-table-component";
import { FaPencilAlt, FaPlus, FaSearch } from "react-icons/fa";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";

import { CForm } from "../CatalogoGestoresCobranza/CForm";
import { CFormM } from "../CatalogoGestoresCobranza/CFormM";

// import { AgregarConPersona } from '../../../Prospeccion/CompProspeccion/AgregarConPersona'

import { AgregarConPersonaGestor } from "./AgregarConPersonaGestor";
import { error } from "console";

type CFormType = {
  oidc: IOidc;
  Id?: number;
  optPersonas: { value: number; label: string }[];
  initialValues: {
    PersonaID: number;
    NombreCompleto: string;
    MesaCobranzaID: number;
    mesaCobranza: string;
    Activo: boolean;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  fnCFormConfirmar(): any;
  FNGetLocal(): any;
};

export const CFormConfirmar = (props: CFormType) => {
  let isMounted = React.useRef(true);
  console.log(props)

  //const DatosDefecto = { /*GestorCobranzaID: 0,*/ PersonaID: 0, MesaCobranzaID: 0, Activo: true }
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optProdMesa: any[] = [];
  const optPersonas: any[] = [];
  const [mesaCob, setMesaCob] = useState([])
  const [gestor, setGestor] = useState([])
  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    optProdMesa,
    optPersonas,
    Filtro: "",
    Cargando: true,
    Error: false,
    valida:true,
    Mostrar: false,
    MostrarM: false,
    AgregarConPersonaGestor: false,
    Form: {
      Mostrar: false,
      // Datos: DatosDefecto,
      Id: undefined,
    },
  });

  const fnCancelar = () => {
    props.fnCFormConfirmar(); // Abre la forma CFormConfirmar
    setState({
      ...state,
      Form: { ...state.Form, Mostrar: false },
      AgregarConPersonaGestor: false,
    }); //Cierra la forma de CForm
  };
  const fnCancelarm = () => {
    props.fnCFormConfirmar(); // Abre la forma CFormConfirmar
    setState({
      ...state,MostrarM: false,
      AgregarConPersonaGestor: false,
    }); //Cierra la forma de CForm
  };
  const FnAbrirCForm = () => {
    props.fnCancelar(); // Cierra la forma de CFormConfirmar
    setState({ ...state, Form: { Mostrar: true, Id: undefined } });
   
  };
  const FnAbrirCFormM = () => {
    props.fnCancelar();
    setState((s) => ({...s,MostrarM:true, Item:undefined}))
   

  };
  const FnAbrirFormaAgregar = () => {
    props.fnCancelar(); // Cierra la forma de CF  ormConfirmar
    setState((s) => ({ ...s, AgregarConPersonaGestor: true, Item: undefined }));
  };

  useEffect(() => {
    Funciones.FNGetMesa(props.oidc).then((respuesta: any) => {
      var mesaCob = respuesta.map((valor:any) => {
          var obj = {value:valor.MesaCobranzaID, label:valor.Nombre}
          return obj;
      });
      setMesaCob(mesaCob);
       console.log('Se logro', mesaCob);
  })
  .catch ((error:any) => {
      console.log('Error');
  })

  }, [props.oidc])


  useEffect(() => {
    setState((s) => ({ ...s }));
    Funciones.getGestoresMesa(props.oidc)
      .then((respuesta: any) => {
        var Gestores = respuesta.map((valor: any) => {
          var obj = {
            value: valor.GestorCobranzaID,
            label: [valor.NombreCompleto, ' - ', valor.ExternoDesc]
          };
          return obj;
        });
        // console.log(Gestores)
        let Gestoresregistrados = Gestores.filter((obj, pos, arr) => {
          return (
            Gestores.map((mapObj) => mapObj.value).indexOf(obj.value) === pos
          );
        });
        // console.log(Gestoresregistrados);
        setGestor(Gestoresregistrados);
      })
      .catch(() => {
        setState((s) => ({ ...s, optGestores:[] }));
      });
  }, [props.oidc])


  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape({})}
      onSubmit={() => {}}
    >
      <Form>
        {/* {state.Cargando && <Spinner />} */}
        {state.Error && <span>Error al cargar los datos...</span>}
        {/* {!state.Cargando && !state.Error && */}

        <div className={"row"}>
          <div className="col-sm-12 col-md-4">
            <div style={{ backgroundColor: "#ebefea", padding: "2em" }}>
              <div className="col text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    FnAbrirCFormM();
                    console.log('Se abrio')
                  }}
                >
                  Agregar Mesa a Gestor
                </button>
              </div>
            </div>
          </div>
          <div className={"col-sm-12 col-md-4"}>
            <div style={{ backgroundColor: "#ebefea", padding: "2em" }}>
              <div className="col text-center">
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => {
                    FnAbrirCForm();
                  }}
                >
                  Agregar Gestor Interno
                </button>
              </div>
            </div>
          </div>
          <div className={"col-sm-12 col-md-4"}>
            <div style={{ backgroundColor: "#ebefea", padding: "2em" }}>
              <div className="col text-center">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    FnAbrirFormaAgregar();
                  }}
                >
                  Agregar Gestor Externo
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-danger waves-effect waves-light"
            onClick={props.fnCancelar}
          >
            Cancelar
          </button>
        </div>

        <ModalWin open={state.Form.Mostrar} center>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>AGREGAR GESTOR</h5>
            {/* <button type="button" className="delete" onClick={fnCancelar}></button> */}
          </ModalWin.Header>
          <ModalWin.Body>
            {
              <CForm
                oidc={props.oidc}
                initialValues={props.initialValues}
                Id={state.Form.Id}
                optProdMesa={mesaCob}
                optPersonas={gestor}
                cbGuardar={props.cbGuardar}
                fnCancelar={fnCancelar}
                cbActualizar={props.cbActualizar}
                fnCerrarCformConfirmar={props.fnCancelar}
              />
            }

            {
              <AgregarConPersonaGestor
                oidc={props.oidc}
                Id={state.Form.Id}
                cbGuardar={props.cbGuardar}
                optProdMesa={mesaCob}
                fnCancelar={fnCancelar}
                mostrar={state.AgregarConPersonaGestor}
                FNGetLocal={props.FNGetLocal}
              />
            }
          </ModalWin.Body>
        </ModalWin>

        <ModalWin open={state.MostrarM} center>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>AGREGAR MESA GESTOR</h5>
            {/* <button type="button" className="delete" onClick={fnCancelar}></button> */}
          </ModalWin.Header>
        <ModalWin.Body>
            {
              <CFormM
                oidc={props.oidc}
                initialValues={props.initialValues}
                Id={state.Form.Id}
                optProdMesa={mesaCob}
                optGestores={gestor}
                cbGuardar={props.cbGuardar}
                fnCancelar={fnCancelarm}
                cbActualizar={props.cbActualizar}
                fnCerrarCformConfirmar={props.fnCancelar}
              />
            }
            </ModalWin.Body>
        </ModalWin>
      </Form>
    </Formik>
  );
};
