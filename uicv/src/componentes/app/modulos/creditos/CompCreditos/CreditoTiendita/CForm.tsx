import React, { useRef, useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  CustomFieldText,
  ActionSelect,
  ActionCreatableSelect,
  ActionMultipleSelect,
  ActionFieldText,
  ImgViewer,
  ActionAsyncSelect,
  CardItem,
  Carrusel,
} from "../../../../../global";
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
} from "react-icons/fa";
import { Cajas } from "../../../../../selectores";
import CreditoArticulos from "../CreditoArticulos";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import { iUI } from "../../../../../../interfaces/ui/iUI";

type CFormType = {
  iu: iUI;
  oidc: IOidc;
  ProductoID: number;
  Id?: number;
  initialValues: {
    SucursalId: number;
    CajaID: number;
    ClienteId: number;
    CuentaId: number;
    Plazos: number;
    tipoCliente: string;
    TipoDesembolsoID: number;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  fnGetCuentas(ProductoID: number, id: any): any;
  fnGetDistribuidores(id: any): any;
  // fnGetClientes(DistribuidorID: number, Nombre: string, callback: any): any,
  fnGetCondicionesDetalle(
    ProductoID: number,
    SucursalId: number,
    DistribuidorID: number
  ): any;
  fnGetTiposDesembolso(ProductoID: number, SucursalId: number): any;
  fnGetEmpleados(id: any, Nombre: string, callback: any): any;
  fnGetListaPlazos(Capital: number): any;
  fnGetDatosCliente(id: any): any;
  fnGetDatosDistribuidor(id: any): any;
  fnGetLineaTiendita(id: any): any;
  optDistribuidores: { value: number; label: string }[];
  optSucursales: { value: number; label: string }[];
  optClientes: { value: number; label: string }[];
  optPlazos: { value: string; label: string }[];
  optCuenta: { value: number; label: string }[];
  optTiposDesembolso: { value: number; label: string }[];
  isUpdate: boolean;
  DatosCliente: any;
  DatosDistribuidor: any;
  TiposDesembolso: any;
  Sistema: string;
  // ProdTiendita: number,
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
};

export const CForm = (props: CFormType) => {
  // console.log('optCuenta: ', props.optCuenta)
  // console.log('TabTiendita: ', props.TabTiendita)

  const MySwal = withReactContent(Swal);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
      partialVisibilityGutter: 15,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
      partialVisibilityGutter: 15,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
      partialVisibilityGutter: 10,
    },
  };

  const [loading, setLoading] = useState(false);

  const [ShowStore, setShowStore] = useState(false);

  const [articles, setArticles] = useState([]);

  const [articulosIds, setArticulosIds] = useState([]);

  const [shopInfo, setShopInfo] = useState({
    totalItems: 0,
    totalPrice: 0,
    totalQty: 0,
  });

  const [tipoCliente, setTipoCliente] = useState("1");

  const [tipoClienteDesc, setTipoClienteDesc] = useState("");

  const [MovimientoID, setMovimientoID] = useState(0);

  const [formValues, setFormValues] = useState({
    optDistribuidores: [{ value: 0, label: "" }],
    optPlazos: [{ value: "0", label: "" }],
    optCuenta: [{ value: 0, label: "" }],
    optTiposDesembolso: [{ value: 0, label: "" }],
    SucursalId: props.initialValues.SucursalId,
    ClienteId: props.initialValues.ClienteId,
    Plazos: props.initialValues.Plazos,
    TipoDesembolsoID: props.initialValues.TipoDesembolsoID,
  });

  const [SucTienda, setSucTienda] = useState({
    id_empresa: 0,
    id_sucursal: 0,
    id_origen: "",
    sistema: "",
  });

  const [isMounted, setisMounted] = useState(false);
  const refSucursal = useRef<Select>(null);
  const refDistribuidor = useRef<Select>(null);
  const refCliente = useRef<AsyncSelect<[], false>>(null);
  const refCuenta = useRef<Select>(null);
  const refPlazos =
    useRef<CreatableSelect<{ value: string; label: string }, false>>(null); //useRef<Select>(null)
  const refTipoDesembolso = useRef<Select>(null);

  const refCliente1 = useRef(null);
  const refCliente2 = useRef(null);
  const refCliente3 = useRef(null);

  const loadOptionsClientes = (inputText: string, callback: any) => {
    // const distribuidor: any = refDistribuidor;
    // const DistribuidorID = distribuidor.current.props.value.value as number;
    // props.fnGetClientes(DistribuidorID, inputText, callback);
    const sucursal: any = refSucursal;
    const SucursalId = sucursal.current.props.value.value as number;
    props.fnGetEmpleados(SucursalId, inputText, callback);
  };

  const clearFormByLevel = (level: number) => {
    // if (level === 3) {
    //     setFormValues(s => ({ ...s, optPlazos: tipoCliente == '3' ? formValues.optPlazos : [], optDistribuidores: [], optCuenta: [], optTiposDesembolso: [] }))
    //     deselectClient()
    //     refTipoDesembolso.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
    // }

    if (level === 0) {
      setArticles([]);
      setArticulosIds([]);
      setShopInfo({
        totalItems: 0,
        totalPrice: 0,
        totalQty: 0,
      });
      // refSucursal.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
    }
    if (level === 0 || level === 1) {
      setFormValues((s) => ({
        ...s,
        optPlazos:
          tipoCliente == "3" || tipoCliente == "2" ? formValues.optPlazos : [],
        optDistribuidores: [],
        optCuenta: [],
        optTiposDesembolso: [],
      }));
      deselectClient();
      refTipoDesembolso.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    if (level === 0 || level === 1 || level === 2) {
      if (tipoCliente == "1") {
        // refPlazos.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
        const plazos: any = refPlazos.current?.select;
        plazos.select.clearValue();
        // setFormValues(s => ({ ...s, Plazos: 0 }))
      }
    }
  };
  const permisoAsignar =
    props.iu.PermisosProductos?.find((p) => p.PermisoID == 2606) ||
    props.iu.Persona?.MasterUser;

  const deselectClient = () => {
    const distribuidor: any = refDistribuidor.current;
    if (distribuidor) {
      distribuidor.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    const cliente: any = refCliente.current?.select;
    if (cliente) {
      cliente.select.setValue({ value: "0", label: "" }, "deselect-option");
    }
    const cuenta: any = refCuenta.current;
    if (cuenta) {
      cuenta.select.setValue({ value: "0", label: "" }, "deselect-option");
    }
  };

  const fnGetCondicionesDetalleByDistribuidor = () => {
    const sucursal: any = refSucursal;
    const distribuidor: any = refDistribuidor;

    const ProductoID = props.ProductoID;
    const SucursalId = sucursal.current.props.value.value as number;
    const DistribuidorID = distribuidor.current.props.value.value as number;

    props.fnGetCondicionesDetalle(ProductoID, SucursalId, DistribuidorID);
  };

  // const fnSetPlazosContado = () => {
  //     setFormValues(s => ({ ...s, optPlazos: [{ value: 1, label: '1' }] }))
  // }

  // const fnListaPlazosGet = (value: any) => {
  //     // const capital: any = refCapital;
  //     const Capital = value;
  //     props.fnGetListaPlazos(Capital);+
  // }

  const cbSucursal = (value: any) => {
    setFormValues((s) => ({ ...s, SucursalId: value }));
    clearFormByLevel(1);
    props.fnGetDistribuidores(value);
    props.fnGetCuentas(props.ProductoID, value);
    // props.fnGetEmpleados(value);
    props.fnGetTiposDesembolso(props.ProductoID, value);
    props.fnGetCondicionesDetalle(props.ProductoID, value, 0);
  };

  const cbDistribuidor = (value: any) => {
    // parseInt(refDistribuidor.current?.select.state.selectValue[0].value as string)
    // setFormValues(s => ({ ...s, DistribuidorId: value }))
    clearFormByLevel(2);
    props.fnGetDatosDistribuidor(value);
    props.fnGetLineaTiendita(value);
    // props.fnGetFolios(value, formValues.SerieId);
  };

  const cbEmpleado = (value: any) => {
    clearFormByLevel(2);
    props.fnGetLineaTiendita(0);
    // setFormValues(s => ({ ...s, ClienteId: value }))
    // props.fnGetDatosCliente(value)
  };

  const cbPlazo = (value: any) => {
    setFormValues((s) => ({ ...s, Plazos: value }));
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
    setShowStore(false);
    if (values.cart !== null) {
      setArticles(values.cart.items);
      setArticulosIds(
        values.cart.items.map((valor: any) => {
          return valor.id;
        })
      );
      setShopInfo(values.cart.info);
    } else {
      setArticles([]);
      setArticulosIds([]);
      setShopInfo({
        totalItems: 0,
        totalPrice: 0,
        totalQty: 0,
      });
    }
  };

  const DescargarPDF = (respuesta: any) => {
    toast.info("Se está generando el pagaré, por favor espere...");
    Funciones.FNPdf(props.oidc, {
      ProductoID: props.ProductoID,
      CreditoID: respuesta.CreditoId,
      CreditoID_2: 0,
    })
      .then((pdf: any) => {
        const file = new Blob([pdf], { type: "application/pdf" });

        // const fileURL = URL.createObjectURL(file);

        // window.open(fileURL);

        // var url = window.URL.createObjectURL(file);
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

        // setCanjearVale(false)

        // clearFormByLevel(0)
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));

        // toast.error("Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas")

        MySwal.fire({
          title: "<strong>Error</strong> al descargar el archivo",
          icon: "error",
          html: (
            <div className="text-center">
              Intente volver a descargar el archivo o reportarlo a sistemas.
            </div>
          ),
          showCloseButton: false,
          showCancelButton: true,
          showConfirmButton: true,
          focusConfirm: false,
          cancelButtonText: "Cerrar",
          confirmButtonText: "Descargar",
          confirmButtonAriaLabel: "",
          cancelButtonAriaLabel: "",
        }).then((result) => {
          if (result.isConfirmed) {
            DescargarPDF(respuesta);
          } else {
            setLoading(false);
          }
        });
      });
  };

  useEffect(() => {
    setFormValues((s) => ({ ...s, optCuenta: props.optCuenta }));
    let val =
      props.optCuenta.length > 0
        ? {
            value: String(props.optCuenta[0].value),
            label: props.optCuenta[0].label,
          }
        : { value: "0", label: "Sin Cuenta" };
    refCuenta.current?.select.setValue(val, "select-option");
  }, [props.optCuenta]);

  useEffect(() => {
    setFormValues((s) => ({
      ...s,
      optTiposDesembolso: props.optTiposDesembolso,
    }));
    let val =
      props.optTiposDesembolso.length > 0
        ? {
            value: String(props.optTiposDesembolso[0].value),
            label: props.optTiposDesembolso[0].label,
          }
        : { value: "0", label: "Sin tipo desembolso" };
    refTipoDesembolso.current?.select.setValue(val, "select-option");
  }, [props.optTiposDesembolso]);

  useEffect(() => {
    setFormValues((s) => ({
      ...s,
      TipoDesembolsoID:
        formValues.optTiposDesembolso.length > 0
          ? formValues.optTiposDesembolso[0].value
          : 0,
    }));
  }, [formValues.optTiposDesembolso]);

  useEffect(() => {
    setFormValues((s) => ({
      ...s,
      optDistribuidores: props.optDistribuidores,
    }));
  }, [props.optDistribuidores]);

  useEffect(() => {
    // console.log('props.optPlazos: ', props.optPlazos)
    setFormValues((s) => ({ ...s, optPlazos: props.optPlazos }));
  }, [props.optPlazos]);

  useEffect(() => {
    setFormValues((s) => ({
      ...s,
      TipoDesembolsoID: props.TiposDesembolso.TipoDesembolsoID
        ? props.TiposDesembolso.TipoDesembolsoID
        : 0,
    }));
  }, [props.TiposDesembolso]);

  useEffect(() => {
    if (tipoCliente == "3") {
      // refPlazos.current?.select.setValue({ value: '1', label: '1' }, 'select-option')
      const plazos: any = refPlazos.current?.select;
      plazos.select.setValue({ value: "1", label: "1" }, "select-option");

      setFormValues((s) => ({ ...s, Plazos: 1 }));
    } else if (tipoCliente == "2") {
      // refPlazos.current?.select.setValue({ value: '1', label: '1' }, 'select-option')
      const plazos: any = refPlazos.current?.select;
      plazos.select.setValue({ value: "8", label: "8" }, "select-option");

      setFormValues((s) => ({ ...s, Plazos: 8 }));
    } else {
      setFormValues((s) => ({ ...s, Plazos: 0 }));
    }
  }, [formValues.optPlazos]);

  // useEffect(() => {
  //     setFormValues(s => ({ ...s, SucursalId: 0 }))
  // }, [props.initialValues.SucursalId])

  // useEffect(() => {
  //     console.log('props.initialValues.SucursalId: ', props.initialValues.SucursalId)
  //     console.log('formValues.SucursalId: ', formValues.SucursalId)
  // }, [formValues.SucursalId])

  useEffect(() => {
    // return () => {
    setisMounted(true);
    // }
  }, []);

  return (
    <>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          // tipoCliente: Yup.number(),
          ClienteId: Yup.number().when("tipoCliente", {
            is: (value: number) => value < 3,
            then: Yup.number()
              .required(`Seleccione ${tipoClienteDesc}`)
              .moreThan(0, `Seleccione ${tipoClienteDesc}`),
          }),
          CuentaId: Yup.number().when("tipoCliente", {
            is: (value: number) => value == 3,
            then: Yup.number()
              .required(`Seleccione una Cuenta`)
              .moreThan(0, `Seleccione una Cuenta`),
          }),
          // ClienteId: Yup.number().required(`Seleccione ${tipoClienteDesc}`).moreThan(0, `Seleccione ${tipoClienteDesc}`),
          SucursalId: Yup.number()
            .required("Seleccione la sucursal")
            .moreThan(0, "Seleccione la sucursal"),
          CajaID: Yup.number()
            .required("Seleccione la Caja")
            .moreThan(0, "Seleccione la Caja"),
          //Plazos: Yup.number().required("Seleccione el número de plazos").moreThan(0, 'Seleccione el número de plazos'),
          Plazos: Yup.object()
            .shape({
              label: Yup.string().required(),
              value: Yup.string().required(),
            })
            .required("Seleccione o ingrese el número de Plazos")
            .nullable(),
          TipoDesembolsoID: Yup.number()
            .required("No se encontro el tipo de desembolso")
            .moreThan(0, "No se encontro el tipo de desembolso"),
        })}
        onReset={(values: any) => {
          clearFormByLevel(0);
        }}
        onSubmit={(values: any) => {
          // console.log('values: ', values)

          if (shopInfo.totalPrice > 0)
            if (shopInfo.totalPrice <= props.TabTiendita.importeMaxCanje) {
              // if (creditoVale === 0)
              // if(props.TiposDesembolso.TipoDesembolsoID)
              // {
              // setResCredito(true)
              setLoading(true);

              let TipoCanje = values.tipoCliente == 3 ? 4 : 3;
              let PrestamoNomina = values.tipoCliente == 2 ? true : false;

              var detalle = articles.map((valor: any) => {
                var obj = { id_sku: valor.id, cantidad: valor.qty };
                return obj;
              });

              let sistema;

              switch (SucTienda.sistema) {
                case "VR":
                  sistema = "CONFIA";
                  break;
                case "GYT":
                  sistema = "GYT";
                  break;
                case "S3":
                  sistema = "CONFIA3";
                  break;
                case "VE":
                  sistema = "VE";
                  break;
                case "LYT":
                  sistema = "LYT";
                  break;
                case "PS":
                  sistema = "PS";
                  break;
                case "RPS":
                  sistema = "RPS";
                  break;
                default:
                  sistema = "";
                  break;
              }

              let tipo_usuario1: number = values.tipoCliente;

              switch (values.tipoCliente) {
                case "1":
                  tipo_usuario1 = 1;
                  break;
                case "2":
                  tipo_usuario1 = 3;
                  break;
                case "3":
                  tipo_usuario1 = 35;
                  break;
                case "4":
                  tipo_usuario1 = 4;
                  break;
                default:
                  tipo_usuario1 = 0;
                  break;
              }

              let JsonTda = {
                id_empresa: SucTienda.id_empresa,
                sucursal: SucTienda.id_origen, //values.SucursalId
                tipo_usuario1: tipo_usuario1,
                id_usuario: values.ClienteId,
                sistema1: sistema, //props.Sistema //"CONFIA"
                id_forma_pago: 10,
                referencia_forma_pago: "@Credito",
                detalle,
              };

              // console.log('JsonTda:', JsonTda)

              // setCanjearVale(true)

              Funciones.FNAdd(props.oidc, {
                ...values,
                DistribuidorId: values.tipoCliente == 1 ? values.ClienteId : 0,
                Capital: shopInfo.totalPrice,
                ProductoID: props.ProductoID,
                ProductoTiendita: props.TabTiendita.ProductoID,
                Plazos: values.Plazos.value as number,
                // TipoDesembolsoID: props.TiposDesembolso.TipoDesembolsoID as number,
                JsonTda: JSON.stringify(JsonTda),
                TipoCanje,
                PrestamoNomina,
                articles: articles,
              })
                .then((respuesta: any) => {
                  console.log(respuesta);
                  if (respuesta.regresa === 1) {
                    // toast.success(`Se creó el crédito con el N° ${respuesta.CreditoId}`)
                    toast.success(`Se compro en tiendita.`);
                    // setMovimientoID(respuesta.MovimientoID)

                    // DescargarPDF(respuesta)
                    setLoading(false);
                    clearFormByLevel(0);
                    // window.location.replace('');
                  } else {
                    // setErrorVale(true)
                    setLoading(false);
                    // setResCredito(false)
                    toast.error("Error al comprar, " + respuesta.msj);
                  }
                })
                .catch((error: any) => {
                  console.log(JSON.stringify(error));
                  // setErrorVale(true)
                  setLoading(false);
                  // setResCredito(false)
                  toast.error("Error al comprar en la tiendita");
                });

              // }
              // else
              //     toast.error("Error no se tiene parametrizado el tipo de desembolso, verifique.")
            } else
              toast.error(
                `El límite de compra en la tiendita es de $${props.TabTiendita.importeMaxCanje}`
              );
          else toast.error("Error no ha seleccionado ningun articulo.");
        }}
      >
        {({ values }) => (
          <Form>
            <div className="columns is-desktop is-tablet">
              <div className="column is-one-fifth"></div>
              <div className="column is-one-fifth">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <Field
                    type="radio"
                    className="btn-check"
                    name="tipoCliente"
                    id="Cliente1"
                    ref={refCliente1}
                    autoComplete="off"
                    value="1"
                    onClick={() => {
                      setFormValues((s) => ({ ...s, optPlazos: [] }));
                      deselectClient();
                      setTipoCliente("1");
                      setTipoClienteDesc(`la ${DescripcionDistribuidor(1)}`);
                    }}
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor="Cliente1"
                  >{`${DescripcionDistribuidor(1)}`}</label>

                  <Field
                    type="radio"
                    className="btn-check"
                    name="tipoCliente"
                    id="Cliente2"
                    ref={refCliente2}
                    autoComplete="off"
                    value="2"
                    onClick={() => {
                      setFormValues((s) => ({ ...s, optPlazos: [] }));
                      deselectClient();
                      setTipoCliente("2");
                      setTipoClienteDesc("el colaborador");
                    }}
                  />
                  <label className="btn btn-outline-primary" htmlFor="Cliente2">
                    Colaborador
                  </label>
                  {permisoAsignar && (
                    <div>
                      <Field
                        type="radio"
                        className="btn-check"
                        name="tipoCliente"
                        id="Cliente3"
                        ref={refCliente3}
                        autoComplete="off"
                        value="3"
                        onClick={() => {
                          setFormValues((s) => ({
                            ...s,
                            optPlazos: [{ value: "1", label: "1" }],
                          }));
                          deselectClient();
                          setTipoCliente("3");
                          setTipoClienteDesc("la cuenta");
                        }}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="Cliente3"
                      >
                        Contado
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-half-desktop">
                {/* { isMounted &&  */}
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
                {/* } */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-half-desktop">
                <Cajas
                  name="CajaID"
                  // unaLinea
                  disabled
                  // ProductoID={props.ProductoID}
                  SucursalId={values.SucursalId}
                  oidc={props.oidc}
                />
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                {isMounted &&
                                    <ActionSelect
                                        disabled//={props.isUpdate || loading}
                                        label="Sucursal"
                                        name="SucursalId"
                                        placeholder="Seleccione la sucursal"
                                        options={props.optSucursales}
                                        addDefault={false}
                                        valor={values.SucursalId}
                                        accion={cbSucursal}
                                        ref={refSucursal}
                                    />}
                            </div> */}
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                {isMounted && values.tipoCliente == "1" && (
                  <ActionSelect
                    disabled={props.isUpdate || loading}
                    label={`${DescripcionDistribuidor(1)}`}
                    name="ClienteId"
                    placeholder={`Seleccione la ${DescripcionDistribuidor(1)}`}
                    options={formValues.optDistribuidores}
                    addDefault={true}
                    valor={props.initialValues.ClienteId}
                    accion={cbDistribuidor}
                    blur={fnGetCondicionesDetalleByDistribuidor}
                    ref={refDistribuidor}
                  />
                )}
                {isMounted && values.tipoCliente == "2" && (
                  <ActionAsyncSelect
                    loadOptions={loadOptionsClientes}
                    disabled={props.isUpdate || loading}
                    label="Colaborador"
                    name="ClienteId"
                    placeholder="Buscar colaborador"
                    options={props.optClientes}
                    addDefault={false}
                    valor={props.initialValues.ClienteId}
                    accion={cbEmpleado}
                    noOptionsMessage={"No encontrado"}
                    ref={refCliente}
                  />
                )}
                {isMounted && values.tipoCliente == "3" && (
                  <ActionSelect
                    disabled={loading}
                    label="Cuenta"
                    name="CuentaId"
                    placeholder="Cuenta no encontrada"
                    options={props.optCuenta}
                    addDefault={true}
                    valor={
                      props.optCuenta.length > 0 ? props.optCuenta[0].value : 0
                    }
                    // accion={cbDistribuidor}
                    // blur={fnGetCondicionesDetalle}
                    ref={refCuenta}
                  />
                )}
              </div>
              {values.tipoCliente == "1" && (
                <div className="column is-12-mobile is-12-tablet is-3-desktop">
                  {/* <div className="mb-3"> */}
                  Monedero
                  <input
                    title="Monedero"
                    disabled={true}
                    value={
                      props.DatosDistribuidor.Monedero
                        ? props.DatosDistribuidor.Monedero.toLocaleString(
                            "en-US",
                            { style: "currency", currency: "USD" }
                          )
                        : 0
                    }
                    className="form-control"
                  />
                  {/* </div> */}
                </div>
              )}
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
                {isMounted && (
                  // <ActionSelect
                  //     disabled={props.isUpdate || loading || tipoCliente == '3'}
                  //     label="Plazos"
                  //     name="Plazos"
                  //     placeholder="Seleccione el número de plazos"
                  //     options={formValues.optPlazos}
                  //     addDefault={false}
                  //     valor={formValues.Plazos}
                  //     ref={refPlazos}
                  //     accion={cbPlazo}
                  // />
                  <ActionCreatableSelect
                    disabled={
                      props.isUpdate ||
                      loading ||
                      tipoCliente == "3" ||
                      tipoCliente == "2"
                    }
                    label="Plazos"
                    name="Plazos"
                    placeholder="Seleccione o ingrese el número de plazos"
                    options={formValues.optPlazos}
                    // addDefault={false}
                    value={formValues.Plazos}
                    ref={refPlazos}
                    accion={cbPlazo}
                  />
                )}
              </div>
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                {isMounted && (
                  <ActionSelect
                    disabled={loading}
                    label="Tipo de Desembolso"
                    name="TipoDesembolsoID"
                    placeholder="Sin tipo desembolso"
                    options={formValues.optTiposDesembolso}
                    addDefault={false}
                    valor={formValues.TipoDesembolsoID}
                    ref={refTipoDesembolso}
                    // accion={cbTipoDesembolso}
                  />
                )}
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-one-third">
                <button
                  type="button"
                  disabled={
                    loading || props.TabTiendita.importeMaxCanje == 0
                      ? true
                      : false
                  }
                  className="ms-2 btn btn-primary waves-effect waves-light"
                  onClick={() => {
                    setShowStore(true);
                  }}
                >
                  <span className="my-1">Incluir Artículos </span>
                  <FaShoppingCart />
                </button>
                {shopInfo.totalPrice > props.TabTiendita.importeMaxCanje && (
                  <div className="text-danger">{`El límite de compra en la tiendita es de $${props.TabTiendita.importeMaxCanje}`}</div>
                )}
              </div>
            </div>
            <div className="box">
              <div className="columns is-desktop is-tablet">
                <div className="column is-10">
                  <Carrusel articles={articles} />
                  {/* <Carousel
                                        swipeable={false}
                                        draggable={false}
                                        showDots={false}
                                        responsive={responsive}
                                        ssr={true} // means to render carousel on server-side.
                                        infinite={false}
                                        // autoPlay={props.deviceType !== "mobile" ? true : false}
                                        autoPlaySpeed={1000}
                                        keyBoardControl={true}
                                        customTransition="all .5"
                                        transitionDuration={500}
                                        containerClass="carousel-container"
                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                        // deviceType={props.deviceType}
                                        dotListClass="custom-dot-list-style"
                                        itemClass="carousel-item-padding-40-px"
                                        partialVisible={true}
                                    // centerMode={true}            
                                    >
                                        {articles.map((item: any) => (
                                            <CardItem {...item} key={item.id} />
                                        ))}
                                    </Carousel> */}
                </div>
                <div className="column">
                  <div className="box">
                    <p className="title is-5">
                      Total:{" "}
                      {shopInfo.totalPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                    <p>Artículos: {shopInfo.totalItems}</p>
                    <p>Cantidad: {shopInfo.totalQty}</p>
                  </div>
                  {loading && <Spinner />}
                  {!loading && (
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-danger waves-effect waves-light"
                        onClick={props.fnCancelar}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="ms-2 btn btn-success waves-effect waves-light"
                      >
                        Comprar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {ShowStore && (
        <ModalWin open={ShowStore} large center scrollable>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>Inclusssir Artículos</h5>
            <button
              title="Cerrar"
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
                Articles={articles}
                cbSucursal={cbSucTienda}
              />
            )}
          </ModalWin.Body>
        </ModalWin>
      )}
    </>
  );
};
