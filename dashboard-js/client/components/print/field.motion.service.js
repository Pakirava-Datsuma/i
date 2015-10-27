angular.module('dashboardJsApp').service('FieldMotionService', ['MarkersFactory', FieldMotionService]);

function FieldMotionService(MarkersFactory) {

  this.FieldMentioned = {
    'in': function(fieldId, prefix) {
      return grepByPrefix(prefix).some(function(entry) {
        return _.contains(entry.aField_ID, fieldId);
      });
    }
  };

  this.getElementIds = function() {
    return grepByPrefix('ShowElementsOnTrue_')
      .map(function(e) { return e.aElement_ID; })
      .reduce(function(p, c) { return p.concat(c); },  []);
  };

  this.isElementVisible = function(elementId, formData) {
    var mentioned = {val:false};
    var bval = grepByPrefix('ShowElementsOnTrue_').some(function(entry) {
      return evalCondition(entry, elementId, formData, mentioned);
    });
    return mentioned.val ? bval : true;
  };

  this.getSplittingRules = function() {
    return grepByPrefix('SplitTextHalf_').reduce(function(p, c) {
        p[c.sID_Field] = {splitter: c.sSpliter, el_id1: c.sID_Element_sValue1, el_id2: c.sID_Element_sValue2};
        return p;
      }, {});
  };

  function evalCondition(entry, fieldId, formData, mentioned) {
    if (!_.contains(entry.aField_ID || entry.aElement_ID, fieldId)) return false;
    else mentioned.val = true;
    console.log("contains");
    var toEval = entry.sCondition.replace(/\[(\w+)]/g, function(str, alias) {
      var fId = entry.asID_Field[alias];
      if (!fId) console.log('Cant resolve original fieldId by alias:' + alias);
      var result = '';
      if (formData[fId] && formData[fId].value)
        result = formData[fId].value.replace(/'/g, "\\'");
      switch(alias.charAt(0)) {
        case 's': result = "'" + result + "'"; break;
        case 'n': result = result ? parseFloat(result) : 0; break;
        default: console.log('invalid alias format, alias:' + alias);
      }
      return result;
    });
    console.log('toEval', toEval);
    try {
      return eval(toEval);
    } catch (e) {
      console.log('OnCondition expression error\n' + e.name + '\n' + e.message
        + '\nexpression:' + entry.sCondition
        + '\nresolved expression:' + toEval);
      throw e;
    }
  }

  function grepByPrefix(prefix) {
    return MarkersFactory.grepByPrefix('motion', prefix);
  }
}
