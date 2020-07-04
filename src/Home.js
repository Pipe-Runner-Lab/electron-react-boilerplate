import React from 'react';

// Electron related imports
const electron = window.require('electron');
const { ipcRenderer } = electron;
const loadBalancer = window.require('electron-load-balancer');

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            single: undefined,
            thread: {

            }
        };
    }

    componentDidMount() {
        // 1. Setup listener for oneshot python output (bounced from main process)
        ipcRenderer.on('ONE_SHOT_RESULT', (event, args) => {
            console.log(args)
            this.setState(
                {
                    ...this.state,
                    single: args.data.result
                }
            )

            // 2. Kill oneshot background task as soon as we get result
            loadBalancer.stop(ipcRenderer, 'one_shot');
        });

        // 3. Setup listener for preemptive loop python output (bounced from main process)
        ipcRenderer.on('PREEMPTIVE_LOOP_RESULT', (event, args) => {
            console.log(args)
            this.setState(
                {
                    ...this.state,
                    thread: {
                        ...this.state.thread,
                        [args.data.threadID]: this.state.thread[args.data.threadID] ?
                            [...this.state.thread[args.data.threadID], args.data.result] :
                            [args.data.result]
                    }
                }
            )
        });
    }

    componentWillUnmount() {
        // 4. Remove all output listeners before app shuts down
        ipcRenderer.removeAllListeners('ONE_SHOT_RESULT');
        ipcRenderer.removeAllListeners('PREEMPTIVE_LOOP_RESULT');
    }

    startOneShot = () => {
        // 5. Start oneshot background task only when user clicks start
        console.log("One Shot Started")
        loadBalancer.start(ipcRenderer, 'one_shot');
    }

    startPreemptiveLoop = () => {
        // 6. Sending data to preemptive loop (process already running)
        console.log("Preemptive Loop data sent")
        loadBalancer.sendData(
            ipcRenderer,
            'preemptive_loop',
            {
                command: "PREEMPTIVE_LOOP",
                val_list: [...Array(15).keys()]
            }
        );
    }

    render() {
        return (
            <div style={{
                padding: '16px'
            }}>
                <div>
                    <button onClick={this.startOneShot}>
                        <span>Calculate Once - 100!</span>
                    </button>
                </div>
                {
                    this.state.single ? <div style={{
                        margin: '8px 0px 0px 0px'
                    }}>{this.state.single}</div> : null
                }
                <div style={{
                    margin: '16px 0px 0px 0px'
                }}>
                    <button onClick={this.startPreemptiveLoop}>
                        <span>Start Calculation Thead - x! for x ∈ [0, 100]</span>
                    </button>
                </div>
                {
                    Object.keys(this.state.thread).map(key => {
                        return (
                            <div style={{
                                margin: '8px 0px 0px 0px'
                            }} key={key}>
                                {
                                    `${key} : ${this.state.thread[key]}`
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Home