import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  CustomFieldText,
  Spinner,
  CustomFieldDatePicker,
  CustomSelect,
} from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import * as Funciones from "./Funciones";
import { Field, ErrorMessage } from "formik";
import DatePicker, { registerLocale } from "react-datepicker";
import { FaSearch, FaTimes, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import {
  FaPencilAlt,
  FaPlus,
  FaCircle,
  FaTrash,
  FaPrint,
} from "react-icons/fa";
import moment from "moment";

type CFormType = {
  Seguridad: IOidc;
  Id?: number;
  initialValues: {
    fecha: Date;
    estatus: number;
    tipo_poliza: string;
    numeroPoliza: number;
    cuenta: string;
    usuario: string;
    empresa: string;
    concepto: string;
    fechaFinal: Date;
    fechaInicial: Date;
  };
  cbGuardar(item: any): any;
  fnPrinting(loading: boolean): any;

  fnCancelar(): any;
};

export const CFormBovedaArqueos = (props: CFormType) => {
  // alert(props.Id)
  const DatosDefecto = {
    NombreMoneda: "",
    TipoCambio: 0,
    Fecha: new Date(),
    ClaveMonedaSat: "",
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optCuentas: any[] = [];
  const opPolizasTipo: any[] = [];
  const DatosTabla: any[] = [];

  const [state, setState] = React.useState({
    Datos: {
      fechaInicial: "",
      fechaFinal: "",
      usuario: "",
      arqueoId: 0,
    },
    DatosMostrar,
    Filtro: "",
    Cargando: false,
    Error: false,
    Form: {
      Mostrar: false,
      Datos: DatosDefecto,
      Id: undefined,
    },
    optCuentas,
    opPolizasTipo,
    startDate: null,
    endDate: null,
    DatosTabla,
  });

  const [estado, setEstado] = React.useState({
    numeroP: {
      id: "",
    },
  });
  // Loading
  const [loading, setLoading] = React.useState(false);
  const [habilitar, setHabilitar] = React.useState(true);

  // Define the columns
  const Columns: IDataTableColumn[] = [
    {
      name: "ArqueoID",
      selector: "ArqueoBovedaID",
      sortable: false,
      center: true,
    },
    {
      name: "Fecha",
      selector: "Fecha",
      sortable: false,
      center: true,
      cell: (props) => <div> {formatearFecha(props.Fecha)} </div>,
    },
    {
      name: "Usuario",
      selector: "UsuarioRealiza",
      sortable: false,
      center: true,
    },
    {
      name: "Imprimir",
      sortable: false,
      center: true,
      cell: (propss) => (
        <button
          className="asstext"
          type={"button"}
          onClick={() => {
            props.fnPrinting(true);
            //    alert(propss.ArqueoBovedaID + " " + propss.BovedaID)
            ImprimirCorte(propss.BovedaID, propss.ArqueoBovedaID);
            /*  setState(s => ({
                             ...s, Form: {
                                 ...s.Form, MostrarArqueos: true,
                                 IdCaja: props.CajaID
                             }
                         })) */
          }}
        >
          <FaPrint />
        </button>
      ),
    },
  ];

  const FNGetPolizas = (
    cajaId?: number,
    fechaInicio?: string,
    fechaFin?: string
  ) => {
    setLoading(true);
    Funciones.FNGetArqueosBovedas(
      props.Seguridad,
      cajaId,
      fechaInicio,
      fechaFin
    )
      .then((respuesta: any) => {
        console.log(respuesta);
        let tabla: any[] = [];
        setHabilitar(false);
        setLoading(false);
        console.log("tabla");
        console.log(tabla);
        setState((s) => ({ ...s, Error: false, DatosTabla: respuesta }));
      })
      .catch((err) => {
        setLoading(false);
        setState((s) => ({ ...s, error: true, DatosTabla: [] }));
      });
  };

  const ImprimirCorte = (BovedaID?: number, ArqueoBovedaID?: number) => {
    setLoading(true);

    Funciones.ImprimirCorteBovedas(props.Seguridad, BovedaID, ArqueoBovedaID)
      .then((respuesta: any) => {
        const file = new Blob([respuesta], { type: "application/pdf" });

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

        props.fnPrinting(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setState((s) => ({ ...s, error: true, DatosTabla: [] }));
      });
  };
  function formatearFecha(fecha) {
    return moment(fecha).format("DD/MM/YYYY hh:mm");
  }

  const handleRowClicked = (row: any) => {
    setEstado((e) => ({ ...e, numeroP: { ...estado.numeroP, id: row.id } }));
    state.DatosTabla.map((item) => {
      if (item.toggleSelected === undefined) {
        if (row.id === item.id) {
          item.toggleSelected = true;
        }
      } else {
        delete item.toggleSelected;
      }
    });
    setState((s) => ({ ...s, DatosTabla: state.DatosTabla }));
  };
  // Return the component
  return (
    <Formik
      initialValues={state.Datos}
      enableReinitialize
      validationSchema={Yup.object().shape({
        fechaInicial: Yup.date().required(
          "Debes de seleccionar una fecha inicial"
        ),
        fechaFinal: Yup.date().required("Debes de seleccionar una fecha Final"),
      })}
      onSubmit={(values: any) => {
        // Set our form to a loading state
        setLoading(true);
        console.log(`values`, values);

        let mesInicio = values.fechaInicial.getMonth() + 1;
        if (mesInicio < 10) mesInicio = "0" + mesInicio;

        let diaInicial = values.fechaInicial.getDate();
        if (diaInicial < 10) diaInicial = "0" + diaInicial;

        let mesFinal = values.fechaFinal.getMonth() + 1;
        if (mesFinal < 10) mesFinal = "0" + mesFinal;

        let diaFinal = values.fechaFinal.getDate();
        if (diaFinal < 10) diaFinal = "0" + diaFinal;

        let fechaInicial =
          "" +
          values.fechaInicial.getFullYear() +
          "-" +
          mesInicio +
          "-" +
          diaInicial;
        let fechaFinal =
          "" +
          values.fechaFinal.getFullYear() +
          "-" +
          mesFinal +
          "-" +
          diaFinal;
        console.log(fechaInicial);
        console.log(fechaFinal);
        FNGetPolizas(props.Id, fechaInicial, fechaFinal);
        // Finish the callback
      }}
    >
      <Form>
        <div>
          <div className="row">
            <div className="columns is-centered is-mobile is-multiline">
              <div className="column is-align-items-center is-one-third-desktop is-one-third-tablet is-one-third-mobile">
                <div className="mb-3">
                  <label className="form-label mb-0" htmlFor={"fechaInicial"}>
                    Fecha Inicial
                  </label>
                  <br />
                  <Field
                    disabled={true}
                    id={"fechaInicial"}
                    name={"fechaInicial"}
                  >
                    {(control: any) => (
                      <DatePicker
                        className="form-control"
                        selected={control.field.value}
                        disabled={false}
                        onChange={(value: any) => {
                          control.form.setFieldValue("fechaInicial", value);
                        }}
                        placeholderText="Fecha Inicial"
                        locale="es"
                        dateFormat="yyyy-MM-dd"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    component="div"
                    name={"fechaInicial"}
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="column is-align-items-center is-one-third-desktop is-one-third-tablet is-one-third-mobile">
                <div className="mb-3">
                  <label className="form-label mb-0" htmlFor={"fechaFinal"}>
                    Fecha Final
                  </label>
                  <br />
                  <Field disabled={true} id={"fechaFinal"} name={"fechaFinal"}>
                    {(control: any) => (
                      <DatePicker
                        className="form-control"
                        selected={control.field.value}
                        disabled={false}
                        onChange={(value: any) => {
                          control.form.setFieldValue("fechaFinal", value);
                          console.log(
                            control.form.getFieldProps("fechaInicial").value
                          );
                        }}
                        minDate={
                          new Date(
                            control.form.getFieldProps("fechaInicial").value
                          )
                        }
                        placeholderText="Fecha Final"
                        locale="es"
                        dateFormat="yyyy-MM-dd"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    component="div"
                    name={"fechaFinal"}
                    className="text-danger"
                  />
                </div>
              </div>

              <div className="column is-align-items-center is-one-third-desktop is-one-third-tablet is-one-third-mobile">
                <div className="mb-3">
                  <label className="form-label mb-0"></label>
                  <br />
                  <div className="">
                    <button
                      type="submit"
                      className="btn btn-secondary waves-effect waves-light"
                    >
                      <FaSearch /> Buscar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {loading && <Spinner />}
              {!loading && (
                <DataTable
                  data={state.DatosTabla}
                  striped
                  pagination
                  dense
                  noHeader
                  responsive
                  keyField={"ArqueoID"}
                  defaultSortField={"ArqueoID"}
                  columns={Columns}
                />
              )}

              <div className="text-end">
                {/*    <button type="reset" disabled={loading} className="btn btn-danger waves-effect waves-light" onClick={() => {
                                    props.fnCancelar()
                                    setState(state => ({ ...state, DatosTabla: [], Datos: { fechaFinal: "", fechaInicial: "", arqueoId: 0, usuario: "" } }))
                                }}
                                >

                                    Cancelar
                                </button> */}
                <button
                  type="button"
                  disabled={loading}
                  className="ms-2 btn btn-success waves-effect waves-light"
                  onClick={() => {
                    props.fnCancelar();
                    setState((state) => ({
                      ...state,
                      DatosTabla: [],
                      Datos: {
                        fechaFinal: "",
                        fechaInicial: "",
                        arqueoId: 0,
                        usuario: "",
                      },
                    }));
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
};
