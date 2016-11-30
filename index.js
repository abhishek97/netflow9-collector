/**
 * Created by abhishek on 30/11/16.
 */
'use strict';


const collector = require('node-netflowv9');
const fs = require('fs');
const stream = fs.createWriteStream('var/log/natlog');
//const netmask = require('netmask').Netmask;

/*
const blocks = [
    // list subnets that you wish to log translations..
    new netmask('100.64.200.0/24'),
];
*/

function logTranslation(unixTime, lanSrcAddr, lanSrcPort,
                        postNatSrcAddr, postNatSrcPort, dstAddr, dstPort) {

        stream.once('open', (fd) => {
            stream.write( "" + unixTime + "Internal IP: " + lanSrcAddr + ":" + lanSrcPort + " -> Translated Ip: " + postNatSrcAddr + ":" + postNatSrcPort + " Destination: " + dstAddr + ":" + dstPort);
            stream.end();
        });
}

collector(function(flowrecord) {
    var unixTime = flowrecord['header']['seconds'];
    var flows = flowrecord['flows'];
    for (var flow in flows) {
        var f = flows[flow];
        if (f['protocol'] != 6) {
            // only log TCP translations
            continue;
        }
        var src = f['ipv4_src_addr'];
        var isNat = true;

        var natSrcAddr = f['postNATSourceIPv4Address'];
        if (src == natSrcAddr) {
            // when internal IP matches natted IP (anomaly I have not figured out)
            continue;
        }
        var dst = f['ipv4_dst_addr'];
        var dstPort = f['l4_dst_port'];
        var srcPort = f['l4_src_port'];
        var natSrcPort = f['postNAPTSourceTransportPort'];
        console.log(unixTime, src, srcPort, natSrcAddr, natSrcPort, dst, dstPort);
        logTranslation(unixTime, src, srcPort, natSrcAddr, natSrcPort, dst, dstPort);
        //console.log(f)

    }
}).listen(3241);

process.on('SIGINT', function() {
    process.exit();
});