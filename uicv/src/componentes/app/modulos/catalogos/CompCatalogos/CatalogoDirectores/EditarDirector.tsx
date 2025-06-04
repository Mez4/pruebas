import React from "react";
import { ModalWin, AsistenteFormik } from "../../../../../global";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";

// Formik
// import * as Yup from 'yup'
import * as Funciones from "./Funciones";
import {
  FormasGeneral,
  FormasPersona,
  FormasClientes,
} from "../../../../../formas";

import { toast } from "react-toastify";

/** Tipo de nuestro componente */
type CFormType = {
  // Basico
  oidc: IOidc;
  Id?: number;
  Item?: any;

  // Callbacks
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;

  // Modal controls
  mostrar: boolean;
  datos: any;
};
/**
 * Forma para agregar un director en el sistema (Debe de incluir una persona por defecto)
 */
export const EditarDirector = (props: CFormType) => {
  // Render our component
  return (
    <ModalWin open={props.mostrar} large>
      <ModalWin.Header>
        <h5 className={MODAL_TITLE_CLASS}>
          {props.Id ? "Editar director" : "Agregar director"}
        </h5>
      </ModalWin.Header>
      <ModalWin.Body>
        <AsistenteFormik
          MostrarPasos={true}
          Pasos={[
            FormasPersona.FormaBasicoUno(),
            FormasPersona.FormaBasicoDos(),
            FormasPersona.FormaBasicoTres,
          ]}
          // Provisionar esta variable para mostrar datos de edicion
          Datos={
            // console.log((new Date(parseInt('2003/10/13'))).toISOString().split('T')[0])
            {
              DirectorID: props.datos.DirectorID,
              Nombre: props.datos.Nombre,
              ApellidoPaterno: props.datos.ApellidoPaterno,
              ApellidoMaterno: props.datos.ApellidoMaterno,
              FechaNacimiento: new Date(props.datos.FechaNacimiento),
              LugarNacimiento: props.datos.LugarNacimiento,
              CURP: props.datos.CURP,
              RFC: props.datos.RFC,
              SexoID: props.datos.SexoID,
              EstadoCivilID: props.datos.EstadoCivilID,
              EscolaridadID: 7,
              DependientesEconomicos: props.datos.DependientesEconomicos == '' ? 0 : props.datos.DependientesEconomicos,
              TelefonoDomicilio: props.datos.TelefonoDomicilio,
              TelefonoMovil: props.datos.TelefonoMovil,
              CorreoElectronico: props.datos.CorreoElectronico,
              NombreConyuge: props.datos.NombreConyuge,
              Observaciones: props.datos.Observaciones,
              identificacionTipoId: props.datos.identificacionTipoId,
              identificacionNumero: props.datos.identificacionNumero,
            }
          }
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
            // Validamos los datos opcionales
            // if (!Datos.FormaEmpleo__FechaTermino) delete Datos.FormaEmpleo__FechaTermino

            const Persona = {
              PersonaID: Datos.DirectorID,
              Nombre: Datos.Nombre,
              ApellidoPaterno: Datos.ApellidoPaterno,
              ApellidoMaterno: Datos.ApellidoMaterno,
              FechaNacimiento: Datos.FechaNacimiento,
              LugarNacimiento: Datos.LugarNacimiento == '' ? 'NANA' : Datos.LugarNacimiento,
              CURP: Datos.CURP,
              RFC: Datos.RFC,
              SexoID: Datos.SexoID,
              EstadoCivilID: Datos.EstadoCivilID,
              EscolaridadID: Datos.EscolaridadID == '' ? 7 : Datos.EscolaridadID,
              DependientesEconomicos: Datos.DependientesEconomicos,
              TelefonoDomicilio: Datos.TelefonoDomicilio,
              TelefonoMovil: Datos.TelefonoMovil,
              CorreoElectronico: Datos.CorreoElectronico,
              NombreConyuge: Datos.NombreConyuge,
              Observaciones: Datos.Observaciones,
              identificacionTipoId: Datos.identificacionTipoId,
              identificacionNumero: Datos.identificacionNumero,
            };


            // Regresamos la nueva promesa
            return Funciones.FNEditar(props.oidc, {
              ...Persona
            });
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
          FN__ERROR={() => toast.error("Error al actualizar el director")}
        />
      </ModalWin.Body>
    </ModalWin>
  );
};
