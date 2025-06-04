import React, { useEffect, useState } from "react";
import {
  ModalWin,
  AsistenteFormik,
  Spinner,
  ActionFieldText2,
} from "../../../../../global";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";

// Formik
// import * as Yup from 'yup'
import * as Funciones from "./Funciones";
import { FormasProspectoInteresado } from "../../../../../formas";
import { DBConfia_Prospeccion } from "../../../../../../interfaces_db/DBConfia/Prospeccion";
import moment from "moment";
import { Form, Formik } from "formik";
import yup from "../../../../../../global/yupLocale";
import { toast } from "react-toastify";

type CFormCURPType = {
  oidc: IOidc;
  Id?: number;
  Item?: any;
  ProductoID?: string;
  // Callbacks
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;

  // Modal controls
  mostrar: boolean;
};

export const AgregarConPersona = (props: CFormCURPType) => {
  const [loading, setLoading] = useState(false);
  const [curp, setCurp] = useState(1);

  const [state, setState] = useState({
    DatosGenerales: undefined,
    Forma: false,
    FormaCurp: true,
  });

  const fnCancelar = () => {
    setState((s) => ({ ...s, Forma: false }));
    props.fnCancelar();
  };

  const FNConsultarCURP_Habilitada = () => {
    Funciones.FNConsultarEstatusCURP(props.oidc)
      .then((res: any) => {
        console.log(res);

        let statusCurp = parseInt(res) === 1 ? 2 : 1;
        setCurp(statusCurp);
      })
      .catch((error: any) => {
        if (!error.response.status) toast.error(`Error: ${error.response.msj}`);
        else if (error.request) toast.error(`Error 404`);
        else toast.error(`Error al consultar el estado de CURP`);
      });
  };

  useEffect(() => {
    FNConsultarCURP_Habilitada();
  }, []);
  return (
    <>
      {!!state.FormaCurp && (
        <ModalWin zIndex={4001} open={props.mostrar} large>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>
              {props.Id ? "Editar cliente" : "Agregar cliente"}
            </h5>
          </ModalWin.Header>
          <ModalWin.Body>
            <Formik
              initialValues={{}}
              enableReinitialize
              validationSchema={yup.object().shape({
                Curp: yup
                  .string()
                  .required("OBLIGATORIO")
                  .matches(
                    /^[A-Za-z]{4}\d{6}[H,M][A-Za-z]{5}[A-Za-z\d]{2}$/i,
                    "Introduce una CURP válida"
                  ),
              })}
              onSubmit={(values: any) => {
                setLoading(true);
                var datos: any = {
                  Curp: values.Curp,
                  status: curp === 2,
                  ProductoID: props.ProductoID,
                };
                values = datos;
                Funciones.FNBuscarCurp(props.oidc, values)
                  .then((respuesta: any) => {
                    setState((s) => ({
                      ...s,
                      DatosGenerales: respuesta.data,
                      Forma: true,
                      FormaCurp: false,
                    }));
                    setLoading(false);
                  })
                  .catch((error: any) => {
                    if (error.response) toast.error(`CURP INCORRECTA`);
                    setState((s) => ({
                      ...s,
                      Forma: false,
                    }));

                    setLoading(false);
                  });
              }}
            >
              <Form>
                <div className="row">
                  <div className="col-12">
                    <ActionFieldText2
                      disabled={false}
                      label={"CURP"}
                      name={"Curp"}
                      placeholder={"CURP"}
                    />
                  </div>
                </div>
                {loading && <Spinner />}
                {!loading && (
                  <div>
                    <div className="text-end">
                      <button
                        type="reset"
                        className="btn btn-danger waves-effect waves-light"
                        onClick={props.fnCancelar}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="ms-2 btn btn-success waves-effect waves-light"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}
              </Form>
            </Formik>
          </ModalWin.Body>
        </ModalWin>
      )}
      {!!state.Forma && (
        <AgregarConPersonaForm
          oidc={props.oidc}
          cbActualizar={props.cbActualizar}
          cbGuardar={props.cbGuardar}
          fnCancelar={fnCancelar}
          mostrar={props.mostrar}
          Item={state.DatosGenerales}
          statusCurp={curp}
        />
      )}
    </>
  );
};

/** Tipo de nuestro componente */
type FormaAgregarTipo = {
  // Basico
  oidc: IOidc;
  Id?: number;
  Item?: DBConfia_Prospeccion.IProspectosDatosGenereles_VW;

  // Callbacks
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;

  // Modal controls
  mostrar: boolean;
  statusCurp?: number;
};
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */
export const AgregarConPersonaForm = (props: FormaAgregarTipo) => {
  console.log(props.Item);
  // Render our component
  return (
    <ModalWin open={props.mostrar} large>
      <ModalWin.Header>
        <h5 className={MODAL_TITLE_CLASS}>
          {props.Id ? "Editar usuario" : "Agregar usuario"}
        </h5>
      </ModalWin.Header>
      <ModalWin.Body>
        <AsistenteFormik
          MostrarPasos={true}
          Pasos={[
            FormasProspectoInteresado.FormaDatosGenerales({
              Prefijo: "ProspectoPersona_",
              Titulo: "Interesado",
              SubTitulo: "Persona Interesada",
              SexoID: props.Item?.SexoID,
              LugarNac: props.Item?.LugarNacimiento,
              AsentID: props.Item?.AsentamientoID,
              TelefonoMovil: props.Item?.TelefonoMovil,
              BC: props.statusCurp,
              oidc: props.oidc,
            }),
          ]}
          // Provisionar esta variable para mostrar datos de edicion
          Datos={{
            ProspectoPersona_ID: props.Item?.PersonaID ?? 0,
            //-----------------------------------------------------------
            ProspectoPersona_Nombre: props.Item?.Nombre ?? "",
            ProspectoPersona_ApellidoPaterno: props.Item?.ApellidoPaterno ?? "",
            ProspectoPersona_ApellidoMaterno: props.Item?.ApellidoMaterno ?? "",
            ProspectoPersona_FechaNacimiento: moment(
              moment(props.Item?.FechaNacimiento).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            ).toDate(),
            ProspectoPersona_SexoID: props.Item?.SexoID ?? "",
            ProspectoPersona_cp: props.Item?.CodigoPostal ?? 0,
            ProspectoPersona_TelefonoMovil: props.Item?.TelefonoMovil ?? "",
            ProspectoPersona_LugarNacimiento: props.Item?.LugarNacimiento ?? "",

            ProspectoPersona_AsentamientoID: props.Item?.AsentamientoID ?? 0,
            ProspectoPersona_Localidad: props.Item?.localidad ?? "",
            ProspectoPersona_Calle: props.Item?.calle ?? "",
            ProspectoPersona_NumeroExterior: props.Item?.numeroExterior ?? "",
            ProspectoPersona_Telefono: props.Item?.TelefonoDomicilio ?? "",
            ProspectoPersona_CURP: props.Item?.CURP ?? "",
            //-----------------------------------------------------------
          }}
          // Personalizacion [Botones]
          CLASE__BOTONES__DIV={"d-grid gap-2 d-md-flex justify-content-md-end"}
          CLASE__BOTONES__CANCELAR={"btn btn-danger btn-sm"}
          CLASE__BOTONES__TERMINAR={"btn btn-confia btn-sm"}
          CLASE__BOTONES__SIGUIENTE={"btn btn-confia btn-sm"}
          CLASE__BOTONES__ANTERIOR={"btn btn-warning btn-sm"}
          // Personalizacion [Listado]
          CLASE__LISTADO_PASOS__PROGRESO={"bg-info"}
          CLASE__LISTADO_PASOS__TERMINADO={"bg-success"}
          CLASE__LISTADO_PASOS__LI__TITULO={`card-title mb-0`}
          // Funciones
          FN__CANCELAR={props.fnCancelar}
          PROMESA__PROCESAR={(Datos: any) => {
            console.log("??", Datos);
            const Persona = {
              Nombre: Datos.ProspectoPersona_Nombre,
              ApellidoPaterno: Datos.ProspectoPersona_ApellidoPaterno,
              ApellidoMaterno: Datos.ProspectoPersona_ApellidoMaterno,
              FechaNacimiento: Datos.ProspectoPersona_FechaNacimiento,
              LugarNacimiento: Datos.ProspectoPersona_LugarNacimiento,
              SexoID: Datos.ProspectoPersona_SexoID,
              TelefonoDomicilio:
                Datos.ProspectoPersona_Telefono.length > 0
                  ? Datos.ProspectoPersona_Telefono
                  : "0000000000",
              TelefonoMovil: Datos.ProspectoPersona_TelefonoMovil,
              NombreCompleto: `${Datos.ProspectoPersona_Nombre} ${Datos.ProspectoPersona_ApellidoMaterno} ${Datos.ProspectoPersona_ApellidoMaterno}`,
              AsentamientoID: Datos.ProspectoPersona_AsentamientoID,
              calle: Datos.ProspectoPersona_Calle,
              localidad: Datos.ProspectoPersona_Localidad,
              numeroExterior: Datos.ProspectoPersona_NumeroExterior,
              CURP: Datos.ProspectoPersona_CURP,
            };

            // Regresamos la nueva promesa
            if (!props.Item?.PersonaID)
              return Funciones.FNAgregar(props.oidc, { ...Persona });
            else
              return Funciones.FNEditar(
                props.oidc,
                { ...Persona },
                props.Item.PersonaID
              );
            //return new Promise(() =>null) //Funciones.FNAgregar(props.oidc, Datos)
          }}
          // {
          //return new Promise((resolve, reject) => {
          //    alert(JSON.stringify(Datos))
          //   reject('DEBUG')
          // })
          // }
          // }
          FN__LIMPIAR={(Datos: any, DatosPromesa: any) =>
            props.cbGuardar(DatosPromesa)
          }
          FN__ERROR={(error) => {
            if (error.response) {
              alert(`Response Error: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) alert(`Request ${error}`);
            else alert(`${error}`);
          }}
        />
      </ModalWin.Body>
    </ModalWin>
  );
};
