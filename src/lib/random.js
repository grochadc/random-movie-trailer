module.exports = {

  //Generate a random number excluding the numbers on the given array
  exclude: function(min, max, arr, logging){
      if(logging==undefined) logging = false; //Defaults to false
      if(arr==undefined || arr.length <= 0) arr = [-1]; //Arr must have something, -1 is used because it doesn't appear in a 'normal' array
      if(arr.toString()=='true' || arr.toString()=='false'){ //If array is omitted and instead a Boolean
        logging = arr; //set logging
        arr = [-1]; //and instead set arr to something so the function has something to work with
      }
      if (typeof(arr) != 'object') throw new TypeError('Error: arg3 is not an array'); //Log an error if arr is anything other than an Object

      var num = Math.floor(Math.random() * (max - min + 1)) + min;

      if(arr){
        var exclude = arr.every(function(val){ return arr.indexOf(num) >= 0; });
        if(exclude){
          if(logging) console.log('Random num ',num,'is in array, do over');
          return this.exclude(min, max, arr, logging);
        }
        else{
          if(logging) console.log('Random num ',num,'is not in array');
          return num;
        }
      }
  }
};
