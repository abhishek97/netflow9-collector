/**
 * Created by abhishek on 07/12/16.
 */
'use strict';

const AZURE_STORAGE_ACCOUNT = "alphanetlog";
const AZURE_STORAGE_ACCESS_KEY = "XXXXXXXXXXX";

var azure = require('azure-storage');
var fileService = azure.createFileService(AZURE_STORAGE_ACCOUNT , AZURE_STORAGE_ACCESS_KEY );
console.log(process.argv);
fileService.createFileFromLocalFile("natlogs" ,"log" , process.argv[3] , process.argv[2] , function(err , result , response ){
    if(!err)
        console.log("Done!");
    else
        console.error(err);

});