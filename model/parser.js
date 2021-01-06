function getNamespaces(xmlModel) {
    if (xmlModel.includes('<definitions')) {
        return '';
    }

    let matched = xmlModel.match(/<[a-z]*:definitions/gi);

    if (matched !== null && matched.length > 0) {
        let xmlns = matched[0];
        xmlns = xmlns.replace('<', '').replace(':definitions', '');
        return xmlns;
    }

    return '';
}

function evaluateBPMNModel(xmlModel, namespace) {
    let DOMParser = require('xmldom').DOMParser;
    xmlModel = new DOMParser().parseFromString(xmlModel, 'text/xml');
    let processList = xmlModel.getElementsByTagName(namespace + 'process');

    let measuresList = {};

    for (let k = 0; k < processList.length; k++) {
        let splits = {};
        let joins = {};

        let process = processList[k].childNodes;

        let measures = {
            invalidTasks: 0,
            invalidEvents: 0,
            startEvents: 0,
            endEvents: 0,
            inclusiveGateways: 0,
            uncertainGateways: 0,
            totalNodes: 0,
            totalGateways: 0,
            mismatchedGateways: 0
        }

        for (let i = 0; i < process.length; i++) {
            if (process[i].nodeName.toLowerCase().includes('task'.toLowerCase()) ||
                process[i].nodeName.toLowerCase().includes('subProcess'.toLowerCase())) {
                let incoming = 0;
                let outgoing = 0;

                for (let j = 0; j < process[i].childNodes.length; j++) {
                    if (process[i].childNodes[j].nodeName.toLowerCase().includes('incoming'.toLowerCase())) {
                        incoming++;
                    }

                    if (process[i].childNodes[j].nodeName.toLowerCase().includes('outgoing'.toLowerCase())) {
                        outgoing++;
                    }
                }

                if (incoming !== 1 || outgoing !== 1) {
                    measures.invalidTasks++;
                }

                measures.totalNodes++;
            }

            if (process[i].nodeName.includes('Event')) {
                let incoming = 0;
                let outgoing = 0;

                for (let j = 0; j < process[i].childNodes.length; j++) {
                    if (process[i].childNodes[j].nodeName.toLowerCase().includes('incoming'.toLowerCase())) {
                        incoming++;
                    }

                    if (process[i].childNodes[j].nodeName.toLowerCase().includes('outgoing'.toLowerCase())) {
                        outgoing++;
                    }
                }

                if (process[i].nodeName.toLowerCase().includes('startEvent'.toLowerCase())) {
                    measures.startEvents++;

                    if (!(incoming === 0 && outgoing === 1)) {
                        measures.invalidEvents++;
                    }
                } else if (process[i].nodeName.toLowerCase().includes('endEvent'.toLowerCase())) {
                    measures.endEvents++;

                    if (!(incoming === 1 && outgoing === 0)) {
                        measures.invalidEvents++;
                    }
                } else {
                    if (incoming !== 1 || outgoing !== 1) {
                        measures.invalidEvents++;
                    }
                }

                measures.totalNodes++;
            }

            if (process[i].nodeName.toLowerCase().includes('gateway'.toLowerCase())) {
                let incoming = 0;
                let outgoing = 0;

                for (let j = 0; j < process[i].childNodes.length; j++) {
                    if (process[i].childNodes[j].nodeName.toLowerCase().includes('incoming'.toLowerCase())) {
                        incoming++;
                    }

                    if (process[i].childNodes[j].nodeName.toLowerCase().includes('outgoing'.toLowerCase())) {
                        outgoing++;
                    }
                }

                if (incoming === 1 && outgoing > 1) {
                    if (splits[process[i].nodeName] === undefined) {
                        splits[process[i].nodeName] = {
                            'nodes': 1,
                            'arcs': incoming + outgoing
                        };
                    } else {
                        let oldNodes = splits[process[i].nodeName]['nodes'];
                        let oldArcs = splits[process[i].nodeName]['arcs'];

                        splits[process[i].nodeName]['nodes'] = oldNodes + 1;
                        splits[process[i].nodeName]['arcs'] = oldArcs + incoming + outgoing;
                    }

                    if (joins[process[i].nodeName] === undefined) {
                        joins[process[i].nodeName] = {
                            'nodes': 0,
                            'arcs': 0
                        };
                    }
                } else if (incoming > 1 && outgoing === 1) {
                    if (joins[process[i].nodeName] === undefined) {
                        joins[process[i].nodeName] = {
                            'nodes': 1,
                            'arcs': incoming + outgoing
                        };
                    } else {
                        let oldNodes = joins[process[i].nodeName]['nodes'];
                        let oldArcs = joins[process[i].nodeName]['arcs'];

                        joins[process[i].nodeName]['nodes'] = oldNodes + 1;
                        joins[process[i].nodeName]['arcs'] = oldArcs + incoming + outgoing;
                    }

                    if (splits[process[i].nodeName] === undefined) {
                        splits[process[i].nodeName] = {
                            'nodes': 0,
                            'arcs': 0
                        };
                    }
                } else {
                    measures.uncertainGateways++;
                }

                if (process[i].nodeName.toLowerCase().includes('inclusiveGateway'.toLowerCase())) {
                    measures.inclusiveGateways++;
                }

                measures.totalNodes++;
                measures.totalGateways++;
            }
        }

        for (var key in splits) {
            if (splits.hasOwnProperty(key) && joins.hasOwnProperty(key)) {
                measures.mismatchedGateways += Math.abs(splits[key]['nodes'] - joins[key]['nodes']);
            }
        }

        measuresList[k] = measures;
    }

    return measuresList;
}

function parse(xmlModel) {
    let namespace = getNamespaces(xmlModel);

    if (namespace.length > 1) {
        namespace = namespace + ':';
    }

    return evaluateBPMNModel(xmlModel, namespace);
}

module.exports.parse = parse;