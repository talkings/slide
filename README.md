# slide
超简单touch滑动组件
### Usage

```html
    <div id="viewport" class="viewport">
      <div class="pageview flex" style="background: #3b76c0">
          <h3>1</h3>
      </div>
      <div class="pageview flex" style="background: #58c03b;">
          <h3>2</h3>
      </div>
      <div class="pageview flex" style="background: #c03b25;">
          <h3>3</h3>
      </div>
      <div class="pageview flex" style="background: #e0a718;">
          <h3>4</h3>
      </div>
      <div class="pageview flex" style="background: #c03eac;">
          <h3>5</h3>
      </div>
    </div>
```

```js
    new slide({
      //绑定元素
      target : ".viewport",
      //总条数
      conut : 5,
      //回调函数
      callback : function(num){
        //返回页码
      }
    })
```
