import sys
import threading
import json


class Factorial:
    def __init__(self):
        self.fact_thead_list = []
        self.thread_num = 0

    def fact(self, val):
        if val == 0:
            return 1

        out = 1
        while(val != 1):
            out *= val
            val -= 1
        return out
        

    def calc_all(self, val_list):
        for val in val_list:
            output = {
                'type': 'PREEMPTIVE_LOOP_RESULT',
                'result': self.fact(val),
                'threadID': threading.currentThread().getName()
            }
            print(json.dumps(output))
            sys.stdout.flush()

    def __call__(self, val_list=[1, 2, 3]):
        self.fact_thead_list.append(
            threading.Thread(
                target=self.calc_all,
                name='fact_thread_{}'.format(self.thread_num),
                kwargs=dict(val_list=val_list)
            )
        )
        self.thread_num += 1

        self.fact_thead_list[-1].start()
        # self.calc_all()


def main():
    # instrument cluster initialization
    factorial = Factorial()

    while(True):
        in_stream_data = input()
        parsed_stream_data = json.loads(in_stream_data)
        command = parsed_stream_data['command']

        # ---------------------------- factorial block ------------------------------
        if command == 'PREEMPTIVE_LOOP':
            val_list = parsed_stream_data['val_list']
            factorial(val_list)

        # -------------------------- Script termination block ----------------------------
        if command == 'KILL':
            exit()


if __name__ == '__main__':
    main()
    print("app exited successfully")
