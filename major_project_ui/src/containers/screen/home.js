import React from "react";
import M from 'materialize-css';
import options from 'materialize-css';
import '../../App.css';
import mp from './mp.png';

const Home=()=>{
    return(
        <><div><img src={mp} />
       
       </div></>
       
     
            
    )
}


document.addEventListener('DOMContentLoaded', function() {
      
      
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, options);
  });
export default Home


 {/* <div class="carousel" >
           <a class="carousel-item" href="#one!"><img id="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHg8Jm8XikGoTgKFhjgGjxoImaBVbBdvLtjw&usqp=CAU" /></a>
             <a class="carousel-item" href="#two!"><img id="image" src="https://lorempixel.com/250/250/nature/2"  /></a>
             <a class="carousel-item" href="#three!"><img id="image" src="https://lorempixel.com/250/250/nature/3" /></a>
             <a class="carousel-item" href="#four!"><img id="image" src="https://lorempixel.com/250/250/nature/4"  /></a>
             <a class="carousel-item" href="#five!"><img id="image" src="https://lorempixel.com/250/250/nature/5"  /></a>
         </div></> */}

    {/* //     <div class="carousel carousel-slider">
    //     <a class="carousel-item" href="#one!"><img src="https://lorempixel.com/800/400/food/1" /></a>
    //     <a class="carousel-item" href="#two!"><img src="https://lorempixel.com/800/400/food/2" /></a>
    //     <a class="carousel-item" href="#three!"><img src="https://lorempixel.com/800/400/food/3" /></a>
    //     <a class="carousel-item" href="#four!"><img src="https://lorempixel.com/800/400/food/4" /></a>
    //   </div> */}