import { Route, Switch } from 'react-router'

// Seguridad de la pantalla
import { useAccesoAdministracion } from '../../../hooks/useAccesoAdministracion'

// Administracion de usuarios
import { AdministracionUsuarios } from './CompSeguridad'
import Usuario from './CompSeguridad/CompAdministracionUsuarios/Usuario'

// Administracion de roles
import AdministracionRoles from './CompSeguridad/AdministracionRoles'
import Rol from './CompSeguridad/CompAdministracionRoles/Rol'

// Catalogos
import CatalogoPermisos from './CompSeguridad/CatalogoPermisos'
import CatalogoPantallas from './CompSeguridad/CatalogoPantallas'

import PermisosEspeciales from './CompSeguridad/PermisosEspeciales'
import CatalogoPermisosExcel from './CompSeguridad/CatalogoPermisosExcel'
import CatalogoPantallasExcel from './CompSeguridad/CatalogoPantallasExcel'

// ModuloID
const ModuloID: number = 10

// Seguridad
const Seguridad = () => {

    // Accedemos al hook e seguridad
    useAccesoAdministracion(ModuloID)

    // Rgresar el componente
    return (
        <div>
            <Switch>
                <Route exact path="/app/seguridad/usuarios" component={AdministracionUsuarios} />
                <Route exact path="/app/seguridad/usuarios/:usuarioId" component={Usuario} />
                <Route exact path="/app/seguridad/roles" component={AdministracionRoles} />
                <Route exact path="/app/seguridad/roles/:rolId" component={Rol} />
                <Route exact path="/app/seguridad/permisos" component={CatalogoPermisos} />
                <Route exact path="/app/seguridad/pantallas" component={CatalogoPantallas} />
                <Route exact path="/app/seguridad/PermisosEspeciales" component={PermisosEspeciales} />
                <Route exact path="/app/seguridad/PermisosExcel" component={CatalogoPermisosExcel} />
                <Route exact path="/app/seguridad/PantallasExcel" component={CatalogoPantallasExcel} />

                <Route render={() => <span>Redirect nivel de modulo</span>} />
            </Switch>
        </div>
    )
}

export default Seguridad