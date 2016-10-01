import SimpleHTTPServer
import SocketServer
from threading import Thread
from time import sleep
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template
import SocketServer

STATIC_WEB_PORT = 8668
WEBSOCKET_PORT = 9093
SOCKET_PORT = 6667

def socketHandler():
    HOST = "192.168.43.174"
    server = SocketServer.TCPServer(("", SOCKET_PORT), socketListener)
    server.serve_forever()

def serverStaticThread():
    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", STATIC_WEB_PORT), Handler)
    httpd.serve_forever()

class webSocketHandler(tornado.websocket.WebSocketHandler):
  def open(self):
    print 'Got one'
    self.write_message("reply")
    #websockets.append(self)

  def on_message(self, message):
    self.write_message("New Data?")
    print 'new data';

  def on_close(self):
    print 'closed'

def serverWebSocket():
    application = tornado.web.Application([
      (r'/ws', webSocketHandler),
    ])
    #thread = Thread(target = listenForCrashThread)
    #thread.start()
    application.listen(WEBSOCKET_PORT)
    tornado.ioloop.IOLoop.instance().start()
    #thread.join()

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

class socketListener(SocketServer.BaseRequestHandler):

    def handle(self):
        print "hi"
        self.request.settimeout(10.0)
        try:
            with open("html/output", "a") as myfile:
                while 1:
                    allLine = self.request.recv(24)
                    lines = allLine.split("\n")
                    for line in lines:
                        count = len(line);
                        if (count>=8):
                            start = line[:4]
                            end = line[-4:]
                            if (start=='ypr:' and end==':ypr'):
                                values = line[4:count-4].split(":")
                                flag = False
                                print values
                                for value in values:
                                    if (is_number(value) == True):
                                        continue
                                    else:
                                        flag = True
                                        break
                                if (flag == False):
                                    print line[4:count-4]
                                    myfile.write(line[4:count-4] + "\n")
        except Exception as inst:
            print "next"
            self.request.close()

if __name__ == "__main__":
    thread = Thread(target = serverStaticThread)
    thread.start()
    thread2 = Thread(target = serverWebSocket)
    thread2.start()
    thread3 = Thread(target = socketHandler)
    thread3.start()

    thread.join()
    thread2.join()
    thread3.join()
    #application.listen(WEBSOCKET_PORT)
    #tornado.ioloop.IOLoop.instance().start()

  #application.listen(9090)
  #tornado.ioloop.IOLoop.instance().start()
  #thread.join()
