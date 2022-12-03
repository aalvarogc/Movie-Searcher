window.onload = ()=>{
    lightbox = document.getElementsByClassName("lightbox")[0];
    containerPelis = document.getElementById("pelis");
    document.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            lanzaPrimeraPeticionPeliculas();
            pagina = 1;
        }
    });

    document.getElementById("close").addEventListener("click", ()=>{
        document.getElementsByClassName("lightbox")[0].classList.toggle("showLight");
    })
}

window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 400) {
        lanzaPeticionPeliculas();
    }
});


var pagina = 1;

var httpRequest = new XMLHttpRequest();

function lanzaPrimeraPeticionPeliculas(){
    httpRequest.open("GET", "http://www.omdbapi.com/?apikey=b8d85a5&page="+pagina+"&s="+document.getElementById("artistName").value);
    httpRequest.onreadystatechange = tratarPrimerasPeliculas;
    httpRequest.send();
    pagina++;
}

function tratarPrimerasPeliculas(){
    if(httpRequest.readyState === XMLHttpRequest.DONE){
        if(httpRequest.status === 200){
            console.log(httpRequest.responseText)
            containerPelis.innerHTML = "";
            datos = JSON.parse(httpRequest.responseText);
            if(datos.Response != "False"){
                document.getElementById("container").style.display = "flex";
                datos.Search.forEach(peli => {
                    film = document.createElement("figure");
                    film.className = "film"

                    filmImg = document.createElement("img");
                    filmImg.src = peli.Poster;

                    filmName = document.createElement("figcaption");
                    filmName.innerHTML = peli.Title;
                    
                    film.appendChild(filmImg);
                    film.appendChild(filmName);
    
                    containerPelis.appendChild(film);

                    film.addEventListener("click", ()=>{
                        lanzaPeticionInformacionPelicula(peli);
                    })
                });
            }else{
                document.getElementById("container").style.display = "flex";
                containerPelis.innerHTML = "";
                let wrongText = document.createElement("span");
                wrongText.id = "wrongText";
                wrongText.innerHTML = "No se ha encontrado ninguna película.";
                containerPelis.appendChild(wrongText);
            }
            
        }
    }
}

function lanzaPeticionPeliculas(){
    httpRequest.open("GET", "http://www.omdbapi.com/?apikey=b8d85a5&page="+pagina+"&s="+document.getElementById("artistName").value);
    httpRequest.onreadystatechange = tratarPeliculas;
    httpRequest.send();
    pagina++;
}

function tratarPeliculas(){
    if(httpRequest.readyState === XMLHttpRequest.DONE){
        if(httpRequest.status === 200){
            console.log(httpRequest.responseText)
            datos = JSON.parse(httpRequest.responseText);
            if(datos.Response != "False"){
                document.getElementById("container").style.display = "flex";
                datos.Search.forEach(peli => {
                    film = document.createElement("figure");
                    film.className = "film"

                    filmImg = document.createElement("img");
                    if(peli.Poster == "N/A"){
                        filmImg.src = "image-not-found.png";
                    }else{
                        filmImg.src = peli.Poster;
                    }

                    filmName = document.createElement("figcaption");
                    filmName.innerHTML = peli.Title;

                    film.addEventListener("click", ()=>{
                        lanzaPeticionInformacionPelicula(peli);
                    })
                    
                    film.appendChild(filmImg);
                    film.appendChild(filmName);
    
                    containerPelis.appendChild(film);
                });
            }
        }
    }
}

function lanzaPeticionInformacionPelicula(e){
    httpRequest.open("GET", "http://www.omdbapi.com/?apikey=b8d85a5&i="+e.imdbID);
    httpRequest.onreadystatechange = tratarInformacionPelicula;
    httpRequest.send();
    pagina++;
}

function tratarInformacionPelicula(){
    if(httpRequest.readyState === XMLHttpRequest.DONE){
        if(httpRequest.status === 200){
            datos = JSON.parse(httpRequest.responseText);
            if(datos.Response != "False"){
                lightbox.classList.toggle("showLight");
                document.getElementById("filmImage").src = datos.Poster;
                document.getElementById("release").innerHTML = "Released: " + datos.Released;
                document.getElementById("genre").innerHTML = "Genre: " + datos.Genre;
                document.getElementById("rating").innerHTML = "Rating: " + datos.imdbRating+"/10";
                document.getElementById("director").innerHTML = "Director: " + datos.Director;
                document.getElementById("actors").innerHTML = "Actors: " + datos.Actors;
                document.getElementById("plot").innerHTML = datos.Plot;
            }else{
                document.getElementById("container").style.display = "flex";
                containerPelis.innerHTML = "";
                let wrongText = document.createElement("span");
                wrongText.id = "wrongText";
                wrongText.innerHTML = "No se ha encontrado ninguna película.";
                containerPelis.appendChild(wrongText);
            }
            
        }
    }
}