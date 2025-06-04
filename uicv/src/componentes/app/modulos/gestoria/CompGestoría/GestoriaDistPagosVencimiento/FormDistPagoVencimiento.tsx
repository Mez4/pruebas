import { useState, useRef, useEffect } from "react";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import * as Funciones from "./Funciones";
import CForm from "./Cform";
import { toast } from "react-toastify";
import Corte05 from "./Corte05";
import Corte20 from "./Corte20";
import moment from "moment";

type FormDistPagoVencimientoType = {
  oidc: IOidc;
  ui: iUI;
};

export default function FormDistPagoVencimiento(
  props: FormDistPagoVencimientoType
) {
  let isMounted = useRef(true);
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];

  const [state, setState] = useState({
    Error: false,
    Datos,
    DatosMostrar,
    FechaVencimiento: moment().add(-1, "d").toDate(),
    diaCorte: "",
    loading: false,
  });

  const setFecha = (fecha: any) => {
    setState((s) => ({
      ...s,
      FechaVencimiento: moment(fecha).toDate(),
    }));
  };

  const filtrar = (values: any) => {
    // VERIFICAR LA FECHA DE CORTE  05/20
    let diaVerificar = moment(values.FechaVencimiento).format("DD");
    if (diaVerificar !== "05" && diaVerificar !== "20") {
      toast.error(
        "Fecha de vencimiento no válida, debe ser el día 5 o 20 del mes."
      );
    } else {
      setState((s) => ({
        ...s,
        loading: true,
      }));

      Funciones.FNReporte1549_2(props.oidc, {
        FechaVencimiento: values.FechaVencimiento,
      })
        .then((respuesta: any) => {
          let diaCorte = moment(respuesta[0].fechaCorte)
            .add(6, "hours")
            .format("DD");

          if (respuesta.length > 0) {
            let tabla: any[] = [];

            respuesta.forEach((element: any) => {
              let Reporte: any;
              if (diaCorte == "05") {
                Reporte = {
                  zonaValesId: element.zonaValesId,
                  zonaVales: element.zonaVales,
                  sucursalValeId: element.sucursalValeId,
                  sucursalVale: element.sucursalVale,
                  coordinadorValeId: element.coordinadorValeId,
                  CoordinadorVale: element.CoordinadorVale,
                  distribuidorId: element.distribuidorId,
                  nombreDistribuidor: element.nombreDistribuidor,
                  salAtrAlInicioCorte: element.salAtrAlInicioCorte,
                  "Dias de Atraso": element.Dias_de_Atraso,
                  pagAtrAlInicioCorte: element.pagAtrAlInicioCorte,
                  vencidoCorte: element.vencidoCorte,
                  aplicado: element.aplicado,
                  bonificacion: element.bonificacion,
                  pagos: element.pagos,
                  D_24: element.D_24,
                  D_25: element.D_25,
                  D_26: element.D_26,
                  D_27: element.D_27,
                  D_28: element.D_28,
                  D_29: element.D_29,
                  D_30: element.D_30,
                  D_31: element.D_31,
                  D_01: element.D_01,
                  D_02: element.D_02,
                  D_03: element.D_03,
                  D_04: element.D_04,
                  D_05: element.D_05,
                  D_06: element.D_06,
                  D_07: element.D_07,
                  D_08: element.D_08,
                  pagosAntes: element.pagosAntes,
                  pagosAntesLiqCliFinal: element.pagosAntesLiqCliFinal,
                  pagosDespues: element.pagosDespues,
                  PACTADO: element.PACTADO,
                  ANTICIPADA: element.ANTICIPADA,
                  PURA: element.PURA,
                  NORMAL: element.NORMAL,
                  TARDÍA: element.TARDÍA,
                  FINAL: element.FINAL,
                };
              } else {
                Reporte = {
                  zonaValesId: element.zonaValesId,
                  zonaVales: element.zonaVales,
                  sucursalValeId: element.sucursalValeId,
                  sucursalVale: element.sucursalVale,
                  coordinadorValeId: element.coordinadorValeId,
                  CoordinadorVale: element.CoordinadorVale,
                  distribuidorId: element.distribuidorId,
                  nombreDistribuidor: element.nombreDistribuidor,
                  salAtrAlInicioCorte: element.salAtrAlInicioCorte,
                  "Dias de Atraso": element.Dias_de_Atraso,
                  pagAtrAlInicioCorte: element.pagAtrAlInicioCorte,
                  vencidoCorte: element.vencidoCorte,
                  aplicado: element.aplicado,
                  bonificacion: element.bonificacion,
                  pagos: element.pagos,
                  D_08: element.D_08,
                  D_09: element.D_09,
                  D_10: element.D_10,
                  D_11: element.D_11,
                  D_12: element.D_12,
                  D_13: element.D_13,
                  D_14: element.D_14,
                  D_15: element.D_15,
                  D_16: element.D_16,
                  D_17: element.D_17,
                  D_18: element.D_18,
                  D_19: element.D_19,
                  D_20: element.D_20,
                  D_21: element.D_21,
                  D_22: element.D_22,
                  D_23: element.D_23,
                  pagosAntes: element.pagosAntes,
                  pagosAntesLiqCliFinal: element.pagosAntesLiqCliFinal,
                  pagosDespues: element.pagosDespues,
                  PACTADO: element.PACTADO,
                  ANTICIPADA: element.ANTICIPADA,
                  PURA: element.PURA,
                  NORMAL: element.NORMAL,
                  TARDÍA: element.TARDÍA,
                  FINAL: element.FINAL,
                };
              }

              tabla.push(Reporte);
            });
            setState((s) => ({
              ...s,
              Error: false,
              Datos: tabla,
              loading: false,
              diaCorte: diaCorte,
            }));
          } else {
            setState((s) => ({
              ...s,
              Error: false,
              Datos: [],
              loading: false,
            }));
          }
        })
        .catch((err) => {
          console.log(err, "TEST");

          setState((s) => ({
            ...s,
            Error: false,
            Datos: [],
            DatosMostrar: [],
            loading: false,
          }));
          toast.error("Hubo un error al obtener los datos");
        });
    }
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [props.oidc]);

  return (
    <div>
      <CForm
        oidc={props.oidc}
        ui={props.ui}
        onSubmit={filtrar}
        loading={state.loading}
        initialValues={{ FechaVencimiento: state.FechaVencimiento }}
        setFecha={setFecha}
        PrintExcelObj={{
          data: state.Datos,
          title: "Consulta Rapida 1549",
          nameDoc: "ConsultaRapida(1549)",
        }}
      />
      {state.Datos.length && state.diaCorte == "05" ? (
        <Corte05 data={state.Datos} />
      ) : (
        <Corte20 data={state.Datos} />
      )}
    </div>
  );
}
