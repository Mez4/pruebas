import React, { useRef, useState, useEffect, memo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Card,
  Spinner,
  CustomFieldText,
  ActionSelect,
  ActionCreatableSelect,
  ActionMultipleSelect,
  ActionFieldText,
  ActionFieldText2,
  ImgViewer,
  ActionAsyncSelect,
  CardItem,
  Carrusel,
  CustomFieldDatePicker,
} from "../../../../../global";
import {
  ControlDatosBancarios,
  BuscarDatosBancarios,
  Cajas,
  Clientes,
} from "../../../../../selectores";
import * as Funciones from "./Funciones";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import { toast } from "react-toastify";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import {
  FaWindowClose,
  FaShoppingCart,
  FaCloudDownloadAlt,
  FaAddressCard,
} from "react-icons/fa";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
import { PerfilPersona } from "../../../../../presentacion";
import { PerfilPersonaParaCapturaDeVales } from "../../../../../presentacion/persona/PerfilPersonaParaCapturaDeVales";
import { DBConfia_General } from "../../../../../../interfaces_db/DBConfia/General";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import VerDoc from "../../../Prospeccion/CompProspeccion/DocsProspecto/VerDoc";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import moment from "moment";

type CFormType = {
  oidc: IOidc;
  // ui: iUI,
  // ProductoID: number,
  Id?: number;
  initialValues: {
    MovimientoID: number;
    MvCancelacion: string;
  };
  cbCerrarMotivo(): any;
};

type EstadoTipo = {
  Datos: {
    Persona?: DBConfia_General.IPersonas_VW;
    Direcciones: DBConfia_General.IDirecciones_VW[];
    Empleos: DBConfia_General.IEmpleos_VW[];
  };
  Cargando: boolean;
  Error: boolean;
  FechaMax: Date;
};

export const CFormCancelar = //memo(
  (props: CFormType) => {
    console.log("CFormCancelar: ", props);

    const MySwal = withReactContent(Swal);

    const [Estado, DefinirEstado] = useState<EstadoTipo>({
      Datos: {
        Persona: undefined,
        Empleos: [],
        Direcciones: [],
      },
      Cargando: true,
      Error: false,
      FechaMax: moment().add(-30, "d").toDate(),
    });
    /*   const cbCancelar = (item: any) =>
          EstadoTipo({ ...state, Datos: state.Datos.filter((obj) => { return obj.CreditoID !== item.CreditoID }) })
   */
    const FNCancelar = (MvCancelacion: string) => {
      console.log("idddddddddd", props.Id);
      let Datos = {
        Id: props.Id ?? 0,
        MvCancelacion: MvCancelacion,
      };
      Funciones.FNCancelar(props.oidc, Datos)
        .then((respuesta: any) => {
          if (respuesta.regresa === 1) {
            toast.success(respuesta.msj);
            props.cbCerrarMotivo();
            setLoading(false);
          } else {
            toast.warning(respuesta.msj);
          }
        })
        .catch((error: any) => {
          if (error.response)
            toast.error(`Response Error: ${error.response.data}`);
          else if (error.request) toast.error(`Request ${error}`);
          else toast.error(`${error}`);
        });
    };

    const [loading, setLoading] = useState(false);

    return (
      <>
        <Formik
          initialValues={props.initialValues}
          enableReinitialize
          validationSchema={Yup.object().shape({
            MvCancelacion: Yup.string()
              .required("Campo obligatorio")
              .min(3, "Minimo 10 caracteres")
              .max(250, "Maximo 250 caracteres"),
          })}
          onSubmit={(values: any) => {
            MySwal.fire({
              title: "<strong>Cancelar Movimiento</strong>",
              icon: "question",
              html: (
                <div className="text-center">
                  Se cancelará el movimiento ¿desea continuar?
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
                FNCancelar(values.MvCancelacion);
              }
            });
          }}
        >
          {({ values }) => (
            <Form>
              <div className="column is-full-desktop is-full-mobile">
                <CustomFieldText
                  disabled={loading}
                  label="Motivo de Cancelación"
                  name="MvCancelacion"
                  placeholder="Descripción"
                />
              </div>

              {loading && <Spinner />}
              {!loading && (
                <div className="text-end">
                  <button
                    type="submit"
                    className="ms-2 btn btn-success waves-effect waves-light"
                  >
                    Cancelar Movimiento
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </>
    );
  };
// );
