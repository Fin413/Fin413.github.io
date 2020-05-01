var header = document.getElementsByClassName('header')[0];
var CogOne = document.getElementsByClassName("cog")[0];
var CogTwo = document.getElementsByClassName("cog")[1];
var run = 0;
		
		
		
header.addEventListener('mouseenter', function(){
	if(run > 0){
    	reset_animation();
    	CogTwo.style.animationDirection = "reverse";
    	timer();
    	run = 0;
    }
 });
 
 
function timer(){
 	setTimeout(function () {
            run = 1;
    }, 2000);
}
   
        
function reset_animation() {
  	CogOne.style.animation = 'none';
  	CogTwo.style.animation = 'none';
  	CogOne.offsetHeight;
  	CogTwo.offsetHeight;
  	CogOne.style.animation = null; 
  	CogTwo.style.animation = null;
}

