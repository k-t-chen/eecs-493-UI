const { createApp } = Vue

createApp({
  data() {
    return {
      artist1: './img/1.jpg',
      artist2: './img/2.jpg',
      onedrop:'active',
      twodrop:'inactive',
      threedrop:'inactive',
      btnAll:"btn btn-success",
      chooseAll:true,
      artistlList:[],
      allGenere:new Set(),
      chooseGenere:new Set(),
      mapGenere:new Map(),
      resultCount:0,

      
    }
  },
  methods: {
    async search() {
      this.artistlList = [];
      this.NameList = [];
      this.PriceList = [];    
      this.resultList = [];  
      this.resultCount = 0,
      tmp = []
      //res = await fetch(`https://itunes.apple.com/search?term=${this.inputtext}` )
      res = await fetch(`https://itunes.apple.com/search?term=${this.inputtext}&&origin=*` )
      var data = await res.json()
      console.log(data.results)

      if (data.resultCount == 0) {
        alert("No artist!!");
      }

      this.resultCount = data.resultCount

      for(let i = 0; i < this.resultCount; i++) {
        this.artistlList.push([data.results[i].artistName, data.results[i].collectionName, data.results[i].collectionPrice, data.results[i].kind, data.results[i].trackViewUrl,data.results[i].trackId, data.results[i].country, data.results[i].artworkUrl100,data.results[i].primaryGenreName])
      };
      //this.tmp = this.artistlList;
      this.tmp = JSON.parse(JSON.stringify(this.artistlList));

      for(let i = 0; i < this.resultCount; i++) {
        (this.allGenere).add(data.results[i].primaryGenreName);
        (this.chooseGenere).add(data.results[i].primaryGenreName);
      };
      console.log(this.allGenere)
      this.allGenere.forEach((item)=>{this.mapGenere.set(item+"chooseTheGenere","btn btn-light")});       

    },
    sortHandler(indexOfNumber){
      if(indexOfNumber == 0) {
        this.tmp = []
        this.tmp = JSON.parse(JSON.stringify(this.artistlList));
        console.log(this.tmp)
        this.onedrop = 'active';
        this.twodrop = 'inactive';
        this.threedrop = 'inactive';
      }
      
      else if (indexOfNumber == 1) {
        this.twodrop = 'active';
        this.onedrop = 'inactive';
        this.threedrop = 'inactive';
        (this.tmp).sort((a,b) => {
          if (a[1] < b[1]) {
            return -1;
          }
          if (a[1] > b[1]) {
            return 1;
          }
          return 0;
        })
      }
      else if (indexOfNumber == 2) {
        this.threedrop = 'active';
        this.onedrop = 'inactive';
        this.twodrop = 'inactive';
        (this.tmp).sort((a,b)=> {
          return (b[2] - a[2]);
        })
      }
    },

    filterHandler(tempWord){
      if(tempWord == "All") {
        if (this.btnAll == "btn btn-success"){
          this.btnAll = "btn light";
          this.resultCount = 0;
          this.chooseAll = false;
          this.chooseGenere.clear();


        } else{
          this.btnAll = "btn btn-success";
          this.chooseAll = true;
          this.allGenere.forEach((item)=>{(this.chooseGenere).add(item)});
          this.mapGenere.forEach((value,key) => {this.mapGenere.set(key, "btn btn-light")});
          this.mapGenere = new Map(this.mapGenere);
          this.resultCount = this.tmp.length;
        }
      } else{
        if(this.mapGenere.get(tempWord + 'chooseTheGenere') == "btn btn-light"){
          if(this.chooseAll) {
            this.chooseAll = false;
            this.chooseGenere.clear();
            this.resultCount = 0;
          }
          this.mapGenere = new Map(this.mapGenere.set(tempWord + 'chooseTheGenere', "btn btn-primary"));
          this.btnAll = "btn light";
          (this.chooseGenere).add(tempWord);
          this.resultCount += (this.tmp.filter(item => item[8] == tempWord)).length;
        } else{
          this.mapGenere = new Map(this.mapGenere.set(tempWord + 'chooseTheGenere', "btn btn-light"));
          (this.chooseGenere).delete(tempWord);
          this.resultCount -= (this.tmp.filter(item => item[8] == tempWord)).length;
        }
      }
    }
  }

}).mount('#app')
