module.exports = function(obj){
    const typeOfObj = Object.prototype.toString.call(obj);
    if(typeOfObj == '[object Array]') {
      return true;
    }
    else if(typeOfObj == '[object Object]') return false;
};
