using System;

public class ResponseToken
{
    public string Message { get; set; }
    public string Token { get; set; }
    public DateTime Expiration { get; set; }
    public bool IsAdmin { get; set; }
    public string User { get; set; }
    public int Id { get; set; }
}