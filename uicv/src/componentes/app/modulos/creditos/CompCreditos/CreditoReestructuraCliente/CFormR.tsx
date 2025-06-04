import React, { useRef, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Card,
  Spinner,
  CustomFieldText,
  CustomFieldText2,
  CustomFieldDatePicker,
  ActionSelect,
  ActionCreatableSelect,
  ActionMultipleSelect,
  ActionFieldText,
  ActionFieldNumberText,
  ImgViewer,
  ActionAsyncSelect,
  CardItem,
  CustomFieldImgUpload,
} from "../../../../../global";
import {
  BuscarDatosBancarios,
  Clientes,
  Distribuidores,
  Sucursales,
  Cuentas,
} from "../../../../../selectores";
import * as Funciones from "./Funciones";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import {
  FaWindowClose,
  FaShoppingCart,
  FaCloudDownloadAlt,
  FaAddressCard,
  FaDownload,
} from "react-icons/fa";
import CreditoArticulos from "../CreditoArticulos";
//import * as FnPersona from '../../../administracion/CompAdministracion/CompPersona/Funciones'
import { PerfilPersona } from "../../../../../presentacion";
// import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiRefreshCcw } from "react-icons/fi";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import moment from "moment";

type CFormType = {
  oidc: IOidc;
  ProductoID: number;
  initialValues: {
    DistribuidorId: number;
    SucursalId: number;
    CuentaId: number;
    FechaPago: Date;
    Importe: number;
    ImpClientes: number;
    GenerarDNI: boolean;
    saldoPlazo: number;
    PorcComision: number;
    PagoTotal: number;
    PagoComision: number;
    Abono: number;
    Dif_Pago: number;
    AbonoAcumulado: number;
    SldCredPersonal: number;
    CargoAdic: number;
    BonDia: number;
    SldDia: number;
    PagoMinComision: number;
    CodigoAut: string;
    Plazos: number;
    ConceptoId: number;
    doc: string;
    doc2: string;
  };
  ClientesX: any[];
  optTipos: { value: number; label: string }[];
  cbMuestrCotizacion(item: any, importe: number, plazos: number): any;
  cbLimpiaTablas(item: any, importe: number, plazos: number): any;
  cbMuestraActual(show: boolean): any;
};

