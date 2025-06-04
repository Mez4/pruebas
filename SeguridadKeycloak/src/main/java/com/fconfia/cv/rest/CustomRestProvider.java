package com.fconfia.cv.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.Encoded;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.annotations.cache.NoCache;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.storage.adapter.InMemoryUserAdapter;

public class CustomRestProvider implements RealmResourceProvider {

    private final KeycloakSession session;

    public CustomRestProvider(KeycloakSession p_session) {
        this.session = p_session;
    }

    @GET
    @Path("/test")
    @NoCache
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces(MediaType.APPLICATION_JSON)
    @Encoded
    public Response test() {
        try {
            return Response.ok("TEST__REST").build();

        } catch (Exception ex) {
            return Response.ok("Error al cerrar la sesion").build();
        }
    }

    @POST
    @Path("/logout__token_id")
    @NoCache
    @Produces(MediaType.APPLICATION_JSON)
    @Encoded
    public Response logOutTokenId(CloseSessionData closeSessionData) {
        try {

            RealmModel realm = this.session.getContext().getRealm();
            InMemoryUserAdapter adapter = new InMemoryUserAdapter(session, realm, closeSessionData.sup);
            session.sessions().getUserSessionsStream(realm, adapter).forEach(userSession -> {

                if (userSession.getId().equals(closeSessionData.sid)) {
                    session.sessions().removeUserSession(realm, userSession);
                }
            });
            return Response.ok("Sesion cerrada").build();

        } catch (Exception ex) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("Error al cerrar la sesion")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }

    @Override
    public void close() {
    }

    @Override
    public Object getResource() {
        return this;
    }

}
