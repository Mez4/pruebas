import { useEffect, useRef, useState } from "react";
import {
  ModalWin,
  AsistenteFormik,
  Spinner,
  ActionFieldText2,
} from "../../../../../global";
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import { formatDate2 } from "../../../../../../global/functions";

import * as Funciones from "./Funciones";
import {
  FormasGeneral,
  FormasPersona,
  FormasClientes,
} from "../../../../../formas";

import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import yup from "../../../../../../global/yupLocale";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import moment from "moment";
import { useParams } from "react-router";
import { FNGetDatosPersonaPrestamo } from "../CreditoCreditoPersonal/Funciones";
import { fetchHuellaCurp, fetchLectorHuella } from "../../../personas/CompAdministracion/Funciones";


type CFormCURPType = {
  oidc: IOidc;
  Id?: number;
  Item?: any;

  // Callbacks
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;

  // Modal controls
  mostrar: boolean;
  EsZonal?: boolean;
  SucursalID?: number;
};

/** Tipo de nuestro componente */
type CFormType = {
  // Basico
  oidc: IOidc;
  Id?: number;
  Item?: any;
  DVID?: number;

  // Callbacks
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;

  // Modal controls
  mostrar: boolean;
  EsZonal?: boolean;
  SucursalID?: number;

  
    statusCurp?: boolean
};
type paramType = { productoId: string }

