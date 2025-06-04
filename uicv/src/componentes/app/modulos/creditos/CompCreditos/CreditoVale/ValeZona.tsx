import React, { useRef, useState, useEffect, memo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Card,
  Spinner,
  CustomFieldText,
  ActionSelect,
  ActionCreatableSelect,
  ActionFieldText2,
  ActionAsyncSelect,
  Carrusel,
  CustomFieldDatePicker,
  ImgViewer,
} from "../../../../../global";
import {
  ControlDatosBancarios,
  BuscarDatosBancarios,
  Cajas,
  Clientes,
  Sucursales,
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
  FaShoppingCart,
  FaCloudDownloadAlt,
  FaAddressCard,
  FaEye,
} from "react-icons/fa";
import CreditoArticulos from "../CreditoArticulos";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
import * as FnPersona from "../../../personas/CompAdministracion/CompPersona/Funciones";
import { PerfilPersonaParaCapturaDeVales } from "../../../../../presentacion/persona/PerfilPersonaParaCapturaDeVales";
import { DBConfia_General } from "../../../../../../interfaces_db/DBConfia/General";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import VerDoc from "../../../Prospeccion/CompProspeccion/DocsProspecto/VerDoc";
import {
  DescripcionDistribuidor,
  FormateoDinero,
} from "../../../../../../global/variables";
import moment from "moment";
import { DBConfia_Creditos } from "../../../../../../interfaces_db/DBConfia/Creditos";
import { FNObtenerPorId } from "../../../../../presentacion/ditribuidor/CompPerfilDistribuidor/Funciones";
import { CtxCreditoTiendita } from "../CreditoTienditaSocia/CreditoTienditaContext";
import FolioConfirmacion from "../FolioConfirmacion/FolioConfirmacion";

type ValeZonaType = {
  oidc: IOidc;
  ui: iUI;
  ProductoID: number;
  Id?: number;
  initialValues: {
    // ProductoId: number,
    SucursalId: number;
    SucursalDistID?: number;
    Sucursal?: string;
    CajaID: number;
    DistribuidorId: number;
    Distribuidor?: string;
    ClienteId: number;
    Capital: number;
    Folio: number;
    SerieId: number;
    Plazos: number;
    TipoDesembolsoID: number;
    // datoBancario: string,
    personasDatosBancariosID: number;
    RequiereDatosBancarios: boolean;
    FechaExpedicion: Date;
    NombreBeneficiario: string;
    ApellidoPaternoBeneficiario: string;
    ApellidoMaternoBeneficiario: string;
    ParentescoBeneficiario: string;
    FechaNacimientoBeneficiario: Date | null;
    // Cuenta: string,
  };
  ActualizarCreditoModal(CreditoIDConfirmado: any): any;
  AbrirPlanDePagos(): any;
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  fnGetTiposDesembolso(SucursalId: number, ProductoID: number): any;
  fnGetDistribuidores(id: any): any;
  fnGetClientes(DistribuidorID: number, Nombre: string, callback: any): any;
  fnGetCondicionesDetalle(
    ProductoID: number,
    SucursalId: number,
    DistribuidorID: number
  ): any;
  fnGetListaPlazos(Capital: number): any;
  fnGetFolios(id: number, SerieId: number, Folio: number): any;
  // fnGetSeries(id: number): any,
  fnGetDatosCliente(id: any): any;
  fnGetDatosFolios(id: any): any;
  fnGetDatosDistribuidor(id: any): any;
  fnGetLineaTiendita(id: any): any;
  fnGetDatosTipoDesembolso(id: any): any;
  fnGetUltimoBeneficiario(ClienteID: number, DistribuidorId: number): any;
  fnGetDistribuidor(id: any, callback?: (options: any) => void): any;
  // optProductos: { value: number, label: string }[],
  optDistribuidores: { value: number; label: string }[];
  optSucursales: { value: number; label: string }[];
  optClientes: { value: number; label: string }[];
  optCapital: { value: string; label: string }[];
  optPlazos: { value: number; label: string }[];
  optTiposDesembolso: { value: number; label: string }[];
  optSeries: { value: number; label: string }[];
  optFolios: {
    value: number;
    label: string;
    estatus: string;
    valedigital: boolean;
  }[];
  isUpdate: boolean;
  DatosCliente: any;
  DatosDistribuidor: any;
  DatosFolio: any;
  DatosTipoDesembolso: any;
  ProdTiendita: number;
  Sistema: string;
  TabTiendita: {
    ProductoID: number;
    DistribuidorNivelID: number;
    PorcComisionBase: number;
    CapitalColocadoMinimo: number;
    CapitalColocadoMaximo: number;
    ImporteProteccionSaldo: number;
    importeMaxCanje: number;
    maximoPrestamoPersonal: number;
    maximoImporteCanjeCliente: number;
    maximoImporteCanjeAval: number;
    monto: number;
  };
  ShowFechaExpedicion: boolean;
  // ShowStore: boolean
};

type EstadoTipo = {
  Datos: {
    Persona?: DBConfia_General.IPersonas_VW;
    Direcciones: DBConfia_General.IDirecciones_VW[];
    Empleos: DBConfia_General.IEmpleos_VW[];
    ContCreditos: DBConfia_Creditos.ICreditos_VW[];
    Creditos?: DBConfia_Creditos.ICreditos_VW;
  };
  Cargando: boolean;
  Error: boolean;
  FechaMax: Date;
  EstructuraID: [];
  ShowDatosBancarios: boolean;
  Validado: boolean;
  ShowFolio: boolean;
  values: {
    SucursalId: number;
    CajaID: number;
    DistribuidorId: number;
    ClienteId: number;
    Capital: number;
    SerieId: number;
    Folio: number;
    SucursalDistID: number;
    FechaExpedicion: any;
    Plazos: number;
    TipoDesembolsoID: number;
    NombreBeneficiario: string;
    ApellidoPaternoBeneficiario: string;
    ApellidoMaternoBeneficiario: string;
    ParentescoBeneficiario: string;
    FechaNacimientoBeneficiario: Date | null;
  };
};

const ParentescoBeneficiarioValues: { label: string; value: number }[] = [
  { label: "Padre", value: 1 },
  { label: "Madre", value: 2 },
  { label: "Hijo(a)", value: 3 },
  { label: "Tio(a)", value: 4 },
  { label: "Primo(a)", value: 5 },
  { label: "Otro", value: 6 },
];

