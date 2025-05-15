import React, {CSSProperties, DOMElement, useEffect, useRef} from 'react';

function CanvasBg(props: {moving: boolean}) {
  const {moving} = props;
  const cvsRef = useRef(null);
  const style: CSSProperties = {
    // width: !moving ? '100%' : '100px',
    // height: !moving ? '100%' : '100px',
    position: 'absolute',
    top: 24,
    left: 20,
  };

  function paintDot() {
    if (!cvsRef.current) {
      return;
    }

    const cvs: HTMLCanvasElement = cvsRef.current;
    const ctx = cvs.getContext('2d')!;
    const devicePixelRatio = window.devicePixelRatio;
    console.log('🚀 ~ paintDot ~ devicePixelRatio:', devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const {width, height} = (cvs as HTMLCanvasElement).getBoundingClientRect();
    console.log(width, height);

    for (let x = 0;x<width;x+=10) {
      for(let y = 0;y<height;y+=10) {
        // 开始一条新路径
        ctx.beginPath();
        // 绘制一个中心在(x, y)，半径为2的实心圆
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        // 设置填充颜色为红色
        ctx.fillStyle = '#ccc';
        // 填充实心圆
        ctx.fill();
      }
    }
  }

  useEffect(() => {
    paintDot();
  }, [moving]);
  return <canvas ref={cvsRef} style={style} height={moving ? 100 : 870} width={moving ? 100 : 940}></canvas>;
}

export default CanvasBg;
