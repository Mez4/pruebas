namespace ConfiaWebApi.keycloak
{
    public class AccessToken
    {
        public string access_token { get; set; }
        public int expires_in { get; set; }
        public int refresh_expires_in { get; set; }
        public string token_type { get; set; }
        public string scope { get; set; }
        public string[] scopes { get { return scope.Split(" "); } }
    }

    public class User
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public bool enabled { get; set; }
        public string username { get; set; }
    }
}