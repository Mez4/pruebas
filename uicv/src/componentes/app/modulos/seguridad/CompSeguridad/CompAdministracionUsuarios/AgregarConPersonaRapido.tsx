import { ModalWin, AsistenteFormik } from "../../../../../global";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";

// Formik
import * as Funciones from "./Funciones";
import { FormaBasicoAgregarUsuarioRapido } from "../../../../../formas/personas/FormaBasicoAgregarUsuarioRapido";
import { toast } from "react-toastify";

/** Tipo de nuestro componente */
type FormaAgregarTipo = {
  // Basico
  oidc: IOidc;

  productosOptions: { value: number, label: string }[]

  // Callbacks
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;

  // Modal controls
  mostrar: boolean;
};
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */
export const AgregarPersonaRapido = (props: FormaAgregarTipo) => {
  // Render our component
  return (
    <ModalWin open={props.mostrar} large>
      <ModalWin.Header>
        <h5 className={MODAL_TITLE_CLASS}>Agregar usuario</h5>
      </ModalWin.Header>
      <ModalWin.Body style={{ overflowY: 'unset' }}>
        <AsistenteFormik
          MostrarPasos={true}
          Pasos={[FormaBasicoAgregarUsuarioRapido(props.productosOptions)]}
          // Provisionar esta variable para mostrar datos de edicion
          Datos={{}}
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
          PROMESA__PROCESAR={(Datos: any) => {
            return Funciones.FNAgregarUsuarioRapido(props.oidc, Datos);
          }}
          FN__LIMPIAR={(Datos: any, DatosPromesa: any) =>
            props.cbGuardar(DatosPromesa)
          }
          FN__ERROR={() => console.log("Error al procesar")}
        />
      </ModalWin.Body>
    </ModalWin>
  );
};
