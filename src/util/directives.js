import Vue from 'vue';

Vue.directive('dialogDrag', { 
  bind (el) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cursor = 'move';
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    dialogHeaderEl.onmousedown = (e) => {
      const disX = e.clientX ;
      const disY = e.clientY;
      let styL, styT;
      styL = +sty.left.replace(/\px/g, '');
      styT = +sty.top.replace(/\px/g, '');

      document.onmousemove = function (e) {
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});