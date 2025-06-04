using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Demo.Classes
{
    internal class WebSocketServer
    {
        private static HttpListener _listener;
        private static WebSocket _webSocket;

        public static async Task StartServer()
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add("http://localhost:8080/");
            _listener.Start();
            Console.WriteLine("Listening on ws://localhost:8080");

            while (true)
            {
                var context = await _listener.GetContextAsync();
                if (context.Request.IsWebSocketRequest)
                {
                    _webSocket = (await context.AcceptWebSocketAsync(null)).WebSocket;
                    Console.WriteLine("WebSocket connected.");
                    //await HandleWebSocketCommunication(_webSocket, "Hello from desktop app!");
                }
            }
        }

        private static async Task HandleWebSocketCommunication(WebSocket webSocket, string message)
        {
            // Send a message to the connected client (webpage)

            var buffer = Encoding.UTF8.GetBytes(message);
            await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }
        // New method to send a message to the connected WebSocket
        public static async Task SendMessageToClient(string message)
        {
            if (_webSocket != null && _webSocket.State == WebSocketState.Open)
            {
                await HandleWebSocketCommunication(_webSocket, message);
            }
            else
            {
                Console.WriteLine("No WebSocket connection is open.");
            }
        }
        public static async void Close(string reason)
        {
            if (_webSocket != null && _webSocket.State == WebSocketState.Open)
            {
                _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, reason, CancellationToken.None);
            }
            
        }
    }
}
