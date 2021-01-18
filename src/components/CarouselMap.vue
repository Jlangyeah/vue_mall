<template>
  <div id="topBanner" style="padding-top: 5px;" class="slide">
    <div v-for="(imgUrl, index) in bannerList" v-show="index===mark" :key="index" class="slideshow">
      <a href="#">
        <img :src=imgUrl style="width:100%;height:100%;">
      </a>
    </div>
    <div class="bar">
      <span v-for="(item, index) in bannerList" :class="{ 'active':index===mark }" :key="index"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mark: 0, //比对图片索引的变量
      bannerList: [
        // "http://localhost:9000/src/assets/img/home/fourFamousWorks.jpg",
        "http://localhost:9000/img/1.png",
        "http://localhost:9000/img/2.png",
        "http://localhost:9000/img/3.png",
      ],
    };
  },
  methods: {
    autoPlay() {
      this.mark++;
      if (this.mark === 3) {
        //当遍历到最后一张图片置零
        this.mark = 0;
      }
    },
    play() {
      setInterval(this.autoPlay, 2500);
    },
    change(i) {
      this.mark = i;
    },
  },
  created() {
    this.play();
  },
};
</script> 


<style scoped>
.slide {
  width: 950px;
  /* height: 650px; */
  margin: 0 auto;
  margin-top: 50px;
  overflow: hidden;
  position: relative;
}
.slideshow {
  width: 950px;
  /* height: 650px; */
}
li {
  position: absolute;
}
img {
  width: 95px;
  height: 150px;
}
.bar {
  position: absolute;
  width: 100%;
  bottom: 10px;
  margin-top: 20px;
  margin: 0 auto;
  z-index: 10;
  text-align: center;
}
.bar span {
  width: 20px;
  height: 5px;
  border: 1px solid;
  background: white;
  display: inline-block;
  margin-right: 10px;
}
.active {
  background: #bfd6b6 !important;
}
</style>  