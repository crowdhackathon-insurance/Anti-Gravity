import SocketServer

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False


class Listener(SocketServer.BaseRequestHandler):

    def handle(self):
        print "got"
        self.request.settimeout(10.0)
        try:
            with open("outputT", "a") as myfile:
                datata = self.request.recv(1024)
                print datata
                myfile.write(datata + "\n")
            self.request.close()
        except:
            print "next"
            self.request.close()

class Listener2(SocketServer.BaseRequestHandler):

    def handle(self):
        print "hi"
        self.request.settimeout(10.0)
        try:
            with open("output", "a") as myfile:
                while 1:
                    allLine = self.request.recv(1024)
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
    HOST = "192.168.43.174"
    PORT =  6667

    server = SocketServer.TCPServer((HOST, PORT), Listener)
    server.serve_forever()
