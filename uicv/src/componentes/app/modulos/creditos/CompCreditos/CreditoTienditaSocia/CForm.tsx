import React, { useRef, useState, useEffect, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  ActionSelect,
  ActionCreatableSelect,
  ActionAsyncSelect,
  Carrusel,
  ImgViewer,
} from "../../../../../global";
import * as Funciones from "../CreditoTiendita/Funciones";
import * as FnVales from "../CreditoVale/Funciones";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import { FaShoppingCart } from "react-icons/fa";
import { Cajas, Distribuidores, Sucursales } from "../../../../../selectores";
import CreditoArticulos from "../CreditoArticulos";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  DescripcionDistribuidor,
  FormateoDinero,
} from "../../../../../../global/variables";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import { range, truncateDecimals } from "../../../../../../global/functions";
import { CtxCreditoTiendita } from "./CreditoTienditaContext";

type CFormType = {
  iu: iUI;
  oidc: IOidc;
  ProductoID: number;
  Id?: number;
  initialValues: {
    SucursalId: number;
    CajaID: number;
    DistribuidorID: number;
    Plazos: number;
    TipoDesembolsoID: number;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  fnGetCuentas(ProductoID: number, id: any): any;
  fnGetDistribuidores(id: any): any;
  // fnGetCondicionesDetalle(
  //   ProductoID: number,
  //   SucursalId: number,
  //   DistribuidorID: number
  // ): any;
  fnGetTiposDesembolso(ProductoID: number, SucursalId: number): any;
  fnGetEmpleados(id: any, Nombre: string, callback: any): any;
  // fnGetListaPlazos(Capital: number): any;
  fnGetDatosCliente(id: any): any;
  fnGetDatosDistribuidor(DistribuidorID: any): any;
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
  ProdTiendita: number;
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
  // descuento:number
};

export const CForm = (props: CFormType) => {
  const { ArticulosCarrito, setArticulosCarrito } =
    useContext(CtxCreditoTiendita);
  const [state, setState] = React.useState({
    Articulos: false,
  });

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

  // const [entro, setEntro] = useState(false);

  const [ShowStore, setShowStore] = useState(false);

  // const [ArticulosCarrito, setArticulosCarrito] = useState([]);

  const [articulosIds, setArticulosIds] = useState([]);

  const [shopInfo, setShopInfo] = useState({
    totalItems: 0,
    totalPrice: 0,
    totalQty: 0,
    totalPriceOrg: 0,
  });

  const [tipoCliente, setTipoCliente] = useState("1");

  const [tipoClienteDesc, setTipoClienteDesc] = useState("");

  const [formValues, setFormValues] = useState({
    optDistribuidores: [{ value: 0, label: "" }],
    optPlazos: [{ value: "0", label: "" }],
    optCuenta: [{ value: 0, label: "" }],
    optTiposDesembolso: [{ value: 0, label: "" }],
    SucursalId: props.initialValues.SucursalId,
    DistribuidorID: props.initialValues.DistribuidorID,
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
  const refDistribuidor =
    useRef<CreatableSelect<{ value: string; label: string }, false>>(null);
  const refCliente = useRef<AsyncSelect<[], false>>(null);
  const refCuenta = useRef<Select>(null);
  const refPlazos =
    useRef<CreatableSelect<{ value: string; label: string }, false>>(null); //useRef<Select>(null)
  const refTipoDesembolso = useRef<Select>(null);

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
    }
    if (level === 0 || level === 1) {
      const plazos: any = refPlazos.current?.select;
      plazos.select.clearValue();
      //deselectClient();
      // refTipoDesembolso.current?.select.setValue(
      //   { value: "0", label: "" },
      //   "deselect-option"
      // );
    }
    if (level === 0 || level === 1 || level === 2) {
      // if (tipoCliente == "1") {
      //   const plazos: any = refPlazos.current?.select;
      //   plazos.select.clearValue();
      // }
    }
  };
  const permisoAsignar =
    props.iu.PermisosProductos?.find((p) => p.PermisoID == 2606) ||
    props.iu.Persona?.MasterUser;

  // const deselectClient = () => {
  //   const distribuidor: any = refDistribuidor.current;
  //   if (distribuidor) {
  //     distribuidor.select.setValue(
  //       { value: "0", label: "" },
  //       "deselect-option"
  //     );
  //   }

  //   const cuenta: any = refCuenta.current;
  //   if (cuenta) {
  //     cuenta.select.setValue({ value: "0", label: "" }, "deselect-option");
  //   }
  // };

  const fnGetCondicionesDetalleByDistribuidor = () => {
    // const sucursal: any = refSucursal;
    // const distribuidor: any = refDistribuidor;
    // const ProductoID = props.ProductoID;
    // const SucursalId = sucursal.current.props.value.value as number;
    // const DistribuidorID = distribuidor.current.props.value.value as number;
    // props.fnGetCondicionesDetalle(ProductoID, SucursalId, DistribuidorID);
  };

  const cbSucursal = (value: any) => {
    setFormValues((s) => ({ ...s, SucursalId: value }));
    clearFormByLevel(1);
    props.fnGetDistribuidores(value);
    props.fnGetCuentas(props.ProductoID, value);
    props.fnGetTiposDesembolso(value, props.ProductoID);
    // props.fnGetCondicionesDetalle(props.ProductoID, value, 0);
  };

  const cbDistribuidor = (value: any) => {
    // clearFormByLevel(2);
    props.fnGetLineaTiendita(value);
    props.fnGetDatosDistribuidor(value);
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
    console.log("M: info totaaaaal", values);
    setShowStore(false);
    if (values.cart !== null) {
      setArticulosCarrito(values.cart.items);
      setArticulosIds(
        values.cart.items.map((valor: any) => {
          return valor.id;
        })
      );
      setShopInfo(values.cart.info);
      state.Articulos = true;
      fnPlazos();
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

  const DescargarPDF = (respuesta: any) => {
    toast.info("Se está generando el pagaré, por favor espere...");
    Funciones.FNPdf(props.oidc, {
      ProductoID: props.ProductoID,
      CreditoID: respuesta.CreditoId,
      CreditoID_2: 0,
    })
      .then((pdf: any) => {
        const file = new Blob([pdf], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);
        const enlaceTemporal = document.createElement("a");
        enlaceTemporal.href = fileURL;
        enlaceTemporal.target = "_blank";
        enlaceTemporal.style.display = "none";

        document.body.appendChild(enlaceTemporal);

        enlaceTemporal.click();

        setTimeout(() => {}, 1000);
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
    if (state.Articulos === true) {
      fnPlazos();
      state.Articulos = false;
    }

    //     console.log('plazos', formValues.Plazos)

    // if(shopInfo.totalPrice <= 1999)
    // {
    //   let arr = range(2, 8, 2)

    //   arr = arr.reverse()
    //   let plazos = arr.map((valor: any) => {
    //       var obj = { value: valor, label: valor };
    //       return obj
    //   });

    //   setFormValues((s) => ({ ...s, optPlazos: plazos }));
    // }
    // if(shopInfo.totalPrice >= 2000 && shopInfo.totalPrice <= 3999)
    //   {
    //     let arr = range(2, 10, 2)

    //     arr = arr.reverse()
    //     let plazos = arr.map((valor: any) => {
    //         var obj = { value: valor, label: valor };
    //         return obj
    //     });

    //     setFormValues((s) => ({ ...s, optPlazos: plazos }));
    //   }
    //   if(shopInfo.totalPrice >= 4000 && shopInfo.totalPrice <= 5999)
    //     {
    //       let arr = range(2, 12, 2)

    //       arr = arr.reverse()
    //       let plazos = arr.map((valor: any) => {
    //           var obj = { value: valor, label: valor };
    //           return obj
    //       });

    //       setFormValues((s) => ({ ...s, optPlazos: plazos }));
    //     }
    //     if(shopInfo.totalPrice > 6000 && state.Articulos === true)
    //       {
    //         let arr = range(2, 14, 2)

    //         arr = arr.reverse()
    //         let plazos = arr.map((valor: any) => {
    //             var obj = { value: valor, label: valor };
    //             return obj
    //         });

    //         setFormValues((s) => ({ ...s, optPlazos: plazos }));
    //       }
    //       // ArticulosCarrito.map((valor: any) => {
    //       //   if(valor.id_estructura == 471 || valor.id_estructura == 472 || valor.id_estructura == 473)
    //       //   {
    //       //     let arr = range(16, 16, 2)

    //       //     arr = arr.reverse()
    //       //     let plazos = arr.map((valor: any) => {
    //       //         var obj = { value: valor, label: valor };
    //       //         return obj
    //       //     });
    //       //     setFormValues((s) => ({ ...s, optPlazos: plazos }));
    //       //   }
    //       // })
  }, [formValues.optPlazos]);

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

  const fnPlazos = () => {
    if (shopInfo.totalPrice <= 1999) {
      let arr = range(2, 8, 2);

      arr = arr.reverse();
      let plazos = arr.map((valor: any) => {
        var obj = { value: valor, label: valor };
        return obj;
      });

      setFormValues((s) => ({ ...s, optPlazos: plazos }));
    }
    if (shopInfo.totalPrice >= 2000 && shopInfo.totalPrice <= 3999) {
      let arr = range(2, 10, 2);

      arr = arr.reverse();
      let plazos = arr.map((valor: any) => {
        var obj = { value: valor, label: valor };
        return obj;
      });

      setFormValues((s) => ({ ...s, optPlazos: plazos }));
    }
    if (shopInfo.totalPrice >= 4000 && shopInfo.totalPrice <= 5999) {
      let arr = range(2, 12, 2);

      arr = arr.reverse();
      let plazos = arr.map((valor: any) => {
        var obj = { value: valor, label: valor };
        return obj;
      });

      setFormValues((s) => ({ ...s, optPlazos: plazos }));
    }
    if (shopInfo.totalPrice > 6000) {
      let arr = range(2, 14, 2);

      arr = arr.reverse();
      let plazos = arr.map((valor: any) => {
        var obj = { value: valor, label: valor };
        return obj;
      });

      setFormValues((s) => ({ ...s, optPlazos: plazos }));
    }
    ArticulosCarrito.map((valor: any) => {
      if (
        valor.id_estructura == 471 ||
        valor.id_estructura == 472 ||
        valor.id_estructura == 473
      ) {
        let arr = range(16, 16, 2);

        arr = arr.reverse();
        let plazos = arr.map((valor: any) => {
          var obj = { value: valor, label: valor };
          return obj;
        });
        setFormValues((s) => ({ ...s, optPlazos: plazos }));
      }
    });
    // formValues.optPlazos
  };

  //   useEffect(() => {
  //     setTotal((capital + shopInfo.totalPrice))
  // }, [capital, shopInfo.totalPrice])
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

  // useEffect(() => {
  //    console.log('props.optPlazos: ', state.optPlazos)
  //   setFormValues((s) => ({ ...s, optPlazos: state.optPlazos }));
  // }, [state.optPlazos]);

  useEffect(() => {
    setFormValues((s) => ({
      ...s,
      TipoDesembolsoID: props.TiposDesembolso.TipoDesembolsoID
        ? props.TiposDesembolso.TipoDesembolsoID
        : 0,
    }));
  }, [props.TiposDesembolso]);

  // useEffect(() => {
  //   if (tipoCliente == "3") {
  //     // refPlazos.current?.select.setValue({ value: '1', label: '1' }, 'select-option')
  //     const plazos: any = refPlazos.current?.select;
  //     plazos.select.setValue({ value: "1", label: "1" }, "select-option");

  //     setFormValues((s) => ({ ...s, Plazos: 1 }));
  //   } else if (tipoCliente == "2") {
  //     // refPlazos.current?.select.setValue({ value: '1', label: '1' }, 'select-option')
  //     const plazos: any = refPlazos.current?.select;
  //     plazos.select.setValue({ value: "8", label: "8" }, "select-option");

  //     setFormValues((s) => ({ ...s, Plazos: 8 }));
  //   } else {
  //     setFormValues((s) => ({ ...s, Plazos: 0 }));
  //   }
  // }, [formValues.optPlazos]);

  useEffect(() => {
    // return () => {
    setisMounted(true);
    // fnPlazos()
    // }
  }, []);

  return (
    <>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          // tipoCliente: Yup.number(),
          DistribuidorID: Yup.number()
            .required(`Seleccione la ${DescripcionDistribuidor(1)}`)
            .moreThan(0, `Seleccione la ${DescripcionDistribuidor(1)}`),
          SucursalId: Yup.number()
            .required("Seleccione la sucursal")
            .moreThan(0, "Seleccione la sucursal"),
          CajaID: Yup.number()
            .required("Seleccione la Caja")
            .moreThan(0, "Seleccione la Caja"),
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
          // fnPlazos()

          console.log(values);

          if (shopInfo.totalPrice > 0)
            if (shopInfo.totalPrice <= props.DatosDistribuidor.Monedero) {
              setLoading(true);

              // let TipoCanje = values.tipoCliente == 3 ? 4 : 3;
              // let PrestamoNomina = values.tipoCliente == 2 ? true : false;

              var detalle = ArticulosCarrito.map((valor: any) => {
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

              // let tipo_usuario1: number = values.tipoCliente;

              // switch (values.tipoCliente) {
              //   case "1":
              //     tipo_usuario1 = 1;
              //     break;
              //   case "2":
              //     tipo_usuario1 = 3;
              //     break;
              //   case "3":
              //     tipo_usuario1 = 35;
              //     break;
              //   case "4":
              //     tipo_usuario1 = 4;
              //     break;
              //   default:
              //     tipo_usuario1 = 0;
              //     break;
              // }

              // let JsonTda = {
              //   id_empresa: SucTienda.id_empresa,
              //   sucursal: SucTienda.id_origen, //values.SucursalId
              //   tipo_usuario1: tipo_usuario1,
              //   id_usuario: values.ClienteId,
              //   sistema1: sistema, //props.Sistema //"CONFIA"
              //   id_forma_pago: 10,
              //   referencia_forma_pago: "@Credito",
              //   detalle,
              // };

              // console.log('JsonTda:', JsonTda)

              // setCanjearVale(true)

              Funciones.FNAddTiendita(props.oidc, {
                ...values,
                Capital: shopInfo.totalPrice,
                ProductoTienditaID: props.ProdTiendita,
                Plazos: values.Plazos.value as number,
                articles: ArticulosCarrito,
                ProductoID: props.ProductoID,
                Sucursal: SucTienda,
              })
                .then((respuesta: any) => {
                  console.log(respuesta);
                  if (respuesta.regresa === 1) {
                    // toast.success(`Se creó el crédito con el N° ${respuesta.CreditoId}`)
                    toast.success(`Se compro en tiendita.`);
                    toast.info(
                      "Se está generando el documento, por favor espere..."
                    );
                    // setMovimientoID(respuesta.MovimientoID)

                    // DescargarPDF(respuesta)
                    setLoading(false);
                    clearFormByLevel(0);
                    cbDistribuidor(values.DistribuidorID);

                    FnVales.FNGetPlanPagoPDF(props.oidc, {
                      CreditoID: respuesta.CreditoId,
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
                  if (error.response)
                    toast.error(`Response Error: ${error.response.data}`);
                  else if (error.request) toast.error(`Request ${error}`);
                  else toast.error(`${error}`);
                  // setResCredito(false)
                  //toast.error("Error al comprar en la tiendita");
                });

              // }
              // else
              //     toast.error("Error no se tiene parametrizado el tipo de desembolso, verifique.")
            } else
              toast.error(
                `El límite de compra en la tiendita es de $${props.DatosDistribuidor.Monedero}`
              );
          else toast.error("Error no ha seleccionado ningun articulo.");
        }}
      >
        {({ values }) => (
          <Form>
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
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <ActionSelect
                  disabled={props.isUpdate || loading}
                  label={`${DescripcionDistribuidor(1)}`}
                  name="DistribuidorID"
                  placeholder={`Seleccione la ${DescripcionDistribuidor(1)}`}
                  options={formValues.optDistribuidores}
                  addDefault={true}
                  valor={values.DistribuidorID}
                  accion={cbDistribuidor}
                  blur={fnGetCondicionesDetalleByDistribuidor}
                  ref={refDistribuidor}
                />
              </div>
              {
                <div className="column is-12-mobile is-12-tablet is-3-desktop">
                  {/* <div className="mb-3"> */}
                  Disponible
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
              }
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
                {isMounted && (
                  <ActionCreatableSelect
                    disabled={props.isUpdate || loading}
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
                    disabled={true}
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
              <div className="column is-two-thirds">
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
                    clearFormByLevel(0);
                    clearFormByLevel(1);
                  }}
                >
                  <span className="my-1">Incluir Artículos </span>
                  <FaShoppingCart />
                </button>
                {shopInfo.totalPrice > props.DatosDistribuidor.Monedero && (
                  <div className="text-danger">{`El límite de compra en la tiendita es de $${props.DatosDistribuidor.Monedero.toLocaleString(
                    "en"
                  )}`}</div>
                )}
              </div>
              <div className="column is-one-third">
                <h1 className="title is-3">{`TOTAL: $${shopInfo.totalPrice.toLocaleString(
                  "en"
                )}`}</h1>
              </div>
            </div>

            <div className="box">
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
                      {/* {fnPlazos()} */}
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
          </Form>
        )}
      </Formik>

      {ShowStore && (
        <ModalWin open={ShowStore} large center scrollable>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>Incluir Artículos</h5>
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
                Articles={ArticulosCarrito}
                cbSucursal={cbSucTienda}
              />
            )}
          </ModalWin.Body>
        </ModalWin>
      )}
    </>
  );
};
