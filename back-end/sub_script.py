def background_process():
    import time
    time.sleep(20)
    sleep_min = 0.5
    while True:

        time.sleep(60 * sleep_min)


def index():
    import threading
    t = threading.Thread(target=background_process, args=(), kwargs={})
    t.setDaemon(True)
    t.start()
