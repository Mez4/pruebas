import { createUserManager } from 'redux-oidc'
const userManager = createUserManager({
    //authority: 'https://kc.fconfia.com/realms/SistemaCV',
    //authority: 'https://kc.fconfia.com/realms/SistemaCV_Desarrollo',
    authority: 'https://kc.fconfia.com/realms/SistemaCV_Demo',
    client_id: 'uicv',
    redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/app/callback`,
    silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent-renew.html`,
    // tslint:disable-next-line:object-literal-sort-keys
    post_logout_redirect_uri: `http://localhost:3000`,
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true,
    monitorSession: false
})

export default userManager