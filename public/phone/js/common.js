// 初始化滚动scroll
mui('.mui-scroll-wrapper').scroll({
  indicators: false, //不显示滚动条
});

// 初始化轮播图，自动播放
//获得slider插件对象
mui('.mui-slider').slider({
  interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});