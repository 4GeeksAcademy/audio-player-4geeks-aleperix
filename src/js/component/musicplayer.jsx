import React, {useState, useEffect, useRef} from "react";

//create your first component
const MusicPlayer = () => {
    const [sounds,setSounds] = useState([]) //Estado donde se guardarán las canciones de la API en formato JSON
    const [currentSong,setCurrentSong] = useState([]) //Estado donde se guardará la canción actual
    const [soundStatus,setSoundStatus] = useState("play") //Estado que guardará el ícono de Play/Pause que se muestra en el momento
    const [isActiveLi,setIsActiveLi] = useState(-1) //Estado que guardará que item de la lista es el seleccionado
    const [volumeValue,setVolumeValue] = useState("50") //Estado que guardará el valor del volumen del reproductor

    const myAudio = useRef("");

    let soundsURL = "https://playground.4geeks.com" //Pasamos la URL de la API

    /*Función que llama a  una API Rest para obtener las canciones 
      y las establece en el estado "sounds"*/
    function getSounds() {
        fetch(soundsURL+'/sound/songs') //Llamamos al método fetch para obtener datos de la API
            .then((response) => {
                console.log(response.status);
                return response.json()
            }) //promesa 1
            .then((data) => {
                console.log(data)
                setSounds(data.songs);
            }) //Establecemos los datos en nuestro estado
            .catch((err) => console.log(err))
        myAudio.current.volume = "0.50"
    }

    /*Función que cambia la canción actual dependiendo de la URL que se le pase
      por parámetro, además se toma también como parámetro la posición para
      marcar la canción actual y el nombre para mostrar que canción se está reproduciendo*/
    function toggleAudio(position, audioURL, audioName) {
            setSoundStatus("pause")
            setIsActiveLi(position)
            setCurrentSong([position, audioName])
            myAudio.current.src = audioURL
            myAudio.current.play()
    }

    /*Función que cambia hacia la canción anterior tomando como valor  el índice
      de la canción actual y restándole -1*/
    function previousSong() {
        if (currentSong[0] === 0) {
            toggleAudio(sounds.length-1, soundsURL+sounds[sounds.length-1].url, sounds[sounds.length-1].name)
            document.getElementsByClassName('list-group-item')[sounds.length-1].scrollIntoView()
        }else{
            toggleAudio(currentSong[0]-1, soundsURL+sounds[currentSong[0]-1].url, sounds[currentSong[0]-1].name)
            document.getElementsByClassName('list-group-item')[currentSong[0]-1].scrollIntoView()
        }
    }

    /*Función que cambia hacia la canción siguiente tomando como valor el índice
      de la canción actual y sumándole +1, además, si detecta que la canción
      actual es la última, vuelve hacia la primer canción de la lista*/
    function nextSong() {
        if (currentSong[0] === sounds.length-1) {
            toggleAudio(0, soundsURL+sounds[0].url, sounds[0].name)
            document.getElementsByClassName('list-group-item')[0].scrollIntoView()
        }else{
            toggleAudio(currentSong[0]+1, soundsURL+sounds[currentSong[0]+1].url, sounds[currentSong[0]+1].name)
            document.getElementsByClassName('list-group-item')[currentSong[0]+1].scrollIntoView()
        }
    }

    /*Función que toma el valor como parámetro del estado del botón de Play/Pause
      y dependiendo de ellos reproduce o pausa la canción actual y además vuelve
      a cambiar el estado del botón*/
    function playPauseSong(opt) {
        if (opt === "pause"){
            setSoundStatus("play")
            myAudio.current.pause()
        }else if(opt === "play"){
            setSoundStatus("pause")
            myAudio.current.play()
        } 
    }
    
    const volumeChange = e => {
        setVolumeValue(e.target.value)
        if (e.target.value == 100) {
            myAudio.current.volume = 1
        }else{
            myAudio.current.volume = "0."+e.target.value
        }
    }

    /*Utilizamos el hook useEffect para generar un evento onLoad y llamamos a la función
      de la API*/
    useEffect(()=>{
        getSounds()
    },[])

	return (
		<div>
            <ul className="list-group rounded-0">
                {/*Iteramos el Array de canciones y creamos un elemento <li> para cada una de ellas
                   pasándole datos como lo son el índice, la URL de la canción y el nombre*/}
                {sounds.map((item, index)=>
                    <li key={index} onClick={() => toggleAudio(index, soundsURL+item.url, item.name)} role="button" className={+isActiveLi === index ? "list-group-item bg-custom-dark active" : "list-group-item bg-custom-dark"}><span className="text-secondary d-inline-block text-center" style={{width: "30px"}}>{index + 1}</span><span className="text-white mx-4">{item.name}</span></li>
                )}
            </ul>
            <div className="bg-dark position-sticky bottom-0 py-2 d-flex justify-content-between align-items-center">
                <div className="d-flex mx-4">
                    {/*Creamos los botones para controlar el estado de las canciones, como lo son Play/Pause, 
                       Previous y Next, además le agregamos un evento click llamando a cada función*/}
                    <button type="button" className="btn btn-light mx-1" onClick={() => previousSong()}><i className="fas fa-step-backward"></i></button>
                    <button type="button" onClick={() => playPauseSong(soundStatus)} className="btn btn-light mx-1"><i className={soundStatus === "pause" ? "fas fa-play" : "fas fa-pause"}></i></button>
                    <button type="button" className="btn btn-light mx-1" onClick={() => nextSong()}><i className="fas fa-step-forward"></i></button>
                </div>
                {/*Slider con el cual se cambiará el volumen del reproductor*/}
                <div className="playervolume w-25 text-center">
                    <label htmlFor="playervolumerange" className="form-label text-white">Volumen: {volumeValue}%</label>
                    <input type="range" className="form-range" min="0" max="100" step="10" onChange={volumeChange} id="playervolumerange"></input>
                </div>
                <span className="text-white mx-4">Reproduciendo: {currentSong[1]}</span>
            </div>
            {/*Elemento donde se reproducirán las canciones*/}
            <audio ref={myAudio} src="" onEnded={() => nextSong()} type="audio" hidden></audio>
		</div>
	);
};

export default MusicPlayer;