export const CFormR = (props: CFormType) => {
  const MySwal = withReactContent(Swal);

  const [loading, setLoading] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formPerc = new Intl.NumberFormat("en-US", {
    style: "percent",
    // currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const download = (opc: number) => {
    setLoading(true);
    //var obj = { ProductoID: 0, serieId: '', FolioInicial: 0, FolioFinal: 0, Estatus: '', RegistroFecha: undefined, RegistroUsuarioId: '', AsignaSucursalId: 0, AsignaSucursalUsuarioId: '', ReciboSucursalUsuarioId: '', AsignaDistribudiorUsuarioId: '', CanceladoUsuarioId: '', ValeraTrackingEstatusID: 0, DistribuidorID: 12 } as any
    if (opc === 1) {
      Funciones.getFileSolcitud(props.oidc, {
        DistribuidorId: props.initialValues.DistribuidorId,
      })
        .then((pdf: any) => {
          const file = new Blob([pdf], { type: "application/pdf" });

          // const fileURL = URL.createObjectURL(file);
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
          // window.open(fileURL);
          setLoading(false);
          toast.success("Descarga de documento realizada correctamente");
        })
        .catch((error: any) => {
          toast.error("Error al descargar documento");
          setLoading(false);
        });
    } else {
      Funciones.getFileMachote(props.oidc, {
        DistribuidorID: props.initialValues.DistribuidorId,
        Clientes: props.ClientesX,
      })
        .then((pdf: any) => {
          const file = new Blob([pdf], { type: "application/pdf" });

          // const fileURL = URL.createObjectURL(file);
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
          // window.open(fileURL);
          setLoading(false);
          toast.success("Descarga de documento realizada correctamente");
        })
        .catch((error: any) => {
          toast.error("Error al descargar documento");
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          ConceptoId: Yup.number()
            .required("Seleccione un motivo")
            .moreThan(0, "Seleccione un motivo"), //Yup.date().required('Seleccione una fecha'),
          //file: Yup.string().required("Campo obligatorio"),
          //file2: Yup.string().required("Campo obligatorio")
        })}
        onReset={(values: any) => {
          // clearFormByLevel(0)
        }}
        onSubmit={(values: any) => {
          setLoading(true);
          console.log("111", values);
          console.log("222", props.initialValues);
          const formData = new FormData();
          formData.append("ConceptoId", `${values.ConceptoId}`);
          formData.append(
            "DistribuidorId",
            `${props.initialValues.DistribuidorId}`
          );
          formData.append("SucursalId", `${props.initialValues.SucursalId}`);
          formData.append(
            "FechaPago",
            moment(props.initialValues.FechaPago).format("DD/MM/YYYY")
          );
          formData.append("Plazos", `${props.initialValues.Plazos}`);
          formData.append("Monto", `${props.initialValues.ImpClientes}`);
          formData.append("doc", values.file);
          formData.append("doc2", values.file2);
          formData.append("Clientes", JSON.stringify(props.ClientesX));
          Funciones.FNReestructuraCliente(props.oidc, formData)
            .then((respuesta: any) => {
              if (respuesta.regresa === 1) {
                setLoading(false);
                toast.success(`Reestructura Realizada con Éxito.`);
                props.cbLimpiaTablas([], 0, props.initialValues.Plazos);
                props.cbMuestraActual(true);
              } else {
                setLoading(false);
                toast.error(respuesta.msj);
              }
            })
            .catch((error: any) => {
              console.log(JSON.stringify(error));
              setLoading(false);
              toast.error(`Error al realizar la reestructura${error}`);
            });
        }}
      >
        {({ values }) => (
          <Form>
            <div className="">
              <div className=" text-end is-12-mobile is-12-tablet is-12-desktop">
                <table style={{ display: "inline-table" }}>
                  <tbody>
                    <tr>
                      <td>
                        <FaDownload color="blue" />
                      </td>
                      <td>
                        {!loading && (
                          <button
                            type="button"
                            className="btn btn-link waves-effect waves-light"
                            onClick={() => download(1)}
                          >
                            DESCARGAR DOCUMENTO DE SOLICITUD
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <FaDownload color="blue" />
                      </td>
                      <td className="text-start">
                        {!loading && (
                          <button
                            type="button"
                            className="btn btn-link waves-effect waves-light"
                            onClick={() => download(2)}
                          >
                            DESCARGAR MACHOTE DE CLIENTES
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* {!loading &&
                                    <button type="button" className="btn btn-link waves-effect waves-light" onClick={() => download()}>
                                        <FaDownload />   DESCARGAR DOCUMENTO DE SOLICITUD
                                    </button>} */}
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-12-desktop">
                <ActionSelect
                  disabled={false}
                  label="Concepto"
                  name="ConceptoId"
                  placeholder="Seleccione un Motivo"
                  options={props.optTipos}
                  addDefault={true}
                  valor={0}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <CustomFieldImgUpload
                  disabled={loading}
                  label="Documento de Solicitud Firmado"
                  name="file"
                  imageSrc={"data:image/png;base64," + props.initialValues.doc}
                />
              </div>
              <div className="col-6">
                <CustomFieldImgUpload
                  disabled={loading}
                  label="Machote Firmado"
                  name="file2"
                  imageSrc={"data:image/png;base64," + props.initialValues.doc2}
                />
              </div>
            </div>

            {loading && <Spinner />}
            {!loading && (
              <div>
                <div className="text-end">
                  <button
                    type="submit"
                    className="ms-2 btn btn-success waves-effect waves-light"
                  >
                    SOLICITAR REESTRUCTURA
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
