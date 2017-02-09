/**
 * touch左右滑动控件
 * @param { object } document
 * @param { object } window
 * @return { function } function
 */
!function(t, e) {
	"function" == typeof define ? define(function(require, exports, module) {
		module.exports = e(t);
	}) : ((function(){
			window.slide = e(t);
	})())
}(this, function(t){
		
		function slide(obj){
			this.o = {
				target : null,
				//当前页码
				current : 1,
				//总页数
				conut : 2,
				//X轴坐标
				x : 0,
				//Y轴坐标
				y : 0,
				//设备宽度
				w : 0,
				//相对偏移值
				relativeOffset : 0,
				//偏移值 
				offset : 0,
				//方向
				direction : 0, // {1 : 左, 2 : 右},
				//点击时间戳
				tapTime : 0,
				callback : function(current){}
			};
			//合并配置
			this.o = Object.assign(this.o, obj);
			//初始化
			this.init();
		};
		slide.prototype = {
			
			init : function(){
				this.events();
			},
			/**
			 * 函数防抖
			 * @param {Object} fn
			 * @param {Number} time
			 */
			reduceStream : function(fn, time){
				var timer = null;
				return function(){
					var self = this;
					var params = arguments;
					if(!timer){
						timer = setTimeout(function(){
							fn && fn.apply(self, params);	
							timer = null;
						}, time);
					}
					
				}
			},
			/**
			 * 跟踪方向
			 * @param {Number} clientX 实时x点坐标 {1 : left, 2: right, 3: up, 4: down}
			 */
			slideDirection : function(x1, x2, y1, y2) {
		    	return Math.abs(x1 - x2) >=
		      	Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 1 : 2) : (y1 - y2 > 0 ? 3 : 4)
		    },
		    //判断边界超出
		    isBorder : function(){
		    	if((this.o.direction === 2 && !this.o.offset) || (this.o.direction === 1 && this.o.offset === (-((this.o.conut - 1) * this.o.w)))){
					return false
				}else{
					return true
				}
		    },
			events : function(){
				if(!this.o.target) { console.warn("Lack of DOM"); return };
				var $target = document.querySelector(this.o.target);
				
				$target.addEventListener("touchstart", function(event){
					
					var touches = event.touches[0];
					this.o.w = document.body.clientWidth;
					this.o.x = touches.clientX;
					this.o.y = touches.clientY;
					this.o.tapTime = Date.now();

				}.bind(this), false);
				
				function move(event){
					var conutOffset = -(this.o.conut * this.o.w);
					var touches = event.touches[0];
					this.o.direction = this.slideDirection(this.o.x, touches.clientX, this.o.y, touches.clientY);
					if(this.o.direction === 1 || this.o.direction === 2){
						if(!this.isBorder()){
							return false
						}
						//计算偏移值
						this.o.relativeOffset = touches.clientX - this.o.x;
						var s = this.o.relativeOffset + this.o.offset 
						//console.log(s);
						$target.style.webkitTransform ='translate3d('+ s +'px,0,0)';
					}

				}
				
				
				$target.addEventListener("touchmove", this.reduceStream(move, 0).bind(this), false);
				
				$target.addEventListener("touchend", function(event){
					
					var touches = event.touches[0];
					if(!this.isBorder()){
						return false
					}
					//跟踪松开坐标
					//小于300毫秒直接过渡下一页
					if(Date.now() - this.o.tapTime < 300){
						if(this.o.direction === 1){
							this.o.current+=1
						}
						if(this.o.direction === 2){
							this.o.current-=1
						};
					}else{
						if((this.o.w/2) < Math.abs(this.o.relativeOffset)){
							if(this.o.direction === 1){
								this.o.current+=1
							}
							if(this.o.direction === 2){
								this.o.current-=1
							};
						}
					}
					//即将切换长度
					var w = -((this.o.current - 1) * this.o.w);
					$target.style.webkitTransform ='translate3d('+ w +'px,0,0)';
					$target.style.webkitTransition = ".3s ease -webkit-transform";
					this.o.offset = w;
					this.o.callback(this.o.current);
					
					
				}.bind(this), false);
				
			},
			/**
			 * 清空内存
			 */
			destroy : function(){
				
			}
		};
		
		return slide;
	});


