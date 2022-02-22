  import {memo, useState, useEffect, useRef, useMemo} from 'react';

  const useScrollAware = () => {
    // custom hook
    const [scrollTop, setScrollTop] = useState(0);
    const ref = useRef();

    const onScroll = e =>
      requestAnimationFrame(() => {
        setScrollTop(e.target.scrollTop);
        // scroll top tells how far the scrollable content container is
        // from the top of the scrolling viewport so when items 0 and 1 are out of sight scrollTop is 60
        console.log("[scrollTop]",e.target.scrollTop);
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
  const VirtualScroll = memo(({
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
    restock,
    loading = false,
    has_more = false,
    stats = true
  }) => {

    const [scrollTop, ref] = useScrollAware();// preps scroll height and sends a ref to use in scroll event listener
    const hideScroll = (hide_scroll) ? "hide-scroll" : "";
    const last_request_section = useRef(0);

    // i get this - how to set the content containers
    const totalHeight = (itemCount * childHeight) + padding;// can i give it padding?
    const viewport_height = (height > totalHeight) ? totalHeight : height;


    // idk what the significance of scrollTop - top of what? - scrollTop is how far the top of the internal
    // scroll element is from the scroll viewport
    // Math.floor keeps the decimal places out of the calculation
    let startNode = Math.floor(scrollTop / childHeight) - renderAhead;
    console.log("[startNode] calc 1",startNode);

    let topNode = Math.floor(scrollTop / childHeight);
    console.log("[topNode] calc ",topNode);

    // this math max keeps the first 20 set as a zero (instead of negative nbrs) startNode because there isn't more to put overhead
    // than the 20 initial items. once the 20 gets overhead the count starts to move.
    startNode = Math.max(0, startNode);
    console.log("[startNode] calc 2",startNode);

    let visibleNodeCount = Math.ceil(viewport_height / childHeight) + 2 * renderAhead;/* 300 / 30 = 10 + 2*20 = 50 */
    console.log("[visible node count] calc 1",visibleNodeCount);

    // this will return the lowest number passed to it. which effectly means that it will stop when the nbr
    // reaches a certain limit (by the calculation countdown that is happening)
    // what happens when the calculation countdown goes under the set nbr?
    // eventually the visible node count will fall below the staic number, coupled with the start node
    // it will force no more nodes to be created
    visibleNodeCount = Math.min(itemCount - startNode, visibleNodeCount);

    console.log(`[itemCount ${itemCount} - startNode ${startNode}]`,itemCount - startNode);

    console.log("[visible node count] calc 2",visibleNodeCount);

    const offsetY = startNode * childHeight;

    useEffect(() => {
      // stats no longer needed, im no longer using this to trigger restocking
      if(!stats) return;
      console.warn("[viewport count]",viewport_height / childHeight);
      console.warn("[hidden count]",2 * renderAhead);
      let vh_str =  [`[visible node count] \n \n viewport_height (${viewport_height}) / `,
        `childHeight (${childHeight})) + 2 * renderAhead (${renderAhead}) = `,
        `${Math.ceil(viewport_height / childHeight) + 2 * renderAhead} \n or \n `,
        `itemCount (${itemCount}) - startNode (${startNode}) = ${itemCount - startNode} \n`,
        `\n actual visible node count = ${visibleNodeCount} (the min #)\n `,
        `(# needs to be below first render #) \n`].join("");
      console.warn(vh_str);
      console.warn("[first render]",itemCount - renderAhead);
    },[])

    // why use memo here? - oh yeah, this will only change when the properties in the array below change
    // item changes when its index changes. its index property changes if its index is changed its alright
    // for it to be changed here - i think it will be disgarded i don't think it is reused and sent to top/bottom
    const visibleChildren = useMemo(
      () =>
        new Array(visibleNodeCount)
          .fill(null)
          .map((_, index) => {
            // do something
            let tru_ndx = index + startNode;
            // console.warn("[map] index",index);
            // console.warn("[map] tru index",tru_ndx);

            // if(restock && tru_ndx > itemCount - renderAhead && tru_ndx > last_request_section.current){
            //   // run this request once per section
            //   last_request_section.current = itemCount;
            //   console.warn(`[rendered at] itemCount ${itemCount} - renderAhead ${renderAhead}`, itemCount - renderAhead);
            //   console.warn("running mock request callout");
            //   console.warn("[visibleChildren] itemCount",itemCount);
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

    // how does it know to move the item to the bottom?
    return (
      <div className={`${classMaker({prefix,name,main:"viewport",iUN})} ${hideScroll}`}
        style={{ height:viewport_height, overflow: "auto" }}
        ref={ref}>
        <div
          className={classMaker({prefix,name,main:"visible_area",iUN})/*the former viewport*/}
          style={{
            overflow: "hidden",
            willChange: "transform",
            height: totalHeight,
            position: "relative"
          }}
        >
          <div
            className={classMaker({prefix,name,main:"inner_content",iUN})}
            style={{
              willChange: "transform",
              transform: `translateY(${offsetY}px)`
            }}
          >
            {visibleChildren}
            { (has_more) ? (
                <div className={classMaker({prefix,name,main:"loader_wrapper",iUN})}>
                  <div className={classMaker({prefix,name,main:"loader",iUN})}></div>
                </div>
            ): null }
          </div>
        </div>
      </div>
    );
  });
  // };

export default VirtualScroll;

const classMaker = ({prefix, name, main, iUN }) => {
  prefix = prefix.replace("_","");//prefix shouldn't have an underscore for this
  return `${prefix}_${name}_${main}_${iUN} ${prefix}_${name}_${main} ${name}_${main} ${name} ${main}`;
}

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
