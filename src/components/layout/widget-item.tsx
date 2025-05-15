import {DRAG_TYPES} from '@/const/drag';
import React, {useRef, useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';

function WidgetItem({
  id,
  index,
  widget,
  moveCard,
}: {
  id: string;
  index: number;
  widget: any;
  moveCard: Function;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    //一个字符串或一个Symbol,这个放置目标只会对指定类型的拖拽源产生的项目做出反应
    accept: DRAG_TYPES.WIDGET,
    //收集功能。 它应该返回一个普通的属性对象，以返回以注入到您的组件属性中
    collect: (monitor) => ({}),
    //当在组件发生hover事件时调用
    hover(item, monitor) {
      // if (!ref.current) {
      //   return;
      // }
      // //被拖动卡片的索引
      // const dragIndex = item.index;
      // // console.log("🚀 ~ hover ~ dragIndex:", dragIndex)
      // //hover卡片的索引
      // const hoverIndex = index;
      // //如果一样什么都不做
      // if (dragIndex === hoverIndex) {
      //   return;
      // }
      // //获取hover卡片的位置信息
      // const {top, bottom} = ref.current.getBoundingClientRect();
      // //获取hover卡片高度的一半
      // const halfOfHoverHeight = (bottom - top) / 2;
      // //获取鼠标最新的X和Y坐标
      // const {y} = monitor.getClientOffset();
      // const hoverClientY = y - top;
      // // 碰撞检测
      // if (
      //   (dragIndex < hoverIndex && hoverClientY > halfOfHoverHeight) ||
      //   (dragIndex > hoverIndex && hoverClientY < halfOfHoverHeight)
      // ) {
      //   moveCard(dragIndex, hoverIndex);
      //   item.index = hoverIndex;
      // }
    },
  });
  //useDrag hook 提供了一种将组件作为拖动源连接到 DnD 系统的方法
  //Collected Props: 包含从 collect 函数收集的属性的对象。 如果没有定义 collect 函数，则返回一个空对象
  //DragSource Ref: 拖动源的连接器功能。 这必须附加到 DOM 的可拖动部分
  const [{isDragging}, drag] = useDrag({
    //spec
    //必需的。 这必须是字符串或Symbol。 只有为相同类型注册的放置目标才会对此项目做出反应
    type: DRAG_TYPES.WIDGET,
    //item: 必需的 (对象或者函数) 当这是一个对象时，它是一个描述被拖动数据的普通 JavaScript 对象
    item: () => ({id, index}),
    //collect:  收集功能。 它应该返回一个普通的属性对象，以返回以注入到您的组件属性中
    //它接收两个参数，monitor 和 props
    collect: (monitor) => ({
      //要收集的属性
      isDragging: monitor.isDragging(),
    }),
  });
  drag(ref);
  drop(ref);
  return (
    <div
      ref={ref}
      key={widget.id}
      className='flex flex-col items-center justify-center p-2 border rounded-md cursor-move hover:bg-muted/50 transition-colors'
      draggable
    >
      {widget.icon}
      <span className='text-xs mt-1'>{widget.name}</span>
    </div>
  );
}

export default WidgetItem;
