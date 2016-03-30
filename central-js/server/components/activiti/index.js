var request = require('request')
  , _ = require('lodash')
  , NodeCache = require("node-cache")
  , FormData = require('form-data')
  , StringDecoder = require('string_decoder').StringDecoder
  , aServerCache = new NodeCache();

var options;

module.exports.httpCallback = function (asyncCallback) {
  return function (error, response, body) {
    if (error) {
      //TODO add code processing
      asyncCallback(error, null);
    } else {
      asyncCallback(null, body);
    }
  };
};

module.exports.asErrorMessages = function (asMessageDefault, oData, onCheckMessage) {
  /*var oData = {"s":"asasas"};
   $.extend(oData,{sDTat:"dddddd"});
   var a=[];
   a=a.concat(["1"]);*/ //{"code":"SYSTEM_ERR","message":null}
  if (!asMessageDefault || asMessageDefault === null) {
    asMessageDefault = [];
  }
  var asMessage = [];
  try {
    if (!oData) {
      asMessage = asMessage.concat(['Пуста відповідь на запит!']);
    } else {
      var n = 0;
      if (oData.hasOwnProperty('message')) {
        if (onCheckMessage !== null) {
          var asMessageNew = onCheckMessage(oData.message);
          if (asMessageNew !== null) {
            asMessage = asMessage.concat(asMessageNew);
          } else {
            asMessage = asMessage.concat(['Message: ' + oData.message]);
          }
        } else {
          asMessage = asMessage.concat(['Message: ' + oData.message]);
        }
        oData.message = null;
        n++;
      }
      if (oData.hasOwnProperty('code')) {
        asMessage = asMessage.concat(['Code: ' + oData.code]);
        oData.code = null;
        n++;
      }
      if (n < 2) {
        asMessage = asMessage.concat(['oData: ' + oData]);
      }
    }
  } catch (sError) {
    asMessage = asMessage.concat(['Невідома помилка!', 'oData: ' + oData, 'sError: ' + sError]);
  }
  if (asMessage.length > 0) {
    asMessage = asMessageDefault.concat(asMessage);
    console.error('[asErrorMessages]:asMessage=' + asMessage);
  }
  return asMessage;
};

module.exports.bExist = function (oValue) {
  return oValue && oValue !== null && oValue !== undefined && !!oValue;
};

module.exports.bExistNotSpace = function (oValue) {
  return bExist(oValue) && oValue.trim() !== "";
};


module.exports.getConfigOptions = function () {
  if (options)
    return options;

  var config = require('../../config/environment');
  var activiti = config.activiti;

  options = {
    protocol: activiti.protocol,
    hostname: activiti.hostname,
    port: activiti.port,
    path: activiti.path,
    username: activiti.username,
    password: activiti.password
  };

  return options;
};

module.exports.getRequestUrl = function (apiURL, sHost) {
  var options = this.getConfigOptions();
  return (sHost !== null && sHost !== undefined ? sHost : options.protocol + '://' + options.hostname + options.path) + apiURL;
};

module.exports.buildGET = function (apiURL, params, sHost, session) {
  var sURL = this.getRequestUrl(apiURL, sHost);
  var qs = params;

  if (params && !params.nID_Subject && session && session.subject) {
    qs = _.extend(params, {nID_Subject: session.subject.nID});
  }

  return {
    'url': sURL,
    'auth': this.getAuth(),
    'json': true,
    'qs': qs
  }
};

module.exports.buildRequest = function (req, apiURL, params, sHost) {
  //var nID_Subject = req.session.subject ? req.session.subject.nID : null;
  return this.buildGET(apiURL, params, sHost, req.session);//nID_Subject
};

module.exports.getAuth = function () {
  var options = this.getConfigOptions();
  return {
    'username': options.username,
    'password': options.password
  };
};

module.exports.getDefaultCallback = function (res) {
  return function (error, response, body) {
    if (error) {
      res.statusCode = 500;
      res.send(error);
    } else {
      res.statusCode = response.statusCode;
      res.send(body);
    }
  }
};

