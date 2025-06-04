import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  CustomFieldText,
  Spinner,
  CustomFieldDatePicker,
  ActionSelect,
  CustomFieldPdfUpload,
  CustomFieldImgUpload,
  ModalWin,
} from "../../../../../global";
import * as Funciones from "./Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useBarcode } from "react-barcodes";
import { CForm_UEvidencia } from "./CForm_UEvidencia";
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import DocsEvidencias from "./DocsEvidencias";
import * as FnPersona from "../../../personas/CompAdministracion/CompPersona/Funciones";
import Select from "react-select/src/Select";
import ImgEvidencias from "./ImgEvidencias";
import { fetchExcepcionHuella, fetchHuellaCliente, fetchHuellaDist, fetchLectorHuella } from "../../../personas/CompAdministracion/Funciones";
import { FNGetDatosPersonaPrestamo } from "../../../creditos/CompCreditos/CreditoCreditoPersonal/Funciones";

type CFormType = {
  oidc: IOidc;
  Id?: number;
  optProductos: { value: number; label: string }[];
  optSeries: { value: number; label: string }[];
  optSucursales: { value: number; label: string }[];
  optDistribuidores: { value: number; label: string }[];
  evento: string;
  initialValues: {
    ProductoID: number;
    DistribuidorID: number;
    serieId: string;
    FolioInicial: number;
    FolioFinal: number;
    Estatus: string;
    RegistroFecha?: Date;
    RegistroUsuarioId: string;
    AsignaSucursalId: number;
    AsignaSucursalUsuarioId: string;
    ReciboSucursalUsuarioId: string;
    AsignaDistribudiorUsuarioId: string;
    CanceladoUsuarioId: string;
    ValeraTrackingEstatusID: number;
    EnvioSucursalNota: string;
    ReciboSucursalNota: string;
    doc: string;
    doc2: string;
    productoName: string;
    serieName: string;
    CodigoBarras: string;
  };
  fnGetDistribuidores(id: any): any;
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  DisCan?: boolean;
};

