import sys
import threading
import json

def fact(val):
    if val == 1:
        return 1
    else:
        return val * fact(val - 1)


if __name__ == '__main__':

    # single thead approach
    output = {
            'type': 'ONE_SHOT_RESULT',
            'result': fact(100)
        }

    # Flushing stdout is needed
    print(json.dumps(output))
    sys.stdout.flush()
