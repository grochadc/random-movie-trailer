/*! random-movie-trailer 2017-10-15 */

module.exports={exclude:function(o,r,n,e){if(void 0==e&&(e=!1),(void 0==n||n.length<=0)&&(n=[-1]),"true"!=n.toString()&&"false"!=n.toString()||(e=n,n=[-1]),"object"!=typeof n)throw new TypeError("Error: arg3 is not an array. It's a "+typeof n);var t=Math.floor(Math.random()*(r-o+1))+o;if(n)return n.every(function(o){return n.indexOf(t)>=0})?(e&&console.log("Random num ",t,"is in array, do over"),this.exclude(o,r,n,e)):(e&&console.log("Random num ",t,"is not in array"),t)}};