export const ValeZona = (props: ValeZonaType) => {
  const [ArticulosCarrito, setArticulosCarrito] = useState([]);

  const MySwal = withReactContent(Swal);

  const [Estado, DefinirEstado] = useState<EstadoTipo>({
    Datos: {
      Persona: undefined,
      Empleos: [],
      Direcciones: [],
      ContCreditos: [],
      Creditos: undefined,
    },
    Cargando: true,
    Error: false,
    FechaMax: moment().add(-30, "d").toDate(),
    EstructuraID: [],
    ShowDatosBancarios: false,
    Validado: false,
    ShowFolio: false,
    values: {
      SucursalId: 0,
      CajaID: 0,
      DistribuidorId: 0,
      SucursalDistID: 0,
      ClienteId: 0,
      Capital: 0,
      SerieId: 0,
      Folio: 0,
      FechaExpedicion: new Date(),
      Plazos: 0,
      TipoDesembolsoID: 0,
      NombreBeneficiario: "",
      ApellidoPaternoBeneficiario: "",
      ApellidoMaternoBeneficiario: "",
      ParentescoBeneficiario: "",
      FechaNacimientoBeneficiario: null,
    },
  });

  const [loading, setLoading] = useState(false);

  const [ShowStore, setShowStore] = useState(false);

  const [ShowClientePerfil, setShowClientePerfil] = useState(false);

  const [ShowDatosBancarios, setShowDatosBancarios] = useState(false);

  const [CanjearVale, setCanjearVale] = useState(false);

  const [ComprarTienda, setComprarTienda] = useState(false);

  const [articles, setArticles] = useState([]);

  const [articulosIds, setArticulosIds] = useState([]);

  const [shopInfo, setShopInfo] = useState({
    totalItems: 0,
    totalPrice: 0,
    totalQty: 0,
    totalPriceOrg: 0,
  });

  const [capital, setCapital] = useState(0);

  const [documentoID, setDocumentoID] = useState(0);

  const [creditoVale, setCreditoVale] = useState(0);

  const [creditoTienda, setCreditoTienda] = useState(0);

  const [MovimientoID, setMovimientoID] = useState(0);

  const [VentaId, setVentaId] = useState(0);

  const [errorVale, setErrorVale] = useState(false);

  const [errorTienda, setErrorTienda] = useState(false);

  const [resCredito, setResCredito] = useState(false);

  const [formValues, setFormValues] = useState({
    optDistribuidores: [{ value: 0, label: "" }],
    optCapital: [{ value: "", label: "" }],
    optPlazos: [{ value: 0, label: "" }],
    optTiposDesembolso: [{ value: 0, label: "" }],
    optFolios: [{ value: 0, label: "", estatus: "" }],
    optSeries: [{ value: 0, label: "" }],
    optSucursalDist: [{ value: 0, label: "" }],
    SucursalId: props.initialValues.SucursalId,
    CajaID: props.initialValues.CajaID,
    DistribuidorId: props.initialValues.DistribuidorId,
    ClienteId: props.initialValues.ClienteId,
    Capital: props.initialValues.Capital,
    SerieId: props.initialValues.SerieId,
    Folio: props.initialValues.Folio,
    Plazos: props.initialValues.Plazos,
    TipoDesembolsoID: props.initialValues.TipoDesembolsoID,
    DatosFolio: props.DatosFolio,
    TabTiendita: props.TabTiendita,
    personasDatosBancariosID: props.initialValues.personasDatosBancariosID,
  });

  const [SucTienda, setSucTienda] = useState({
    id_empresa: 0,
    id_sucursal: 0,
    id_origen: "",
    sistema: "",
  });

  const [total, setTotal] = useState(0);

  const [verFirma, setVerFirma] = useState(false);

  const refSucursal = useRef<Select>(null);
  const refSucursalDist = useRef<Select>(null);
  const refDistribuidor = useRef<Select>(null);
  const refCliente = useRef<AsyncSelect<[], false>>(null);
  const refCapital =
    useRef<CreatableSelect<{ value: string; label: string }, false>>(null);
  const refSerie = useRef<Select>(null);
  const refFolio = useRef<Select>(null);
  const refPlazos = useRef<Select>(null);
  const refParentescos = useRef<Select>(null);
  const refTipoDesembolso = useRef<Select>(null);

  const loadOptionsClientes = (inputText: string, callback: any) => {
    // const distribuidor: any = refDistribuidor;
    // const DistribuidorID = distribuidor.current.props.value.value as number;
    props.fnGetClientes(0, inputText, callback);
  };

  const clearFormByLevel = (level: number) => {
    if (level === 0) {
      setArticulosCarrito([]);
      setArticulosIds([]);
      setShopInfo({
        totalItems: 0,
        totalPrice: 0,
        totalQty: 0,
        totalPriceOrg: 0,
      });
      refSerie.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    if (level === 0 || level === 1) {
      setFormValues((s) => ({
        ...s,
        optCapital: [],
        optFolios: [],
        optPlazos: [],
      }));
      refDistribuidor.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
      refTipoDesembolso.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
      refParentescos.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
      refCliente.current?.select;
    }
    if (level === 0 || level === 1 || level === 2) {
      const capital: any = refCapital.current?.select;
      capital.select.clearValue();
      if (!props.isUpdate) {
        const cliente: any = refCliente.current?.select;
      }
      refPlazos.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    if (level === 0 || level === 1 || level === 2 || level === 3) {
      refFolio.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    if (level === 4) {
      setArticulosCarrito([]);
      setArticulosIds([]);
      setShopInfo({
        totalItems: 0,
        totalPrice: 0,
        totalQty: 0,
        totalPriceOrg: 0,
      });
    }
  };

  const fnGetCondicionesDetalle = () => {
    const sucursal: any = refSucursal;
    // const distribuidor: any = refDistribuidor;

    const ProductoID = props.ProductoID;
    const SucursalId = sucursal.current.props.value.value as number;
    // const DistribuidorID = distribuidor.current.props.value.value as number;

    props.fnGetCondicionesDetalle(
      ProductoID,
      SucursalId,
      formValues.DistribuidorId
    );
  };

  const fnSetCapital = (value: number) => {
    setCapital(value == 0 ? 0 : value);
  };

  const cbSucursal = (value: any) => {
    setFormValues((s) => ({ ...s, SucursalId: value }));
    if (!props.isUpdate) {
      clearFormByLevel(1);
    }
    // props.fnGetDistribuidores(value)
    props.fnGetTiposDesembolso(value, props.ProductoID);
  };

  const validarDistribuidor = (value: any) => {
    FNObtenerPorId(props.oidc, value)
      .then((respuesta: any) => {
        if (respuesta.DistribuidoresEstatusID == "T") {
          clearFormByLevel(0);
          toast.info(
            `La socia ${respuesta.DistribuidorID} - ${respuesta.PersonaNombre} está cancelada temporalmente`
          );
        } else if (respuesta.DistribuidoresEstatusID == "F") {
          clearFormByLevel(0);
          toast.info(
            `La socia ${respuesta.DistribuidorID} - ${respuesta.PersonaNombre} está en estatus Fallecida`
          );
        } else {
          setFormValues((s) => ({
            ...s,
            optSucursalDist: [
              {
                value: respuesta.SucursalID,
                label: respuesta.Sucursal_Nombre,
              },
            ],
          }));
          // refDistribuidor.current?.select.setValue({ value: respuesta.DistribuidorID, label: respuesta.PersonaNombre }, "select-option")
          // refSucursalDist.current?.select.setValue({ value: respuesta.SucursalID, label: respuesta.Sucursal_Nombre }, "select-option")
        }
      })
      .catch(() => {
        toast.error("Ha ocurrido un error al obtener la socia");
      });
  };

  //Validar Cliente
  const validarCliente = (ClienteId: any) => {
    FnPersona.FNGetCliente(props.oidc, { ClienteId })
      .then((respuesta: any) => {
        console.log("Entra validarCliente", respuesta);
        if (!respuesta.CanjeaVale) {
          toast.info(`El cliente ${ClienteId} está bloqueado temporalmente`);
          props.fnGetUltimoBeneficiario(0, formValues.DistribuidorId);
        } else {
          // console.log(formValues.DistribuidorId)
          props.fnGetUltimoBeneficiario(
            respuesta.ClienteID,
            formValues.DistribuidorId
          );
        }
      })
      .catch(() => {
        toast.error("Ha ocurrido un error al obtener al cliente");
      });
  };

  const cbDistribuidor = (value: any) => {
    setFormValues((s) => ({ ...s, DistribuidorId: value }));
    if (!props.isUpdate) {
      clearFormByLevel(2);
    }
    props.fnGetDatosDistribuidor(value);
    props.fnGetLineaTiendita(value);
  };

  const cbCliente = (value: any) => {
    setFormValues((s) => ({ ...s, ClienteId: value }));
    props.fnGetDistribuidor(value, validarDistribuidor);
    props.fnGetDatosCliente(value);
    validarCliente(value);
  };

  const cbSerie = (value: any) => {
    setFormValues((s) => ({ ...s, SerieId: value }));
    if (!props.isUpdate) {
      clearFormByLevel(3);
    }
  };

  const cbFolio = (value: any) => {
    setFormValues((s) => ({ ...s, Folio: value }));
    props.fnGetDatosFolios(value);
    props.fnGetFolios(formValues.DistribuidorId, formValues.SerieId, value);
  };

  const cbPlazo = (value: any) => {
    setFormValues((s) => ({ ...s, Plazos: value }));
  };

  const cbTipoDesembolso = (value: any) => {
    setFormValues((s) => ({ ...s, TipoDesembolsoID: value }));
    props.fnGetDatosTipoDesembolso(value);
  };

  const cbSucTienda = (values: any) => {
    setSucTienda((s) => ({
      ...s,
      id_empresa: values.id_empresa,
      id_sucursal: values.id_sucursal,
      id_origen: values.id_origen,
      sistema: values.sistema,
    }));
  };

  const cbArticles = (values: any) => {
    console.log("TIENDA", values);
    console.log("cart.itemssss", values.cart.items);
    setShowStore(false);
    if (values.cart !== null) {
      setArticulosCarrito(values.cart.items);
      setArticulosIds(
        values.cart.items.map((valor: any) => {
          return valor.id;
        })
      );
      setShopInfo(values.cart.info);
    } else {
      setArticulosCarrito([]);
      setArticulosIds([]);
      setShopInfo({
        totalItems: 0,
        totalPrice: 0,
        totalQty: 0,
        totalPriceOrg: 0,
      });
    }
  };

  const fnCancelarDatosBancarios = () => setShowDatosBancarios(false);

  const fnCerrarFirma = () => setVerFirma(false);

  const cbDatosBancarios = (item: any) =>
    DefinirEstado((s) => ({ ...s, ShowDatosBancarios: false }));

  const cbAceptarDatosBancarios = (id: number) => {
    setShowDatosBancarios(false);
    setFormValues((s) => ({ ...s, personasDatosBancariosID: id }));
  };

  useEffect(() => {
    if (props.DatosDistribuidor) {
      setDocumentoID(props.DatosDistribuidor.DocumentoID);
    } else {
      setDocumentoID(0);
    }
  }, [props.DatosDistribuidor]);

  const fnCerrar = () => {
    Estado.ShowFolio = false;
  };

  const fnGenerarCredito = () => {
    Estado.Validado = true;
    if (!props.optFolios.length && !props.isUpdate) {
      MySwal.fire({
        title: "<strong>Folio inválido</strong>",
        icon: "error",
        html: (
          <div className="text-center">
            El folio: {Estado.values.Folio} no pertenece a la{" "}
            {DescripcionDistribuidor(1)} con el id:{" "}
            {Estado.values.DistribuidorId} para la serie:{" "}
            {Estado.values.SerieId}
          </div>
        ),
        showCloseButton: false,
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false,
        cancelButtonText: "Cerrar",
        confirmButtonAriaLabel: "",
        cancelButtonAriaLabel: "",
      });
    } else {
      // Finish the callback

      if (shopInfo.totalPrice <= formValues.TabTiendita.importeMaxCanje) {
        // setResCredito(true)
        // setLoading(true)
        // setCanjearVale(true)

        if (props.Id! > 0) {
          setResCredito(true);
          setLoading(true);
          setCanjearVale(true);

          Funciones.FNUpdate(props.oidc, {
            ...Estado.values,
            CreditoID: props.Id,
            Capital: Estado.values.Capital,
            ProductoID: props.ProductoID,
            TipoCanje: 1,
            // Monto: shopInfo.totalPrice
            // ArticulosCarrito: ArticulosCarrito
          })
            .then((respuesta: any) => {
              // console.log(respuesta)
              if (respuesta.regresa === 1) {
                toast.success(
                  `Se modificó el crédito con el N° ${respuesta.CreditoId}`
                );
                setCreditoVale(respuesta.CreditoId);
                setMovimientoID(respuesta.MovimientoID);
                setVentaId(respuesta.VentaId);
                setErrorVale(false);
                // props.cbActualizar(respuesta)
                if (ArticulosCarrito.length > 0) {
                  setCanjearVale(false);
                } else {
                  toast.info(
                    "Se está generando el pagaré, por favor espere..."
                  );

                  Funciones.FNPdf(props.oidc, {
                    ProductoID: props.ProductoID,
                    CreditoID: respuesta.CreditoId,
                    CreditoID_2: 0,
                  })
                    .then((pdf: any) => {
                      const file = new Blob([pdf], {
                        type: "application/pdf",
                      });

                      // const fileURL = URL.createObjectURL(file);

                      // window.open(fileURL);

                      var url = window.URL.createObjectURL(file);
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

                      setCanjearVale(false);

                      if (props.isUpdate) {
                        props.cbGuardar(respuesta.Credito);
                      }
                    })
                    .catch((error: any) => {
                      console.log(JSON.stringify(error));

                      toast.error(
                        "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                      );

                      setLoading(false);

                      setCanjearVale(false);
                    });
                }
              } else {
                setLoading(false);
                setResCredito(false);
                toast.error(respuesta.msj);
              }
            })
            .catch((error: any) => {
              console.log(JSON.stringify(error));
              setErrorVale(true);
              setLoading(false);
              setResCredito(false);
              toast.error("Error al crear el vale");
            });
        } else {
          setResCredito(true);
          setLoading(true);
          setCanjearVale(true);

          // <FolioConfirmacion
          //     PersonaID={formValues.DistribuidorId}
          //     cbGuardar={cbDatosBancarios}
          //     Validado={Estado.Validado}
          // />

          Funciones.FNCheckBox(props.oidc, Estado.values.CajaID).then(
            (res: any) => {
              // console.log(res);

              if (!res.Cerrada) {
                console.log(res.Cerrada);
                console.log("articulos", ArticulosCarrito);

                Funciones.FNValeZona(props.oidc, {
                  ...Estado.values,
                  Capital: Estado.values.Capital,
                  ProductoID: props.ProductoID,
                  Monto: shopInfo.totalPrice,
                  articles: ArticulosCarrito,
                  TipoCanje: 1,
                  ParentescoBeneficiario: Estado.values.ParentescoBeneficiario,
                  Sucursal: SucTienda,
                  Validado: Estado.Validado,
                })
                  .then((respuesta: any) => {
                    if (respuesta.status || respuesta.regresa === 1) {
                      toast.success(
                        `Se creó el crédito con el N° ${respuesta.CreditoId}`
                      );
                      props.ActualizarCreditoModal(respuesta.CreditoId);
                      // console.log("respuesta creditoid", respuesta)
                      setCreditoVale(respuesta.CreditoId);
                      setMovimientoID(respuesta.MovimientoID);
                      setVentaId(respuesta.VentaId);
                      setErrorVale(false);
                      // clearFormByLevel(0)
                      // resetForm()

                      toast.info(
                        "Se está generando el pagaré, por favor espere..."
                      );

                      if (respuesta.TipoDesembolsoID != 7) {
                        Funciones.FNPdf(props.oidc, {
                          ProductoID: props.ProductoID,
                          CreditoID: respuesta.CreditoId,
                          CreditoID_2: 0,
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
                            setLoading(false);
                            setCanjearVale(false);
                          })
                          .catch((error: any) => {
                            console.log(JSON.stringify(error));

                            toast.error(
                              "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                            );

                            setLoading(false);

                            setCanjearVale(false);
                          });
                      } else {
                        Funciones.FNPdf2(props.oidc, {
                          CreditoId: respuesta.CreditoId,
                          personasDatosBancariosID:
                            props.initialValues.personasDatosBancariosID,
                        })
                          .then((respuesta: any) => {
                            const file = new Blob([respuesta], {
                              type: "application/pdf",
                            });

                            const fileURL = URL.createObjectURL(file);

                            window.open(fileURL);

                            setLoading(false);

                            setCanjearVale(false);
                          })
                          .catch(() => {
                            toast.error("Error al generar el documento");

                            setLoading(false);

                            setCanjearVale(false);
                          });
                      }
                    } else {
                      setLoading(false);
                      setResCredito(false);
                      toast.warning(respuesta.msj);
                    }
                    setLoading(false);
                  })
                  .catch((error: any) => {
                    console.log(JSON.stringify(error));
                    setErrorVale(true);
                    setLoading(false);
                    setResCredito(false);
                    toast.error("Error al crear el vale");
                  });
              } else {
                console.log(res.Cerrada);

                toast.info("La caja esta cerrada, no es posible continuar...");
                setLoading(false);
                setResCredito(false);
                setCanjearVale(false);
              }
            }
          );
        }
      } else {
        toast.error(
          `El límite de compra en la tiendita para este vale es de $${formValues.TabTiendita.importeMaxCanje}`
        );
      }
    }
  };

  useEffect(() => {
    setFormValues((s) => ({
      ...s,
      optDistribuidores: props.optDistribuidores,
    }));
  }, [props.optDistribuidores]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, optCapital: props.optCapital }));
  }, [props.optCapital]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, optFolios: props.optFolios }));
  }, [props.optFolios]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, optSeries: props.optSeries }));
  }, [props.optSeries]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, optPlazos: props.optPlazos }));
  }, [props.optPlazos]);

  useEffect(() => {
    if (props.optTiposDesembolso.length > 1)
      setFormValues((s) => ({
        ...s,
        optTiposDesembolso: props.optTiposDesembolso,
      }));
  }, [props.optTiposDesembolso]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, DatosFolio: props.DatosFolio }));
  }, [props.DatosFolio]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, TabTiendita: props.TabTiendita }));
  }, [props.TabTiendita]);

  useEffect(() => {
    setTotal(capital + shopInfo.totalPrice);
  }, [capital, shopInfo.totalPrice]);

  useEffect(() => {
    if (props.initialValues.Capital > 0) {
      // console.log('Capital', props.initialValues.Capital)
      const capital: any = refCapital.current?.select;
      capital.select.setValue(
        {
          value: props.initialValues.Capital,
          label: props.initialValues.Capital,
        },
        "select-option"
      );
      fnSetCapital(props.initialValues.Capital);
    }
  }, [props.initialValues.Capital]);

  // useEffect(() => {
  //     if (props.initialValues.DistribuidorId > 0) {
  //         validarDistribuidor(props.initialValues.DistribuidorId)
  //     }
  // }, [props.initialValues.DistribuidorId]);

  useEffect(() => {
    if (props.initialValues.ClienteId > 0) {
      setFormValues((s) => ({
        ...s,
        ClienteId: props.initialValues.ClienteId,
      }));
    }
  }, [props.initialValues.ClienteId]);

  useEffect(() => {
    if (
      props.initialValues.TipoDesembolsoID > 0 &&
      props.initialValues.personasDatosBancariosID > 0
    ) {
      cbTipoDesembolso(props.initialValues.TipoDesembolsoID);
    }
  }, [props.optTiposDesembolso]);

  useEffect(() => {
    if (props.initialValues.TipoDesembolsoID > 0) {
      cbTipoDesembolso(props.initialValues.TipoDesembolsoID);
    }
  }, [props.initialValues.TipoDesembolsoID]);

  useEffect(() => {
    if (props.initialValues.personasDatosBancariosID > 0) {
      setFormValues((s) => ({
        ...s,
        personasDatosBancariosID: props.initialValues.personasDatosBancariosID,
      }));
    }
  }, [props.initialValues.personasDatosBancariosID]);

  useEffect(() => {
    console.log("DatosTipoDesembolso: ", props.DatosTipoDesembolso);
  }, [props.DatosTipoDesembolso]);

  useEffect(() => {
    console.log("M: ACTUALIZA CARRITO", ArticulosCarrito);
  }, [ArticulosCarrito]);

  return (
    <CtxCreditoTiendita.Provider
      value={{
        DistribuidorID: formValues.DistribuidorId || 0,
        ClienteID: formValues.ClienteId || 0,
        Oidc: props.oidc,
        ArticulosCarrito,
        setArticulosCarrito,
      }}
    >
      <>
        <Formik
          initialValues={props.initialValues}
          enableReinitialize
          validationSchema={Yup.object().shape({
            // ProductoId: Yup.number().required("Seleccione el producto").moreThan(0, 'Seleccione el producto'),
            SucursalDistID: Yup.number()
              .required("Sucursal de Socia no encontrada")
              .moreThan(0, "Sucursal de Socia no encontrada"),
            DistribuidorId: Yup.number()
              .required(`Seleccione la ${DescripcionDistribuidor(1)}`)
              .moreThan(0, `Seleccione la ${DescripcionDistribuidor(1)}`),
            ClienteId: Yup.number()
              .required("Seleccione el cliente")
              .moreThan(0, "Seleccione el cliente"),
            SucursalId: Yup.number()
              .required("Seleccione la sucursal")
              .moreThan(0, "Seleccione la sucursal"),
            CajaID: Yup.number()
              .required("Seleccione la Caja")
              .moreThan(0, "Seleccione la Caja"),
            Folio: Yup.number()
              .required("Ingrese el folio del vale")
              .moreThan(0, "Ingrese el folio del vale"),
            SerieId: Yup.number()
              .required("Seleccione la serie del vale")
              .moreThan(0, "Seleccione la serie del vale"),
            Capital: Yup.object()
              .shape({
                label: Yup.string().required(),
                value: Yup.string().required(),
              })
              .required("Ingrese el capital")
              .nullable(), //Yup.number().required("Ingrese el capital").moreThan(0, 'Ingrese el capital'),
            Plazos: Yup.number()
              .required("Seleccione el número de plazos")
              .moreThan(0, "Seleccione el número de plazos"),
            TipoDesembolsoID: Yup.number()
              .required("Seleccione el tipo de desembolso")
              .moreThan(0, "Seleccione el tipo de desembolso"),
            FechaExpedicion: Yup.date()
              .min(moment().add(-30, "d").toDate())
              .required("La fecha de expedicion supera los 30 dias"),
            personasDatosBancariosID: Yup.number().when(
              "RequiereDatosBancarios",
              {
                is: true,
                then: Yup.number()
                  .required(`Seleccione la cuenta o la CLABE del cliente`)
                  .moreThan(0, `Seleccione la cuenta o la CLABE del cliente`),
              }
            ),
            NombreBeneficiario: !props.isUpdate
              ? Yup.string().required("Ingrese el nombre del beneficiario")
              : Yup.string().nullable(true),
            ApellidoPaternoBeneficiario: !props.isUpdate
              ? Yup.string().required(
                  "Ingrese el apellido paterno del beneficiario"
                )
              : Yup.string().nullable(true),
            ApellidoMaternoBeneficiario: !props.isUpdate
              ? Yup.string().required(
                  "Ingrese el apellido materno del beneficiario"
                )
              : Yup.string().nullable(true),
            ParentescoBeneficiario: !props.isUpdate
              ? Yup.number().required(
                  "Seleccione el parentesco con el beneficiario"
                )
              : Yup.number().nullable(),
            FechaNacimientoBeneficiario: !props.isUpdate
              ? Yup.string()
                  .required()
                  .test(
                    "FechaNacimientoBeneficiario",
                    "El beneficiario debe ser mayor de edad",
                    (value: any) => moment().diff(moment(value), "years") >= 18
                  )
              : Yup.string().nullable(true),
          })}
          onReset={(values: any) => {
            clearFormByLevel(0);
          }}
          onSubmit={(values: any, { resetForm }) => {
            Estado.values.SucursalId = values.SucursalId;
            Estado.values.CajaID = values.CajaID;
            Estado.values.DistribuidorId = values.DistribuidorId;
            Estado.values.ClienteId = values.ClienteId;
            Estado.values.Capital = values.Capital.value as number;
            Estado.values.SerieId = values.SerieId;
            Estado.values.Folio = values.Folio;
            Estado.values.FechaExpedicion = values.FechaExpedicion;
            Estado.values.NombreBeneficiario = values.NombreBeneficiario;
            Estado.values.ApellidoPaternoBeneficiario =
              values.ApellidoPaternoBeneficiario;
            Estado.values.ApellidoMaternoBeneficiario =
              values.ApellidoMaternoBeneficiario;
            Estado.values.ParentescoBeneficiario =
              ParentescoBeneficiarioValues[
                values.ParentescoBeneficiario - 1
              ].label;
            Estado.values.FechaNacimientoBeneficiario =
              values.FechaNacimientoBeneficiario;
            Estado.values.Plazos = values.Plazos;
            Estado.values.TipoDesembolsoID = values.TipoDesembolsoID;

            if (!props.optFolios.length && !props.isUpdate) {
              MySwal.fire({
                title: "<strong>Folio inválido</strong>",
                icon: "error",
                html: (
                  <div className="text-center">
                    El folio: {values.Folio} no pertenece a la{" "}
                    {DescripcionDistribuidor(1)} con el id:{" "}
                    {values.DistribuidorId} para la serie: {values.SerieId}
                  </div>
                ),
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: false,
                focusConfirm: false,
                cancelButtonText: "Cerrar",
                confirmButtonAriaLabel: "",
                cancelButtonAriaLabel: "",
              });
            } else {
              // Finish the callback
              if (
                shopInfo.totalPrice <= formValues.TabTiendita.importeMaxCanje
              ) {
                if (props.Id! > 0) {
                  setResCredito(true);
                  setLoading(true);
                  setCanjearVale(true);

                  Funciones.FNUpdate(props.oidc, {
                    ...values,
                    CreditoID: props.Id,
                    Capital: values.Capital.value as number,
                    ProductoID: props.ProductoID,
                    TipoCanje: 1,
                    Monto: shopInfo.totalPrice,
                  })
                    .then((respuesta: any) => {
                      // console.log(respuesta)
                      if (respuesta.regresa === 1) {
                        toast.success(
                          `Se modificó el crédito con el N° ${respuesta.CreditoId}`
                        );
                        setCreditoVale(respuesta.CreditoId);
                        setMovimientoID(respuesta.MovimientoID);
                        setVentaId(respuesta.VentaId);
                        setErrorVale(false);
                        // props.cbActualizar(respuesta)
                        if (articles.length > 0) {
                          setCanjearVale(false);
                        } else {
                          toast.info(
                            "Se está generando el pagaré, por favor espere..."
                          );

                          Funciones.FNPdf(props.oidc, {
                            ProductoID: props.ProductoID,
                            CreditoID: respuesta.CreditoId,
                            CreditoID_2: 0,
                          })
                            .then((pdf: any) => {
                              const file = new Blob([pdf], {
                                type: "application/pdf",
                              });

                              var url = window.URL.createObjectURL(file);
                              const fileURL = URL.createObjectURL(file);
                              const enlaceTemporal =
                                document.createElement("a");
                              enlaceTemporal.href = fileURL;
                              enlaceTemporal.target = "_blank";
                              enlaceTemporal.style.display = "none";

                              document.body.appendChild(enlaceTemporal);

                              enlaceTemporal.click();

                              setTimeout(() => {
                                // Imprimir el documento
                                // window.print();
                              }, 1000);
                              // var anchor = document.createElement("a");
                              // anchor.download = "myfile.pdf";
                              // anchor.href = url;
                              // anchor.click();

                              setLoading(false);

                              setCanjearVale(false);

                              if (props.isUpdate) {
                                props.cbGuardar(respuesta.Credito);
                              }
                            })
                            .catch((error: any) => {
                              console.log(JSON.stringify(error));

                              toast.error(
                                "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                              );

                              setLoading(false);

                              setCanjearVale(false);
                            });
                        }
                      } else {
                        setLoading(false);
                        setResCredito(false);
                        toast.error(respuesta.msj);
                      }
                    })
                    .catch((error: any) => {
                      console.log(JSON.stringify(error));
                      setErrorVale(true);
                      setLoading(false);
                      setResCredito(false);
                      toast.error("Error al crear el vale");
                    });
                } else {
                  var EsArticuloEspecial = 0;
                  ArticulosCarrito.map((Dato: any) => {
                    Dato.id_estructura === 472 ||
                    Dato.id_estructura === 471 ||
                    Dato.id_estructura === 473
                      ? (EsArticuloEspecial = 1)
                      : (EsArticuloEspecial = 0);
                  });

                  if (EsArticuloEspecial === 0) {
                    setResCredito(true);
                    setLoading(true);
                    setCanjearVale(true);

                    Funciones.FNCheckBox(props.oidc, values.CajaID).then(
                      (res: any) => {
                        // console.log(res);

                        if (!res.Cerrada) {
                          console.log(res.Cerrada);
                          console.log("articulos", ArticulosCarrito);

                          Funciones.FNValeZona(props.oidc, {
                            ...values,
                            Capital: values.Capital.value as number,
                            ProductoID: props.ProductoID,
                            Monto: shopInfo.totalPrice,
                            articles: ArticulosCarrito,
                            TipoCanje: 1,
                            ParentescoBeneficiario:
                              ParentescoBeneficiarioValues[
                                values.ParentescoBeneficiario - 1
                              ].label,
                            Sucursal: SucTienda,
                            Validado: Estado.Validado,
                          })
                            .then((respuesta: any) => {
                              if (respuesta.regresa === 1) {
                                toast.success(
                                  `Se creó el crédito con el N° ${respuesta.CreditoId}`
                                );
                                props.ActualizarCreditoModal(
                                  respuesta.CreditoId
                                );
                                // console.log("respuesta creditoid", respuesta);
                                setCreditoVale(respuesta.CreditoId);
                                setMovimientoID(respuesta.MovimientoID);
                                setVentaId(respuesta.VentaId);
                                setErrorVale(false);
                                // clearFormByLevel(0);
                                // resetForm();
                                if (ArticulosCarrito.length > 0) {
                                  Funciones.FNPdf(props.oidc, {
                                    ProductoID: props.ProductoID,
                                    CreditoID: respuesta.CreditoId,
                                    CreditoID_2: 0,
                                  })
                                    .then((pdf: any) => {
                                      const file = new Blob([pdf], {
                                        type: "application/pdf",
                                      });
                                      const fileURL = URL.createObjectURL(file);
                                      const enlaceTemporal =
                                        document.createElement("a");
                                      enlaceTemporal.href = fileURL;
                                      enlaceTemporal.target = "_blank";
                                      enlaceTemporal.style.display = "none";
                                      document.body.appendChild(enlaceTemporal);
                                      enlaceTemporal.click();
                                      setLoading(false);
                                      setResCredito(false);
                                      setCanjearVale(false);
                                    })
                                    .catch((error: any) => {
                                      console.log(JSON.stringify(error));
                                      toast.error(
                                        "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                                      );
                                      setLoading(false);
                                      setResCredito(false);
                                      setCanjearVale(false);
                                    });
                                } else {
                                  toast.info(
                                    "Se está generando el pagaré, por favor espere..."
                                  );

                                  if (respuesta.TipoDesembolsoID != 7) {
                                    Funciones.FNPdf(props.oidc, {
                                      ProductoID: props.ProductoID,
                                      CreditoID: respuesta.CreditoId,
                                      CreditoID_2: 0,
                                    })
                                      .then((pdf: any) => {
                                        const file = new Blob([pdf], {
                                          type: "application/pdf",
                                        });

                                        const fileURL =
                                          URL.createObjectURL(file);
                                        const enlaceTemporal =
                                          document.createElement("a");
                                        enlaceTemporal.href = fileURL;
                                        enlaceTemporal.target = "_blank";
                                        enlaceTemporal.style.display = "none";
                                        document.body.appendChild(
                                          enlaceTemporal
                                        );
                                        enlaceTemporal.click();
                                        setLoading(false);
                                        setCanjearVale(false);
                                      })
                                      .catch((error: any) => {
                                        console.log(JSON.stringify(error));

                                        toast.error(
                                          "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                                        );

                                        setLoading(false);

                                        setCanjearVale(false);
                                      });
                                  } else {
                                    Funciones.FNPdf2(props.oidc, {
                                      CreditoId: respuesta.CreditoId,
                                      personasDatosBancariosID:
                                        props.initialValues
                                          .personasDatosBancariosID,
                                    })
                                      .then((respuesta: any) => {
                                        const file = new Blob([respuesta], {
                                          type: "application/pdf",
                                        });

                                        const fileURL =
                                          URL.createObjectURL(file);
                                        const enlaceTemporal =
                                          document.createElement("a");
                                        enlaceTemporal.href = fileURL;
                                        enlaceTemporal.target = "_blank";
                                        enlaceTemporal.style.display = "none";

                                        document.body.appendChild(
                                          enlaceTemporal
                                        );

                                        enlaceTemporal.click();

                                        setLoading(false);

                                        setCanjearVale(false);
                                      })
                                      .catch(() => {
                                        toast.error(
                                          "Error al generar el documento"
                                        );

                                        setLoading(false);

                                        setCanjearVale(false);
                                      });
                                  }
                                }
                              } else {
                                setLoading(false);
                                setResCredito(false);
                                toast.error("Error " + respuesta.msj);
                              }
                            })
                            .catch((error: any) => {
                              console.log(JSON.stringify(error));
                              setErrorVale(true);
                              setLoading(false);
                              setResCredito(false);
                              toast.error("Error al crear el vale");
                            });
                        } else {
                          console.log(res.Cerrada);

                          toast.info(
                            "La caja esta cerrada, no es posible continuar..."
                          );
                          setLoading(false);
                          setResCredito(false);
                          setCanjearVale(false);
                        }
                      }
                    );
                  } else {
                    DefinirEstado((s) => ({ ...s, ShowFolio: true }));
                  }
                }
              } else {
                toast.error(
                  `El límite de compra en la tiendita para este vale es de $${formValues.TabTiendita.importeMaxCanje}`
                );
              }
            }
          }}
        >
          {({ values }) => (
            <Form>
              <div className="columns is-desktop is-tablet">
                <div className="column is-12-mobile is-12-tablet is-3-desktop">
                  <ActionSelect
                    disabled //={props.isUpdate || loading}
                    label="Sucursal"
                    name="SucursalId"
                    placeholder="Seleccione la sucursal"
                    options={props.optSucursales}
                    addDefault={false}
                    valor={values.SucursalId}
                    accion={cbSucursal}
                    ref={refSucursal}
                  />
                </div>
                <div className="column is-12-mobile is-12-tablet is-3-desktop">
                  <Cajas
                    name="CajaID"
                    disabled
                    SucursalId={values.SucursalId}
                    oidc={props.oidc}
                  />
                </div>
                <div className="column is-12-mobile is-12-tablet is-4-desktop">
                  {props.isUpdate && (
                    <Clientes
                      disabled
                      DistribuidorID={values.DistribuidorId}
                      name={"ClienteId"}
                      ClienteId={values.ClienteId}
                      noAsync
                    />
                  )}
                  {!props.isUpdate && (
                    <ActionAsyncSelect
                      loadOptions={loadOptionsClientes}
                      disabled={loading}
                      label="Cliente"
                      name="ClienteId"
                      placeholder="Buscar cliente"
                      options={props.optClientes}
                      addDefault={false}
                      valor={values.ClienteId}
                      accion={cbCliente}
                      noOptionsMessage={"Escriba el nombre del cliente"}
                      ref={refCliente}
                      // accion2={validarCliente}
                    />
                  )}
                </div>
                <div className="column is-12-mobile is-half-tablet is-2-desktop">
                  <br className="is-hidden-touch" />
                  <button
                    title="Cliente"
                    type="button"
                    disabled={loading || formValues.ClienteId == 0}
                    className="ms-2 btn btn-primary waves-effect waves-light"
                    onClick={async () => {
                      DefinirEstado((e) => ({
                        ...e,
                        Datos: {
                          Persona: undefined,
                          Direcciones: [],
                          Empleos: [],
                          ContCreditos: [],
                          Creditos: undefined,
                        },
                        Cargando: true,
                        Error: false,
                      }));
                      let resultado = await FnPersona.FNObtenerPersona(
                        props.oidc,
                        formValues.ClienteId
                      );
                      DefinirEstado((e) => ({
                        ...e,
                        Datos: {
                          Persona: resultado.persona,
                          Direcciones: resultado.direcciones,
                          Empleos: resultado.empleos,
                          ContCreditos: resultado.contCreditos,
                          Creditos: resultado.creditos,
                        },
                        Cargando: false,
                        Error: false,
                      }));
                      setShowClientePerfil(true);
                    }}
                  >
                    Información Cliente&nbsp;
                    <FaAddressCard />
                  </button>
                </div>
              </div>
              <div className="columns is-desktop is-tablet">
                <div className="column is-12-mobile is-12-tablet is-4-desktop">
                  <ActionSelect
                    disabled={
                      props.isUpdate || loading || values.ClienteId == 0
                    }
                    label="Sucursal Socia"
                    name="SucursalDistID"
                    placeholder="Seleccione la sucursal"
                    options={formValues.optSucursalDist}
                    addDefault={false}
                    valor={values.SucursalDistID}
                    // accion={cbSucursal}
                    ref={refSucursalDist}
                  />
                </div>
                <div className="column is-12-mobile is-12-tablet is-4-desktop">
                  {/* <CustomFieldText
                                        disabled
                                        label='Socia'
                                        name='Distribuidor'
                                    /> */}
                  <ActionSelect
                    disabled={
                      props.isUpdate || loading || values.ClienteId == 0
                    } //props.isUpdate ||
                    label={`${DescripcionDistribuidor(1)}`}
                    name="DistribuidorId"
                    placeholder={`Seleccione la ${DescripcionDistribuidor(1)}`}
                    options={formValues.optDistribuidores}
                    addDefault={true}
                    valor={values.DistribuidorId}
                    accion={cbDistribuidor}
                    blur={fnGetCondicionesDetalle}
                    ref={refDistribuidor}
                    // accion2={validarDistribuidor}
                  />
                </div>
                <div className="column is-12-mobile is-half-tablet is-2-desktop">
                  <br className="is-hidden-touch" />
                  <button
                    title="Ver Firma"
                    type="button"
                    disabled={
                      loading ||
                      formValues.DistribuidorId == 0 ||
                      documentoID == 0 ||
                      !documentoID
                    }
                    className="ms-2 btn btn-primary waves-effect waves-light"
                    onClick={() => setVerFirma(true)}
                  >
                    Firma {`${DescripcionDistribuidor(1)}`}&nbsp;
                    <FaAddressCard />
                  </button>
                </div>
              </div>
              <div className="columns is-desktop is-tablet">
                <div className="column is-12-mobile is-12-tablet is-one-quarter-desktop">
                  <ActionCreatableSelect
                    disabled={props.isUpdate || loading}
                    label="Capital"
                    name="Capital"
                    placeholder="Seleccione o ingrese el capital"
                    options={formValues.optCapital}
                    accion={fnSetCapital}
                    value={values.Capital}
                    ref={refCapital}
                  />
                </div>
                <div className="column is-12-mobile is-12-tablet is-one-quarter-desktop">
                  <ActionSelect
                    disabled={props.isUpdate || loading}
                    label="Serie"
                    name="SerieId"
                    placeholder="Seleccione la serie del vale"
                    options={formValues.optSeries}
                    addDefault={false}
                    valor={values.SerieId}
                    noOptionsMessage="Sin series"
                    ref={refSerie}
                    accion={cbSerie}
                  />
                </div>
                <div className="column is-12-mobile is-12-tablet is-one-quarter-desktop">
                  <ActionFieldText2
                    disabled={props.isUpdate || loading}
                    label="Folio"
                    name="Folio"
                    placeholder="Ingrese el folio del vale"
                    valor={values.Folio}
                    onChange={cbFolio}
                  />
                  {!props.optFolios.length &&
                    !props.isUpdate &&
                    !!values.Folio && (
                      <div className="text-danger">{`El folio ${
                        values.Folio
                      } no pertenece a la ${DescripcionDistribuidor(
                        1
                      )} seleccionada`}</div>
                    )}
                  {props.optFolios[0]?.valedigital &&
                    !props.isUpdate &&
                    !!values.Folio && (
                      <div className="text-danger">{`El folio ${values.Folio} es digital`}</div>
                    )}
                  {props.optFolios[0]?.estatus == "C" &&
                    !props.isUpdate &&
                    !!values.Folio && (
                      <div className="text-danger">{`El folio ${values.Folio} ya ha sido utilizado`}</div>
                    )}
                </div>
                <div className="column is-12-mobile is-12-tablet is-one-quarter-desktop">
                  {props.ShowFechaExpedicion && (
                    <CustomFieldDatePicker
                      disabled={props.isUpdate || loading}
                      label={"Fecha Expedición Vale"}
                      name={"FechaExpedicion"}
                      placeholder={""}
                    />
                  )}
                </div>
              </div>

              <div className="columns is-desktop is-tablet">
                <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                  <ActionSelect
                    disabled={props.isUpdate || loading}
                    label="Plazos"
                    name="Plazos"
                    placeholder="Seleccione el número de plazos"
                    options={formValues.optPlazos}
                    addDefault={false}
                    valor={values.Plazos}
                    ref={refPlazos}
                    accion={cbPlazo}
                  />
                </div>
                <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                  <ActionSelect
                    disabled={loading}
                    label="Tipo de Desembolso"
                    name="TipoDesembolsoID"
                    placeholder="Seleccione el tipo de desembolso"
                    options={formValues.optTiposDesembolso}
                    addDefault={false}
                    valor={values.TipoDesembolsoID}
                    ref={refTipoDesembolso}
                    accion={cbTipoDesembolso}
                  />
                </div>
                <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                  <br />
                  <ControlDatosBancarios
                    name={`personasDatosBancariosID`}
                    RequiereDatosBancarios={
                      props.DatosTipoDesembolso.RequiereDatosBancarios ?? false
                    }
                    ClienteId={values.ClienteId}
                    valor={formValues.personasDatosBancariosID}
                    fnOpen={() => setShowDatosBancarios(true)}
                  />
                </div>
              </div>

              {!props.isUpdate && (
                <div>
                  <div className="columns is-desktop is-tablet">
                    <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                      <CustomFieldText
                        disabled={props.isUpdate || loading}
                        label="Nombre(s) del beneficiario"
                        name="NombreBeneficiario"
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                      <CustomFieldText
                        disabled={props.isUpdate || loading}
                        label="Apellido paterno del beneficiario"
                        name="ApellidoPaternoBeneficiario"
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                      <CustomFieldText
                        disabled={props.isUpdate || loading}
                        label="Apellido materno del beneficiario"
                        name="ApellidoMaternoBeneficiario"
                      />
                    </div>
                  </div>
                  <div className="columns is-desktop is-tablet">
                    <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                      <ActionSelect
                        disabled={props.isUpdate || loading}
                        label="Parentesco del beneficiario"
                        name="ParentescoBeneficiario"
                        addDefault={false}
                        options={ParentescoBeneficiarioValues}
                        ref={refParentescos}
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                      <CustomFieldDatePicker
                        disabled={props.isUpdate || loading}
                        label="Fecha nacimiento del beneficiario"
                        name="FechaNacimientoBeneficiario"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="columns is-desktop is-tablet">
                <div className="column is-two-thirds">
                  {props.ProductoID != 33 && (
                    <div>
                      <button
                        title="Tiendita"
                        type="button"
                        disabled={
                          loading ||
                          formValues.TabTiendita.importeMaxCanje == 0 ||
                          props.ProdTiendita == 0 ||
                          props.isUpdate
                            ? true
                            : false
                        }
                        className="ms-2 btn btn-primary waves-effect waves-light"
                        onClick={() => {
                          setShowStore(true);
                        }}
                      >
                        <span className="my-1">Incluir Artículos</span>{" "}
                        <FaShoppingCart />
                      </button>
                      {shopInfo.totalPrice >
                        formValues.TabTiendita.importeMaxCanje && (
                        <div className="text-danger">{`El límite de compra en la tiendita para este vale es de $${formValues.TabTiendita.importeMaxCanje}`}</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="column is-one-third">
                  <h1 className="title is-3">{`TOTAL: $${total.toLocaleString(
                    "en"
                  )}`}</h1>
                </div>
              </div>
              {ArticulosCarrito.length > 0 && (
                <div className="columns is-desktop is-tablet">
                  <div className="column is-6">
                    {/* <Carrusel ArticulosCarrito={ArticulosCarrito} />  */}
                    <div
                      className="box"
                      style={{ maxHeight: "370px", overflowY: "auto" }}
                    >
                      <h1 className="title is-5">
                        Elementos de Tiendita en el carrito:{" "}
                        <span>{ArticulosCarrito.length}</span>
                        <br />
                        {ArticulosCarrito.length > 2
                          ? "(Desplazate hacia abajo)"
                          : ""}
                      </h1>
                      {ArticulosCarrito.map((item: any) => (
                        <div>
                          <p className="title is-5">{item.desc}</p>

                          <div className="columns is-desktop is-tablet">
                            <div className="column is-8 pl-6 ">
                              <label className="form-label mb-0">
                                {`Precio: `}
                                {item.descuento > 0 ? (
                                  <>
                                    <del
                                      style={{
                                        position: "relative",
                                        display: "inline-block",
                                        color: "#c2c0c0",
                                      }}
                                    >
                                      {FormateoDinero.format(item.precioOrg)}{" "}
                                    </del>{" "}
                                    <span style={{ color: "red" }}>
                                      {FormateoDinero.format(item.price)}
                                    </span>
                                  </>
                                ) : (
                                  `${FormateoDinero.format(item.price)}`
                                )}
                              </label>
                              <br />
                              <label className="form-label mb-0">{`Cantidad: ${item.qty}`}</label>
                              <br />
                              <label className="form-label mb-0">
                                {`Importe: `}
                                {item.descuento > 0 ? (
                                  <>
                                    <del
                                      style={{
                                        position: "relative",
                                        display: "inline-block",
                                        color: "#c2c0c0",
                                      }}
                                    >
                                      {FormateoDinero.format(
                                        item.precioOrg * item.qty
                                      )}{" "}
                                    </del>{" "}
                                    <span style={{ color: "red" }}>
                                      {FormateoDinero.format(
                                        item.price * item.qty
                                      )}
                                    </span>
                                  </>
                                ) : (
                                  `${FormateoDinero.format(
                                    item.price * item.qty
                                  )}`
                                )}
                              </label>
                              <br />
                              <label className="form-label mb-0">{`SKU: ${item.id}`}</label>
                              <br />
                              <label className="form-label mb-0">{`Código Barras: ${item.codigo}`}</label>
                              <br />
                            </div>
                            <div className="column is-4">
                              <ImgViewer
                                imgSrc={item.imagen}
                                noToolbar={true}
                                zIndex={1500}
                                maxWidth={100}
                                maxHeight={300}
                              />
                            </div>
                          </div>
                          <hr />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="column">
                    <div className="box">
                      <p className="title is-5">
                        Total:{" "}
                        {shopInfo.totalPrice != shopInfo.totalPriceOrg ? (
                          <>
                            <del
                              style={{
                                position: "relative",
                                display: "inline-block",
                                color: "#c2c0c0",
                              }}
                            >
                              {FormateoDinero.format(shopInfo.totalPriceOrg)}{" "}
                            </del>{" "}
                            <span style={{ color: "red" }}>
                              {FormateoDinero.format(shopInfo.totalPrice)}
                            </span>
                          </>
                        ) : (
                          `${FormateoDinero.format(shopInfo.totalPrice)}`
                        )}
                      </p>
                      <p>Artículos distintos: {shopInfo.totalItems}</p>
                      <p>Total de articulos: {shopInfo.totalQty}</p>
                    </div>
                  </div>
                </div>
              )}
              <br />
              {loading && <Spinner />}
              {!loading && (
                <div className="text-end">
                  <button
                    title="Cancelar"
                    type="reset"
                    disabled={props.isUpdate}
                    className="btn btn-danger waves-effect waves-light"
                    onClick={props.fnCancelar}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="ms-2 btn btn-success waves-effect waves-light"
                  >
                    Generar Crédito
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>

        <ModalWin open={resCredito}>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>Generando Crédito</h5>
          </ModalWin.Header>
          <ModalWin.Body>
            <button
              className={`btn btn - ${
                errorVale ? "danger" : CanjearVale ? "warning" : "success"
              }`}
              type="button"
              disabled
            >
              {CanjearVale && (
                <>
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  &nbsp; Canjeando Vale...
                </>
              )}
              {!CanjearVale && !errorVale && <>Canje de Vale Completado</>}
              {errorVale && <>Error</>}
            </button>
            &nbsp;
            {creditoVale > 0 && (
              <>
                N° de Crédito: <strong>{creditoVale}</strong>
              </>
            )}
            <br />
            <br />
            {articles.length > 0 && (
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={
                    CanjearVale ||
                    ComprarTienda ||
                    errorVale ||
                    creditoTienda > 0
                  }
                  onClick={() => {
                    setCreditoTienda(0);
                    setErrorTienda(false);
                    setLoading(false);
                    setArticulosCarrito([]);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className={`btn btn - ${
                    ComprarTienda ? "warning" : "primary"
                  }`}
                  type="button"
                  disabled={
                    CanjearVale ||
                    ComprarTienda ||
                    errorVale ||
                    creditoTienda > 0
                  }
                  onClick={() => {
                    setComprarTienda(true);
                    var detalle = articles.map((valor: any) => {
                      var obj = { id_sku: valor.id, cantidad: valor.qty };
                      return obj;
                    });

                    // console.log('detalle: ', detalle)

                    let JsonTda = {
                      id_empresa: 1,
                      sucursal: props.initialValues.SucursalId,
                      tipo_usuario1: "4",
                      id_usuario: formValues.DistribuidorId,
                      sistema1: props.Sistema,
                      id_forma_pago: 10,
                      referencia_forma_pago: "@Credito",
                      detalle,
                    };

                    Funciones.FNComprarTiendita(props.oidc, {
                      SucursalId: props.initialValues.SucursalId, //formValues.SucursalId,
                      CajaID: props.initialValues.CajaID, //</div>formValues.CajaID,
                      ProductoID: 1, //props.oidc.user.ProductoID,
                      ProductoTiendita: props.ProdTiendita,
                      DistribuidorId: formValues.DistribuidorId,
                      ClienteId: formValues.ClienteId,
                      Folio: formValues.Folio,
                      SerieId: formValues.SerieId,
                      Plazos: formValues.Plazos,
                      TipoDesembolsoID: 9, //formValues.TipoDesembolsoID,
                      Capital: shopInfo.totalPrice,
                      MovimientoID: MovimientoID,
                      VentaId: VentaId,
                      JsonTda: JSON.stringify(JsonTda),
                      TipoCanje: 2,
                      articles: articles as [],
                    })
                      .then((respuesta: any) => {
                        setComprarTienda(false);
                        if (respuesta.regresa === 1) {
                          setCreditoTienda(respuesta.CreditoId);
                          toast.success(
                            `Se creó el crédito con el N° ${respuesta.CreditoId}`
                          );

                          setErrorTienda(false);

                          toast.info(
                            "Se está generando el pagaré, por favor espere..."
                          );

                          Funciones.FNPdf(props.oidc, {
                            ProductoID: props.ProductoID,
                            CreditoID: creditoVale,
                            CreditoID_2: respuesta.CreditoId,
                          })
                            .then((pdf: any) => {
                              const file = new Blob([pdf], {
                                type: "application/pdf",
                              });

                              var url = window.URL.createObjectURL(file);
                              // var anchor = document.createElement("a");
                              // anchor.download = "myfile.pdf";
                              // anchor.href = url;
                              // anchor.click();
                              const fileURL = URL.createObjectURL(file);
                              const enlaceTemporal =
                                document.createElement("a");
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
                            })
                            .catch((error: any) => {
                              console.log(JSON.stringify(error));

                              toast.error(
                                "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                              );

                              setLoading(false);
                            });
                        } else {
                          setErrorTienda(true);
                          toast.error(respuesta.msj);
                        }
                      })
                      .catch((error: any) => {
                        console.log(JSON.stringify(error));
                        setComprarTienda(false);
                        setErrorTienda(true);
                        toast.error("Error al comprar en la tiendita");
                      });
                  }}
                >
                  {ComprarTienda && (
                    <>
                      <span
                        className="spinner-grow spinner-grow-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      &nbsp; Comprando en la Tiendita...
                    </>
                  )}
                  {!ComprarTienda &&
                    !errorTienda && ( //(creditoTienda > 0) &&
                      <>Comprar Tiendita</>
                    )}
                  {errorTienda && (
                    <>
                      Volver a intentar
                      <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle" />
                    </>
                  )}
                </button>
              </div>
            )}
            &nbsp;
            {creditoTienda > 0 && (
              <>
                N° de Crédito: <strong>{creditoTienda}</strong>
              </>
            )}
            <br />
            <hr />
            <br />
            <div className="text-end">
              <button
                type="button"
                disabled={
                  loading ||
                  (creditoVale > 0 &&
                    creditoTienda === 0 &&
                    articles.length > 0)
                }
                className="ms-2 btn btn-danger waves-effect waves-light"
                onClick={() => {
                  setResCredito(false);
                  clearFormByLevel(0);
                  setCreditoVale(0);
                  setCreditoTienda(0);
                  setMovimientoID(0);
                  setVentaId(0);
                  setErrorVale(false);
                  setErrorTienda(false);
                }}
              >
                Cerrar
              </button>
              <button
                type="button"
                disabled={
                  loading ||
                  (creditoVale > 0 &&
                    creditoTienda === 0 &&
                    articles.length > 0)
                }
                className="ms-2 btn btn-primary waves-effect waves-light"
                onClick={() => {
                  setLoading(true);
                  Funciones.FNPdf(props.oidc, {
                    ProductoID: props.ProductoID,
                    CreditoID: creditoVale,
                    CreditoID_2: creditoTienda,
                  })
                    .then((pdf: any) => {
                      const file = new Blob([pdf], {
                        type: "application/pdf",
                      });

                      var url = window.URL.createObjectURL(file);
                      // var anchor = document.createElement("a");
                      // anchor.download = "myfile.pdf";
                      // anchor.href = url;
                      // anchor.click();
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
                    })
                    .catch((error: any) => {
                      console.log(JSON.stringify(error));
                      setLoading(false);
                      toast.error(
                        "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                      );
                    });
                }}
              >
                Descargar C. Responsiva&nbsp;
                <FaCloudDownloadAlt />
              </button>

              <button
                type="button"
                disabled={
                  loading ||
                  (creditoVale > 0 &&
                    creditoTienda === 0 &&
                    articles.length > 0)
                }
                className="ms-2 btn btn-primary waves-effect waves-light"
                onClick={() => props.AbrirPlanDePagos()}
              >
                Ver Plan de Pagos &nbsp;
                <FaEye />
              </button>
            </div>
          </ModalWin.Body>
        </ModalWin>

        <ModalWin center open={ShowDatosBancarios} zIndex={10000}>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>{"Datos Bancarios"}</h5>
          </ModalWin.Header>
          <ModalWin.Body>
            {ShowDatosBancarios && (
              <BuscarDatosBancarios
                initialValues={{
                  personaID: formValues.ClienteId,
                  cveBancoRef: 0,
                  datoTipoID: 0,
                  datoBancario: "",
                  personasDatosBancariosID: 0,
                }}
                cbAceptar={cbAceptarDatosBancarios}
                fnCancelar={fnCancelarDatosBancarios}
              />
            )}
          </ModalWin.Body>
        </ModalWin>

        {ShowStore && (
          <ModalWin open={ShowStore} large center scrollable>
            <ModalWin.Header>
              <h5 className={MODAL_TITLE_CLASS}>Incluir Artículos</h5>
              <button
                type="button"
                className="delete"
                onClick={() => setShowStore(false)}
              />
            </ModalWin.Header>
            <ModalWin.Body>
              {ShowStore && (
                <CreditoArticulos
                  SucursalId={props.initialValues.SucursalId}
                  cbArticles={cbArticles}
                  ArticulosIds={articulosIds}
                  Articles={ArticulosCarrito}
                  cbSucursal={cbSucTienda}
                />
              )}
            </ModalWin.Body>
          </ModalWin>
        )}

        {Estado.ShowFolio && (
          <ModalWin open={Estado.ShowFolio} scrollable>
            <ModalWin.Header>
              <h5 className={MODAL_TITLE_CLASS}>Validar Folio</h5>
              <button
                title="Cerrar"
                type="button"
                className="delete"
                onClick={() =>
                  DefinirEstado((s) => ({ ...s, ShowFolio: false }))
                }
              />
            </ModalWin.Header>
            <ModalWin.Body>
              {Estado.ShowFolio && (
                <FolioConfirmacion
                  PersonaID={formValues.DistribuidorId}
                  cbGuardar={cbDatosBancarios}
                  // Validado={Estado.Validado}
                  fnGenerarCredito={fnGenerarCredito}
                  fnCerrar={fnCerrar}
                />
              )}
            </ModalWin.Body>
          </ModalWin>
        )}

        <ModalWin open={ShowClientePerfil} center scrollable>
          <ModalWin.Header>
            <button
              type="button"
              className="delete"
              onClick={() => setShowClientePerfil(false)}
            />
          </ModalWin.Header>
          <ModalWin.Body>
            {ShowClientePerfil && (
              <Card Title="Detalles personales">
                <Card.Body>
                  <React.Fragment>
                    <PerfilPersonaParaCapturaDeVales
                      ContCreditos={Estado.Datos.ContCreditos}
                      Editar={false}
                      Persona={
                        Estado.Datos.Persona as DBConfia_General.IPersonas_VW
                      }
                      Direcciones={Estado.Datos.Direcciones}
                      Empleos={Estado.Datos.Empleos}
                      Creditos={
                        Estado.Datos.Creditos as DBConfia_Creditos.ICreditos_VW
                      }
                      oidc={props.oidc}
                      ui={props.ui}
                    />
                  </React.Fragment>
                </Card.Body>
              </Card>
            )}
          </ModalWin.Body>
        </ModalWin>

        {verFirma && (
          <ModalWin open={verFirma} center large>
            <ModalWin.Header>
              <h5
                className={MODAL_TITLE_CLASS}
              >{`Firma ${DescripcionDistribuidor(1)}`}</h5>
              <button
                type="button"
                className="delete"
                onClick={() => {
                  fnCerrarFirma();
                }}
              />
            </ModalWin.Header>
            <ModalWin.Body>
              <VerDoc DocumentoID={documentoID} fnCancelar={fnCerrarFirma} />
            </ModalWin.Body>
          </ModalWin>
        )}
      </>
    </CtxCreditoTiendita.Provider>
  );
};
