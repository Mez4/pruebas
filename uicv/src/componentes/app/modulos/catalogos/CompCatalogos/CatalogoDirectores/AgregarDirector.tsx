import React, { useState } from "react";
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
import StateManager from "react-select";
import { date } from "yup/lib/locale";
import { formatDate2, formatDate } from "../../../../../../global/functions";

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
export const AgregarDirector = (props: CFormType) => {
  let [msjError , setMsjError] = useState("");
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
          // HECH990728HCLRRC03
          MostrarPasos={true}
          Pasos={[
            FormasPersona.FormaBasicoUno(),
            FormasPersona.FormaBasicoDos(),
            FormasPersona.FormaBasicoTres,
            FormasGeneral.FormaDireccion({
              Prefijo: "DireccionPersona_",
              Titulo: "Direccion",
              SubTitulo: "Direccion Personal",
            }),
            FormasPersona.FormaEmpleo(),
            FormasGeneral.FormaDireccion({
              Prefijo: "DireccionEmpleo_",
              Titulo: "Direccion laboral",
              SubTitulo: "Ubicacion laboral",
            }),
          ]}
          // Provisionar esta variable para mostrar datos de edicion
          Datos={
            // console.log((new Date(parseInt('2003/10/13'))).toISOString().split('T')[0])
            {
              // Nombre: props.datos.Nombre,
              // ApellidoPaterno: props.datos.ApellidoPaterno,
              // ApellidoMaterno: props.datos.ApellidoMaterno,
              // FechaNacimiento: new Date(props.datos.FechaNacimiento),
              // LugarNacimiento: props.datos.LugarNacimiento,
              // CURP: props.datos.CURP,
              // RFC: props.datos.RFC,
              // SexoID: props.datos.SexoID,
              // EstadoCivilID: props.datos.EstadoCivilID,
              // EscolaridadID: props.datos.EscolaridadID,
              // DependientesEconomicos: props.datos.DependientesEconomicos,
              // TelefonoDomicilio: props.datos.TelefonoDomicilio,
              // TelefonoMovil: props.datos.TelefonoMovil,
              // CorreoElectronico: props.datos.CorreoElectronico,
              // NombreConyuge: props.datos.NombreConyuge,
              // Observaciones: props.datos.Observaciones,
              // identificacionTipoId: props.datos.identificacionTipoId,
              // identificacionNumero: props.datos.identificacionNumero,
              //   DireccionPersona_AsentamientoID: props.datos.AsentamientoID,
              //   DireccionPersona_NombreVialidad: props.datos.NombreVialidad,
              //   DireccionPersona_NumeroInterior: props.datos.NumeroInterior,
              //   DireccionPersona_NumeroExterior: props.datos.NumeroExterior,
              //   DireccionPersona_vialidadTipoId: props.datos.vialidadTipoId,
              //   DireccionPersona_orientacionVialidadTipoId:
              //     props.datos.orientacionVialidadTipoId,
              //   DireccionPersona_viviendaTipoId: props.datos.viviendaTipoId,
              //   DireccionPersona_ReferenciaGeografica:
              //     props.datos.ReferenciasGeograficasEmpleo,
              //   FormaEmpleo__Empresa: props.datos.Empresa,
              //   FormaEmpleo__Puesto: props.datos.Puesto,
              //   FormaEmpleo__OcupacionID: props.datos.OcupacionID,
              //   FormaEmpleo__Telefono: props.datos.Telefono,
              //   FormaEmpleo__FechaIngreso: new Date(props.datos.FechaIngreso),
              //   FormaEmpleo__FechaTermino: new Date(props.datos.FechaTermino),
              //   FormaEmpleo__SueldoMensual: props.datos.SueldoMensual,
              //   DireccionEmpleo_vialidadTipoId: props.datos.vialidadTipoIdEmpleo,
              //   DireccionEmpleo_NombreVialidad: props.datos.NombreVialidadEmpleo,
              //   DireccionEmpleo_orientacionVialidadTipoId:
              //     props.datos.orientacionVialidadTipoIdEmpleo,
              //   DireccionEmpleo_NumeroExterior: props.datos.NumeroExteriorEmpleo,
              //   DireccionEmpleo_NumeroInterior: props.datos.NumeroInteriorEmpleo,
              //   DireccionEmpleo_ReferenciaGeografica:
              //     props.datos.ReferenciasGeograficasEmpleo,
              //   DireccionEmpleo_AsentamientoID: props.datos.AsentamientoIDEmpleo,
              //   DireccionEmpleo_viviendaTipoId: props.datos.viviendaTipoIdEmpleo,
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
              Nombre: Datos.Nombre,
              ApellidoPaterno: Datos.ApellidoPaterno,
              ApellidoMaterno: Datos.ApellidoMaterno,
              FechaNacimiento: formatDate2(new Date(Datos.FechaNacimiento)),//Datos.FechaNacimiento,
              LugarNacimiento: Datos.LugarNacimiento == '' ? 'NANA' : Datos.LugarNacimiento,
              CURP: Datos.CURP,
              RFC: Datos.RFC == '' ? 'NOPRESENTARFC' : Datos.RFC,
              SexoID: Datos.SexoID,
              EstadoCivilID: Datos.EstadoCivilID == "0" ? "Z" : Datos.EstadoCivilID,
              EscolaridadID: 7,
              DependientesEconomicos: Datos.DependientesEconomicos == '' ? 0 : Datos.DependientesEconomicos,
              TelefonoDomicilio: Datos.TelefonoDomicilio,
              TelefonoMovil: Datos.TelefonoMovil,
              CorreoElectronico: Datos.CorreoElectronico,
              NombreConyuge: Datos.NombreConyuge,
              Observaciones: Datos.Observaciones,
              identificacionTipoId: parseInt(Datos.identificacionTipoId),
              identificacionNumero: Datos.identificacionNumero,
            };

            const AgregarCliente = {
              CrearCliente: false,
              ClienteID: 0,
              PersonaID: 0,
              LineaCreditoPersonal: 1,
              PagareEstatusId: 0,
              PagareCantidad: 0.0,
              CreacionPersonaID: 0,
              CreacionFecha: "",
              CreacionUsuarioID: 0,
              IdentificadorAnterior: "",
              DistribuidorID: 0,
            };

            const AgregarDireccion = {
              PersonaID: 1,
              DireccionPersona_vialidadTipoId: Datos.DireccionPersona_vialidadTipoId,
              DireccionPersona_NombreVialidad: Datos.DireccionPersona_NombreVialidad,
              DireccionPersona_orientacionVialidadTipoId: Datos.DireccionPersona_orientacionVialidadTipoId == '' ? 0
                : parseInt(Datos.DireccionPersona_orientacionVialidadTipoId),
              DireccionPersona_NumeroExterior: Datos.DireccionPersona_NumeroExterior,
              DireccionPersona_NumeroInterior: Datos.DireccionPersona_NumeroInterior,
              DireccionPersona_ReferenciaGeografica: Datos.DireccionPersona_ReferenciaGeografica,
              DireccionPersona_AsentamientoID: parseInt(Datos.DireccionPersona_AsentamientoID),
              DireccionPersona_viviendaTipoId: Datos.DireccionPersona_viviendaTipoId == '' ? 1 :
                parseInt(Datos.DireccionPersona_viviendaTipoId),
            };

            const AgregarEmpleo = {
              PersonaID: 1,
              FormaEmpleo__Empresa: Datos.FormaEmpleo__Empresa,
              FormaEmpleo__Puesto: Datos.FormaEmpleo__Puesto,
              FormaEmpleo__OcupacionID: Datos.FormaEmpleo__OcupacionID == '' ? 42 : Datos.FormaEmpleo__OcupacionID,
              FormaEmpleo__Telefono: Datos.FormaEmpleo__Telefono,
              FormaEmpleo__FechaIngreso: formatDate2(new Date(Datos.FormaEmpleo__FechaIngreso)) == 'NaN-NaN-NaN' ? '1900-01-01' : Datos.FormaEmpleo__FechaIngreso,
              FormaEmpleo__FechaTermino: formatDate2(new Date(Datos.FormaEmpleo__FechaTermino)) == 'NaN-NaN-NaN' ? '1900-01-01' : Datos.FormaEmpleo__FechaTermino,
              FormaEmpleo__SueldoMensual: Datos.FormaEmpleo__SueldoMensual == '' ? 0 : Datos.FormaEmpleo__SueldoMensual,
              DireccionEmpleo_vialidadTipoId:
                Datos.DireccionEmpleo_vialidadTipoId == '' ? 0 : Datos.DireccionEmpleo_vialidadTipoId,
              DireccionEmpleo_NombreVialidad:
                Datos.DireccionEmpleo_NombreVialidad,
              DireccionEmpleo_orientacionVialidadTipoId:
                Datos.DireccionEmpleo_orientacionVialidadTipoId == '' ? 0 : parseInt(Datos.DireccionEmpleo_orientacionVialidadTipoId),
              DireccionEmpleo_NumeroExterior:
                Datos.DireccionEmpleo_NumeroExterior,
              DireccionEmpleo_NumeroInterior:
                Datos.DireccionEmpleo_NumeroInterior,
              DireccionEmpleo_ReferenciaGeografica:
                Datos.DireccionEmpleo_ReferenciaGeografica,
              DireccionEmpleo_AsentamientoID:
                parseInt(Datos.DireccionEmpleo_AsentamientoID),
              DireccionEmpleo_viviendaTipoId:
                Datos.DireccionEmpleo_viviendaTipoId == '' ? 1 : Datos.DireccionEmpleo_viviendaTipoId,
            };

            const AgregarProspecto = {
              CrearProspecto: false,
            };

            const AgregarDirector = {
              CrearDirector: true,
              LineaCreditoPersonal: 1,
              PagareEstatusId: 0,
              PagareCantidad: 0.0,
              IdentificadorAnterior: "",
              DirectorID: 0,
              PersonaID: 0,
              CreacionPersonaID: 0,
              CreacionFecha: "",
              CreacionUsuarioID: 0,
              DistribuidorID: Datos.DistribuidorID
            };

            // Regresamos la nueva promesa
           return  Funciones.FNAgregar(props.oidc, {
              ...Persona,
              AgregarCliente,
              AgregarDireccion,
              AgregarEmpleo,
              AgregarProspecto,
              AgregarDirector,
            }).catch((err) => {
              // mandamos el mensaje segun la excepcion atrapada
              // console.log("ERROR" ,err.response.data.msj);
              console.log("Holaoalaoalaolaoalaoalaol",err);
              
              setMsjError(err?.msj || 'Error al agregar director');
              throw err;
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
          FN__ERROR={() => console.log("#")}
          
        />
      </ModalWin.Body>
    </ModalWin>
  );
};
