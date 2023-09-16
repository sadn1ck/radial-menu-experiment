import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChartIcon,
  HomeIcon,
  PieChartIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useKey, useMouse } from "rooks";

interface IRadialMenu {
  show: boolean;
}
function RadialMenu(props: PropsWithChildren<IRadialMenu>) {
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
  const xCenter = window.innerWidth / 2 - 200;
  const yCenter = window.innerHeight / 2 - 200;
  const startPos = useRef([xCenter + 150, yCenter + 150]);
  const init = 180 / items.length;
  const activeIndex = useRef(-1);
  const { pageX, pageY } = useMouse();

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
    return () => {
      activeIndex.current = -1;
    };
  }, []);

  return (
    <>
      {props.show ? (
        <div
          style={{
            width: "400px",
            height: "400px",
            transform: `translate(${xCenter}px, ${yCenter}px)`,
          }}
        >
          <div
            id="holder"
            className="transition-all duration-100"
            style={{
              // @ts-expect-error heheheheh lmao
              "--mul":
                activeIndex.current >= 0 ? activeIndex.current - 1 : null,
            }}
          ></div>
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
                <li
                  key={item.id}
                  className="absolute border-r-[0.5px] border-gray-300 -top-1/2 -left-1/2 transition-all duration-[10] flex flex-row-reverse justify-start items-end"
                  data-active={i === activeIndex.current}
                  style={{
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
                </li>
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
      <footer className="absolute text-sm font-sans bottom-4 left-1/2 -translate-x-1/2">
        Made by <a href="https://x.com/__sadn1ck__">@__sadn1ck__</a>
      </footer>
    </>
  );
}

export default App;
