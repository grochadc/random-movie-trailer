module.exports = {

  //Generate a random number excluding the numbers on the given array
  exclude: function(min, max, arr, logging){
      if(logging==undefined) logging = false;

      var num = Math.floor(Math.random() * (max - min + 1)) + min;

      if(arr){
        var exclude = arr.every(function(val){ return arr.indexOf(num) >= 0 });
        if(exclude){
          if(logging) console.log('Random num is in array, do over');
          this.exclude(min, max, arr);
        }
        else{
          if(logging) console.log('Random num is not in array ',num);
          return num;
        }
      }
      else if(arr == undefined){
        return num;
      }
  }
}