module.exports.sendGetRequest = function (req, res, apiURL, params, callback, sHost) {
  var _callback = callback ? callback : this.getDefaultCallback(res);
  var url = this.buildRequest(req, apiURL, params, sHost);
  return request(url, _callback);
};

module.exports.get = function (apiURL, params, callback, sHost, session) {
  var prepared = this.buildGET(apiURL, params, sHost, session);
  return request(prepared, callback);
};

module.exports.post = function (apiURL, params, body, callback, sHost, session) {
  var prepared = this.buildGET(apiURL, params, sHost, session);
  prepared = _.extend(prepared, {body: body});
  request.post(prepared, callback);
};

module.exports.upload = function (apiURL, params, fileName, content, callback, sHost, session) {
  var form = new FormData();
  form.append('file', content, {
    filename: fileName
  });

  var uploadRequest = this.buildGET(apiURL, params, sHost, session);
  _.extend(uploadRequest, { headers: form.getHeaders()});
  _.extend(uploadRequest.headers, {'Accept': 'application/json'});


  pipeFormDataToRequest(form, uploadRequest, function (result) {
    //TODO handle errors
    callback(null, result.reponse, result.data);
  });
};

function pipeFormDataToRequest(form, uploadRequest, callback) {
  var decoder = new StringDecoder('utf8');
  var result = {};
  form.pipe(request.post(uploadRequest))
    .on('response', function (response) {
      result.reponse = response;
    }).on('data', function (chunk) {
    if (result.data) {
      result.data += decoder.write(chunk);
    } else {
      result.data = decoder.write(chunk);
    }
  }).on('end', function () {
    callback(result);
  });
}


module.exports.sendPostRequest = function (req, res, apiURL, params, callback, sHost) {
  var apiReq = this.buildRequest(req, apiURL, params, sHost);
  return this.executePostRequest(apiReq, res, callback);
};

module.exports.executePostRequest = function (apiReq, res, callback) {
  var _callback = callback ? callback : this.getDefaultCallback(res);
  return request.post(apiReq, _callback);
};

module.exports.sendDeleteRequest = function (req, res, apiURL, params, callback, sHost) {
  var _callback = callback ? callback : this.getDefaultCallback(res);
  var url = this.buildRequest(req, apiURL, params, sHost);
  return request.del(url, _callback);
};

module.exports.getServerRegionHost = function (nID_Server, fCompleted) {
  this.getServerRegion(nID_Server, function (oServer) {
    console.log("[getServerRegionHost]oServer=" + oServer);
    var sHost = null;
    if (oServer && oServer !== null) {
      sHost = oServer.sURL;
    }
    console.log("[getServerRegionHost]sHost=" + sHost);
    //return sHost;
    if (fCompleted !== null) {
      fCompleted(sHost);
    }
  });
};

module.exports.getServerRegion = function (nID_Server, fCompleted) {
  var options = this.getConfigOptions();
  console.log("[getServerRegion]:nID_Server=" + nID_Server);
  var sResourcePath = '/subject/getServer?nID=' + nID_Server;
  console.log("[getServerRegion]:sResourcePath=" + sResourcePath);
  var sURL = options.protocol + '://' + options.hostname + options.path + sResourcePath;
  console.log("[getServerRegion]:sURL=" + sURL);
  var oServerCache = aServerCache.get(sResourcePath) || null;
  //var structureValue = getStructureServer(nID_Server);
  if (oServerCache && oServerCache !== null) {
    console.log("[getServerRegion]:oServerCache=" + oServerCache);
    //fCompleted
    if (fCompleted !== null) {
      fCompleted(oServerCache);
    }//return oServerCache;
  } else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return request.get({
      'url': sURL,
      'auth': {
        'username': options.username,
        'password': options.password
      }
    }, function (error, response, body) {
      console.log("[getServerRegion]:error=" + error + ",body=" + body + ",response=" + response);
      var oServer = JSON.parse(body);
      aServerCache.set(sResourcePath, oServer, 86400); //'api/places/server?nID='+nID_Server
      //console.log("body="+body);
      if (fCompleted !== null) {
        fCompleted(oServer);
      }//return oServerCache;
      //return JSON.parse(body);
    });
  }
};
