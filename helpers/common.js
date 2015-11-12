module.exports = {

  //-- check if value is NOT empty
  isNotEmpty: function (val) {
    if (val != '' && val != null && typeof(val) != 'undefined') {
      return true;
    }
    return false;
  },
  //-- check if value is empty
  isEmpty: function (val) {
    return !isNotEmpty(val);
  },
  //-- check if value is NOT empty or not 'all'
  isNotEmptyOrAll: function (val) {
    if (val != '' && val != null && typeof(val) != 'undefined' && val != 'all') {
      return true;
    }
    return false;
  }
};