export const AgregarCliente = (props: CFormCURPType) => {
  const [loading, setLoading] = useState(false);
  const [curp, setCurp] = useState(false);
  let { productoId } = useParams<paramType>()
  const [state, setState] = useState({
    DatosGenerales: undefined,
    Forma: false,
  });

  const fnCancelar = () => {
    setState((s) => ({ ...s, Forma: false }));
    props.fnCancelar();
  };


  const FNConsultarCURP_Habilitada = () => {
    Funciones.FNConsultarEstatusCURP(props.oidc)
      .then((res: any) => {
        let statusCurp = parseInt(res) === 1 ? true : false;
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
      <ModalWin zIndex={4001} open={props.mostrar} large>
        <ModalWin.Header>
          <h5 className={MODAL_TITLE_CLASS}>
            {props.Id ? "Editar cliente" : "Agregar cliente"}
          </h5>
        </ModalWin.Header>
        <ModalWin.Body>
          <Formik
            initialValues={{Curp: ''}}
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
              var datos: any =  {
                Curp: values.Curp,
                status: curp 
            };
            
            values = datos
            Funciones.FNBuscarCurp (props.oidc, values)
                .then((respuesta: any) => {
                  
                  setState((s) => ({
                    ...s,
                    DatosGenerales: respuesta.data,
                    Forma: true,
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
          >{({ values }) => (<>
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
              {/* <div className="col-12">
                  <button id="btnHuella" ref={btnHuella} onClick={(e) => requestFingerprint(e, values.Curp, productoId, values, props.oidc.user.profile.UsuarioID)} className="btn btn-primary waves-effect waves-light" disabled={false}>Añadir huella digital</button>
              </div> */}
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
                      id="submit"
                      className="ms-2 btn btn-success waves-effect waves-light"
                      // disabled
                      // ref={btnSubmit}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}
              {state.Forma == true && (
                <AgregarClienteForm
                  oidc={props.oidc}
                  cbActualizar={props.cbActualizar}
                  cbGuardar={props.cbGuardar}
                  fnCancelar={fnCancelar}
                  mostrar={props.mostrar}
                  Item={state.DatosGenerales}
                  DVID={props.Item}
                  statusCurp={curp}
                />
              )}
            </Form>
          </>)}</Formik>
        </ModalWin.Body>
      </ModalWin>
    </>
  );
};

/**
 * Forma para agregar un cliente en el sistema (Debe de incluir una persona por defecto)
 */
  
 let lectorResponded=true
const AgregarClienteForm = (props: CFormType) => {
  const [ok, setOk] = useState(false);
 
 const[huellaVerificada, setHuellaVerificada] = useState(false);
  let retries = 0;
  const maxRetries = 5; // Max number of retries
  let recieved:boolean;
  let idInterval;



  function connectWebSocket() { 
    const socketUrl = "ws://localhost:8080";
    let socket = new WebSocket(socketUrl);

    // Connection opened
    socket.addEventListener("open", event => {
      console.log("Connection established");
      socket.send("Connection established");
      retries = 0; 
    });
  
    // Handle WebSocket close event (if the connection is lost)
        socket.addEventListener("close", event => {
          console.log("WebSocket closed");
          if ((retries < maxRetries) && !recieved ){
            retries++;
            console.log(`Retrying... (${retries}/${maxRetries})`);
            connectWebSocket()
          } else {
            if(!recieved){
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
      lectorResponded=false
      let parsedData;
      try {
          parsedData = JSON.parse(event.data);
          console.log(parsedData)
      } catch (e) {
          console.error("Error parsing message data", e);
          return;
      }
      if(parsedData != null && parsedData !=""){
        recieved = true
      } 
      console.log(parsedData)  
      if(parsedData["Image64"]!="error"){

        setHuellaVerificada(true)
        
        toast.info("Huella guardada, presione TERMINAR para completar el registro")
      }else{
        toast.error("EL PROGRAMA FUE CERRADO SIN REGISTRAR LA HUELLA, INTENTE NUEVAMENTE")
      }
      
    });
    
  }
  
  const requestFingerprint = (Curp, producto, usuarioid) => {
    

      console.log("CURP ok, enabling button")

      console.log("Opening reader")
      console.log(usuarioid)
      const link = document.createElement('a');
    
      link.href = "cv://registrarhuella?productoid="+producto+"&curp="+Curp+"&usuarioid="+usuarioid;

      link.click();
      connectWebSocket();   
  }


  return (
    <ModalWin zIndex={4001} open={props.mostrar} large>
      <ModalWin.Header>
        <h5 className={MODAL_TITLE_CLASS}>
          {props.Id ? "Editar cliente" : "Agregar cliente"}
        </h5>
      </ModalWin.Header>
      <ModalWin.Body>
        <AsistenteFormik
          MostrarPasos={true}
          Pasos={[
            FormasPersona.FormaBasicoUnoCurp({statusCurp: props?.statusCurp}),
            FormasPersona.FormaBasicoDos(),
            FormasPersona.FormaBasicoTres,
            FormasGeneral.FormaDireccion({
              Prefijo: "DireccionPersona_",
              Titulo: "Direccion",
              SubTitulo: "Direccion Personal",
            }),
            FormasClientes.FormaDatosCliente({
              SociaID: props.DVID || undefined,
              EsZonal: props.EsZonal,
              SucursalID: props.SucursalID,
            }),
            FormasPersona.FormaEmpleo(),
            FormasGeneral.FormaDireccion({
              Prefijo: "DireccionEmpleo_",
              Titulo: "Direccion laboral",
              SubTitulo: "Ubicacion laboral",
            }),
          ]}
          // Provisionar esta variable para mostrar datos de edicion
          Datos={{
            Nombre: props.Item?.Nombre,
            ApellidoPaterno: props.Item?.ApellidoPaterno,
            ApellidoMaterno: props.Item?.ApellidoMaterno,
            FechaNacimiento: props.Item?.FechaNacimiento
              ? moment(props.Item?.FechaNacimiento).toDate()
              : "",
            CURP: props.Item?.CURP || "",
            SexoID: props.Item?.SexoID || "",

            DireccionPersona_AsentamientoID: props.Item?.AsentamientoID ?? 0,
            DireccionPersona_Localidad: props.Item?.localidad ?? "",
            DireccionPersona_Calle: props.Item?.calle ?? "",
            DireccionPersona_NumeroExterior: props.Item?.numeroExterior ?? "",
            DireccionPersona_Telefono: props.Item?.TelefonoDomicilio ?? "",
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
          PROMESA__PROCESAR={async (Datos: any) => {
            // Validamos los datos opcionales
            
            const Persona = {
              Nombre: Datos.Nombre,
              ApellidoPaterno: Datos.ApellidoPaterno,
              ApellidoMaterno: Datos.ApellidoMaterno,
              FechaNacimiento: formatDate2(new Date(Datos.FechaNacimiento)), //Datos.FechaNacimiento,
              LugarNacimiento:
                Datos.LugarNacimiento == "" ? "NA-NA" : Datos.LugarNacimiaento,
              CURP: Datos.CURP,
              RFC: Datos.RFC == "" ? "NOSEAGREGARFC" : Datos.RFC,
              SexoID: Datos.SexoID,
              EstadoCivilID:
                Datos.EstadoCivilID == "" ? "N" : Datos.EstadoCivilID,
              EscolaridadID: 7,
              DependientesEconomicos:
                Datos.DependientesEconomicos == ""
                  ? 7
                  : Datos.DependientesEconomicos,
              TelefonoDomicilio: Datos.TelefonoDomicilio,
              TelefonoMovil: Datos.TelefonoMovil,
              CorreoElectronico: Datos.CorreoElectronico,
              NombreConyuge: Datos.NombreConyuge,
              Observaciones: Datos.Observaciones,
              identificacionTipoId: Datos.identificacionTipoId,
              identificacionNumero: Datos.identificacionNumero,
            };

            const AgregarCliente = {
              CrearCliente: true,
              ClienteID: 0,
              PersonaID: 0,
              LineaCreditoPersonal: 0, //Datos.LineaCreditoPersonal,
              PagareEstatusId: 0, //Datos.PagareEstatusId,
              PagareCantidad: 0, //Datos.PagareCantidad,
              CreacionPersonaID: 0,
              CreacionFecha: "",
              CreacionUsuarioID: 0,
              IdentificadorAnterior: "0", //Datos.IdentificadorAnterior,
              DistribuidorID: (props.DVID == 0 || props.DVID == null || props.DVID == undefined) ? Datos.DistribuidorID : props.DVID,
            };
            console.log("M: DATOS DIST", props.DVID)
            console.log("M: DATOS GEN", props.Item)
            console.log("M: DATOS CLIENTE", AgregarCliente)
            let allowHuellas = false
           

             

            const AgregarDireccion = {
              PersonaID: 1,
              DireccionPersona_AsentamientoID:
                Datos.DireccionPersona_AsentamientoID,
              DireccionPersona_NombreVialidad:
                Datos.DireccionPersona_NombreVialidad,
              DireccionPersona_NumeroInterior:
                Datos.DireccionPersona_NumeroInterior,
              DireccionPersona_NumeroExterior:
                Datos.DireccionPersona_NumeroExterior,
              DireccionPersona_vialidadTipoId:
                Datos.DireccionPersona_vialidadTipoId,
              DireccionPersona_orientacionVialidadTipoId:
                Datos.DireccionPersona_orientacionVialidadTipoId == ""
                  ? 0
                  : Datos.DireccionEmpleo_orientacionVialidadTipoId,
              DireccionPersona_viviendaTipoId:
                Datos.DireccionPersona_viviendaTipoId == ""
                  ? 1
                  : Datos.DireccionPersona_viviendaTipoId,
              DireccionPersona_ReferenciaGeografica:
                Datos.DireccionPersona_ReferenciaGeografica,
            };

            const AgregarEmpleo = {
              PersonaID: 1,
              FormaEmpleo__Empresa: Datos.FormaEmpleo__Empresa,
              FormaEmpleo__Puesto: Datos.FormaEmpleo__Puesto,
              FormaEmpleo__OcupacionID:
                Datos.FormaEmpleo__OcupacionID == ""
                  ? 0
                  : Datos.FormaEmpleo__OcupacionID,
              FormaEmpleo__Telefono: Datos.FormaEmpleo__Telefono,
              FormaEmpleo__FechaIngreso: "1990-01-01", //formatDate2(new Date(Datos.FormaEmpleo__FechaIngreso)) == 'NaN-NaN-NaN' ? '1990-01-01' : Datos.ormaEmpleo__FechaTermino,
              FormaEmpleo__FechaTermino: "1990-01-01", //formatDate2(new Date(Datos.FormaEmpleo__FechaTermino)) == 'NaN-NaN-NaN' ? '1990-01-01' : Datos.ormaEmpleo__FechaTermino,
              FormaEmpleo__SueldoMensual:
                Datos.FormaEmpleo__SueldoMensual == ""
                  ? 0
                  : Datos.FormaEmpleo__SueldoMensual,
              DireccionEmpleo_vialidadTipoId:
                Datos.DireccionEmpleo_vialidadTipoId,
              DireccionEmpleo_NombreVialidad:
                Datos.DireccionEmpleo_NombreVialidad,
              DireccionEmpleo_orientacionVialidadTipoId:
                Datos.DireccionEmpleo_orientacionVialidadTipoId == ""
                  ? 0
                  : Datos.DireccionEmpleo_orientacionVialidadTipoId,
              DireccionEmpleo_NumeroExterior:
                Datos.DireccionEmpleo_NumeroExterior,
              DireccionEmpleo_NumeroInterior:
                Datos.DireccionEmpleo_NumeroInterior,
              DireccionEmpleo_ReferenciaGeografica:
                Datos.DireccionEmpleo_ReferenciaGeografica,
              DireccionEmpleo_AsentamientoID:
                Datos.DireccionEmpleo_AsentamientoID,
              DireccionEmpleo_viviendaTipoId:
                Datos.DireccionEmpleo_viviendaTipoId == ""
                  ? 1
                  : Datos.DireccionEmpleo_viviendaTipoId,
            };

            const AgregarProspecto = {
              CrearProspecto: false,
            };

            const AgregarDirector = {
              CrearDirector: false,
              DirectorID: 0,
              PersonaID: 0,
              LineaCreditoPersonal: 1,
              PagareEstatusId: 0,
              PagareCantidad: 0.0,
              CreacionPersonaID: 0,
              CreacionFecha: "",
              CreacionUsuarioID: 0,
              IdentificadorAnterior: "",
              // DistribuidorID: Datos.DistribuidorID
            };
            


              await fetchLectorHuella(props.oidc, AgregarCliente.DistribuidorID)
              .then(async (respuesta: any) => {
                allowHuellas=respuesta;
                console.log("M: Allow", allowHuellas);
                console.log("props.oidc", props.oidc.user)
                if(allowHuellas){
                  console.log("Verificando si ya existe")
                  await fetchHuellaCurp(props.oidc, Persona.CURP)
                  .then(async (respuesta2: any) => {
                    
                    console.log("M: Registered", respuesta2);
                    if(!respuesta2){
                      console.log("resp2", respuesta2)
                      await requestFingerprint(Persona.CURP, 0, props.oidc.user.profile.UsuarioID)
                      
                    }
                    else{
                      setHuellaVerificada(true)
                      allowHuellas = false
                      //toast.info("Ya existe una huella asociada a esa CURP")
                    }
                    
                    
                  })
                  .catch(() => {
                    toast.error("Error al verificar registro de huellas");
                    setOk(false)
                    lectorResponded = false
                  });
                  //await requestFingerprint(Persona.CURP, 0, props.oidc.user.profile.UsuarioID)
                  
                }else{
                  console.log("No requiere huellas")
                  setOk(true)
                }
                
              })
              .catch(() => {
                toast.error("Error al verificar sucursal");
                lectorResponded = false
              });
            
            
            console.log("M: allowHuellas",allowHuellas)
            console.log("M: Huella verificada:", huellaVerificada)
            
            // Regresamos la nueva promesa
            
            // if(huellaVerificada || !allowHuellas)
            // {
            //   setOk(true)
              
            // }else
            // {
            //   setOk(false)
            // }
            console.log("M: ok", ok)
            
            return Funciones.FNAgregar(props.oidc, {
              ...Persona,
              AgregarCliente,
              AgregarDireccion,
              AgregarEmpleo,
              AgregarProspecto,
              AgregarDirector,
            }, huellaVerificada || !allowHuellas);
            //Eso está mandando un error, verificar el lunes

            
            
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
