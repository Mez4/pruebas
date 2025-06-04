import React, { useRef } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";

// Icons
import { FaSave } from "react-icons/fa";

// Custom components
import { toast } from "react-toastify";
import { iUI } from "../../../../../interfaces/ui/iUI";
import BodyTemplate from "../../../../global/BodyTemplate";
import DataGridComp from "../../../../global/DataGrid";
import * as Funciones from "./CreditoTabComisiones/Funciones";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
};

type EstadoTipo = {
  DatosEliminados: any[];
  Cargando: boolean;
  Error: boolean;
};

const TabComisiones = (props: CatalogosType) => {
  const DatosTabla = useRef<any[]>([]);
  const [state, setState] = React.useState<EstadoTipo>({
    DatosEliminados: [],
    Cargando: false,
    Error: false,
  });

  const updateStateData = (newTabData: any[]) => {
    console.log("M: NUEVOS DATOS", newTabData)
    DatosTabla.current = newTabData
  }

  const FnSaveTabulador = () => {
    if (DatosTabla.current.length == 0){
      toast.error("SE DEBE CARGAR EL EXCEL CON LOS DATOS")
      return
    }
    setState(prev => ({ ...prev, Cargando: true }))
    Funciones.FnGuardarComisionesCsv(props.oidc, { ComisionesList: JSON.stringify(DatosTabla.current) })
      .then((res: any) => {
        toast.success(res.msj)
      })
      .catch(error => {
        if (typeof error.response.data == 'string') {
          toast.error(error.response.data || 'HA OCURRIDO UN PROBLEMA')
          return
        }
        const errData = error.response.data
        const arrMsj = Array(Array(Object.values(errData.errors || {}))[0])[0]
        const validMsjErr = arrMsj ? `${(errData.title || 'ERROR')} - ` + arrMsj : null

        console.log(errData.error || errData.msj || errData.message || errData.mensaje || validMsjErr)
        toast.error(errData.error || errData.msj || errData.message || errData.mensaje || validMsjErr || 'HA OCURRIDO UN PROBLEMA')
      })
      .finally(() => setState(prev => ({ ...prev, Cargando: false })))
  }

  return (<BodyTemplate title="Tabulador de comisiones" >
    <>
      <div>
        <FilterTemplate>
          <div className="text-end column is-12-mobile is-12-tablet is-12-desktop">
            <button disabled={state.Cargando} type="button" className="btn btn-primary ml-2 btn-lg" onClick={FnSaveTabulador} >
              {!state.Cargando ? 'Guardar tabulador' : 'Cargando...'} <FaSave size="20px" style={{ marginTop: -2 }} />
            </button>
          </div>
        </FilterTemplate>
        <DataGridComp
          data={[]}
          chargeCsvData
          extractCsvData={updateStateData}
          pagination
        />
      </div>
    </>
  </BodyTemplate>);
};


export const FilterTemplate = ({ children }) => {
  return (
    <div style={{ backgroundColor: "#F0F0F0", padding: "1em", borderRadius: "15px" }}>
      <div style={{ width: "100%", textAlign: "center", display: "inline-block" }}>
        <div className="columns is-left is-mobile is-multiline"> {children} </div>
      </div>
    </div>)
}


const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TabComisiones);
