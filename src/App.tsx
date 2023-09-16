import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChartIcon,
  HomeIcon,
  PieChartIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useKey, useMouse } from "rooks";

interface IRadialMenu {
  show: boolean;
}

function ChatMessages(props: {
  actions: Array<(typeof items)[0] & { ts: number }>;
}) {
  return (
    <>
      <div className="flex flex-col fixed bottom-20 right-4 w-60 gap-4">
        <AnimatePresence>
          {props.actions.map((msg, index) => {
            return (
              <motion.div
                key={msg.ts + index}
                initial={"pre"}
                animate={"entry"}
                exit={"exit"}
                variants={{
                  pre: {
                    translateX: "200%",
                  },
                  entry: {
                    translateX: "0%",
                  },
                  exit: {
                    translateX: "200%",
                  },
                }}
                className="border-2 border-gray-600 flex items-center rounded-md p-2 w-full gap-4"
              >
                {msg.icon}
                {msg.text}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}

const items = [
  {
    id: "1",
    text: "Back",
    icon: <ArrowLeftIcon width={24} height={24} />,
  },
  {
    id: "2",
    text: "Home",
    icon: <HomeIcon width={24} height={24} />,
  },
  {
    id: "3",
    text: "Trash",
    icon: <TrashIcon width={24} height={24} />,
  },
  {
    id: "4",
    text: "Forward",
    icon: <ArrowRightIcon width={24} height={24} />,
  },
  {
    id: "5",
    text: "Bar chart",
    icon: <BarChartIcon width={24} height={24} />,
  },
  {
    id: "6",
    text: "Pie chart",
    icon: <PieChartIcon width={24} height={24} />,
  },
];

function RadialMenu(props: PropsWithChildren<IRadialMenu>) {
  const xCenter = window.innerWidth / 2 - 200;
  const yCenter = window.innerHeight / 2 - 200;
  const startPos = useRef([xCenter + 150, yCenter + 150]);
  const init = 180 / items.length;
  const activeIndex = useRef(-1);
  const { pageX, pageY } = useMouse();

  const [actions, setActions] = useState<
    Array<(typeof items)[0] & { ts: number }>
  >([]);

  const removeAction = useCallback((ts: number) => {
    setActions((prev) => {
      return prev.filter((x) => x.ts !== ts);
    });
  }, []);

  const addAction = useCallback((a: (typeof actions)[0]) => {
    setActions(() => {
      return [a];
    });
  }, []);

  useEffect(() => {
    if (!pageX) return;
    if (!pageY) return;
    if (!props.show) return;
    // console.log(pageX, startPos.current[0]);
    const dx = pageX - startPos.current[0];
    const dy = pageY - startPos.current[1];

    const currAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (
      (currAngle > 150 && currAngle < 180) ||
      (currAngle < -150 && currAngle > -180)
    ) {
      activeIndex.current = 0;
    } else if (currAngle > -150 && currAngle < -90) {
      activeIndex.current = 1;
    }
    if (currAngle > -90 && currAngle < -30) {
      activeIndex.current = 2;
    } else if (currAngle > -30 && currAngle < 30) {
      activeIndex.current = 3;
    } else if (currAngle > 30 && currAngle < 90) {
      activeIndex.current = 4;
    } else if (currAngle > 90 && currAngle < 150) {
      activeIndex.current = 5;
    }
  }, [pageX, pageY, props.show]);

  useEffect(() => {
    if (!props.show && activeIndex.current >= 0) {
      const ts = Date.now();
      addAction({
        ...items[activeIndex.current],
        ts,
      });
      setTimeout(() => {
        removeAction(ts);
      }, 2500);
    }
  }, [addAction, props.show, removeAction]);

  return (
    <>
      <ChatMessages actions={actions} />
      {props.show ? (
        <div
          style={{
            width: "400px",
            height: "400px",
            transform: `translate(${xCenter}px, ${yCenter}px)`,
          }}
        >
          <motion.div
            id="holder"
            style={{
              // @ts-expect-error heheheheh lmao
              "--mul":
                activeIndex.current >= 0 ? activeIndex.current - 1 : null,
            }}
          ></motion.div>
          <ul
            className={[
              "absolute rounded-full transition-all duration-[10ms] overflow-clip",
            ].join(" ")}
            style={{
              width: "400px",
              height: "400px",
            }}
          >
            <div className="absolute w-32 h-32 rounded-full z-10 border-[0.5px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1E1E1E] grid place-items-center">
              <span>{items[activeIndex.current]?.text}</span>
            </div>
            {items.map((item, i) => {
              return (
                <motion.li
                  layout
                  key={item.id}
                  className="absolute border-r-[0.5px] border-gray-300 -top-1/2 -left-1/2 transition-all duration-[10ms] flex flex-row-reverse justify-start items-end"
                  data-active={i === activeIndex.current}
                  style={{
                    // need to calculate paddings somehow
                    paddingLeft: "48px",
                    paddingTop: "56px",
                    paddingBottom: "48px",
                    paddingRight: "56px",
                    width: "400px",
                    height: "400px",
                    transform: `rotate(${
                      init * (i * 2 - 1)
                    }deg) skew(${init}deg)`,
                    transformOrigin: "100% 100%",
                  }}
                >
                  <span
                    style={{
                      transform: `skew(${
                        init * -1
                      }deg) rotate(${init}deg) rotate(${-init * (i * 2)}deg)`,
                    }}
                  >
                    {item.icon}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function App() {
  // const { deltaX, deltaY } = useMouseMoveDelta();
  const [showRadial, setShowRadial] = useState(false);

  useKey(
    ["`", "Tab", "Cmd"],
    (e) => {
      e.preventDefault();
      if (e.type === "keydown") {
        if (!e.repeat) setShowRadial(true);
      } else {
        setShowRadial(false);
      }
    },
    {
      eventTypes: ["keydown", "keyup"],
    }
  );
  return (
    <>
      <h1 className="absolute text-xl left-1/2 -translate-x-1/2 top-16 font-bold text-center">
        Press Tab/tilde to get started
      </h1>
      <RadialMenu show={showRadial} />
      <footer className="absolute text-sm font-sans bottom-8 left-1/2 -translate-x-1/2 text-center">
        Made by <a href="https://x.com/__sadn1ck__">@__sadn1ck__</a>, inspired
        by <a href="https://rauno.me/craft/radial-menu">@raunofreiberg</a>.
        Source:{" "}
        <a href="https://github.com/sadn1ck/radial-menu-experiment">GitHub</a>
      </footer>
    </>
  );
}

export default App;
