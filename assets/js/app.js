const $ = document.querySelector.bind(document) ;
const $$ = document.querySelectorAll.bind(document);

/*
HTML DOM Audio Object?search:)
1.render.
2.
*/
//select element .
const player = $('.player')
const progress = $('#progress')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-ramdom')
const btnRepeat = $('.btn-repeat')
const playList = $('.playlist')

const app = {

    isPlaying :false,
    isRandom : false,
    isRepeat : false , 
    currentIndex: 0,
    songs : [
            {
                name:"Chúng ta sau này",
                singer: "T R I",
                path:"./assets/sourceSongs/songs/chungtasaunay.mp3",
                image:"./assets/sourceSongs/img/singer.jpg"
            },
            {
                name:"Dù cho mai về sau",
                singer: "buitruonglinh",
                path:"./assets/sourceSongs/songs/duchomaivesau.mp3",
                image:"./assets/sourceSongs/img/image1.jpg"
            },
            {
                name:"Đường tôi chở em về",
                singer: "buitruonglinh",
                path:"./assets/sourceSongs/songs/duongtoichoemve.mp3",
                image:"./assets/sourceSongs/img/image2.jpg"
            },
            {
                name:"Lỡ Say Bye là Bye",
                singer: "Lemese,Changg",
                path:"./assets/sourceSongs/songs/losaybyelabye.mp3",
                image:"./assets/sourceSongs/img/image3.jpg"
            },
            {
                name:"Muộn rồi mà sao còn",
                singer: "Sơn tùng MTP",
                path:"./assets/sourceSongs/songs/muonroimasaocon.mp3",
                image:"./assets/sourceSongs/img/image4.png"
            },
            {
                name:"Phải chăng em đã yêu",
                singer: "Juky San, RedT",
                path:"./assets/sourceSongs/songs/phaichangemdayeu.mp3",
                image:"./assets/sourceSongs/img/image5.jpg"
            },
            {
                name:"Răng khôn",
                singer: "Phi Phương Anh",
                path:"./assets/sourceSongs/songs/rangkhon.mp3",
                image:"./assets/sourceSongs/img/image6.jpg"
            },
            {
                name:"Sài gòn đau lòng quá",
                singer: "Hứa kim Tuyền",
                path:"./assets/sourceSongs/songs/saigondaulongqua.mp3",
                image:"./assets/sourceSongs/img/image7.jpg"
            },
            {
                name:"Sài gòn hôm nay mưa",
                singer: "JSOL,Hoàng Duyên",
                path:"./assets/sourceSongs/songs/saigonhomnaymua.mp3",
                image:"./assets/sourceSongs/img/image8.jpg"
            },
            {
                name:"Trên tình bạn dưới tình yêu",
                singer: "MIN",
                path:"./assets/sourceSongs/songs/trentinhbanduoitinhyeu.mp3",
                image:"./assets/sourceSongs/img/image9.jpg"
            },
    ],
    render:function(){
        const htmls = this.songs.map((song,index )=>{
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb"
                    style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        });
        playList.innerHTML = htmls.join('');
    },
    defineProperties:function() {
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[app.currentIndex]
            }
        });
    },
    handleEvents:function(){
        const _this = this ; 

        // xử lý CD quay / dừng 
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000 ,// 10 seconds
            iterations : Infinity 
        })
        cdThumbAnimate.pause() ;
       //xử lý phóng to / thu nhỏ CD . 
        const cdWidth = cd.offsetWidth ;
        document.onscroll = function(){
            const scrolltop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrolltop ; 
            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px': 0; 
            cd.style.opacity = newCdWidth / cdWidth; 
        }
        // xử lý khi click play . 
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }     
        }
        // khi song được play 
        audio.onplay = function(){
            _this.isPlaying = true 
            player.classList.add('playing')
             cdThumbAnimate.play() ;
        }
        // khi song được pause 
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent 
            }
        }

        // xử lý khi tua song 
        progress.onchange = function(e){
            const seekTime = (audio.duration / 100) * e.target.value
            audio.currentTime = seekTime ; 
        }
        // khi onclick button next song . 
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
            audio.play()
            _this.render()
            // _this.scrollToActiveSong()
        }
        //khi onclick button prev song . 
        btnPrev.onclick = function(){
            if (_this.isRandom){
                _this.randomSong();
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            // _this.scrollToActiveSong()
        }

        // khi onclick btn random . 
        btnRandom.onclick = function(){
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle('active',_this.isRandom)     
        }

        // khi onclick btn repeat . 
        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active',_this.isRepeat)
        }

        // khi song.onend chuyển qua bài khác . 
        audio.onended = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else if(_this.isRepeat){
               _this.loadCurrentSong() ;
            }else{
                 _this.nextSong();
            }
            audio.play();
            _this.render()

        }

        // lắng nghe hành vi khi click vào playList . 
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //xử lý khi click vào song . 
                if(songNode){
                    _this.currentIndex = Number(songNode.getAttribute('data-index')) ;
                    _this.loadCurrentSong();
                    audio.play()
                    _this.render()
                }
                //xử lý khi click vào option . 
                if (e.target.closest('.option')){
                    /// ??? 
                }             
            }
        }
    },
    scrollToActiveSong:function(){
        //?????
    },
    // load current song . 
    loadCurrentSong:function(){       
        heading.innerText = this.currentSong.name 
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    // next song 
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0 
        }
        this.loadCurrentSong()
    },
    // prev song 
    prevSong: function(){    
        this.currentIndex--  
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length -1
        }
        
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex ; 
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)               
        }while(newIndex === this.currentIndex);
      this.currentIndex = newIndex ; 
      this.loadCurrentSong();
    },
    start: function(){
        //định nghĩa các thuộc tính cho Object . 
        this.defineProperties() ; 

        //Lắng nghe và xử lý các sự kiện (DOM Event)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI(User Interface) khi chạy ứng dụng . 
        this.loadCurrentSong();

        // Render playlist . 
        this.render();

    }
}

app.start() ; 
