  import {memo, useState, useEffect, useRef, useMemo} from 'react';
  const {class_maker} = require('../../tools/class_maker');
  require("./VirtualScroll.scss");

  const useScrollAware = () => {
    // custom hook
    const [scrollTop, setScrollTop] = useState(0);
    const ref = useRef();
    const last_fixed_top = useRef(0);
    const last_top = useRef(0);

    const onScroll = e =>
      requestAnimationFrame(() => {
        let num = e.target.scrollTop;
        let fixed = num.toFixed();
        let offset = 10;
        let last = last_top.current;
        let last_fixed = Number(last_fixed_top.current);
        let adding_to = (fixed > last) ? "bottom" : "top";

        last_top.current = fixed;
        // console.warn(`[onScroll] adding_to ${adding_to}`)
        if(/*fixed > last + offset*/ adding_to == "bottom" || fixed < last_fixed - offset){
          // console.warn(`[onScroll] scrollTop = ${last}`)
          // console.warn(`[onScroll] lf + o ${last_fixed + offset} < f ${fixed} > lf - o  ${last_fixed - offset} \n lf = last_fixed o = offset and f = fixed`);
          last_fixed_top.current = fixed;
          setScrollTop(fixed);
        }
        // scroll top tells how far the scrollable content container is
        // from the top of the scrolling viewport so when items 0 and 1 are out of sight scrollTop is 60
      });

    useEffect(() => {
      const scrollContainer = ref.current;

      setScrollTop(scrollContainer.scrollTop);
      scrollContainer.addEventListener("scroll", onScroll);

      // cleanup fn
      return () => scrollContainer.removeEventListener("scroll", onScroll);
    }, []);

    return [scrollTop, ref];
  };

  // VirtualScroll component
  const VirtualScroll = React.memo(({
  // const VirtualScroll = ({
    name,
    prefix = "",
    iUN = Math.round(Math.random() * 10000),
    Item,/*this is the mapping template for the list items*/
    itemCount,
    height,/*scrollcontainer height - this height comes out to 300,000px 30 * 10,000*/
    childHeight,/*item height*/
    renderAhead = 3,/*i believe i have seen this labeled as padding - this will render 20 items above * below*/
    padding = 0,
    hide_scroll = false,
    observer,
    loading = false,
    has_more = false,
    position = 0,
    save_position,
    stats = true
  }) => {

    const [scrollTop, ref] = useScrollAware();// preps scroll height and sends a ref to use in scroll event listener

    if(typeof save_position == "function"){
      save_position(scrollTop);
    }//if

    const hideScroll = (hide_scroll) ? "hide-scroll" : "";
    const last_request_section = useRef(0);

    // i get this - how to set the content containers
    const totalHeight = (itemCount * childHeight) + padding;// can i give it padding?
    const viewport_height = Math.min(height, totalHeight)//(totalHeight < height) ? totalHeight : height;


    // idk what the significance of scrollTop - top of what? - scrollTop is how far the top of the internal
    // scroll element is from the scroll viewport
    // Math.floor keeps the decimal places out of the calculation
    let startNode = Math.floor(scrollTop / childHeight) - renderAhead;
    // console.warn("[startNode] calc 1",startNode);

    let topNode = startNode;//Math.floor(scrollTop / childHeight);
    // console.warn("[topNode] calc ",topNode);

    // this math max keeps the first 20 set as a zero (instead of negative nbrs) startNode because there isn't more to put overhead
    // than the 20 initial items. once the 20 gets overhead the count starts to move.
    startNode = Math.max(0, startNode);
    // console.log("[startNode] calc 2",startNode);

    let visibleNodeCount = Math.ceil(viewport_height / childHeight) + 2 * renderAhead;/* 300 / 30 = 10 + 2*20 = 50 */
    // console.log("[visible node count] calc 1",visibleNodeCount);

    // this will return the lowest number passed to it. which effectly means that it will stop when the nbr
    // reaches a certain limit (by the calculation countdown that is happening)
    // what happens when the calculation countdown goes under the set nbr?
    // eventually the visible node count will fall below the staic number, coupled with the start node
    // it will force no more nodes to be created

    // if itemCount is less than the startNode maybe the data has started over. go with the numbers we have. (do we reset the scrollTop?)
    visibleNodeCount = (itemCount < startNode) ? itemCount : Math.min(itemCount - startNode, visibleNodeCount);
    if(itemCount < startNode){
      // protects agains restarting without the proper restarting processes
      startNode = 0;
    }

    // console.log(`[itemCount ${itemCount} - startNode ${startNode}]`,itemCount - startNode);

    // console.log("[visible node count] calc 2",visibleNodeCount);

    const offsetY = startNode * childHeight;

    // console.warn(`[offsetY] ${startNode} * ${childHeight}`,offsetY);

    useEffect(() => {
      // stats no longer needed, im no longer using this to trigger restocking
      if(!stats) return;
      // console.warn("[viewport] in viewport",viewport_height / childHeight);
      // console.warn("[hidden count]",2 * renderAhead);
      let vh_str =  [`[visible node count] \n \n viewport_height (${viewport_height}) / `,
        `childHeight (${childHeight})) + 2 * renderAhead (${renderAhead}) = `,
        `${Math.ceil(viewport_height / childHeight) + 2 * renderAhead} \n or \n `,
        `itemCount (${itemCount}) - startNode (${startNode}) = ${itemCount - startNode} \n`,
        `\n actual visible node count = ${visibleNodeCount} (the min #)\n `,
        `(# needs to be below first render #) \n`].join("");
      // console.warn(vh_str);
      // console.warn("[first render]",itemCount - renderAhead);
      // console.warn("[vScroll] viewport ref = ",ref.current);
      // i want to set this to a scroll position
      // get the scroll top
      ref.current.scrollTo(0,position);// this works (otherwise i would use an init boolean in its own useEffect)
    },[])


    // why use memo here? - oh yeah, this will only change when the properties in the array below change
    // item changes when its index changes. its index property changes if its index is changed its alright
    // for it to be changed here - i think it will be disgarded i don't think it is reused and sent to top/bottom
    const visibleChildren = React.useMemo(
      () =>
        new Array(visibleNodeCount)
          .fill(null)
          .map((_, index) => {
            // do something
            let tru_ndx = index + startNode;
            // // console.warn("[map] index",index);
            // // console.warn("[map] tru index",tru_ndx);

            // if(restock && tru_ndx > itemCount - renderAhead && tru_ndx > last_request_section.current){
            //   // run this request once per section
            //   last_request_section.current = itemCount;
            //   // console.warn(`[rendered at] itemCount ${itemCount} - renderAhead ${renderAhead}`, itemCount - renderAhead);
            //   // console.warn("running mock request callout");
            //   // console.warn("[visibleChildren] itemCount",itemCount);
            //   restock();
            // }
            return(
              <Item key={tru_ndx} index={tru_ndx} />
            );
        }),
      [startNode, visibleNodeCount, Item]
    );
    // keep researching the behind the scenes to the magic or dom-recycling 'supposedly' being used here
    // (my assumption, maybe it isn't)

    // // console.warn("[vS] rerendering...");
    // how does it know to move the item to the bottom?
    return (
      <div className={`${class_maker({prefix,name,main:"viewport",iUN})} VirtualScroll ${hideScroll}`}
        style={{ height, overflow: "auto" }}
        ref={ref}>
        <div
          className={class_maker({prefix,name,main:"visible_area",iUN})/*the former viewport*/}
          style={{
            overflow: "hidden",
            willChange: "transform",
            height: totalHeight,
            position: "relative"
          }}
        >
          <div
            className={class_maker({prefix,name,main:"inner_content",iUN})}
            style={{
              willChange: "transform",
              transform: `translateY(${offsetY}px)`
            }}
          >
            {visibleChildren}
            { (has_more) ? (
                <div className={class_maker({prefix,name,main:"loader_wrapper",iUN})} ref={observer}
                  onClick={(e) => { observer(e.target,true); }}  data-observer="loader">
                  <div className={class_maker({prefix,name,main:"loader",iUN})}></div>
                </div>
            ): null }
          </div>
        </div>
      </div>
    );
  });
  // };

export default VirtualScroll;


  /*
  // wrap the item template in a memo fn, i want to do some things before i add the data to the elements
  const Item = React.memo(({ index }) => (
    <div
      style={{
        height: 30,
        lineHeight: "30px",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 10px"
      }}
      className="row"
      key={index}
    >
      <img
        alt={index}
        src={`http://lorempixel.com/30/30/animals/${(index % 10) + 1}`}
      />
      row index {index}
    </div>
  ));

  const App = () => {
    return (
      <div className="App">
        <h1>Virtual Scroll</h1>
        <VirtualScroll
          itemCount={100}
          height={300}
          childHeight={30}
          Item={Item}
        />
        <hr />
        <h1>Hooks are awesome!</h1>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/500tech/hook-cook-book"
        >
          Explore more examples
        </a>
      </div>
    );
  }

  ReactDOM.render(
  <App />,
  document.querySelector('.root')
  );

  //sample component setup
  <VirtualScroll
    itemCount={100}
    height={300}
    childHeight={30}
    Item={Item}
  />
*/
