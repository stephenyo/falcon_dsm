var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var soap = require('strong-soap').soap;
var path = require('path');
var date = new Date();
var url = './ShipService_v21.wsdl';
var rateUrl = './RateService_v20.wsdl';
var async = require('async');
const request = require("request");

module.exports = {
    getQuote : function(item, callback){
        var rateDetails = [];
        var key = '0c4h6cjDqryLNGpt';
        var password = 'eRnQjEEftR9YACwduEXGTCzKi';
        var account = '510087780';
        var meter = '118729945';
        var start = new Date();
        var totalTime = 0;
        var shipCost = 0;
        var zipCode = '75070'
        var options =   {RateRequest: {WebAuthenticationDetail : {
            UserCredential : {
                    Key : key,
                    Password : password
            },
        },
        ClientDetail :{
            AccountNumber : account,
            MeterNumber : meter,
        },
        Version :{
            ServiceId : 'crs',
            Major : 20,
            Intermediate : 0,
            Minor : 0
        },

        RequestedShipment : {
            ShipTimestamp: new Date(date.getTime() + (24*60*60*1000)).toISOString(),
            DropoffType: 'REGULAR_PICKUP',
            ServiceType : 'PRIORITY_OVERNIGHT',
            PackagingType: 'YOUR_PACKAGING',
            ShipmentAuthorizationDetail: {
                AccountNumber : account
            },
            Shipper: {
                Contact:{
                    PersonName : 'Dallas SGP',
                    CompanyName : 'FedEx Office',
                    PhoneNumber : '(972) 462-1369'
                },
                Address : {
                    StreetLines : ['1025 S Beltline Rd', 'Ste 200'],
                    City : 'Coppell',
                    StateOrProvinceCode : 'TX',
                    PostalCode : '75019',
                    CountryCode : 'US',
                    Residential : false
                }
            },
                Recipient: {
                    Contact: {
                        PersonName: 'Matt', //item.Recipient.Contact.PersonName,
                        CompanyName: 'Company', //item.Recipient.Contact.CompanyName,
                        PhoneNumber: '214-417-5085' //item.Recipient.Contact.PhoneNumber
                    },
                    Address: {
                        StreetLines: [
                            '7109 Dove Tail Dr' //item.Recipient.Address.StreetLines[0], item.Recipient.Address.StreetLines[1]
                        ],
                        City: 'McKinney', //item.Recipient.Address.City,
                        StateOrProvinceCode: 'TX',// item.Recipient.Address.StateOrProvinceCode,
                        PostalCode: '75070',
                        CountryCode: 'US'
                    }
                },
                RateRequestTypes : 'LIST',
                PackageCount: 1,
                RequestedPackageLineItems: [{
                    SequenceNumber: 1,
                    GroupPackageCount: 1,
                    Weight: {
                        Units: 'LB',
                        Value: '1'//item.RequestedPackageLineItems[0].Weight.Value,
                    },
                    Dimensions: {
                        Length: 8,
                        Width: 8,
                        Height: 8,
                        Units: 'IN'
                    }
                }]
            }
        },
            };
            soap.createClient(rateUrl, function(err, client){
                client.getRates(options, function(err, result){
                    // console.log(client.lastRequest);
                    if(err){console.log(err)}
                    else{
                        console.log('Request took : ',new Date() - start, 'ms')
                        totalTime = totalTime + parseInt(new Date() - start);
                        var fRequest = fs.createWriteStream('./request.txt');
                        var fResponse = fs.createWriteStream('./response.txt');
                        var cRequest = client.lastRequest;
                        try{
                            var serviceType = result.RateReplyDetails;
                            for(i=0; i!=serviceType.length; i++){
                                rateDetails.push({ServiceType : serviceType[i].ServiceType, Cost : serviceType[i].RatedShipmentDetails[0].ShipmentRateDetail.TotalNetChargeWithDutiesAndTaxes.Amount});
                            }
                        }
                        catch(e){
                            console.log(JSON.stringify(result));
                        }
                    }
                    callback(result);
                    var lastRequest = new Date();
                });
            });
        }
}