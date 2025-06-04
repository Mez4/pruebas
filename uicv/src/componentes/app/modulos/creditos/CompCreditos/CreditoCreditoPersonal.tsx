import React, { useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CreditoCreditoPersonal/Funciones";
import * as FnVales from "./CreditoVale/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import {
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaBan,
  FaCashRegister,
  FaListAlt,
  FaRegCheckCircle,
  FaExclamationCircle,
  FaUniversity,
  FaFileDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter
} from "react-icons/fa";

// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner } from "../../../../global";
import { BuscarCreditos } from "./CreditoCreditoPersonal/BuscarCreditos";
// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from "react-icons/fi";
import {
  FiltrarDatos,
  addOneDay,
  formatDate,
} from "../../../../../global/functions";
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import { DBConfia_Creditos } from "../../../../../interfaces_db/DBConfia/Creditos";

import ReactTooltip from "react-tooltip";
import moment from "moment";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { Distribuidores, SeleccionarCajaSucursal, Sucursales } from "../../../../selectores";
import { Form, Formik } from "formik";
import { DescripcionDistribuidor } from "../../../../../global/variables";
import { DBConfia_Distribuidores } from "../../../../../interfaces_db/DBConfia/Distribuidores";
import { fetchExcepcionHuella, fetchHuellaDist, fetchLectorHuella } from "../../personas/CompAdministracion/Funciones";



type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
};

type EstadoTipo = {
  Datos: DBConfia_Distribuidores.ISolicitudesPrestamos_VW[];
  DatosMostrar: DBConfia_Distribuidores.ISolicitudesPrestamos_VW[];
  DatosDetalle: DBConfia_Creditos.IPlanPagos[];
  Filtro: string;
  Cargando: boolean;
  Error: boolean;
  Form: {
    Mostrar: boolean;
    Datos?: DBConfia_Creditos.ICreditos;
    Id?: number;
  };
  Detalle: boolean;
  DistribuidorID: number;
  Distribuidor: string;
  ClienteID: number;
  Cliente: string;
  CreditoID: number;
  ShowCaja: boolean;
  CajaDefault: {
    ProductoID: number;
    SucursalID: number;
    CajaID: number;
  };
  Desembolso: {
    Desembolsar: boolean;
    CreditoID: number;
    TipoDesembolsoID: number;
    Datos: any;
  };
  optSucursales: any[];
  showTable: boolean;
  filterTipoCredito: string;
  optEstatus: any[];
  FiltroEstatus: number;
};

