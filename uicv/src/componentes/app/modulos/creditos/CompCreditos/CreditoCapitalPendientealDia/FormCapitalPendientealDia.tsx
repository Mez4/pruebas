import { useState, useRef, useEffect } from "react";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import * as Funciones from "./Funciones";
import { toast } from "react-toastify";
import moment from "moment";
import CFormCPD from "./CFormCPD";
import DataTablePendCapital from "./DataTablePendCapital";


type FormCapitalPendientealDiaType = {
  oidc: IOidc;
  ui: iUI;
};

export default function FormCapitalPendientealDia(
  props: FormCapitalPendientealDiaType
) {
  let isMounted = useRef(true);
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];

  const [state, setState] = useState({
    Error: false,
    Datos,
    DatosMostrar,
    FechaCapital: moment().add(0, "d").toDate(),
    loading: false,
  });

  const setFecha = (fecha: any) => {
    setState((s) => ({
      ...s,
      FechaCapital: moment(fecha).toDate(),
    }));
  };


  const filtroFecha = (values: any) => {
    // VERIFICAR REPORTE
    let Verificar = moment(values.FechaCapital).format("DD");
    if(Verificar = ""){
      toast.error(
        "Seleccione una Fecha(Obligatorio)"
      );
    } else {
      setState((s) => ({
        ...s,
        loading: true,
      }));
      
      
      Funciones.Reportependientecapital(props.oidc, {
        FechaCapital: values.FechaCapital,
      })
        .then((respuesta: any) => {
          
          if (respuesta.length > 0) {
            let tabla: any[] = [];
    
            respuesta.forEach((element: any) => {
              let ReportePendCapital: any;
              ReportePendCapital = {
                    SucursalID: element.SucursalID,
                    Sucursal: element.Sucursal,
                    DistribuidorID: element.DistribuidorID,
                    Distribuidor: element.Distribuidor,
                    DistribuidorNivelID: element.DistribuidorNivelID,
                    Nivel: element.Nivel,
                    EstatusID: element.EstatusID,
                    Estatus: element. Estatus,
                    IDExterno: element.IDExterno,
                    CreditoID: element.CreditoID,
                    CapítalPendientes: element.CapítalPendientes,
                    SaldoActual: element.SaldoActual,
                    DiasAtraso: element.DiasAtraso,
                    TipoCreditoID: element.TipoCreditoID,
                    Clave: element.Clave,
                    Descripcion: element.Descripcion
              };
              tabla.push(ReportePendCapital);   
            });
              setState((s) => ({
                ...s,
                Error: false,
                Datos: tabla,
                loading: false,
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
          toast.error("Ocurrio un error al obtener los datos");
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
      <CFormCPD
        oidc={props.oidc}
        ui={props.ui}
        onSubmit={filtroFecha}//()=>{}
        loading={state.loading}
        initialValues={{ FechaCapital: state.FechaCapital }}
        setFecha={setFecha}
        PrintExcelObj={{
          data: state.Datos,
          title: "Reporte de Pendientes de Capital al Día",
          nameDoc: "Reporte de Pendientes de Capital al Día",
        }}
        />
      <DataTablePendCapital data={state.Datos} />
    </div>
  );
}
