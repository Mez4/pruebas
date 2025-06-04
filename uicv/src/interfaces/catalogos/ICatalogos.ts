import { IEstadoDistribuidor } from './IEstadoDistribuidor';
import { IIdentificacionesTipos } from "./IIdentificacionesTipos"
import { ISexo } from "./ISexo"
import { IEstadoCivil } from './IEstadosCiviles'
import { IEscolaridad } from './IEscolaridad'
import { IOcupacion } from "./IOcupacion"
import { IVialidadesTipo } from "./IVialidadesTipo"
import { IOrientacionVialidadTipo } from "./IOrientacionVialidadTipo"
import { IViviendasTipos } from "./IViviendasTipos"
import { IEstadoCredito } from "./IEstadoCredito"
import { IPagareEstatusTipo } from "./IPagareEstatusTipo"
import { IAsentamientos } from "./IAsentamientos"
import { IEstadosPais } from './IEstadosPais';
import { ITipoVivienda } from './iTipoVivienda';
import { ITipoDistribuidor } from './ITipoDistribuidor';
import { IEmpresasExperiencia } from './IEmpresasExperiencia';
import { IParentesco } from './IParentesco';
import { IStatusProceso } from './IStatusProceso';
import { DBConfia_General } from '../../interfaces_db/DBConfia/General';

export interface ICatalogos {
    IdentificacionesTipos: {
        Datos?: IIdentificacionesTipos[],
        Cargando: boolean,
        Error: boolean
    },
    EstatusCredito: {
        Datos?: IEstadoCredito[],
        Cargando: boolean,
        Error: boolean
    }
    Sexos: {
        Datos?: ISexo[],
        Cargando: boolean,
        Error: boolean
    },
    EstadosCiviles: {
        Datos?: IEstadoCivil[],
        Cargando: boolean,
        Error: boolean
    },
    Escolaridades: {
        Datos?: IEscolaridad[],
        Cargando: boolean,
        Error: boolean
    },
    Ocupaciones: {
        Datos?: IOcupacion[],
        Cargando: boolean,
        Error: boolean
    },
    VialidadesTipo: {
        Datos?: IVialidadesTipo[],
        Cargando: boolean,
        Error: boolean
    },
    OrientacionVialidadTipo: {
        Datos?: IOrientacionVialidadTipo[],
        Cargando: boolean,
        Error: boolean
    },
    ViviendasTipo: {
        Datos?: IViviendasTipos[],
        Cargando: boolean,
        Error: boolean
    },
    EstadisDistribuidor: {
        Datos?: IEstadoDistribuidor[],
        Cargando: boolean,
        Error: boolean
    },
    PagareEstatus: {
        Datos?: IPagareEstatusTipo[],
        Cargando: boolean,
        Error: boolean
    },
    Asentamientos: {
        Datos?: IAsentamientos[],
        Cargando: boolean,
        Error: boolean
    },
    EstadosPais: {
        Datos?: IEstadosPais[],
        Cargando: boolean,
        Error: boolean
    },
    TipoVivienda: {
        Datos?: ITipoVivienda[],
        Cargando: boolean,
        Error: boolean
    },
    EmpresasExperiencia: {
        Datos?: IEmpresasExperiencia[],
        Cargando: boolean,
        Error: boolean
    },
    Parentescos: {
        Datos?: IParentesco[],
        Cargando: boolean,
        Error: boolean
    },
    StatusProcesos: {
        Datos?: IStatusProceso[],
        Cargando: boolean,
        Error: boolean
    },
    TipoDistribuidor: {
        Datos?: ITipoDistribuidor[],
        Cargando: boolean,
        Error: boolean
    },
    Empresas: {
        Datos?: DBConfia_General.IEmpresas[],
        Cargando: boolean,
        Error: boolean
    }
}