export const CForm = (props: CFormType) => {
  // Loading
  const [loading, setLoading] = React.useState(false);
  const [isMounted, setisMounted] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [CancelSoc, SocCancel] = React.useState(false);

  const refSucursal = useRef<HTMLInputElement>(null);

  const validarDistribuidor = (value: any) => {
    FnPersona.FNGetDistribuidor(props.oidc, { Id: value.SucursalID })
      .then((respuesta: any) => {
        if (respuesta.DistribuidoresEstatusID == "T") {
          toast.error(
            `La socia ${value.NombreSucursal} está cancelada temporalmente`
          );
          SocCancel(true);
        } else if (respuesta.DistribuidoresEstatusID == "F") {
          toast.error(
            `La socia ${value.NombreSucursal} está en estatus Fallecida`
          );
        } else if (
          respuesta.DistribuidoresEstatusID == "N" ||
          respuesta.DistribuidoresEstatusID == "R"
        ) {
          toast.success(`Se puede asignar valera a  ${value.NombreSucursal}`);
          SocCancel(false);
        }
      })
      .catch(() => {
        toast.error("Ha ocurrido un error al obtener el distribuidor");
      });
  };

  const { inputRef } = useBarcode({
    value: props.initialValues.CodigoBarras,
    options: {
      background: "#F7F7F7",
      height: 50,
    },
  });

  function cerrar() {
    setShow(false);
  }

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  useEffect(() => {
    // return () => {
    setisMounted(true);
    // }
  }, []);

  let validationShape = {
    //ProductoID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el producto'),
    //serieId: Yup.string().required("Seleccione la serie"),
    //FolioInicial: Yup.number().required("Campo obligatorio").moreThan(0, 'indique el folio inicial'),
    //FolioFinal: Yup.number().required("Campo obligatorio").moreThan(0, 'indique el folio final'),
    AsignaSucursalId: Yup.number(),
    DistribuidorID: Yup.number(),
    file: Yup.string(),
    //file2: Yup.string()
  };

  if (props.evento === "Asignar Sucursal")
    validationShape.AsignaSucursalId = Yup.number()
      .required("Campo obligatorio")
      .moreThan(0, "Seleccione la sucursal");

  if (props.evento === "Asignar Socia")
    validationShape.DistribuidorID = Yup.number()
      .required("Campo obligatorio")
      .moreThan(0, "Seleccione una socia");

  if (props.evento === "Subir Expediente") {
    validationShape.file = Yup.string().required("Campo obligatorio");
    //validationShape.file2 = Yup.string().required("Campo obligatorio")
  }
  const FNGetPersona = (PersonaID: number, e: any) => {
    FNGetDatosPersonaPrestamo(props.oidc, PersonaID)
      .then((respuesta: any) => {
        let userID = props.oidc.user.profile.UsuarioID
        let ProductoID = props.initialValues.ProductoID
        requestFingerprint(e, respuesta.CURP, ProductoID, userID)
      })
  }
  const btnHuella = React.useRef<any>();
  const Instrucciones = React.useRef<any>();
  // WEB SOCKET HUELLAS

  let retries = 0;
  const maxRetries = 10; // Max number of retries
  let recieved: boolean;
  let huellaConfirmada = false;

  function connectWebSocket() {
    const socketUrl = "ws://localhost:8080";
    let socket = new WebSocket(socketUrl);
    // Connection opened
    socket.addEventListener("open", event => {
      console.log("Connection established");
      console.log("This props", props)
      socket.send("Connection established");

      retries = 0;
    });

    // Handle WebSocket close event (if the connection is lost)
    socket.addEventListener("close", event => {
      console.log("WebSocket closed");
      if ((retries < maxRetries) && !recieved) {
        retries++;
        console.log(`Retrying... (${retries}/${maxRetries})`);
        setInterval(connectWebSocket, 1000);
      } else {
        if (!recieved) {
          toast.error("NO TIENE INSTALADO EN PROGRAMA DEL SENSOR DE HUELLAS")
        }
        console.log("Max retries reached. Could not establish connection.");
      }
    });

    // Handle WebSocket error event
    socket.addEventListener("error", error => {
      //console.error("WebSocket error", error);
      //toast.error("No tiene instalado el programa")
    });
    // Listen for messages
    socket.addEventListener("message", event => {
      let parsedData;
      try {
        parsedData = JSON.parse(event.data);
        console.log(parsedData)
      } catch (e) {
        console.error("Error parsing message data", e);
        return;
      }
      if (parsedData != null && parsedData != "") {
        recieved = true
      }
      
      console.log("VALORES");
      console.log(parsedData)
      if (parsedData?.data?.codeData != null && parsedData.data.codeData == -1) {
        toast.info("HUELLAS NO COINCIDEN; REINTENTA");
      }
      else if (parsedData["Image64"] != "error") {
        toast.info(parsedData.msj != "USUARIO YA EXISTENTE" ? parsedData.msj : "HUELLA VERIFICADA CORRECTAMENTE")
        huellaConfirmada = true
        btnHuella.current.setAttribute("disabled", "true")
        btnHuella.current.innerHTML = "Huella verificada"
        console.info(parsedData.msj)
      } else {
        toast.error("EL PROGRAMA FUE CERRADO SIN REGISTRAR LA HUELLA, INTENTE NUEVAMENTE")
      }
    });
  }

  const requestFingerprint = (e, Curp, producto, usuarioid) => {
    console.log("This props", props)
    e.preventDefault()
    console.log("Opening reader")
    const link = document.createElement('a');

    link.href = `cv://registrarhuella?productoid=${producto}&curp=${Curp}&usuarioid=${usuarioid}`;

    link.click();

    connectWebSocket();
  }
  const [allowHuellas, setAllowHuellas] = React.useState<any>(false);
  useEffect(() => {

    fetchLectorHuella(props.oidc, props.initialValues.DistribuidorID)
      .then((respuesta: any) => {
        console.log("Allow sucursal", respuesta)
        if (respuesta) {
          fetchExcepcionHuella(props.oidc, props.initialValues.DistribuidorID)
            .then((respuesta2: any) => {
              setAllowHuellas(!respuesta2);
              console.log("Excepcion a las huellas", allowHuellas);
            })
            .catch(() => {
              toast.error("Error al verificar sucursal");
            });
        }
        //setAllowHuellas(respuesta);
        //console.log("Allow", allowHuellas);
      })
      .catch(() => {
        toast.error("Error al verificar sucursal");
      });
    console.log("iniDist", props.initialValues.DistribuidorID)

    if (props.initialValues.DistribuidorID > 0) {
      fetchHuellaDist(props.oidc, props.initialValues.DistribuidorID)
        .then((respuesta: any) => {
          console.log("Check reg", respuesta)
          if (respuesta) {
            Instrucciones.current.innerHTML = "Verifique la identidad de la socia escaneando el dedo índice derecho"
            btnHuella.current.innerHTML = "Verificar huella"
          }
          else {
            Instrucciones.current.innerHTML = "Registre la huella de la socia escaneando el índice derecho 3 veces."
            btnHuella.current.innerHTML = "Registrar huella"
          }
        })
        .catch(() => {
          toast.error("Error al verificar sucursal");
        });
    }

  }, [props.oidc, props.initialValues.DistribuidorID]);
  // useEffect(() => {


  // }, [props.oidc, props.initialValues.DistribuidorID]); 

  // Return the component
  return (
    <>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape(validationShape)}
        onSubmit={(values: any) => {
          // Set our form to a loading state
          setLoading(true);
          console.log(`values`, values);
          // Finish the callback
          if (props.Id === undefined)
            Funciones.FNAdd(props.oidc, values)
              .then((respuesta: any) => {
                setLoading(false);
                props.cbGuardar(respuesta);
                toast.success("Valera agregado correctamente");
              })
              .catch((error: any) => {
                toast.error("Error al agregar valera");
                setLoading(false);
              });
          else if (props.evento === "Editar Valera")
            Funciones.FNUpdate(props.oidc, {
              ...values,
              ValeraID: props.Id as number,
            })
              .then((respuesta: any) => {
                setLoading(false);
                props.cbActualizar(respuesta);
                toast.success("Valera actualizada correctamente");
              })
              .catch((error: any) => {
                toast.error("Error al actualizar valera");
                setLoading(false);
              });
          else if (props.evento === "Asignar Sucursal")
            Funciones.FNUpdateSucursal(props.oidc, {
              ...values,
              ValeraID: props.Id as number,
            })
              .then((respuesta: any) => {
                setLoading(false);
                props.cbActualizar(respuesta);
                toast.success("Asignación de Sucursal realizada correctamente");
              })
              .catch((error: any) => {
                toast.error("Error al actualizar asignar sucursal");
                setLoading(false);
              });
          else if (props.evento === "Enviar a Sucursal")
            Funciones.FNUpdateEnviadoSucursal(props.oidc, {
              ...values,
              ValeraID: props.Id as number,
            })
              .then((respuesta: any) => {
                setLoading(false);
                props.cbActualizar(respuesta);
                toast.success("Envío a Sucursal realizada correctamente");
              })
              .catch((error: any) => {
                toast.error("Error al enviar a sucursal");
                setLoading(false);
              });
          else if (props.evento === "Recibir Sucursal")
            Funciones.FNUpdateReciboSucursal(props.oidc, {
              ...values,
              ValeraID: props.Id as number,
            })
              .then((respuesta: any) => {
                setLoading(false);
                props.cbActualizar(respuesta);
                toast.success("Recibido en Sucursal realizada correctamente");
              })
              .catch((error: any) => {
                toast.error("Error al recibir en sucursal");
                setLoading(false);
              });
          else if (props.evento === "Descargar Documento")
            Funciones.FNGetFile(props.oidc, {
              ...values,
              ValeraID: props.Id as number,
            })
              .then((pdf: any) => {
                const file = new Blob([pdf], { type: "application/pdf" });

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

                setLoading(false);
                props.fnCancelar();
                toast.success("Descarga de documento realizada correctamente");
              })
              .catch((error: any) => {
                toast.error("Error al descargar documento");
                setLoading(false);
              });
          else if (props.evento === "Asignar Socia")
            Funciones.FNUpdateDistribuidor(props.oidc, {
              ...values,
              ValeraID: props.Id as number,
            })
              .then(async (respuesta: any) => {
                toast.success("Asignación de socia realizada correctamente");
                await timeout(1000);
                toast.info(
                  "Generando Documento de entrega de valera, por favor espere"
                );
                Funciones.FNGetFile(props.oidc, {
                  ...values,
                  ValeraID: props.Id as number,
                })
                  .then((pdf: any) => {
                    const file = new Blob([pdf], { type: "application/pdf" });

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

                    setLoading(false);
                    props.cbActualizar(respuesta);
                    toast.success(
                      "Generación de documento, realizada correctamente"
                    );
                  })
                  .catch((error: any) => {
                    toast.error("Error al generar documento");
                    setLoading(false);
                  });
              })
              .catch((error: any) => {
                toast.error("Error al asignar socia" + `${error}`);
                setLoading(false);
              });
          else if (props.evento === "Subir Expediente") {
            if (huellaConfirmada || !allowHuellas) {
              const formData = new FormData();
              formData.append("ValeraID", `${props.Id}`);
              formData.append("doc", values.file);
              //formData.append('doc2', values.file2);
              Funciones.FNSubirExpediente(props.oidc, formData)
                .then((respuesta: any) => {
                  setLoading(false);
                  props.cbActualizar(respuesta);
                  toast.success("Subida de Documento realizada correctamente");
                })
                .catch((error: any) => {
                  if (error.response)
                    toast.info(`Response Error: ${error.response.data}`);
                  else if (error.request) toast.error(`Request ${error}`);
                  else toast.error(`${error}`);
                  setLoading(false);
                });
            }
            else {
              toast.error("No ha confirmado las huellas")
              setLoading(false);
            }
          } else if (props.evento === "Cancelar Valera")
            Funciones.FNCancelarValera(props.oidc, {
              ...values,
              ValeraID: props.Id as number,
            })
              .then((respuesta: any) => {
                setLoading(false);
                props.cbActualizar(respuesta);
                toast.success("Cancelación de Valera realizada correctamente");
              })
              .catch((error: any) => {
                toast.error("Error al cancelar valera");
                setLoading(false);
              });
          else if (props.evento === "Ver Valera") {
            setLoading(false);
            props.fnCancelar();
          }
        }}
      >
        <Form>
          <div className="row">
            <div className="col-md-6">
              <CustomFieldText
                disabled={true}
                label="Valera"
                name="Id"
                placeholder={`${props.Id}`}
              />
            </div>
            <div className="col-md-3">
              <CustomFieldText
                disabled={true}
                label="Estatus"
                name="Estatus"
                placeholder="Estatus"
              />
            </div>
            <div className="col-md-3">
              <CustomFieldDatePicker
                disabled={true}
                label="RegistroFecha"
                name="RegistroFecha"
                placeholder="RegistroFecha"
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              {
                isMounted && (
                  <CustomFieldText
                    disabled={true}
                    label="Producto"
                    name="productoName"
                    placeholder="productoName"
                  />
                )
                /*<ActionSelect
                        disabled={props.evento != 'Editar Valera' && props.evento != 'Crear Valera'}
                        label="Producto"
                        name="ProductoID"
                        placeholder="Seleccione el producto"
                        options={props.optProductos}
                        addDefault={false}
                        valor={props.initialValues.ProductoID}
                        
                    />*/
              }
            </div>
            <div className="col">
              {
                isMounted && (
                  <CustomFieldText
                    disabled={true}
                    label="Serie"
                    name="serieName"
                    placeholder="serieName"
                  />
                )
                /*<ActionSelect
                        disabled={props.evento != 'Editar Valera' && props.evento != 'Crear Valera'}
                        label="Serie"
                        name="serieId"
                        placeholder="Seleccione la serie"
                        options={props.optSeries}
                        addDefault={false}
                        valor={props.initialValues.serieId}
                        
                    />*/
              }
            </div>
          </div>
          <div className="row">
            <div className="col">
              <CustomFieldText
                disabled={
                  props.evento != "Editar Valera" &&
                  props.evento != "Crear Valera"
                }
                label="FolioInicial"
                name="FolioInicial"
                placeholder="FolioInicial"
              />
            </div>
            <div className="col">
              <CustomFieldText
                disabled={
                  props.evento != "Editar Valera" &&
                  props.evento != "Crear Valera"
                }
                label="FolioFinal"
                name="FolioFinal"
                placeholder="FolioFinal"
              />
            </div>
          </div>
          {props.evento != "Editar Valera" && props.Id != undefined && (
            <>
              <div className="row">
                <div className="col-md-6">
                  {isMounted && (
                    <div className="row">
                      <div className="col">
                        <ActionSelect
                          disabled={props.evento != "Asignar Sucursal"}
                          label="Sucursal"
                          name="AsignaSucursalId"
                          placeholder={
                            props.evento != "Asignar Sucursal"
                              ? "SIN SUCURSAL ASIGNADA"
                              : "Seleccione una Sucursal"
                          }
                          options={props.optSucursales}
                          addDefault={false}
                          valor={props.initialValues.AsignaSucursalId}
                          accion={props.fnGetDistribuidores}
                        />
                      </div>
                      {props.evento == "Asignar Sucursal" && (
                        <div
                          className="col-md-2"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <FaArrowAltCircleLeft size={30} color={"indigo"} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  {isMounted && (
                    <>
                      <div className="row">
                        <div className="col">
                          <ActionSelect
                            disabled={props.evento != "Asignar Socia"}
                            label="Socia"
                            name="DistribuidorID"
                            placeholder={
                              props.evento != "Asignar Socia"
                                ? "SIN SOCIA ASIGNADA"
                                : "Seleccione la Socia"
                            }
                            options={props.optDistribuidores}
                            addDefault={true}
                            valor={props.initialValues.DistribuidorID}
                            accion2={validarDistribuidor}
                          />
                        </div>
                        {props.evento == "Asignar Socia" && (
                          <div
                            className="col-md-2"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FaArrowAltCircleLeft size={30} color={"grey"} />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          {props.evento != "Subir Expediente" &&
            props.initialValues.EnvioSucursalNota && (
              <CustomFieldText
                disabled={true}
                label="NOTA de Envío a sucursal"
                name="EnvioSucursalNota"
                placeholder="SIN NOTA DE ENVÍO"
              />
            )}
          {props.evento != "Subir Expediente" &&
            props.initialValues.ReciboSucursalNota &&
            props.initialValues.ValeraTrackingEstatusID != 5 && (
              <CustomFieldText
                disabled={true}
                label="NOTA de Recepción en sucursal"
                name="ReciboSucursalNota"
                placeholder="SIN NOTA DE RECIBIDO EN SUCURSAL"
              />
            )}

          {props.evento === "Subir Expediente" && (
            <div className="row">

              <div className="col-6">
                <CustomFieldPdfUpload
                  disabled={loading}
                  label="Documento Firmado"
                  name="file"
                  imageSrc={"data:image/png;base64," + props.initialValues.doc}
                />
              </div>
              <div className="col-6">
                {!show && <ImgEvidencias ValeraID={props.Id ?? 0} />}
              </div>
              <div className="col-6"></div>
              <div className="col-6" hidden={!allowHuellas}>
                <b>Validación de huella digital</b>
                {!show &&
                  <div>
                    <div className="row">
                      <div className="column is-half-desktop is-half-mobile">
                        <label className="form-label mb-0 pl-3" htmlFor={"Nota"} ref={Instrucciones}>
                          {/* Sucursal: {props.SucursalID}<br></br> */}
                          Verifique la identidad de la socia escaneando el índice derecho 3 veces.</label>
                      </div>

                      <div className="column is-half-desktop is-half-mobile">
                        <button ref={btnHuella} data-tip style={{ width: '100%', textAlign: 'center', justifyContent: "center", borderRadius: "4px" }} className="btn btn-primary pr-3" type={"button"}
                          onClick={(e) => {

                            FNGetPersona(props.initialValues.DistribuidorID, e)

                          }}>Verificar huella
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          )}
          {props.initialValues.ValeraTrackingEstatusID === 12 && (
            <div className="col-12">
              {!show && <DocsEvidencias ValeraID={props.Id ?? 0} />}
              <div style={{ textAlign: "center" }}>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => setShow(true)}
                >
                  AGREGAR EVIDENCIA
                </button>
              </div>
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <svg ref={inputRef} />
          </div>
          {loading && <Spinner />}
          {!loading && (
            <div className="text-end">
              {props.evento != "Ver Valera" && (
                <button
                  type="button"
                  className="btn btn-danger waves-effect waves-light"
                  onClick={props.fnCancelar}
                >
                  {props.evento === "Cancelar Valera" ? "Volver" : "Cancelar"}
                </button>
              )}
              <button
                type="submit"
                className="ms-2 btn btn-success waves-effect waves-light"
                disabled={CancelSoc}
              >
                {props.evento === "Asignar Sucursal" ||
                  props.evento === "Asignar Socia"
                  ? "Asignar"
                  : props.evento === "Cancelar Valera"
                    ? "Cancelar Valera"
                    : props.evento === "Recibir Sucursal"
                      ? "Valera Recibida"
                      : props.evento === "Descargar Documento"
                        ? "Descargar PDF"
                        : "Ok"}
              </button>
            </div>
          )}
        </Form>
      </Formik>
      {show && (
        <ModalWin open={show} large>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>AGREGAR DOCUMENTO DE ENTREGA</h5>
          </ModalWin.Header>
          <ModalWin.Body>
            <CForm_UEvidencia oidc={props.oidc} Id={props.Id} close={cerrar} />
          </ModalWin.Body>
        </ModalWin>
      )}
    </>
  );
};