const CreditoCreditoPersonal = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const [startDate, setStartDate] = useState(moment().add(-10, 'd').toDate());
  const [endDate, setEndDate] = useState(moment().toDate());
  const MySwal = withReactContent(Swal);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [state, setState] = React.useState<EstadoTipo>({
    Datos: [],
    DatosMostrar: [],
    DatosDetalle: [],
    Filtro: "",
    Cargando: false,
    Error: false,
    Form: {
      Mostrar: false,
      Datos: undefined,
      Id: undefined,
    },
    Detalle: false,
    DistribuidorID: 0,
    Distribuidor: "",
    ClienteID: 0,
    Cliente: "",
    CreditoID: 0,
    ShowCaja: false,
    CajaDefault: {
      ProductoID: 0,
      SucursalID: 0,
      CajaID: 0,
    },
    Desembolso: {
      Desembolsar: false,
      CreditoID: 0,
      TipoDesembolsoID: 0,
      Datos: {}
    },
    optSucursales: [],
    showTable: false,
    filterTipoCredito: "",
    optEstatus: [],
    FiltroEstatus: 0
  });

  const FNGetPersona = (PersonaID: number, e: any) => {
    Funciones.FNGetDatosPersonaPrestamo(props.oidc, PersonaID)
      .then((respuesta: any) => {
        requestFingerprint(e, respuesta.CURP, props.ui.Producto?.ProductoID, props.oidc.user.profile.UsuarioID)
      })
  }

  const FNGetDetalle = (CreditoID: number, data: any) => {
    console.log("CreditoID: ", CreditoID);
    console.log("Data: ", data);


    Funciones.FNGetPlanPagos(props.oidc, CreditoID)
      .then((respuesta: any) => {
        // console.log("Detalles del Pago: ", respuesta)
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Detalle: true,
          DatosDetalle: respuesta,
          DistribuidorID: data.DistribuidorID,
          Distribuidor: data.Distribuidor,
          ClienteID: data.ClienteID,
          Cliente: data.NombreCompleto,
          CreditoID,
        }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Detalle: false,
          DatosDetalle: [],
          DistribuidorID: 0,
          Distribuidor: "",
          ClienteID: 0,
          Cliente: "",
          CreditoID: 0,
        }));
        // }
      });
  };

  const fnGetFiltroEstatus = (EstatusID: number) => {
    setState(s => ({ ...s, FiltroEstatus: EstatusID }))
  }

  const FNAutorizar = (data: any, CajaID: number) => {
    console.log("CreditoID: ", data);
    let Datos = {
      SolicitudPrestamoPersonalID: data.SolicitudPrestamoPersonalID,
      DistribuidorID: data.DistribuidorID,
      ContratoID: data.ContratoID,
      ProductoID: data.ProductoID,
      PrestamoSolicitado: data.PrestamoSolicitado,
      PlazoSolicitado: data.PlazoSolicitado,
      CajaID
    }
    Funciones.FNAceptar(props.oidc, Datos)
      .then((respuesta: any) => {
        if (respuesta.EstatusID == 1) {
          console.log("respuesta: ", respuesta);

          toast.success("Se genero el credito exitosamente");
          //Ubicar un registro segun el SolicitudPrestamoPersonalID
          let index = state.Datos.findIndex((item) => item.SolicitudPrestamoPersonalID === data.SolicitudPrestamoPersonalID);
          // Actualizar su estatusID y mostrarlo en la tabla
          state.Datos[index].EstatusID = respuesta.EstatusID;
          //Añadir el creditoID en ese registro
          state.Datos[index].CreditoID = respuesta.CreditoID;
          //Actualizar el estado de la tabla
          setState(s => ({ ...s, Datos: state.Datos }))

          // cbActualizar(respuesta.Data);
          const resData = {
            CreditoID: respuesta.CreditoID,
            ProductoID: 0,
            CreditoID_2: 0,
            SoloFormatoExtra: true
          }
          console.log(resData);

          Funciones.FNReimprimirSolicitudPrestamosPersonalesPDF(props.oidc, resData)
            .then((res: any) => {
              const file = new Blob([res], { type: "application/pdf" });

              const fileURL = URL.createObjectURL(file);
              const enlaceTemporal = document.createElement("a");
              enlaceTemporal.href = fileURL;
              enlaceTemporal.target = "_blank";
              enlaceTemporal.style.display = "none";

              document.body.appendChild(enlaceTemporal);

              enlaceTemporal.click();
            }).catch((error: any) => {
              console.log(JSON.stringify(error));
              toast.error("Error al descargar el archivo, intente descargar nuevamente el archivo o reportarlo a sistemas");
            });
        } else {
          toast.warning(respuesta.msj);
        }
      })
      .catch(() => {
        toast.error("Error al autorizar el crédito, vuelva a intentarlo.");
      });
  };

  const FNGetTipoEstatus = () => {
    setState(s => ({ ...s, }))
    Funciones.FNGetEstatus(props.oidc)
      .then((respuesta: any) => {
        // añadir la opcion por defecto de todos

        //Quitar estatus cancelado y solicitado
        respuesta = respuesta.filter((item: any) => item.EstatusID !== 3 && item.EstatusID !== 4)
        respuesta.unshift({ EstatusID: 0, Estatus: 'TODOS' })
        var estatus = respuesta.map((valor: any) => {
          var obj = { value: valor.EstatusID, label: valor.Estatus };
          return obj
        });
        setState(s => ({ ...s, optEstatus: estatus }))
      })
      .catch(() => {
        setState(s => ({ ...s, optEstatus: [] }))
      })
  }

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Prestamo Personal ID",
        selector: "SolicitudPrestamoPersonalID",
        sortable: false,
        center: true,
        width: "200px",
        // hide: "sm" || "md",
      },
      { name: "Sucursal", selector: "NombreSucursal", sortable: true, width: "200px", center: true },
      { name: "Distribuidor ID", selector: "DistribuidorID", sortable: true, width: "150px", center: true },
      { name: "Nombre Completo", selector: "PersonaNombre", sortable: true, width: '300px', center: true },
      {
        name: "Estatus",
        selector: "Estatus",
        sortable: false,
        center: true,
        width: "150px",
      },

      {
        name: "Prestamo",
        selector: "PrestamoSolicitado",
        sortable: false,
        center: true,
        width: "150px",
        format: (row) => formatter.format(row.PrestamoSolicitado),
      },
      {
        name: "Plazos",
        selector: "PlazoSolicitado",
        sortable: false,
        center: true,
        width: "100px",
      },
      {
        name: "Persona Acepta",
        selector: "personaAcepta",
        sortable: true,
        center: true,
        width: "250px",
        cell: (props) => (
          <span>{props.personaAcepta != null ? props.personaAcepta : 'N/A'}</span>
        )
      },
      {
        name: "Fecha Solicitud",
        width: "210px",
        selector: "FechaSolicitud",
        sortable: true,
        center: true,
        cell: (props) => (
          <span>{moment(props.FechaSolicitud).format("DD/MM/YYYY hh:mm:ss")}</span>
        ),
      },
      {
        name: "Observaciones",
        selector: "Observaciones",
        sortable: false,
        center: true,
        width: "300px",
      }

    ];
    return colRet;
  }, []);

  const DetailColumns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { name: "# Pago", width: "95px", selector: "NoPago", sortable: true },
      {
        name: "Fecha Vencimiento",
        width: "110px",
        selector: "FechaVencimientoClienteFinal",
        sortable: false,
        cell: (props) =>
          props.NoPago != null ? (
            <span>
              {formatDate(
                addOneDay(new Date(props.FechaVencimientoClienteFinal))
              )}
            </span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.NoPago == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Importe",
        width: "150px",
        selector: "ImporteTotal",
        sortable: false,
        format: (row) => formatter.format(row.ImporteTotal),
      },
      {
        name: "Abono",
        width: "150px",
        selector: "Abonos",
        sortable: false,
        format: (row) => formatter.format(row.Abonos),
      },
      {
        name: "Saldo",
        width: "150px",
        selector: "SaldoActual",
        sortable: false,
        format: (row) => formatter.format(row.SaldoActual),
      },
      {
        name: "Comision",
        width: "150px",
        selector: "Comision",
        sortable: false,
        format: (row) => formatter.format(row.Comision),
      },
      {
        name: "Fecha Liquidacion",
        width: "110px",
        selector: "FechaLiquidacion",
        sortable: false,
        cell: (props) => (
          <span>
            {props.FechaLiquidacion
              ? moment(addOneDay(new Date(props.FechaLiquidacion))).format(
                "DD/MM/YYYY"
              )
              : ""}
          </span>
        ),
      },
      { name: "Dias Atraso", selector: "DiasAtraso", sortable: true },
    ];
    return colRet;
  }, []);

  const conditionalRowStyles = [
    {
      when: row => row.EstatusID === 1,
      style: {
        backgroundColor: 'rgba(5, 207, 149, 0.2)',
      }
    },
    {
      when: row => row.PrestamoSolicitado < 10,
      style: {
        backgroundColor: 'rgba(253, 212, 149, 0.5)',
      }
    }
  ]
  const btnHuella = React.useRef<any>();
  let Instrucciones: string;
  let btnHuellaTxt: string;
  //const Instrucciones = React.useRef<any>();
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
    e.preventDefault()
    console.log("Opening reader")
    const link = document.createElement('a');

    link.href = `cv://registrarhuella?productoid=${producto}&curp=${Curp}&usuarioid=${usuarioid}`;

    link.click();

    connectWebSocket();
  }

  const HiddenColumns: IDataTableColumn[] = [
    {
      name: "Acciones",
      sortable: false,
      wrap: true,
      cell: (data) => (
        <div style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}>
          <button
            title="Detalle"
            data-tip
            data-for={`DetalleTooltip${data.CreditoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type="button"
            onClick={() => {
              FNGetDetalle(data.CreditoID, data);
            }}
          >
            <FaListAlt />
          </button>
          <ReactTooltip
            id={`DetalleTooltip${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Detalle Crédito
          </ReactTooltip>

          <button
            disabled={data.EstatusID !== 2 || data.PrestamoSolicitado <= 0}
            data-tip="true"
            data-for={`AutorizarTooltip${data.CreditoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
              cursor: `${data.EstatusID == 2 ? "pointer" : "not-allowed"}`,
            }}
            type={"button"}
            onClick={() => {
              let allowHuellas = true
              fetchHuellaDist(props.oidc, data.DistribuidorID)
                .then((respuesta: any) => {
                  console.log("Check reg", respuesta)
                  if (respuesta) {
                    Instrucciones = "Verifique la identidad de la socia escaneando el dedo índice derecho"
                    btnHuellaTxt = "Verificar huella"
                  }
                  else {
                    Instrucciones = "Registre la huella de la socia escaneando el índice derecho 3 veces."
                    btnHuellaTxt = "Registrar huella"
                  }
                })
                .catch((error) => {
                  console.error("Error al verificar sucursal:", error);
                  toast.error("Error al verificar sucursal");
                });
              fetchLectorHuella(props.oidc, data.DistribuidorID)
                .then((respuesta: any) => {
                  allowHuellas = respuesta
                  console.log("DIstID", data.DistribuidorID)
                  if (allowHuellas) {
                    fetchExcepcionHuella(props.oidc, data.DistribuidorID)
                      .then((respuesta2: any) => {
                        console.log("Check reg", respuesta2);
                        allowHuellas = !respuesta2


                        console.log("Final", allowHuellas)

                        //Muestra el modal
                        MySwal.fire({
                          title: "<strong>Autorizar Crédito</strong>",
                          icon: "question",
                          html: (
                            <div className="text-center">
                              Se desembolasará el crédito ¿Desea continuar?
                              <div hidden={!allowHuellas}>
                                <div className="row">
                                  <div className="column is-half-desktop is-half-mobile">
                                    <label className="form-label mb-0 pl-3" htmlFor={"Nota"}>
                                      {/* Sucursal: {props.SucursalID}<br></br> */}
                                      {Instrucciones}</label>
                                  </div>

                                  <div className="column is-half-desktop is-half-mobile">
                                    <button ref={btnHuella} data-tip style={{ width: '100%', textAlign: 'center', justifyContent: "center", borderRadius: "4px" }} className="btn btn-primary pr-3" type={"button"}
                                      onClick={(e) => {
                                        let userID = props.oidc.user.profile.UsuarioID

                                        FNGetPersona(data.DistribuidorID, e)
                                      }}>{btnHuellaTxt}
                                    </button>
                                  </div>
                                </div>
                              </div>
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
                          console.log("Presionó aceptar", result.isConfirmed)
                          console.log("Sucursal tiene lector", allowHuellas)
                          console.log("Huella confirmada", huellaConfirmada)
                          if (result.isConfirmed && (huellaConfirmada || !allowHuellas)) {
                            // FNAutorizar(data)
                          }
                          if (result.isConfirmed && !huellaConfirmada && allowHuellas) {
                            toast.error("CONFIRME LA HUELLA PARA CONTINUAR")
                          }
                          huellaConfirmada = false
                        });

                      });
                  }
                  else {
                    //Muestra el modal
                    MySwal.fire({
                      title: "<strong>Autorizar Crédito</strong>",
                      icon: "question",
                      html: (
                        <div className="text-center">
                          Se desembolasará el crédito ¿Desea continuar?
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


                        setState((s) => ({
                          ...s,
                          CajaDefault: {
                            ProductoID: data.ProductoID,
                            SucursalID: data.SucursalID,
                            CajaID: data.CajaID,
                          },
                          Desembolso: {
                            Desembolsar: true,
                            CreditoID: data.CreditoID,
                            TipoDesembolsoID: data.TipoDesembolsoID,
                            Datos: data
                          },
                          ShowCaja: true,
                        }));

                      }
                    });
                  }


                }).catch((error) => {
                  toast.error("Error, por favor intente nuevamente");
                  console.error(error)
                })
            }}
          >
            <FaUniversity />
          </button>
          <ReactTooltip
            id={`AutorizarTooltip${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Desembolsar Crédito
          </ReactTooltip>
          <button
            data-tip="true"
            disabled={data.EstatusID == 2 ? true : false}
            data-for={`DetalleMovimientoTooltip${data.CreditoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
              cursor: `${data.EstatusID == 2 ? "not-allowed" : "pointer"}`,
            }}
            type="button"
            onClick={() => {
              MySwal.fire({
                title: "<strong>Descargar Detalle de Movimiento</strong>",
                icon: "question",
                html: (
                  <div className="text-center">
                    Se descargara el Detalle de Movimiento ¿Desea continuar?
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
                  FnVales.FNPdf(props.oidc, {
                    ProductoID: 1,
                    CreditoID: data.CreditoID,
                    CreditoID_2: 0,
                    SoloFormatoExtra: true,
                  })
                    .then((pdf: any) => {
                      const file = new Blob([pdf], {
                        type: "application/pdf",
                      });
                      var url = window.URL.createObjectURL(file);
                      const fileURL = URL.createObjectURL(file);
                      const enlaceTemporal = document.createElement("a");
                      enlaceTemporal.href = fileURL;
                      enlaceTemporal.target = "_blank";
                      enlaceTemporal.style.display = "none";
                      document.body.appendChild(enlaceTemporal);
                      enlaceTemporal.click();
                    })
                    .catch((error: any) => {
                      console.log(JSON.stringify(error));

                      toast.error(
                        "Error al descargar el archivo, intente descargar nuevamente el archivo o reportarlo a sistemas"
                      );
                    });
                }

              });
            }}
          >
            <FaFileDownload />
          </button>
          <ReactTooltip
            id={`DetalleMovimientoTooltip${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Descargar Detalle de Movimiento
          </ReactTooltip>
          <button
            data-tip="true"
            disabled={data.EstatusID == 2 ? true : false}
            data-for={`CartaCartaResponsiva${data.CreditoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
              cursor: `${data.EstatusID == 2 ? "not-allowed" : "pointer"}`
            }}
            type="button"
            onClick={() => {
              MySwal.fire({
                title: "<strong>Descargar Carta Responsiva</strong>",
                icon: "question",
                html: (
                  <div className="text-center">
                    Se descargara la Carta Responsiva ¿Desea continuar?
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
                  FnVales.FNPdf(props.oidc, {
                    ProductoID: data.ProductoID,
                    CreditoID: data.CreditoID,
                    CreditoID_2: 0,
                    Reimpresion: true,
                  })
                    .then((pdf: any) => {
                      const file = new Blob([pdf], {
                        type: "application/pdf",
                      });

                      var url = window.URL.createObjectURL(file);
                      var anchor = document.createElement("a");
                      anchor.download = "myfile.pdf";
                      anchor.href = url;
                      anchor.click();
                    })
                    .catch((error: any) => {
                      console.log(JSON.stringify(error));

                      toast.error(
                        "Error al descargar el archivo, intente descargar el archivo nuevamente o reportarlo a sistemas"
                      );
                    });
                }
              });
            }}
          >
            <FaFileDownload />
          </button>
          <ReactTooltip
            id={`CartaCartaResponsiva${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Descargar Carta Responsiva
          </ReactTooltip>
        </div >
      ),
    },

  ];
  // return col
  // }, [])

  const HiddenData = (data: any) => {
    const Datos = [data.data];
    console.log('Datos', Datos);
    return (
      <DataTable
        data={Datos}
        striped
        noHeader
        noTableHead
        responsive
        keyField={"CreditoID"}
        defaultSortField={"CreditoID"}
        columns={HiddenColumns}
      />
    );
  };

  React.useEffect(() => {
    if (isMounted.current === true) {
      // FNGetLocal()
      fnGetSucursalesCaja();
      FNGetTipoEstatus();
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    let datosFiltro = state.Datos

    if (state.FiltroEstatus > 0)
      datosFiltro = datosFiltro.filter((d: any) => { return d.EstatusID === state.FiltroEstatus })
    // setState((s) => ({
    //   ...s,
    //   DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    // }));
    setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    console.log('datosFiltro', datosFiltro);
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro, state.FiltroEstatus]);

  /** funcion Callback al agregar un item */
  const cbRespuesta = (Datos: any) => setState((s) => ({ ...s, Datos: Datos, showTable: true }));

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.SolicitudPrestamoPersonalID === item.SolicitudPrestamoPersonalID ? item : Dato
      ),
      Form: { ...state.Form, Mostrar: false, Datos: undefined },
    });



  const cbCancelar = (item: any) =>
    setState({
      ...state,
      Datos: state.Datos.filter((obj) => {
        return obj.CreditoID !== item.CreditoID;
      }),
    });






  const fnGetSucursalesCaja = () => {
    FnCajas.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        // console.log('respuesta: ', respuesta)

        var sucursales = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.Sucursal };
          return obj;
        });

        setState((s) => ({ ...s, optSucursales: sucursales }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optSucursales: [] }));
      });
  };

  const fnSetSucCaja = (Data: any) => {
    setState((s) => ({
      ...s,
      CajaDefault: {
        ProductoID: Data.ProductoID,
        SucursalID: Data.SucursalID,
        CajaID: Data.CajaID,
      },
      // Form: { ...state.Form, Datos: {...state.Form.Datos, SucursalId: Data.SucursalID, CajaID: Data.CajaID} },
      ShowCaja: false,
    }));
  };

  const FNAutorizar2 = (CreditoID: number, Datos2: any) => {
    setState((s) => ({
      ...s,
      CajaDefault: {
        ProductoID: 0,
        SucursalID: 0,
        CajaID: 0,
      },
      Desembolso: {
        Desembolsar: false,
        CreditoID: 0,
        TipoDesembolsoID: 0,
        Datos: {}
      },
    }));

    let Datos = {
      CreditoID,
      CajaID: state.CajaDefault.CajaID,
      SucursalID: state.CajaDefault.SucursalID,
    };

    FNAutorizar(Datos2, Datos.CajaID)
  };

  React.useEffect(() => {
    if (!state.ShowCaja && state.Desembolso.Desembolsar)
      FNAutorizar2(
        state.Desembolso.CreditoID,
        state.Desembolso.Datos
      );
  }, [state.ShowCaja]);


  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Administrar Créditos Préstamo Personal">
          <Card.Body>
            <Card.Body.Content>
              <Formik
                initialValues={{
                  SucursalID: 0,
                  FechaInicio: moment().add(-10, "d").toDate(),
                  FechaFin: new Date(),
                  EstatusID: 0
                }}
                onSubmit={(values: any) => {
                  console.log(values);
                  let obj = {
                    //Si sucursalID tiene valor en cadena 'Seleccione una Sucursal' se envia 0
                    SucursalID: values.SucursalID === 'Seleccione una Sucursal' ? 0 : values.SucursalID,
                    DistribuidorID: values.DistribuidorID,
                    FechaInicio: values.FechaInicio,
                    FechaFin: values.FechaFin,
                    EstatusID: values.EstatusID,

                  }
                  Funciones.FNgetbyfiltros(props.oidc, obj).then((respuesta: any) => {
                    console.log('respuesta', respuesta)
                    setState(s => ({ ...s, Datos: respuesta, showTable: true }))
                  }).catch(() => {
                    setState(s => ({ ...s, Datos: [], showTable: false }))
                    toast.error("Error al consultar los datos")
                  })

                }}
              >
                {({ values }) => (
                  <Form>
                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px', }}>
                      <div>
                        <div style={{ float: 'left' }} className='mx-3'><FaFilter /></div>
                        <div ><label> FILTROS</label></div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: '', }} className=''>
                          <div className="d-flex justify-content-center row">
                            {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Productos oidc={props.oidc} isSingle disabled={loading} name={'ProductoID'} valor={values.ProductoID} ui={props.ui} />
                                    </div> */}
                            {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Zonas oidc={props.oidc} cargar disabled={loading} name={'ZonaID'} isProducto />
                                    </div> */}
                            <div className="col-sm-12 col-md-3 col-lg-4 col-xl-2 text-center mt-1">
                              <Sucursales disabled={false} name={'SucursalID'} valor={values.SucursalID} Permiso />
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-4 col-xl-3 text-center">
                              <Distribuidores disabled={false} WithProducto SucursalID={values.SucursalID} name={'DistribuidorID'} label={`${DescripcionDistribuidor(1)}`} />
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-4 col-xl-2 text-center">
                              <ActionSelect
                                disabled={false}
                                label="Estatus"
                                name="EstatusID"
                                placeholder="TODOS"
                                options={state.optEstatus}
                                addDefault={false}
                                valor={state.FiltroEstatus}
                                accion={fnGetFiltroEstatus}
                              />
                            </div>


                          </div>
                          <div className="d-flex justify-content-center row">
                            <div className="col-sm-12 col-md-3 col-lg-4 col-xl-2 text-center">
                              <DatePickeStart name={'FechaInicio'} label={'Fecha Inicial'} disabled={false} placeholder={'Inicio'} isClearable startDate={startDate} endDate={endDate} setStartDate={setStartDate} />
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-4 col-xl-2 text-center">
                              <DatePickeEnd name={'FechaFin'} label={'Fecha Final'} disabled={false} placeholder={'Final'} isClearable startDate={startDate} endDate={endDate} setEndDate={setEndDate} />
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-4 col-xl-1 text-center mt-4">
                              <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => { }}>
                                <span className="is-hidden-touch">Buscar</span>&nbsp;<FiRefreshCcw />
                              </button>
                            </div>
                          </div>
                          {/* <div className="columns is-desktop is-tablet">
                                    <div className="column">
                                        
                                    </div>
                                </div> */}
                        </div>
                      </div>
                    </div>
                    {/* {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <br />
                            <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => { }}>
                                <span className="is-hidden-touch">Buscar</span>&nbsp;<FiRefreshCcw />
                            </button>
                        </div>
                    } */}
                  </Form>
                )}
              </Formik>
              {/* <BuscarCreditos
                oidc={props.oidc}
                ui={props.ui}
                initialValues={{
                  ProductoID: 0,
                  ClienteID: 0,
                  SucursalID: 0,
                  CajaID: 0,
                  ZonaID: 0,
                  EmpresaID: 0,
                  DistribuidorID: 0,
                  CoordinadorID: 0,
                  ContratoID: 0,
                  EstatusID: "A",
                  DistribuidorNivelID: 0,
                  FechaInicio: moment().add(-10, "d").toDate(),
                  FechaFin: new Date(),
                }}
                cbRespuesta={cbRespuesta}
              /> */}
              {state.Cargando &&
                <div className="mt-2">
                  <Spinner />
                  Cargando datos...
                </div>
              }
              {state.Error && <span>Error al cargar los datos...</span>}
              {state.showTable && !state.Error &&
                <div>

                  <DataTable
                    noHeader
                    subHeader
                    noDataComponent={
                      <div className="text-center" style={{ margin: '4em' }}>
                        <FaExclamationCircle /><h5>No hay datos</h5>
                      </div>
                    }
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12 mt-3">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Busqueda General"
                              value={state.Filtro}
                              onChange={(e) =>
                                setState((s) => ({
                                  ...s,
                                  Filtro: e.target.value,
                                }))
                              }
                            />
                            <span className="input-group-text">
                              <FaSearch />
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                    data={state.DatosMostrar}
                    striped
                    pagination
                    dense
                    // noHeader
                    responsive
                    keyField={"CreditoID"}
                    defaultSortField={"CreditoID"}
                    columns={Columns}
                    expandableRows
                    conditionalRowStyles={conditionalRowStyles}
                    onRowExpandToggled={(res: any) => {
                      HiddenData(res);
                    }}
                    paginationComponentOptions={{ rowsPerPageText: 'Registros por página:', rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todo' }}
                    expandableRowsComponent={<HiddenData />}
                  />


                  <ModalWin open={state.Form.Mostrar}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {state.Form.Id ? "Editar Crédito" : "Agregar Crédito"}
                      </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      <div></div>
                      {/* <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar} /> */}
                    </ModalWin.Body>
                  </ModalWin>

                  <ModalWin open={state.Detalle} xlarge scrollable>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {"Plan de Pagos"} <br />
                        {"Socia: " +
                          state.DistribuidorID +
                          " - " +
                          state.Distribuidor}{" "}
                        <br />
                        {"Cliente: " +
                          state.ClienteID +
                          " - " +
                          state.Cliente}{" "}
                        <br />
                        {"N°Crédito: "}
                        {state.CreditoID}
                      </h5>
                      <button
                        title="Cerrar"
                        type="button"
                        className="delete"
                        onClick={() => setState({ ...state, Detalle: false })}
                      />
                    </ModalWin.Header>
                    <ModalWin.Body>
                      <DataTable
                        noDataComponent={
                          <div className="text-center" style={{ margin: '4em' }}>
                            <FaExclamationCircle /><h5>No hay datos</h5>
                          </div>
                        }
                        data={state.DatosDetalle}
                        striped
                        dense
                        noHeader
                        responsive
                        keyField={"NoPago"}
                        defaultSortField={"NoPago"}
                        columns={DetailColumns}
                      />
                    </ModalWin.Body>
                  </ModalWin>

                  {state.ShowCaja && (
                    <ModalWin open={state.ShowCaja} large scrollable>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Selección de Caja</h5>
                      </ModalWin.Header>
                      <ModalWin.Body>
                        {state.ShowCaja && (
                          <SeleccionarCajaSucursal
                            optSucursales={state.optSucursales}
                            initialValues={state.CajaDefault}
                            cbAceptar={fnSetSucCaja}
                          />
                        )}
                      </ModalWin.Body>
                    </ModalWin>
                  )}
                </div>
              }
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditoCreditoPersonal);
